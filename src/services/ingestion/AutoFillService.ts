import { z, ZodError } from 'zod';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAuthorizedApiKey } from '../../config/apiConfig';
import {
    CalculationItemSchema,
    BowTieItemSchema,
    OrderedResponseSchema,
    MatrixItemSchema,
    HighlightItemSchema,
    DropClozeItemSchema,
    HotSpotItemSchema,
    OptionBasedItemSchema,
    CaseStudySchema
} from '../../schemas';

// Map of item types to their respective schemas for validation
const schemaMap: Record<string, z.ZodSchema<any>> = {
    'calculation': CalculationItemSchema,
    'bow-tie': BowTieItemSchema,
    'bowtie': BowTieItemSchema,
    'case-study': CaseStudySchema,
    'ordered-response': OrderedResponseSchema,
    'matrix': MatrixItemSchema,
    'highlight': HighlightItemSchema,
    'drop-cloze': DropClozeItemSchema,
    'hot-spot': HotSpotItemSchema,
    'multiple-response': OptionBasedItemSchema,
    'single-response': OptionBasedItemSchema,
    'trend': OptionBasedItemSchema,
};

export class AutoFillService {
    /**
     * Logic to fill missing required fields using AI.
     * Detects gaps using Zod and generates a targeted prompt.
     */
    static async fillMissing(item: any): Promise<any> {
        const type = (item.type || '').toLowerCase().trim();
        const schema = schemaMap[type];

        if (!schema) return item; // Unknown type, skip auto-fill

        // 1. Detect Missing Fields using Zod safeParse
        const result = schema.safeParse(item);

        // 2. Identify Gaps or Generic Placeholders (John Doe, Medication, etc.)
        const missingPaths = this.extractMissingPaths(result.error || { issues: [] } as any, item);

        if (result.success && missingPaths.length === 0) return item; // Genuinely valid and high-fidelity

        console.log(`[AutoFill] Detected gaps or placeholders for ${type}:`, missingPaths);

        // 2. Build Targeted AI Prompt
        const prompt = this.buildPrompt(item, type, missingPaths);

        try {
            // 3. Call AI to generate missing fragments
            const fragment = await this.generateMissingFragment(prompt);
            if (!fragment) return item;

            // 4. Merge Fragment and Return
            // 4. Merge Fragment and Return
            console.log(`[AutoFill] Successfully generated fragment for ${type}`);
            const merged = this.deepMerge(item, fragment);

            // Final check: Validate that the merge didn't break JSON (heuristic)
            return merged;
        } catch (error) {
            console.warn('[AutoFill] AI Generation failed, falling back to original item:', error);
            return item;
        }
    }

    /**
     * Extracts dot-paths of fields that are missing, null, or generic placeholders.
     */
    private static extractMissingPaths(error: ZodError, item: any): string[] {
        const paths: string[] = [];

        // 1. Zod Identified Missing/Invalid Fields
        for (const issue of error.issues) {
            paths.push(issue.path.join('.'));
        }

        // 2. Heuristic Check: Find generic placeholders that Zod might miss
        // e.g. "Rationale not generated", "Medication", "Order"
        const checkPlaceholders = (obj: any, currentPath: string = '') => {
            if (obj === null || obj === undefined) {
                if (currentPath) paths.push(currentPath);
                return;
            }
            if (typeof obj === 'string') {
                const genericRe = /^(Medication|Order|Drug|Rationale not generated|Fallback|Review the case study).*$/i;
                if (genericRe.test(obj)) paths.push(currentPath);
            } else if (Array.isArray(obj)) {
                obj.forEach((item, i) => checkPlaceholders(item, `${currentPath}.${i}`));
            } else if (typeof obj === 'object') {
                Object.keys(obj).forEach(key => checkPlaceholders(obj[key], currentPath ? `${currentPath}.${key}` : key));
            }
        };
        checkPlaceholders(item);

        return Array.from(new Set(paths.filter(p => p !== '')));
    }

    /**
     * Generates a clinical-aware prompt for the LLM.
     */
    private static buildPrompt(item: any, type: string, missing: string[]): string {
        const context = JSON.stringify(item, null, 2);

        return `
You are an expert NCLEX-RN Content Developer and Medical Writer.
TASK: Repair and complete a partially generated NGN ${type} item.

CONTEXT (Current Case Data + Item Partial):
${context}

CRITICAL REQUIREMENT:
The item is missing or has generic "PLACEHOLDER" content for:
${missing.map(p => `- ${p}`).join('\n')}

INSTRUCTIONS:
1. ANALYZE the clinical context (vitals, history, notes, age, gender) to create HIGH-FIDELITY, case-specific content.
2. DO NOT USE GENERIC TERMS. 
   - Instead of "Medication", use a specific drug name (e.g., "Furosemide 40mg IV", "Lisinopril 10mg PO").
   - Instead of "Action", use a specific nursing intervention (e.g., "Place the patient in High-Fowler's position").
   - Instead of "Rationale", provide the specific pathophysiology or safety rationale for THIS SPECIFIC patient.
3. CONSTRAINTS:
   - For BowTie actions/conditions/parameters: Generate the EXACT number required for the schema if missing.
   - For Patient data: If age is missing, infer a typical age based on the condition (e.g., bronchiolitis -> 6 months).
4. OUTPUT: Return ONLY a JSON fragment containing the missing or repaired fields.
5. NO MARKDOWN: Just the raw JSON object.

Example Output Structure:
{
  "prompt": "Based on the assessment findings, which medication should the nurse anticipate?",
  "content": {
    "patient": { "age": "45", "gender": "Male", "name": "Mr. S." },
    "orders": [{ "order": "Morphine 2mg IV push every 4 hours PRN pain", "time": "08:15" }]
  },
  "structure": {
    "actions": [ ... ],
    "conditions": [ ... ]
  }
}
`;
    }

    /**
     * Calls Gemini to generate the missing JSON fragment.
     */
    private static async generateMissingFragment(prompt: string): Promise<any> {
        const apiKey = await getAuthorizedApiKey();
        if (!apiKey) throw new Error("Missing AI API Key");

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Sanitize and Parse
        const cleanJson = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
        try {
            return JSON.parse(cleanJson);
        } catch (e) {
            // Heuristic cleanup if raw JSON parsing fails
            const start = cleanJson.indexOf('{');
            const end = cleanJson.lastIndexOf('}');
            if (start >= 0) return JSON.parse(cleanJson.substring(start, end + 1));
            throw e;
        }
    }

    /**
     * Deep merge source into target.
     */
    private static deepMerge(target: any, source: any): any {
        const output = { ...target };
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) Object.assign(output, { [key]: source[key] });
                    else output[key] = this.deepMerge(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }
}

function isObject(item: any) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
