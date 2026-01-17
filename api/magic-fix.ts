// api/magic-fix.ts
// Vercel Serverless Function for AI Magic Fix

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

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
    "temp": 101.2,
    "hr": 98,
    "rr": 22,
    "bp": "142/88",
    "o2Sat": 94,
    "painLevel": 5
  }
]`,
  labs: `
LAB RESULTS SCHEMA (content.labs as array):
[
  {
    "name": "WBC",
    "value": 14.2,
    "unit": "x10^3/uL",
    "range": "4.5-11.0",
    "flag": "High"
  }
]`,
  orders: `
PROVIDER ORDERS SCHEMA (content.orders as array):
[
  {
    "category": "Medication",
    "order": "Lisinopril 10mg PO Daily",
    "status": "Active"
  }
]`,
  history: `
HISTORY AND PHYSICAL SCHEMA (content.history as object):
{
  "history": "56M with hx of HTN, DM2...",
  "physical": "Gen: Alert, NAD. CV: RRR..."
}`,
  questionStem: `
QUESTION STEM SCHEMA (content.questionStem as string):
"The nurse should first..." (Just the text string)
`,
  answerOptions: `
ANSWER OPTIONS SCHEMA (content.answerOptions as array):
[
  { "id": "opt1", "text": "Assess vital signs", "correct": true },
  { "id": "opt2", "text": "Call provider", "correct": false }
]`,
  highlight: `
HIGHLIGHT SCHEMA (content.highlight as object):
{
    "text": "The nurse notes <span id='tok1'>wheezing</span> and <span id='tok2'>stridor</span>.",
    "tokens": [
        { "id": "tok1", "text": "wheezing", "correct": true },
        { "id": "tok2", "text": "stridor", "correct": true }
    ]
}`,
  rationale: `
RATIONALE SCHEMA (content.rationale as object):
{
    "general": "The patient is experiencing...",
    "options": {
        "opt1": "Correct because...",
        "opt2": "Incorrect because..."
    }
}
`,
  bowtie: `
BOWTIE SCHEMA (content.bowtie as object):
{
    "center": { "id": "cond1", "text": "Heart Failure" },
    "actions": [
        { "id": "act1", "text": "Elevate HOB" },
        { "id": "act2", "text": "Administer O2" }
    ],
    "parameters": [
        { "id": "param1", "text": "O2 Saturation" },
        { "id": "param2", "text": "Respiratory Rate" }
    ],
    "correct": {
        "center": "cond1",
        "actions": ["act1", "act2"],
        "parameters": ["param1", "param2"]
    }
}
`,
  matrix: `
MATRIX SCHEMA (content.matrix as object):
{
    "columns": [
        { "id": "col1", "text": "Indicated" },
        { "id": "col2", "text": "Contraindicated" }
    ],
    "rows": [
        { "id": "row1", "text": "Administer Beta Blocker" }
    ],
    "correct": {
        "row1": ["col2"]
    }
}
`,
  orderedResponse: `
ORDERED RESPONSE SCHEMA (content.orderedResponse as array of ids):
["opt3", "opt1", "opt4"] (Correct order of option IDs)
`
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { item, instruction } = req.body;

  if (!item || !instruction) {
    return res.status(400).json({ error: 'Missing item or instruction' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Gemini API Key');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // --- PROMPT ENGINEERING START ---
    
    const typeId = item.typeId || 'unknown';
    const isBowTieItem = typeId === 'bowtie';
    const isHighlightItem = typeId === 'highlight';
    const isMatrixItem = typeId.includes('matrix');
    const isOrderedItem = typeId === 'ordered-response';

    const instructionLower = instruction.toLowerCase();
    
    // Determine context (Full Case vs Specific Field)
    // If instruction asks for "full case", "generate everything", or implies a full generation
    const isFullCase = instructionLower.includes("full") || instructionLower.includes("generate all") || instructionLower.includes("complete item");

    // Build the Prompt Schema Context
    let schemaContext = "";
    
    // Always include Rationale schema if missing, as it's often needed
    const needsRationale = !item.content?.rationale;

    // MANDATORY SCHEMAS based on Item Type
    let mandatorySchemaString = "";
    
    // For specific item types, we MUST include their structure schema
    if (isBowTieItem) mandatorySchemaString += GOLDEN_SCHEMAS.bowtie + "\n\n";
    else if (isMatrixItem) mandatorySchemaString += GOLDEN_SCHEMAS.matrix + "\n\n";
    else if (isHighlightItem) mandatorySchemaString += GOLDEN_SCHEMAS.highlight + "\n\n";
    else if (isOrderedItem) mandatorySchemaString += GOLDEN_SCHEMAS.orderedResponse + "\n\n";
    else {
        // Standard items need stem and options
        mandatorySchemaString += GOLDEN_SCHEMAS.questionStem + "\n\n";
        mandatorySchemaString += GOLDEN_SCHEMAS.answerOptions + "\n\n";
    }

    if (isFullCase) {
      // For full generation, include everything
      const allSchemas = Object.values(GOLDEN_SCHEMAS)
        .filter(s => typeof s === 'string') // filter out non-strings if any
        .join("\n\n");
      schemaContext = mandatorySchemaString + "\n\n" + allSchemas;
    } else {
    // Selective schemas based on instruction
    if (instructionLower.includes("nurse") || instructionLower.includes("notes")) schemaContext += GOLDEN_SCHEMAS.nursesNotes + "\n\n";
    if (instructionLower.includes("vital") || instructionLower.includes("pain") || instructionLower.includes("temp") || instructionLower.includes("bp") || instructionLower.includes("signs")) schemaContext += GOLDEN_SCHEMAS.vitals + "\n\n";
    if (instructionLower.includes("lab") || instructionLower.includes("result") || instructionLower.includes("panel")) schemaContext += GOLDEN_SCHEMAS.labs + "\n\n";
    if (instructionLower.includes("order") || instructionLower.includes("med") || instructionLower.includes("drug")) schemaContext += GOLDEN_SCHEMAS.orders + "\n\n";
    if (instructionLower.includes("rationale") || instructionLower.includes("reason") || instructionLower.includes("explanation")) schemaContext += GOLDEN_SCHEMAS.rationale + "\n\n";
    if (instructionLower.includes("stem")) schemaContext += GOLDEN_SCHEMAS.questionStem + "\n\n";
    if (instructionLower.includes("highlight") || instructionLower.includes("token")) schemaContext += GOLDEN_SCHEMAS.highlight + "\n\n";

      // Smart switching for options/structure
      if (instructionLower.includes("option") || instructionLower.includes("answer") || instructionLower.includes("structure")) {
        if (isBowTieItem) schemaContext += GOLDEN_SCHEMAS.bowtie + "\n\n";
        else if (isMatrixItem) schemaContext += GOLDEN_SCHEMAS.matrix + "\n\n";
        else if (isHighlightItem) schemaContext += GOLDEN_SCHEMAS.highlight + "\n\n";
        else if (isOrderedItem) schemaContext += GOLDEN_SCHEMAS.orderedResponse + "\n\n";
        else schemaContext += GOLDEN_SCHEMAS.answerOptions + "\n\n";
      }
    }

    // Fallback: If no specific schema triggered but instructions are vague, provide relevant ones
    if (schemaContext === "") {
        schemaContext = mandatorySchemaString; 
        if (needsRationale) schemaContext += GOLDEN_SCHEMAS.rationale + "\n\n";
    }


    const systemPrompt = `
You are an expert NCLEX-RN Clinical Content Generator.

--- TASK ---
${instruction}

--- CONTEXT ---
Topic: ${item.metadata?.clientNeeds || 'General Nursing'}
Type: ${item.typeId || 'case-study'}
Current JSON content (partial):
${JSON.stringify(item.content || {}, null, 2)}

--- SCHEMAS (Strictly Follow Format) ---
${schemaContext}
${mandatorySchemaString}

--- RULES ---
1. Return VALID JSON only.
2. NO COMMENTS inside the JSON.
3. NO Markdown fences.
4. Use standard keys provided in schemas.
5. If creating a new section (e.g. vitals), follow the schema exactly.
6. For 'highlight' items, ensure the 'text' field contains <span> tags with IDs matching the 'tokens' array.
7. For 'bowtie' items, ensure 'correct' object references valid IDs from actions/parameters.
8. Validate that all IDs in 'correct' answers exist in the options/tokens.

RETURN ONLY THE JSON OBJECT.
`;

    // --- PROMPT ENGINEERING END ---

    console.log('🔮 Magic Fix Prompt Length:', systemPrompt.length);

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    console.log('✨ AI Response Preview:', text.substring(0, 100) + '...');

    // Clean Markdown
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse JSON with robust fallback
    let parsedItem: any = null;
    try {
      parsedItem = JSON.parse(cleanText);
    } catch (parseError) {
      // Try extracting a JSON object from the text
      const start = cleanText.indexOf('{');
      const end = cleanText.lastIndexOf('}');
      if (start >= 0 && end > start) {
        const candidate = cleanText.substring(start, end + 1);
        try {
          parsedItem = JSON.parse(candidate);
        } catch (_) {
          // still failed – fall through
        }
      }
      if (!parsedItem) {
        // Return the raw AI output for debugging
        console.error('❌ Failed to parse JSON from AI response');
        return res.status(502).json({
          error: 'AI returned non‑JSON response',
          raw: cleanText
        });
      }
    }


    // ---------------------------------------------------------------------------
    // DIRECT IN-API NORMALIZATION (Sanity Check)
    // Ensure critical fields are hoisted so the UI sees them immediately
    // ---------------------------------------------------------------------------
    if (parsedItem) {
        // 1. Hoist Question Stem
        if (parsedItem.content?.questionStem) {
             parsedItem.prompt = parsedItem.content.questionStem;
             // Ensure structure also has it if needed (redundancy ok)
             if (parsedItem.structure) parsedItem.structure.prompt = parsedItem.content.questionStem;
        }

        // 2. Hoist Answer Options
        if (parsedItem.content?.answerOptions) {
             parsedItem.structure = { ...(parsedItem.structure || {}), options: parsedItem.content.answerOptions };
        }

        // 3. Hoist Highlight Structure
        if (parsedItem.content?.highlight) {
             parsedItem.structure = { ...(parsedItem.structure || {}), highlight: parsedItem.content.highlight };
        }
        
        // 4. Hoist BowTie
        if (parsedItem.content?.bowtie) {
            parsedItem.structure = { ...(parsedItem.structure || {}), ...parsedItem.content.bowtie };
        }

        // 5. Hoist Matrix
        if (parsedItem.content?.matrix) {
            parsedItem.structure = { ...(parsedItem.structure || {}), ...parsedItem.content.matrix };
        }
    }

    console.log(`✅ Magic Fix completed successfully`);
    return res.status(200).json({ success: true, item: parsedItem });

  } catch (error: any) {
    console.error('❌ Magic Fix Error:', error);
    return res.status(500).json({ 
        error: error.message || 'Internal Server Error',
        details: error.toString() 
    });
  }
}
