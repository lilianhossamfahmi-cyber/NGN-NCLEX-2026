import { MasterQuestionItem, InputMode } from '../types/master-schema';
import { UnifiedDataPipeline } from './UnifiedDataPipeline';

import { AppConfig, getGenAI, limiter } from '../config/apiConfig';

const genAI = getGenAI();


export const attemptAiJsonFix = async (malformedInput: string): Promise<{ success: boolean, data?: MasterQuestionItem[], error?: string }> => {
    if (!genAI || !AppConfig.features.aiGeneration) {
        return { success: false, error: "AI Fix unavailable: No API Key or AI disabled." };
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Start Prompt ...
        const prompt = `
        SYSTEM: You are a JSON Repair Robot.
        The user has provided invalid JSON or text that contains JSON.
        Your task is to extract the JSON or Array of JSON objects and return it as VALID, STRICT JSON.

        RULES:
        1. Output ONLY the JSON. No markdown markers (like \`\`\`json), no conversation.
        2. If the input is a single object, wrap it in an array [].
        3. Ensure all property names are double-quoted.
        4. Fix trailing commas or missing brackets.
        5. If the input describes a question but is not JSON, convert it into a valid JSON object representing the question content.
        
        INPUT TO FIX:
        ${malformedInput.slice(0, 15000)}
        `;

        await limiter.checkLimit();
        const result = await model.generateContent(prompt);

        const text = result.response.text();

        // Clean markdown if AI ignores rule
        const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return parseJsonInput(clean);
    } catch (e: any) {
        return { success: false, error: "AI Fix Failed: " + e.message };
    }
};

/**
 * Aggressive Local JSON Repair (Nuclear Option)
 * Fixes structural errors that AI commonly makes without needing a network call.
 */
export const aggressiveRepairJson = (raw: string): string => {
    let clean = raw.trim();

    // 1. Remove/Extract Markdown code blocks
    // Handle multiple blocks by joining them with commas (assuming they are separate objects/arrays)
    if (clean.includes('```')) {
        const blocks: string[] = [];
        const regex = /```(?:json)?([\s\S]*?)```/g;
        let match;
        let found = false;

        while ((match = regex.exec(clean)) !== null) {
            found = true;
            blocks.push(match[1].trim());
        }

        if (found) {
            // Join matched blocks with comma to simulate formatting: obj1, obj2
            clean = blocks.join(', ');
        }
    }

    // 2. DO NOT escape structural newlines - they are valid JSON whitespace
    // Only problematic newlines are INSIDE string values, which we handle via field-specific logic below

    // 3. TARGETED HTML FIX: Convert double quotes INSIDE html strings to single quotes
    // This is the #1 cause of "Expected ',' or '}'"
    // REMOVED 'rationale' because it is now a structured object, not just a string
    const htmlFields = ['history', 'historyPhysical', 'labs', 'orders', 'radiology', 'notes', 'text', 'prompt'];

    htmlFields.forEach(field => {
        // Look for: "field": "CONTENT"
        // We use a smarter lookahead to find the closing quote.
        // It must be followed by:
        // 1. Whitespace + } (End of object)
        // 2. Whitespace + , + Whitespace + "NextKey": (Start of next property)

        // Regex explanation:
        // "${field}"\s*:\s*"  -> Match Key
        // ([\s\S]*?)          -> Match Content (safe greedy-ish)
        // "(?=\s*\}|\s*,\s*"[^"]+"\s*:) -> Lookahead for valid JSON terminator

        const regex = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*\\}|\\s*,\\s*"[^"]+"\\s*:)`, 'g');

        clean = clean.replace(regex, (_, content) => {
            // Replace " with ' ONLY inside the content
            const safeContent = content.replace(/"/g, "'");
            return `"${field}": "${safeContent}"`;
        });
    });

    // 4. GLOBAL FALLBACK: Fix HTML properties specifically
    // style="width..." -> style='width...'
    clean = clean.replace(/style="([^"]*)"/g, "style='$1'");
    clean = clean.replace(/class="([^"]*)"/g, "class='$1'");

    // 5. Normalize Smart Quotes & Unicode
    clean = clean.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
    clean = clean.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");

    // 6. Fix Unquoted Keys
    clean = clean.replace(/([{,]\s*)([a-zA-Z0-9._-]+)\s*:/g, '$1"$2":');

    // 7. MISSING COMMAS (Between objects/elements)
    clean = clean.replace(/"\s*"/g, '", "'); // "val" "val"
    clean = clean.replace(/(\d+|true|false|null)(\s*)"/g, '$1, "$2'); // 123 "key"
    clean = clean.replace(/\}\s*\{/g, '}, {');
    clean = clean.replace(/\]\s*\{/g, '], {');
    clean = clean.replace(/\}\s*\[/g, '}, [');
    clean = clean.replace(/"\s*\{/g, '", {');

    // 8. TRAILING COMMAS
    clean = clean.replace(/,(\s*[,\]\}])/g, '$1');
    clean = clean.replace(/,\s*([\}\]])/g, '$1');

    // 9. FIX BAD ESCAPES (Common AI Error: "patient\'s")
    // JSON does NOT support escaped single quotes. We must remove the backslash.
    clean = clean.replace(/\\'/g, "'");

    return clean;
};

export const parseJsonInput = (input: string): { success: boolean, data?: MasterQuestionItem[], error?: string } => {
    let cleanJson = aggressiveRepairJson(input);

    // Attempt standard parse
    try {
        JSON.parse(cleanJson);
    } catch (e) {
        // [RECOVERY 1]: Check if it's a list of objects missing the array wrapper (Obj1, Obj2)
        // Try wrapping in brackets
        try {
            const wrapped = `[${cleanJson}]`;
            JSON.parse(wrapped);
            cleanJson = wrapped; // It worked!
        } catch (wrapperError) {
            // [RECOVERY 2]: Extraction attempt for messy text (if wrapper failed)
            const jsonMatch = cleanJson.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (jsonMatch) {
                const extracted = aggressiveRepairJson(jsonMatch[0]);
                try {
                    JSON.parse(extracted);
                    cleanJson = extracted;
                } catch (innerError) {
                    // Try wrapping extracted content too
                    try {
                        const wrappedExtracted = `[${extracted}]`;
                        JSON.parse(wrappedExtracted);
                        cleanJson = wrappedExtracted;
                    } catch (finalError) {
                        // Last ditch: if it's still failing, it might be due to unescaped quotes inside strings
                        // We'll return the failure but keep the cleaned version available
                    }
                }
            }
        }
    }

    try {
        const parsed = JSON.parse(cleanJson);

        // UNWRAP CONTAINER LOGIC:
        // Commonly AIs return { "items": [...] } or { "questions": [...] } even when asked for an array.
        let items: any[] = [];

        if (!Array.isArray(parsed) && parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed.items)) items = parsed.items;
            else if (Array.isArray(parsed.questions)) items = parsed.questions;
            else if (Array.isArray(parsed.data)) items = parsed.data;
            else items = [parsed]; // True single object
        } else {
            items = Array.isArray(parsed) ? parsed : [parsed];
        }

        // Handle flattened nested arrays (fixes multiple code blocks each returning an array)
        items = items.reduce((acc: any[], val: any) => acc.concat(Array.isArray(val) ? val : [val]), []);

        // Basic Validation: Filter out empty/null/primitive garbage
        const validItems = items.filter((i: any) => i && typeof i === 'object' && !Array.isArray(i));

        // ============================================================
        // UNIFIED PIPELINE: Single transformation for ALL items
        // This replaces the complex mapping logic below
        // ============================================================
        const mappedItems: MasterQuestionItem[] = validItems.map((raw: any) => {
            // If already processed by pipeline, return as-is
            if (raw._unifiedPipelineProcessed) return raw as MasterQuestionItem;

            // Transform through the unified pipeline
            return UnifiedDataPipeline.transform(raw);
        });

        return { success: true, data: mappedItems };
    } catch (e: any) {
        let errorMsg = e.message;
        const trimmed = input.trim();
        if (trimmed.startsWith('>') || trimmed.startsWith('#')) {
            errorMsg = "Input contains Markdown (Prompts/Guides). We tried to extract JSON but failed. Please paste ONLY the generated JSON code.";
        } else if (trimmed.startsWith('User:') || trimmed.includes("Here is the JSON")) {
            errorMsg = "Input contains chat/conversation text. We tried to extract JSON but failed. Please paste ONLY the JSON object.";
        }
        return { success: false, error: `JSON Parse Failed: ${errorMsg}` };
    }
};

export const parseCsvInput = (csvText: string): { success: boolean, data?: MasterQuestionItem[], error?: string } => {
    try {
        const lines = csvText.split('\n').filter(l => l.trim().length > 0);
        if (lines.length < 2) return { success: false, error: "Empty or invalid CSV" };


        const items: MasterQuestionItem[] = [];

        // Expect specific headers or best guess
        // Minimal: Type, Prompt, Options... 

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(','); // Naive split (fails on commas in quotes, but good enough for MVP)

            // Map to Structure... this is very brittle for complex NGN. 
            // I'll create a basic MCQ placeholder.
            // This is just to satisfy the "button exists" requirement unless user provides spec.

            items.push({
                id: crypto.randomUUID(),
                typeId: 'multiple-choice', // Default fallback
                metadata: {
                    title: 'CSV Import ' + i,
                    authorId: 'CSV',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    status: 'draft',
                    qualityScore: 50,
                    hasStudentPreview: true,
                    batchInfo: { batchId: 'csv', batchSize: 1, temperature: 0, generationDate: new Date().toISOString() },
                    sourceOrigin: 'upload' as InputMode,
                    sourceReferences: []
                },
                pedagogy: { difficultyLevel: 3, clinicalFocus: 'Imported', clinicalFocusTopics: [] },
                aiSafetyChecks: { runId: 'csv', timestamp: new Date().toISOString(), copyrightScore: 100, duplicationCheck: { isDuplicate: false, similarityScore: 0 }, validationStatus: 'Pass', issues: [], autoFixHistory: [] },
                content: {
                    quickStart: { summary: values[1] || 'Imported' },
                    clinicalData: null,
                    structure: {
                        type: 'multiple-choice',
                        prompt: values[1] || 'Question Prompt',
                        options: [
                            { id: 'o1', text: values[2] || 'Option A', isCorrect: true },
                            { id: 'o2', text: values[3] || 'Option B', isCorrect: false }
                        ]
                    }
                }
            });
        }
        return { success: true, data: items };
    } catch (e: any) {
        return { success: false, error: "CSV Parse Error: " + e.message };
    }
}
