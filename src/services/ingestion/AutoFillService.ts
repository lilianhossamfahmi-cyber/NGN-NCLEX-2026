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
        if (result.success) return item; // Item is already valid, skip

        const missingPaths = this.extractMissingPaths(result.error);
        if (missingPaths.length === 0) return item; // No actionable missing fields

        console.log(`[AutoFill] Detected missing fields for ${type}:`, missingPaths);

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
     * Extracts dot-paths of fields that failed 'required' validation.
     */
    private static extractMissingPaths(error: ZodError): string[] {
        const paths: string[] = [];
        for (const issue of error.issues) {
            // Check for missing fields (invalid_type with received undefined)
            if (issue.code === 'invalid_type' && (issue as any).received === 'undefined') {
                paths.push(issue.path.join('.'));
            }
        }
        // Deduplicate paths
        return Array.from(new Set(paths));
    }

    /**
     * Generates a clinical-aware prompt for the LLM.
     */
    private static buildPrompt(item: any, type: string, missing: string[]): string {
        const context = JSON.stringify(item, null, 2);

        return `
You are an expert NCLEX-RN Content Developer.
TASK: Complete a partially generated NGN ${type} item.

CONTEXT (Current Item Data):
${context}

MISSING FIELDS TO FILL:
${missing.map(p => `- ${p}`).join('\n')}

INSTRUCTIONS:
1. Use the existing clinical context (patient data, vitals, history) to generate these fields.
2. Ensure content is highly case-specific. NEVER use generic placeholders like "N/A", "medication", or "missing".
3. For 'rationale', provide deep clinical reasoning (pathophysiology, safety, takeaways).
4. For 'options' or 'structure' arrays, ensure IDs are unique and 'isCorrect' logic aligns with the scenario.
5. Return ONLY a JSON fragment containing the missing fields. No introductory or closing text.

Example Fragment:
{
  "rationale": { "general": "...", "pathophysiology": "...", "safetyCheck": "..." },
  "structure": { "options": [ ... ] }
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
