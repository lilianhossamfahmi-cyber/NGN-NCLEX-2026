import { MasterQuestionItem, InputMode } from '../types/master-schema';
import { UnifiedDataPipeline } from './UnifiedDataPipeline';
import { AppConfig, getGenAI, limiter } from '../config/apiConfig';

const genAI = getGenAI();

export const attemptAiJsonFix = async (malformedInput: string): Promise<{ success: boolean, data?: MasterQuestionItem[], error?: string }> => {
    if (!genAI || !AppConfig.features.aiGeneration) {
        return { success: false, error: "AI Fix unavailable: No API Key or AI disabled." };
    }

    // Use a more capable model list for repairs
    const candidateModels = [
        "gemini-2.0-flash",
        "gemini-1.5-pro",
        "gemini-1.5-flash",
        "gemini-pro"
    ];

    for (const modelName of candidateModels) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });

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
            ${malformedInput.slice(0, 20000)}
            `;

            await limiter.checkLimit();
            const result = await model.generateContent(prompt);
            const text = result.response.text();

            const clean = text.replace(/```json/g, '').replace(/```/g, '').trim();

            // Aggressive parsing attempt
            let validJsonString = clean;
            const start = clean.indexOf('{');
            const end = clean.lastIndexOf('}');

            // Also check for array wrapping
            const startArr = clean.indexOf('[');
            const endArr = clean.lastIndexOf(']');

            // If array markers are wider than object markers, use them
            if (startArr >= 0 && endArr > startArr && (start === -1 || startArr < start)) {
                validJsonString = clean.substring(startArr, endArr + 1);
            } else if (start >= 0 && end > start) {
                validJsonString = clean.substring(start, end + 1);
            }

            try {
                return parseJsonInput(validJsonString);
            } catch (e) {
                // Try to fix common JSON errors (e.g. trailing commas)
                try {
                    const fixed = validJsonString.replace(/,\s*([\]}])/g, '$1');
                    return parseJsonInput(fixed);
                } catch (e2) {
                    console.warn(`[AiJsonFix] JSON Parse failed for model ${modelName}:`, e);
                    continue;
                }
            }

        } catch (e: any) {
            console.warn(`[AiJsonFix] Model ${modelName} failed:`, e.message);
            if (e.message.includes('404') || e.message.includes('not found')) {
                continue; // Try next model
            }
            // Continue to next model on other errors too
        }
    }

    return { success: false, error: "All AI models failed to repair the JSON." };
};

/**
 * Aggressive Local JSON Repair (Nuclear Option)
 * Fixes structural errors that AI commonly makes without needing a network call.
 */
export const aggressiveRepairJson = (raw: string): string => {
    if (!raw) return "";
    let clean = raw.trim();

    // 0. Preliminary Cleanup
    clean = clean.replace(/^(Here is the JSON|Sure, here it is|JSON:|```json|```)\s*/i, '');

    // 1. IMPROVED CODE BLOCK EXTRACTION
    if (clean.includes('```')) {
        const blocks: string[] = [];
        const regex = /```(?:json|any|text)?([\s\S]*?)```/g;
        let match;
        while ((match = regex.exec(clean)) !== null) {
            blocks.push(match[1].trim());
        }
        if (blocks.length > 0) {
            clean = blocks.join(', ');
        }
    }

    // 2. ESCAPE UNESCAPED QUOTES (The #1 Error)
    const commonFields = [
        'prompt', 'rationale', 'explanation', 'history', 'historyPhysical',
        'vitalSigns', 'nursesNotes', 'entry', 'order', 'drug', 'text', 'drugName',
        'clinicalLogic', 'strategy', 'knowledge', 'coreConcept', 'pathophysiology'
    ];

    commonFields.forEach(field => {
        const fieldRegex = new RegExp(`("${field}"\\s*:\\s*")([\\s\\S]*?)("(?=\\s*[\\},]))`, 'g');
        clean = clean.replace(fieldRegex, (_, prefix, content, suffix) => {
            const safeContent = content.replace(/(?<!\\)"/g, "'");
            return prefix + safeContent + suffix;
        });
    });

    // 3. FIX MULTI-LINE STRINGS (The #2 Error)
    const stringRegex = /"([^"\\]*(?:\\.[^"\\]*)*)"/g;
    clean = clean.replace(stringRegex, (fullMatch, content) => {
        if (content.includes('\n') || content.includes('\r')) {
            return `"${content.replace(/\r?\n/g, '\\n').replace(/\r/g, '\\n')}"`;
        }
        return fullMatch;
    });

    // 4. FIX UNQUOTED KEYS 
    clean = clean.replace(/([{,]\s*)([a-zA-Z0-9_-]+)\s*:/g, '$1"$2":');

    // 5. FIX TRAILING COMMAS
    clean = clean.replace(/,(\s*[\]\}])/g, '$1');

    // 6. FIX MISSING COMMAS BETWEEN OBJECTS/ARRAYS
    clean = clean.replace(/\}\s*\{/g, '}, {');
    clean = clean.replace(/\]\s*\[/g, '], [');
    clean = clean.replace(/\}\s*\[/g, '}, [');
    clean = clean.replace(/\]\s*\{/g, '], {');

    // 7. REMOVE SINGLE LINE COMMENTS
    clean = clean.replace(/([^:])\/\/.*/g, '$1');

    // 8. NORMALIZE UNICODE QUOTES
    clean = clean.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
    clean = clean.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");

    // 9. WRAP IN ARRAY IF MISSING
    if (clean.includes('}, {') && !clean.startsWith('[')) {
        clean = `[${clean}]`;
    }

    return clean;
};

export const parseJsonInput = (input: string): { success: boolean, data?: MasterQuestionItem[], error?: string } => {
    let cleanJson = aggressiveRepairJson(input);

    try {
        const parsed = JSON.parse(cleanJson);
        return processParsedResult(parsed);
    } catch (e: any) {
        const originalError = e.message;
        try {
            const wrapped = `[${cleanJson}]`;
            const parsed = JSON.parse(wrapped);
            return processParsedResult(parsed);
        } catch (innerE) {
            const jsonMatch = cleanJson.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
            if (jsonMatch) {
                try {
                    const extracted = aggressiveRepairJson(jsonMatch[0]);
                    const parsed = JSON.parse(extracted);
                    return processParsedResult(parsed);
                } catch (finalE: any) {
                    return { success: false, error: `JSON Parse Failed: ${originalError}. Tip: Our Local Auto-Fix can help resolve this by force-escaping clinical text.` };
                }
            }
            return { success: false, error: `JSON Parse Failed: ${originalError}` };
        }
    }
};

const processParsedResult = (parsed: any): { success: boolean, data: MasterQuestionItem[] } => {
    let items: any[] = [];
    if (!Array.isArray(parsed) && parsed && typeof parsed === 'object') {
        if (Array.isArray(parsed.items)) items = parsed.items;
        else if (Array.isArray(parsed.questions)) items = parsed.questions;
        else if (Array.isArray(parsed.data)) items = parsed.data;
        else items = [parsed];
    } else {
        items = Array.isArray(parsed) ? parsed : [parsed];
    }
    items = items.reduce((acc: any[], val: any) => acc.concat(Array.isArray(val) ? val : [val]), []);
    const validItems = items.filter((i: any) => i && typeof i === 'object' && !Array.isArray(i));
    const mappedItems: MasterQuestionItem[] = validItems.map((raw: any) => UnifiedDataPipeline.transform(raw));
    return { success: true, data: mappedItems };
};

export const parseCsvInput = (csvText: string): { success: boolean, data?: MasterQuestionItem[], error?: string } => {
    try {
        const lines = String(csvText).split('\n').filter(l => l.trim().length > 0);
        if (lines.length < 2) return { success: false, error: "Empty or invalid CSV" };
        const items: MasterQuestionItem[] = [];
        for (let i = 1; i < lines.length; i++) {
            const values = String(lines[i]).split(',');
            items.push({
                id: crypto.randomUUID(),
                typeId: 'multiple-choice',
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
