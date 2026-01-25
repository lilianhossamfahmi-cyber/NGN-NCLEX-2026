
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuthorizedApiKey } from '../config/apiConfig';
import { MasterQuestionItem } from '../types/master-schema';

// Enhanced Golden Schema definitions for AI guidance
const GOLDEN_SCHEMAS: any = {
    // SECTION 1: CLINICAL CONTENT (SCENARIO)
    scenario: `
SECTION 1: CLINICAL DATA SCENARIO (content object)
Required Fields:
- patient: { name, age, gender, allergies, codeStatus, weightKg }
- setting: "ICU", "ED", "MedSurg", etc.
- historyPhysical: { chiefComplaint, hpi, pmh: [], medications: [], socialHistory, reviewOfSystems: {}, physicalExam: {} }
- nursesNotes: [ { time, author, entry } ] (Minimum 2 entries for trends)
- vitalSigns: [ { time, tempF, hr, rr, bp, o2, o2_device, pain } ] (Minimum 2 sets for trends)
- laboratory: [ { test, value, unit, flag, reference } ]
- orders: [ { category, order, status } ]
- radiology: [ { type, finding, impression } ]
`,

    // SECTION 2: ITEM STRUCTURE (STEM + OPTIONS)
    structure_bowtie: `
SECTION 2: BOW-TIE STRUCTURE (structure object)
{
    "type": "bow-tie",
    "prompt": "Complete the diagram...",
    "actions": [ { "id": "a1", "text": "...", "isCorrect": boolean }, ... (5 total) ],
    "conditions": [ { "id": "c1", "text": "...", "isCorrect": boolean }, ... (4 total) ],
    "parameters": [ { "id": "p1", "text": "...", "isCorrect": boolean }, ... (5 total) ],
    "correct": { "center": "c1", "actions": ["a1","a2"], "parameters": ["p1","p2"] }
}`,

    structure_standard: `
SECTION 2: STANDARD ITEM STRUCTURE (structure object)
{
    "prompt": "Question stem text...",
    "options": [
        { "id": "o1", "text": "Option text", "isCorrect": boolean },
        { "id": "o2", "text": "Option text", "isCorrect": boolean }
    ]
}`,
    // Specific structures for other types can be added here if needed, but 'structure_standard' covers most multiple choice

    // SECTION 3: RATIONALE & REASONING
    rationale: `
SECTION 3: CLINICAL REASONING (rationale object)
{
    "general": "Detailed explanation of the condition...",
    "pathophysiology": "Mechanism of disease...",
    "safetyCheck": "Critical safety warnings...",
    "clinicalTakeaway": "Key teaching point...",
    "clinicalStrategy": "Systematic approach to solving this specific item type/topic...",
    "mnemonic": {
        "title": "ACRONYM",
        "content": "A-..., B-...",
        "explanation": "How it applies..."
    },
    "cheatSheet": {
        "title": "Clinical Pearls",
        "points": ["Pearl 1", "Pearl 2", "Pearl 3"]
    },
    "referenceInfo": {
        "anatomy": "Relevant anatomical structures...",
        "physiology": "Normal physiological function vs this condition...",
        "pharm": "Key medications, mechanisms, and nursing implications..."
    }
}
`
};

/**
 * PHASE 1: PLANNING
 * Generates a text plan for approval before execution.
 */
export async function magicPlanItem(item: MasterQuestionItem, instruction: string, sections: string[]): Promise<string> {
    const apiKey = await getAuthorizedApiKey();
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
You are an expert Clinical Nurse Educator.
TASK: Plan the modifications for an NCLEX item based on user instructions.
DO NOT GENERATE JSON. Output a concise, bulleted plan of changes.

USER INSTRUCTION: "${instruction}"
SCOPE: ${sections.join(', ')}

CURRENT ITEM CONTEXT:
Type: ${item.typeId}
Topic: ${(item.metadata as any)?.clientNeeds}

Return a plan like:
- **Clinical Scenario**: Will update vitals to show shock (BP 80/40, HR 130).
- **Structure**: Will change correct answer to 'Start IV fluids'.
- **Rationale**: Will explain hypovolemic shock management.
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

/**
 * PHASE 2: EXECUTION
 * Generates the JSON based on the approved plan/instruction.
 */
export async function magicFixItem(
    item: MasterQuestionItem,
    instruction: string,
    sections: string[] = ['scenario', 'structure', 'rationale'] // Default all
): Promise<any> {
    const apiKey = await getAuthorizedApiKey();
    if (!apiKey) throw new Error("Missing Gemini API Key");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Determine Item Type Logic
    const typeId = item.typeId || 'case-study';
    const isBowTie = typeId === 'bowtie';

    // Build Schema Context based on selected sections
    let schemaContext = "";

    if (sections.includes('scenario')) {
        schemaContext += GOLDEN_SCHEMAS.scenario + "\n\n";
    }

    if (sections.includes('structure')) {
        if (isBowTie) {
            schemaContext += GOLDEN_SCHEMAS.structure_bowtie + "\n\n";
        } else {
            // Check for specific types if needed, otherwise standard
            // For now, simpler is better, assume standard unless specific type logic exists
            schemaContext += GOLDEN_SCHEMAS.structure_standard + "\n\n";
            // ... Add specific schemas for matrix, order, etc if needed later
        }
    }

    if (sections.includes('rationale')) {
        schemaContext += GOLDEN_SCHEMAS.rationale + "\n\n";
    }

    const systemPrompt = `
You are an expert NCLEX-RN Content Generator.
Authorized to strictly follow the GOLDEN SCHEMAS below.

--- TASK ---
${instruction}

--- SCOPE ---
Modify ONLY: ${sections.join(', ')}. Keep other sections as is.

--- CURRENT CONTENT (Partial) ---
${JSON.stringify(item.content || {}, null, 2)}

--- REQUIRED SCHEMAS ---
${schemaContext}

--- RULES ---
1. Return VALID JSON only. NO Markdown.
2. Follow the SCHEMAS exactly for the requested sections.
3. For 'scenario' (Section 1), ensure realistic clinical trends.
4. For 'structure' (Section 2), ensure correct/incorrect logic is valid.
5. For 'rationale' (Section 3), LEVERAGE THE CASE SCENARIO. Mnemonic and Cheat Sheet must be highly specific to this exact condition. Ensure 'clinicalStrategy' provides a clear 'How to Solve' and 'referenceInfo' covers Anatomy/Physiology/Pharm. AVOID GENERIC ADVICE.

RETURN ONLY THE JSON OBJECT.
`;

    const result = await model.generateContent(systemPrompt);
    const text = result.response.text();

    // Clean JSON
    let cleanText = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    // (Existing sanitization logic...)
    cleanText = cleanText.replace(/"(?:[^"\\]|\\.)*"/g, (match) => {
        return match.replace(/[\x00-\x1f]/g, (char) => {
            const code = char.charCodeAt(0);
            if (code === 0x09) return '\\t';
            if (code === 0x0a) return '\\n';
            if (code === 0x0d) return '\\r';
            return `\\u${code.toString(16).padStart(4, '0')} `;
        });
    });

    let parsedItem: any = null;
    try {
        parsedItem = JSON.parse(cleanText);
    } catch (e) {
        // Simple fallback
        const start = cleanText.indexOf('{');
        const end = cleanText.lastIndexOf('}');
        if (start >= 0) parsedItem = JSON.parse(cleanText.substring(start, end + 1));
        else throw new Error("Invalid JSON from AI");
    }

    // Hoisting Logic (Standardized)
    if (parsedItem) {
        // Ensure structure is populated if generated in content (legacy AI behavior)
        if (parsedItem.content?.structure) {
            parsedItem.structure = { ...parsedItem.structure, ...parsedItem.content.structure };
        }
        // Ensure prompt is top level
        if (parsedItem.content?.prompt) parsedItem.prompt = parsedItem.content.prompt;
    }

    // NORMALIZATION FOR MANAGER CONSUMPTION
    // If the AI returned partial 'rationale' or 'structure' at root, wrap it in 'content'
    if (!parsedItem.content && (parsedItem.rationale || parsedItem.structure || parsedItem.scenario)) {
        parsedItem.content = {};
        if (parsedItem.scenario) parsedItem.content.case = parsedItem.scenario;
        if (parsedItem.rationale) parsedItem.content.rationale = parsedItem.rationale;
        if (parsedItem.structure) parsedItem.content.structure = parsedItem.structure;
    }

    return parsedItem;
}

export async function generateItemImage(prompt: string, context: string): Promise<any> {
    const apiKey = await getAuthorizedApiKey();
    if (!apiKey) {
        throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your env variables.");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const enhancedPrompt = `Create a professional medical/clinical educational image:
    
Context: ${context || 'NCLEX nursing exam preparation material'}
Request: ${prompt}

Requirements:
- Professional, clean, educational style
- Suitable for nursing students
- Clear labeling if anatomical
- No graphic/disturbing content
- High quality, vector-style preferred`;

    try {
        // Method 1: Try Imagen 3 model if available in this environment
        try {
            const imagenModel = genAI.getGenerativeModel({ model: "imagen-3.0-generate-001" });
            const result = await imagenModel.generateContent({
                contents: [{ role: "user", parts: [{ text: enhancedPrompt }] }],
            });

            const response = await result.response;
            const candidates = response.candidates;

            if (candidates && candidates.length > 0) {
                const parts = candidates[0].content?.parts || [];
                for (const part of parts) {
                    if ((part as any).inlineData) {
                        const imageData = (part as any).inlineData;
                        return {
                            success: true,
                            image: `data:${imageData.mimeType};base64,${imageData.data}`,
                            format: 'base64'
                        };
                    }
                }
            }
        } catch (e) {
            console.log("Imagen model not available/supported in browser SDK or quota exceeded, falling back to description.");
        }

        // Method 2: Fallback to Text Description
        const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const descResult = await textModel.generateContent(`
        You are a medical illustrator assistant. 
        Create a detailed description of an image that would be suitable for this request:
        "${prompt}"
        
        Provide:
        1. Detailed visual description (what the image should show)
        2. Style recommendations
        3. Key elements to include
        4. A simple ASCII art representation if possible
        
        Format as JSON: { "description": "...", "style": "...", "elements": [...], "ascii": "..." }
        `);

        const descText = descResult.response.text();
        let description;
        try {
            description = JSON.parse(descText.replace(/```json\s* /gi, '').replace(/```\s*/g, '').trim());
        } catch {
            description = { description: descText, style: 'medical illustration', elements: [] };
        }

        return {
            success: true,
            type: 'description',
            description: description.description,
            style: description.style,
            elements: description.elements,
            ascii: description.ascii,
            message: 'Image generation requires specific model access. Use this description with an external tool.',
            suggestedServices: [
                'https://www.canva.com/ai-image-generator/',
                'https://openai.com/dall-e-3',
                'https://www.midjourney.com/'
            ]
        };

    } catch (error: any) {
        throw new Error(error.message || "Image generation failed");
    }
}
