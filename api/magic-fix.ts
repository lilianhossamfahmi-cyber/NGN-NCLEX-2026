// api/magic-fix.ts
// Vercel Serverless Function for AI Magic Fix

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Golden Schema definitions for AI guidance
const GOLDEN_SCHEMAS = {
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
}`
};

function buildPrompt(item: any, instruction: string): string {
    const instructionLower = instruction.toLowerCase();
    let schemaContext = "";

    // Detect which schemas are relevant
    if (instructionLower.includes("nurse") || instructionLower.includes("notes")) {
        schemaContext += GOLDEN_SCHEMAS.nursesNotes + "\n\n";
    }
    if (instructionLower.includes("vital")) {
        schemaContext += GOLDEN_SCHEMAS.vitals + "\n\n";
    }
    if (instructionLower.includes("lab")) {
        schemaContext += GOLDEN_SCHEMAS.labs + "\n\n";
    }
    if (instructionLower.includes("order")) {
        schemaContext += GOLDEN_SCHEMAS.orders + "\n\n";
    }
    if (instructionLower.includes("rationale")) {
        schemaContext += GOLDEN_SCHEMAS.rationale + "\n\n";
    }
    if (instructionLower.includes("full") || instructionLower.includes("complete")) {
        schemaContext = Object.values(GOLDEN_SCHEMAS).join("\n\n");
    }

    const topic = item.metadata?.subTopic || item.metadata?.topic || "General Medical";

    return `
You are an expert NCLEX-RN Clinical Content Generator.

=== TASK ===
${instruction}

=== CONTEXT ===
Topic: ${topic}
Type: ${item.typeId || "case-study"}

=== SCHEMAS ===
${schemaContext || "Generate standard clinical content."}

=== RULES ===
1. Return VALID JSON only.
2. NO COMMENTS inside the JSON.
3. NO Markdown fences.
4. PRESERVE existing data structure.
5. Only modify what the instruction asks.

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
        const { item, instruction } = req.body;

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

        const result = await model.generateContent(prompt);
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
