// server/aiService.ts
// Enhanced AI Service with detailed schema-aware prompts for clinical content generation
import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
}

// Ensure logs directory exists
const LOG_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

// ============================================================================
// GOLDEN SCHEMA DEFINITIONS - Used to guide AI generation
// ============================================================================

const GOLDEN_SCHEMAS = {
  nursesNotes: `
NURSES NOTES SCHEMA (content.nursesNotes as array):
[
  {
    "time": "0800",
    "date": "Day 1",
    "note": "Patient admitted via ED with chief complaint of...",
    "author": "J. Smith, RN"
  }
]
REQUIREMENTS:
- Minimum 3-5 chronological entries`,

  vitals: `
VITALS SCHEMA (content.vitals as array):
[
  {
    "time": "0800",
    "tempF": 101.2,
    "hr": 98,
    "rr": 22,
    "bp": "142/88",
    "o2Sat": 94,
    "painLevel": 6
  }
]
REQUIREMENTS:
- Include at least 2-3 vital sign readings`,

  labs: `
LABS SCHEMA (content.labs as array):
[
  {
    "test": "WBC",
    "value": "15.2",
    "unit": "x10^9/L",
    "flag": "H",
    "reference": "4.5-11.0"
  }
]
REQUIREMENTS:
- Include 8-12 relevant lab values with flags`,

  orders: `
ORDERS SCHEMA (content.orders as array):
[
  {
    "order": "Morphine 2mg IV every 4 hours PRN pain",
    "category": "Medication",
    "status": "Active",
    "orderedBy": "Dr. Johnson",
    "time": "0830"
  }
]
REQUIREMENTS:
- Include 6-10 relevant orders`,

  historyPhysical: `
H&P SCHEMA (content.historyPhysical as object):
{
  "chiefComplaint": "Shortness of breath x 3 days",
  "hpi": "62-year-old male...",
  "pmh": ["Congestive Heart Failure", "Diabetes"],
  "psh": ["Appendectomy"],
  "medications": ["Lisinopril 20mg"],
  "allergies": ["Penicillin"],
  "socialHistory": { "smoking": "No", "alcohol": "Social" },
  "familyHistory": ["Father - MI"],
  "reviewOfSystems": { "constitutional": "Fatigue" },
  "physicalExam": { "general": "Alert", "cardiovascular": "S3 gallop" }
}
REQUIREMENTS:
- Populate all fields matches diagnosis`,

  rationale: `
RATIONALE SCHEMA (content.rationale as object):
{
  "coreConcept": "Heart Failure",
  "caseSummary": "Patient with acute decompensated HF...",
  "answerAnalysis": "Correct answer addresses fluid overload...",
  "trap": "Diuretics before assessment...",
  "goldenRule": "Assess before treating...",
  "steps": ["Assess", "Analyze", "Act"],
  "mnemonic": { "title": "FACES", "content": "Fatigue...", "explanation": "Signs of HF" },
  "cheatSheet": { "title": "CHF Tips", "points": ["Daily weights"] },
  "referenceInfo": { "anatomy": "Heart pump failure...", "physiology": "Decreased CO..." }
}
REQUIREMENTS:
- Specific case-based rationale`,

  caseScenario: `
CASE SCENARIO SCHEMA (content.structure.screens as array):
[
  {
    "id": 1,
    "title": "Recognize Cues",
    "cjmmPhase": "recognize",
    "prompt": "Review findings...",
    "options": [{"id":"A","text":"Option 1"}],
    "correctAnswer": ["A"]
  }
]
REQUIREMENTS:
- Generate 6 screens (Recognize -> Evaluate)
- Follow CJMM Phases`
};

// ============================================================================
// PROMPT BUILDER
// ============================================================================

function buildEnhancedPrompt(item: any, instruction: string): string {
  const instructionLower = instruction.toLowerCase();

  let schemaContext = "";
  let detectedTasks: string[] = [];

  // Add Question Stem schema
  const QUESTION_STEM_SCHEMA = `
QUESTION STEM SCHEMA (content.questionStem as string):
"What is the most appropriate next step for the patient?"
REQUIREMENTS:
- Provide a clear, single-sentence question stem.
`;

  const ANSWER_OPTIONS_SCHEMA = `
ANSWER OPTIONS SCHEMA (content.answerOptions as array):
[
  { "id": "A", "text": "Option A" },
  { "id": "B", "text": "Option B" },
  { "id": "C", "text": "Option C" },
  { "id": "D", "text": "Option D" }
]
REQUIREMENTS:
- Provide at least 4 options.
- Mark the correct answer(s) with a separate "correctAnswer" array.
`;

  const BOWTIE_SCHEMA = `
BOWTIE SCHEMA (content.bowtie or content.structure):
{
  "actions": [
    { "id": "a1", "text": "Administer Oxygen", "isCorrect": true },
    { "id": "a2", "text": "Discharge Patient", "isCorrect": false },
    { "id": "a3", "text": "Start IV Fluids", "isCorrect": true },
    { "id": "a4", "text": "Call Chaplain", "isCorrect": false }
    // Provide 4-5 options
  ],
  "conditions": [
    { "id": "c1", "text": "Heart Failure", "isCorrect": true },
    { "id": "c2", "text": "Pneumonia", "isCorrect": false },
    { "id": "c3", "text": "Sepsis", "isCorrect": false },
    { "id": "c4", "text": "Asthma", "isCorrect": false }
    // Provide 4 options, only 1 correct
  ],
  "parameters": [
    { "id": "p1", "text": "Pulse Oximetry", "isCorrect": true },
    { "id": "p2", "text": "Urine Output", "isCorrect": true },
    { "id": "p3", "text": "Blood Glucose", "isCorrect": false },
    { "id": "p4", "text": "Deep Tendon Reflexes", "isCorrect": false }
    // Provide 4-5 options
  ]
}
REQUIREMENTS:
- Use this structure for BowTie items specifically.
- "isCorrect" boolean must mark the valid keys.
`;

  // Extend GOLDEN_SCHEMAS
  const EXTENDED_GOLDEN_SCHEMAS = {
    ...GOLDEN_SCHEMAS,
    questionStem: QUESTION_STEM_SCHEMA,
    answerOptions: ANSWER_OPTIONS_SCHEMA,
    bowtie: BOWTIE_SCHEMA
  };

  const isBowTieItem = item.typeId === 'bowtie' || instructionLower.includes('bowtie');

  // Quick heuristic for tasks
  if (instructionLower.includes("nurse") || instructionLower.includes("notes")) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.nursesNotes + "\n\n";
    detectedTasks.push("Nurses Notes");
  }
  if (instructionLower.includes("vital")) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.vitals + "\n\n";
    detectedTasks.push("Vitals");
  }
  if (instructionLower.includes("lab")) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.labs + "\n\n";
    detectedTasks.push("Labs");
  }
  if (instructionLower.includes("order")) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.orders + "\n\n";
    detectedTasks.push("Orders");
  }
  if (instructionLower.includes("h&p") || instructionLower.match(/history.*physical/)) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.historyPhysical + "\n\n";
    detectedTasks.push("H&P");
  }
  if (instructionLower.includes("rationale")) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.rationale + "\n\n";
    detectedTasks.push("Rationale");
  }
  if (instructionLower.includes("case") || instructionLower.includes("scenario")) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.caseScenario + "\n\n";
    detectedTasks.push("Case Scenario");
  }
  if (instructionLower.includes("stem")) {
    schemaContext += EXTENDED_GOLDEN_SCHEMAS.questionStem + "\n\n";
    detectedTasks.push("Question Stem");
  }

  // Smart switching for options
  if (instructionLower.includes("option") || instructionLower.includes("answer") || instructionLower.includes("choices")) {
    if (isBowTieItem) {
      schemaContext += EXTENDED_GOLDEN_SCHEMAS.bowtie + "\n\n";
      detectedTasks.push("BowTie Structure");
    } else {
      schemaContext += EXTENDED_GOLDEN_SCHEMAS.answerOptions + "\n\n";
      detectedTasks.push("Answer Options");
    }
  }

  // If user explicitly asks for full content or mentions BowTie, include everything
  if (instructionLower.includes("full") || instructionLower.includes("complete") || instructionLower.includes("generate all") || instructionLower.includes("bowtie")) {
    // Inject mandatory schemas
    const mandatorySchemas = [
      EXTENDED_GOLDEN_SCHEMAS.nursesNotes,
      EXTENDED_GOLDEN_SCHEMAS.questionStem
    ];

    if (isBowTieItem) {
      mandatorySchemas.push(EXTENDED_GOLDEN_SCHEMAS.bowtie);
    } else {
      mandatorySchemas.push(EXTENDED_GOLDEN_SCHEMAS.answerOptions);
    }

    const mandatoryString = mandatorySchemas.join("\n\n");
    const otherSchemas = Object.entries(EXTENDED_GOLDEN_SCHEMAS)
      .filter(([key]) => {
        // Avoid duplication and conflicts
        if (key === 'nursesNotes' || key === 'questionStem') return false;
        if (isBowTieItem && key === 'answerOptions') return false;
        if (!isBowTieItem && key === 'bowtie') return false;
        return true;
      })
      .map(([_, val]) => val)
      .join("\n\n");

    schemaContext = mandatoryString + "\n\n" + otherSchemas;
    detectedTasks = ["FULL CONTENT"];
  }

  // Extract metadata from item to guide AI
  // We prioritize text-based metadata to give AI better context
  const topic = item.metadata?.subTopic || item.metadata?.topic || "General Medical";
  const level = item.metadata?.difficultyLevel || item.metadata?.level || "Standard";
  const clientNeeds = item.metadata?.clientNeeds || "Not Specified";
  const qStyle = item.metadata?.qStyle || "N/A";
  const demographics = item.content?.patientDemographics || {};

  return `
You are an expert NCLEX-RN Clinical Content Generator.

=== TASK ===
${instruction}

=== CONTEXT ===
Topic: ${topic}
Type: ${item.typeId || "case-study"}
Difficulty Level: ${level}
Client Needs: ${clientNeeds}
Style: ${qStyle}
Patient: ${JSON.stringify(demographics)}

=== SCHEMAS ===
${schemaContext || "Generate standard clinical content."}

=== RULES ===
1. Return VALID JSON only.
2. NO COMMENTS inside the JSON.
3. NO Markdown fences.
4. Use standard keys provided in schemas.
5. Preserve existing data.
6. ${"IMPORTANT: You MUST generate content for nursesNotes, questionStem, and " + (isBowTieItem ? "BowTie structure (actions, conditions, parameters)." : "answerOptions.")}

=== CURRENT JSON ===
${JSON.stringify(item, null, 2)}

=== RESPONSE ===
Return the complete modified JSON object.
`;
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

export async function magicFixItem(item: any, instruction: string): Promise<any> {
  if (!genAI) {
    throw new Error("AI Service not initialized.");
  }

  console.log(`🤖 AI Request: ${instruction.substring(0, 50)}...`);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 8192,
      responseMimeType: "application/json"
    }
  });

  const prompt = buildEnhancedPrompt(item, instruction);

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Clean markdown fences
    let cleanText = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

    // Sanitize control characters inside JSON strings
    // This fixes "Bad control character in string literal" errors
    const sanitizeJsonString = (str: string): string => {
      return str.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
        return match.replace(/[\x00-\x1f]/g, (char) => {
          const code = char.charCodeAt(0);
          if (code === 0x09) return '\\t';
          if (code === 0x0a) return '\\n';
          if (code === 0x0d) return '\\r';
          return `\\u${code.toString(16).padStart(4, '0')}`;
        });
      });
    };
    cleanText = sanitizeJsonString(cleanText);

    // Use a simple JSON repair if strict parse fails
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      console.warn("⚠️ Standard JSON parse failed, attempting cleanup...");

      // Log the failure for debug
      const logFile = path.join(LOG_DIR, `ai_fail_${Date.now()}.json`);
      fs.writeFileSync(logFile, text);
      console.log(`📄 Saved raw AI response to ${logFile}`);

      // Super aggressive cleanup: remove anything before '{' and after '}'
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      if (start >= 0 && end > start) {
        cleanText = cleanText.substring(start, end + 1);
        // Try removing comments regex (risky but needed)
        cleanText = cleanText.replace(/\/\/.*$/gm, "");
        return JSON.parse(cleanText);
      }
      throw e;
    }

  } catch (error: any) {
    console.error("❌ AI Service Error:", error.message);
    throw new Error(`AI Generation Failed: ${error.message} (Check Server Logs)`);
  }
}
