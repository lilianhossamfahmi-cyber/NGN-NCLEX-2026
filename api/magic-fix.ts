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
`
};

function buildPrompt(item: any, instruction: string): string {
    const instructionLower = instruction.toLowerCase();

    // Check if this is a "full case" generation request
    const isFullCase = instructionLower.includes("full") ||
        instructionLower.includes("complete") ||
        instructionLower.includes("generate all") ||
        instructionLower.includes("bowtie");

    // Mandatory schemas that MUST be present for full cases
    const mandatorySchemas = [
        GOLDEN_SCHEMAS.nursesNotes,
        GOLDEN_SCHEMAS.questionStem,
        GOLDEN_SCHEMAS.answerOptions
    ].join("\n\n");

    let schemaContext = "";
    let detectedTasks: string[] = [];

    if (isFullCase) {
        // If full case, include EVERYTHING + Mandatory block
        schemaContext = mandatorySchemas + "\n\n" + Object.values(GOLDEN_SCHEMAS).join("\n\n");
        detectedTasks = ["FULL CONTENT"];
    } else {
        // Selective schemas based on instruction
        if (instructionLower.includes("nurse") || instructionLower.includes("notes")) {
            schemaContext += GOLDEN_SCHEMAS.nursesNotes + "\n\n";
            detectedTasks.push("Nurses Notes");
        }
        if (instructionLower.includes("vital")) {
            schemaContext += GOLDEN_SCHEMAS.vitals + "\n\n";
            detectedTasks.push("Vitals");
        }
        if (instructionLower.includes("lab")) {
            schemaContext += GOLDEN_SCHEMAS.labs + "\n\n";
            detectedTasks.push("Labs");
        }
        if (instructionLower.includes("order")) {
            schemaContext += GOLDEN_SCHEMAS.orders + "\n\n";
            detectedTasks.push("Orders");
        }
        if (instructionLower.includes("rationale")) {
            schemaContext += GOLDEN_SCHEMAS.rationale + "\n\n";
            detectedTasks.push("Rationale");
        }
        if (instructionLower.includes("stem")) {
            schemaContext += GOLDEN_SCHEMAS.questionStem + "\n\n";
            detectedTasks.push("Question Stem");
        }
        if (instructionLower.includes("option") || instructionLower.includes("answer")) {
            schemaContext += GOLDEN_SCHEMAS.answerOptions + "\n\n";
            detectedTasks.push("Answer Options");
        }
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
5. Preserve existing data structure.
6. ${isFullCase ? "IMPORTANT: You MUST generate content for nursesNotes, questionStem, and answerOptions." : ""}

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
            // Expecting image as base64 string (without data URI prefix if possible, or strip it)
            const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

            result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: "image/png" // Assuming PNG or JPEG, Gemini is flexible
                    }
                }
            ]);
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
