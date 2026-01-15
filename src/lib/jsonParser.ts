/**
 * JSON PARSER - Advanced error recovery for AI-generated JSON
 * Handles malformed JSON with multiple fallback strategies
 */

export interface ParseResult {
    success: boolean;
    data?: any;
    error?: string;
    rawResponse?: string;
    attemptUsed?: number;
}

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Main parser with 5-stage fallback strategy
 */
export function parseAiResponse(response: string): ParseResult {
    let attempts = 0;
    const maxAttempts = 5;
    let cleaned = response;

    while (attempts < maxAttempts) {
        try {
            // Attempt 1: Direct parse (fastest path)
            if (attempts === 0) {
                const data = JSON.parse(cleaned);
                return { success: true, data, attemptUsed: 1 };
            }

            // Attempt 2: Strip markdown code fences
            if (attempts === 1) {
                cleaned = stripMarkdown(response);
                const data = JSON.parse(cleaned);
                return { success: true, data, attemptUsed: 2 };
            }

            // Attempt 3: Extract JSON from conversational text
            if (attempts === 2) {
                cleaned = extractJson(response);
                const data = JSON.parse(cleaned);
                return { success: true, data, attemptUsed: 3 };
            }

            // Attempt 4: Fix common JSON errors
            if (attempts === 3) {
                cleaned = fixCommonErrors(extractJson(response));
                const data = JSON.parse(cleaned);
                return { success: true, data, attemptUsed: 4 };
            }

            // Attempt 5: Aggressive repair (last resort)
            if (attempts === 4) {
                cleaned = aggressiveRepair(fixCommonErrors(extractJson(response)));
                const data = JSON.parse(cleaned);
                return { success: true, data, attemptUsed: 5 };
            }

        } catch (error) {
            attempts++;
            if (attempts >= maxAttempts) {
                console.error(`[JSONParser] All ${maxAttempts} attempts failed:`, error);
            }
        }
    }

    return {
        success: false,
        error: `Failed to parse JSON after ${maxAttempts} attempts`,
        rawResponse: response.substring(0, 500) // First 500 chars for debugging
    };
}

/**
 * Strategy 1: Strip markdown code fences
 */
function stripMarkdown(text: string): string {
    return text
        // Remove ```json or ```JSON
        .replace(/```json\s*/gi, '')
        .replace(/```\s*/g, '')
        // Remove leading/trailing whitespace
        .trim();
}

/**
 * Strategy 2: Extract JSON structure from surrounding text
 */
function extractJson(text: string): string {
    // Find first [ or {
    const arrayStart = text.indexOf('[');
    const objectStart = text.indexOf('{');

    let start = -1;
    if (arrayStart !== -1 && objectStart !== -1) {
        start = Math.min(arrayStart, objectStart);
    } else if (arrayStart !== -1) {
        start = arrayStart;
    } else if (objectStart !== -1) {
        start = objectStart;
    }

    // Find last ] or }
    const arrayEnd = text.lastIndexOf(']');
    const objectEnd = text.lastIndexOf('}');
    const end = Math.max(arrayEnd, objectEnd);

    if (start === -1 || end === -1 || end <= start) {
        throw new Error('No valid JSON structure found in text');
    }

    return text.substring(start, end + 1);
}

/**
 * Strategy 3: Fix common JSON syntax errors
 */
function fixCommonErrors(text: string): string {
    let fixed = text;

    // Fix trailing commas before closing brackets
    fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

    // Fix missing commas between objects/arrays
    fixed = fixed.replace(/}\s*{/g, '},{');
    fixed = fixed.replace(/]\s*\[/g, '],[');

    // Fix missing commas between properties
    fixed = fixed.replace(/"(\s+)"/g, '","');

    // Fix smart quotes (common in copy-paste)
    fixed = fixed.replace(/[""]/g, '"');
    fixed = fixed.replace(/['']/g, "'");

    // Fix single quotes to double quotes (JSON requires double)
    fixed = fixed.replace(/'/g, '"');

    // Remove control characters that break JSON
    fixed = fixed.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

    // Fix unescaped newlines in strings
    fixed = fixed.replace(/:\s*"([^"]*)\n([^"]*)"/g, (_match, p1, p2) => {
        return `: "${p1}\\n${p2}"`;
    });

    return fixed;
}

/**
 * Strategy 4: Aggressive repair (auto-close brackets, remove incomplete entries)
 */
function aggressiveRepair(text: string): string {
    let repaired = text;

    // Count brackets
    const openBraces = (repaired.match(/{/g) || []).length;
    const closeBraces = (repaired.match(/}/g) || []).length;
    const openBrackets = (repaired.match(/\[/g) || []).length;
    const closeBrackets = (repaired.match(/]/g) || []).length;

    // Auto-close missing closing brackets
    if (openBraces > closeBraces) {
        console.warn(`[JSONParser] Auto-closing ${openBraces - closeBraces} missing braces`);
        repaired += '}'.repeat(openBraces - closeBraces);
    }
    if (openBrackets > closeBrackets) {
        console.warn(`[JSONParser] Auto-closing ${openBrackets - closeBrackets} missing brackets`);
        repaired += ']'.repeat(openBrackets - closeBrackets);
    }

    // Remove incomplete trailing entries (e.g., `,"partialKey`)
    repaired = repaired.replace(/,\s*"[^"]*$/g, '');

    // Remove trailing commas that may have been introduced
    repaired = repaired.replace(/,(\s*[}\]])/g, '$1');

    // Remove incomplete key-value pairs at the end
    repaired = repaired.replace(/,\s*"[^"]*"\s*:\s*$/g, '');

    return repaired;
}

/**
 * Validates required fields for a question item
 */
export function validateItemSchema(item: any): ValidationResult {
    const errors: string[] = [];

    // Check if item is an object
    if (!item || typeof item !== 'object') {
        return { valid: false, errors: ['Item must be an object'] };
    }

    // Required root fields
    if (!item.id) errors.push('Missing required field: id');
    if (!item.typeId) errors.push('Missing required field: typeId');
    if (!item.metadata) errors.push('Missing required field: metadata');
    if (!item.content) errors.push('Missing required field: content');

    // Metadata validation
    if (item.metadata) {
        if (!item.metadata.title) errors.push('Missing metadata.title');
        if (!item.metadata.createdAt) errors.push('Missing metadata.createdAt');
    }

    // Content validation
    if (item.content) {
        if (!item.content.structure) errors.push('Missing content.structure');
    }

    // Type-specific validation
    if (item.typeId === 'case-study-6-screen') {
        if (!item.content.structure?.screens) {
            errors.push('Case study must have screens array');
        } else if (item.content.structure.screens.length !== 6) {
            errors.push(`Case study must have exactly 6 screens (found ${item.content.structure.screens.length})`);
        }
    }

    // Validate options for multiple choice/response types
    const typesWithOptions = ['multiple-choice', 'sata', 'multiple-response'];
    if (typesWithOptions.includes(item.typeId)) {
        if (!item.content.structure?.options || !Array.isArray(item.content.structure.options)) {
            errors.push('Missing or invalid options array');
        } else if (item.content.structure.options.length === 0) {
            errors.push('Options array is empty');
        }
    }

    return { valid: errors.length === 0, errors };
}

/**
 * Validates an array of items
 */
export function validateItems(items: any[]): {
    valid: boolean;
    errors: Array<{ index: number; errors: string[] }>;
    validCount: number;
} {
    if (!Array.isArray(items)) {
        return {
            valid: false,
            errors: [{ index: -1, errors: ['Input is not an array'] }],
            validCount: 0
        };
    }

    const results = items.map((item, index) => ({
        index,
        ...validateItemSchema(item)
    }));

    const invalidItems = results.filter(r => !r.valid);
    const validCount = results.length - invalidItems.length;

    return {
        valid: invalidItems.length === 0,
        errors: invalidItems.map(r => ({ index: r.index, errors: r.errors })),
        validCount
    };
}

/**
 * Attempts to fix common AI response patterns
 */
export function preprocessAiResponse(response: string): string {
    let processed = response;

    // Remove common AI prefixes
    const prefixes = [
        /^Here is the JSON:/i,
        /^Here's the JSON:/i,
        /^Here are the items:/i,
        /^Sure! Here's/i,
        /^Certainly!/i,
        /^Of course!/i
    ];

    prefixes.forEach(prefix => {
        processed = processed.replace(prefix, '');
    });

    // Remove trailing explanations
    const explanationMarkers = [
        /\n\nLet me know if/gi,
        /\n\nIs there anything/gi,
        /\n\nWould you like/gi,
        /\n\nI hope this helps/gi
    ];

    explanationMarkers.forEach(marker => {
        const matchIndex = processed.search(marker);
        if (matchIndex !== -1) {
            processed = processed.substring(0, matchIndex);
        }
    });

    return processed.trim();
}

/**
 * High-level helper that combines preprocessing and parsing
 */
export function parseAndValidate(response: string): {
    parseResult: ParseResult;
    validationResult?: ReturnType<typeof validateItems>;
} {
    // Preprocess
    const preprocessed = preprocessAiResponse(response);

    // Parse
    const parseResult = parseAiResponse(preprocessed);

    if (!parseResult.success) {
        return { parseResult };
    }

    // Validate
    const data = parseResult.data;
    const itemsArray = Array.isArray(data) ? data : [data];
    const validationResult = validateItems(itemsArray);

    return { parseResult, validationResult };
}

export const JSONParser = {
    parse: parseAiResponse,
    validate: validateItemSchema,
    validateItems,
    parseAndValidate,
    preprocess: preprocessAiResponse
};

export default JSONParser;
