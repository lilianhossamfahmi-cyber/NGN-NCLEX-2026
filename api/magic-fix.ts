// api/magic-fix.ts
// Vercel Serverless Function for AI Magic Fix

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Golden Schema definitions for AI guidance
// Golden Schema definitions for AI guidance
const GOLDEN_SCHEMAS: any = {
    nursesNotes: `
NURSES NOTES SCHEMA (content.nursesNotes as array):
[
  {
    "time": "0800",
    "date": "Day 1",
    "note": "Patient admitted via ED...",
    "author": "J. Smith, RN"
  }
]`,
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
]`,
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
]`,
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
]`,
    rationale: `
RATIONALE SCHEMA (content.rationale as object):
{
  "coreConcept": "Heart Failure",
  "caseSummary": "Patient with acute decompensated HF...",
  "answerAnalysis": "Correct answer addresses fluid overload...",
  "trap": "Common mistake is...",
  "goldenRule": "Assess before treating..."
}`,
    questionStem: `
QUESTION STEM SCHEMA (content.questionStem as string):
"What is the most appropriate next step for the patient?"
REQUIREMENTS:
- Provide a clear, single-sentence question stem.
`,
    answerOptions: `
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
`,
    bowtie: `
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
`,
    matrix: `
MATRIX SCHEMA (content.structure):
{
  "type": "matrix",
  "prompt": "For each finding, indicate if it is consistent with [Column 1] or [Column 2].",
  "columns": [
    { "id": "c1", "text": "Condition A" },
    { "id": "c2", "text": "Condition B" }
  ],
  "rows": [
    { "id": "r1", "text": "Finding 1", "correctColumnId": "c1", "rationale": "Explanation..." },
    { "id": "r2", "text": "Finding 2", "correctColumnId": "c2", "rationale": "Explanation..." }
  ]
}
REQUIREMENTS:
- Columns must be mutually exclusive options.
- Rows must represent patient findings.
- correctColumnId MUST match one of the column IDs.
`,
    highlight: `
HIGHLIGHT SCHEMA (content.structure):
{
  "type": "highlight",
  "prompt": "Highlight the findings that require immediate intervention.",
  "text": "The patient reports <span id='h1'>sudden chest pain</span>...",
  "correct": ["h1"],
  "decoys": ["h2"],
  "tokenMap": {
    "h1": { "isCorrect": true, "whyCorrect": "...", "whyIncorrect": "N/A" },
    "h2": { "isCorrect": false, "whyCorrect": "N/A", "whyIncorrect": "..." }
  }
}
REQUIREMENTS:
- Use <span id='hX'> wrappers in text.
- Provide tokenMap for ALL spans.
`,
    orderedResponse: `
ORDERED RESPONSE SCHEMA (content.structure):
{
  "type": "ordered-response",
  "prompt": "Drag steps into order.",
  "orderedOptions": [
    { "id": "s1", "text": "First Action", "rationale": "..." },
    { "id": "s2", "text": "Second Action", "rationale": "..." }
  ]
}
REQUIREMENTS:
- orderedOptions MUST be in the CORRECT order.
`
};

function buildPrompt(item: any, instruction: string): string {
    const instructionLower = instruction.toLowerCase();

    // Check if this is a "full case" generation request
    const isFullCase = instructionLower.includes("full") ||
        instructionLower.includes("complete") ||
        instructionLower.includes("generate all") ||
        instructionLower.includes("bowtie") ||
        instructionLower.includes("matrix") ||
        instructionLower.includes("highlight");

    const typeId = item.typeId || "case-study";
    const isBowTieItem = typeId === 'bowtie' || instructionLower.includes('bowtie');
    const isMatrixItem = typeId === 'matrix' || instructionLower.includes('matrix');
    const isHighlightItem = typeId === 'highlight' || instructionLower.includes('highlight');
    const isOrderedItem = typeId === 'ordered-response' || instructionLower.includes('ordered');

    // Mandatory schemas that MUST be present for full cases
    let mandatorySchemas = [
        GOLDEN_SCHEMAS.nursesNotes,
        GOLDEN_SCHEMAS.questionStem
    ];

    // Swap Answer Options for specific structures
    if (isBowTieItem) {
        mandatorySchemas.push(GOLDEN_SCHEMAS.bowtie);
    } else if (isMatrixItem) {
        mandatorySchemas.push(GOLDEN_SCHEMAS.matrix);
    } else if (isHighlightItem) {
        mandatorySchemas.push(GOLDEN_SCHEMAS.highlight);
    } else if (isOrderedItem) {
        mandatorySchemas.push(GOLDEN_SCHEMAS.orderedResponse);
    } else {
        mandatorySchemas.push(GOLDEN_SCHEMAS.answerOptions);
    }

    const mandatorySchemaString = mandatorySchemas.join("\n\n");

    let schemaContext = "";

    if (isFullCase) {
        // If full case, include EVERYTHING + Mandatory block
        // FILTER out conflicting schemas for cleaner prompt
        const allSchemas = Object.entries(GOLDEN_SCHEMAS)
            .filter(([key]) => {
                if (isBowTieItem && (key === 'answerOptions' || key === 'matrix' || key === 'highlight' || key === 'orderedResponse')) return false;
                if (isMatrixItem && (key === 'answerOptions' || key === 'bowtie' || key === 'highlight' || key === 'orderedResponse')) return false;
                if (isHighlightItem && (key === 'answerOptions' || key === 'bowtie' || key === 'matrix' || key === 'orderedResponse')) return false;
                if (isOrderedItem && (key === 'answerOptions' || key === 'bowtie' || key === 'matrix' || key === 'highlight')) return false;
                if (!isBowTieItem && !isMatrixItem && !isHighlightItem && !isOrderedItem && (key === 'bowtie' || key === 'matrix' || key === 'highlight' || key === 'orderedResponse')) return false;
                return true;
            })
            .map(([_, val]) => val)
            .join("\n\n");
        schemaContext = mandatorySchemaString + "\n\n" + allSchemas;
    } else {
        // Selective schemas based on instruction
        if (instructionLower.includes("nurse") || instructionLower.includes("notes")) schemaContext += GOLDEN_SCHEMAS.nursesNotes + "\n\n";
        if (instructionLower.includes("vital")) schemaContext += GOLDEN_SCHEMAS.vitals + "\n\n";
        if (instructionLower.includes("lab")) schemaContext += GOLDEN_SCHEMAS.labs + "\n\n";
        if (instructionLower.includes("order")) schemaContext += GOLDEN_SCHEMAS.orders + "\n\n";
        if (instructionLower.includes("rationale")) schemaContext += GOLDEN_SCHEMAS.rationale + "\n\n";
        if (instructionLower.includes("stem")) schemaContext += GOLDEN_SCHEMAS.questionStem + "\n\n";

        // Smart switching for options/structure
        if (instructionLower.includes("option") || instructionLower.includes("answer") || instructionLower.includes("structure")) {
            if (isBowTieItem) schemaContext += GOLDEN_SCHEMAS.bowtie + "\n\n";
            else if (isMatrixItem) schemaContext += GOLDEN_SCHEMAS.matrix + "\n\n";
            else if (isHighlightItem) schemaContext += GOLDEN_SCHEMAS.highlight + "\n\n";
            else if (isOrderedItem) schemaContext += GOLDEN_SCHEMAS.orderedResponse + "\n\n";
            else schemaContext += GOLDEN_SCHEMAS.answerOptions + "\n\n";
        }
    }

    // Extract metadata
    const topic = item.metadata?.subTopic || item.metadata?.topic || "General Medical";
    const level = item.metadata?.difficultyLevel || item.metadata?.level || "Standard";
    const clientNeeds = item.metadata?.clientNeeds || "Not Specified";
    const qStyle = item.metadata?.qStyle || "N/A";
    const demographics = item.content?.patientDemographics || {};

    let specificInstruction = "";
    if (isBowTieItem) specificInstruction = "Generate BowTie structure (actions, conditions, parameters).";
    else if (isMatrixItem) specificInstruction = "Generate Matrix structure (columns, rows with correctColumnId).";
    else if (isHighlightItem) specificInstruction = "Generate Highlight structure (text with spans and tokenMap).";
    else if (isOrderedItem) specificInstruction = "Generate Ordered Response structure (orderedOptions).";
    else specificInstruction = "Generate Answer Options array.";

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
5. Preserve existing data structure.
6. ${isFullCase ? `IMPORTANT: You MUST generate content for nursesNotes, questionStem, and ${specificInstruction}` : ""}

=== CURRENT JSON ===
${JSON.stringify(item, null, 2)}

=== RESPONSE ===
Return the complete modified JSON object.
`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { item, instruction, image } = req.body;

        if (!item || !instruction) {
            return res.status(400).json({ error: 'Missing item or instruction' });
        }

        const API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
            generationConfig: {
                temperature: 0.7,
                topP: 0.9,
                maxOutputTokens: 8192,
                responseMimeType: "application/json"
            }
        });

        const prompt = buildPrompt(item, instruction);
        console.log(`🤖 Magic Fix Request: ${instruction.substring(0, 50)}...`);

        let result;
        if (image) {
            // Check basic size limit (approx 4MB in base64 is ~3MB binary)
            if (image.length > 5 * 1024 * 1024) {
                console.error("Image too large");
                return res.status(413).json({ error: 'Image too large. Please resize to under 4MB.' });
            }

            // Expecting image as base64 string
            // Some browsers send data:image/jpeg;base64,... prefix. We need to strip it.
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

            try {
                result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: "image/png" // Gemini is flexible with mimeType generally
                        }
                    }
                ]);
            } catch (genError: any) {
                console.error("Gemini Generation Error:", genError);
                return res.status(502).json({ error: 'AI Generation Failed', details: genError.message });
            }
        } else {
            result = await model.generateContent(prompt);
        }

        const text = result.response.text();

        // Clean markdown fences if present
        let cleanText = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();

        // Sanitize control characters
        cleanText = cleanText.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
            return match.replace(/[\x00-\x1f]/g, (char) => {
                const code = char.charCodeAt(0);
                if (code === 0x09) return '\\t';
                if (code === 0x0a) return '\\n';
                if (code === 0x0d) return '\\r';
                return `\\u${code.toString(16).padStart(4, '0')}`;
            });
        });

        // Parse JSON
        let parsedItem;
        try {
            parsedItem = JSON.parse(cleanText);
        } catch (parseError) {
            // Try extracting JSON object
            const start = cleanText.indexOf('{');
            const end = cleanText.lastIndexOf('}');
            if (start >= 0 && end > start) {
                cleanText = cleanText.substring(start, end + 1);
                cleanText = cleanText.replace(/\/\/.*$/gm, ""); // Remove comments
                parsedItem = JSON.parse(cleanText);
            } else {
                throw parseError;
            }
        }

        console.log(`✅ Magic Fix completed successfully`);
        return res.status(200).json({ success: true, item: parsedItem });

    } catch (error: any) {
        console.error('❌ Magic Fix Error:', error.message);
        return res.status(500).json({
            error: error.message || 'AI processing failed',
            details: error.toString()
        });
    }
}
