/**
 * sanitizeIds.ts
 * 
 * Pre-pipeline sanitizer middleware that:
 * 1. Strips trailing commas/spaces from every `.id` field
 * 2. De-stringifies double-encoded JSON objects
 * 3. Recursively walks the entire item tree
 * 
 * This is the FIRST line of defense against malformed AI-generated payloads.
 * 
 * @version 1.0.0
 */

import type { MasterQuestionItem } from '../types/master-schema';

/**
 * Cleans an ID string by removing trailing commas, spaces, and internal whitespace
 */
const cleanId = (raw: string): string =>
    raw
        .trim()              // Remove leading/trailing spaces
        .replace(/,+$/, '')  // Remove one or more trailing commas
        .replace(/\s+/g, ''); // Squash all internal whitespace

/**
 * Recursively walks an object tree and sanitizes all `id` fields
 */
function walkAndCleanIds(node: unknown): void {
    if (Array.isArray(node)) {
        node.forEach(walkAndCleanIds);
    } else if (node && typeof node === 'object') {
        const obj = node as Record<string, unknown>;
        for (const [key, value] of Object.entries(obj)) {
            if (key === 'id' && typeof value === 'string') {
                const cleaned = cleanId(value);
                if (cleaned !== value) {
                    console.log(`[SanitizeIds] Fixed ID: "${value}" → "${cleaned}"`);
                    obj[key] = cleaned;
                }
            }
            walkAndCleanIds(value);
        }
    }
}

/**
 * Recursively detects and parses double-encoded JSON strings
 * e.g., "{"foo":1}" → { foo: 1 }
 */
function reviveDoubleEncodedJson(node: unknown): void {
    if (Array.isArray(node)) {
        node.forEach(reviveDoubleEncodedJson);
    } else if (node && typeof node === 'object') {
        const obj = node as Record<string, unknown>;
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string') {
                const trimmed = value.trim();
                // Detect JSON object or array strings
                if ((trimmed.startsWith('{') && trimmed.endsWith('}')) ||
                    (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
                    try {
                        const parsed = JSON.parse(trimmed);
                        console.log(`[SanitizeIds] Revived double-encoded JSON at key: "${key}"`);
                        obj[key] = parsed;
                        // Recurse into newly parsed object
                        reviveDoubleEncodedJson(obj[key]);
                    } catch {
                        // Not valid JSON - leave as-is
                    }
                }
            } else {
                reviveDoubleEncodedJson(value);
            }
        }
    }
}

/**
 * Main entry point: Sanitizes an item by cleaning IDs and reviving double-encoded JSON
 * 
 * @param item - The raw item to sanitize (can be any shape)
 * @returns The sanitized item (mutated in place, but also returned for chaining)
 */
export function sanitizeItem<T extends object>(item: T): T {
    if (!item) {
        console.warn('[SanitizeIds] Received null/undefined item');
        return item;
    }

    // Step 1: Clean all ID fields in the original structure
    walkAndCleanIds(item);

    // Step 2: Revive double-encoded JSON
    reviveDoubleEncodedJson(item);

    // Step 3: Clean IDs again in any newly revived structures
    // This catches IDs that were inside double-encoded JSON strings
    walkAndCleanIds(item);

    return item;
}

/**
 * Type-safe wrapper specifically for MasterQuestionItem
 */
export function sanitizeMasterItem(item: MasterQuestionItem): MasterQuestionItem {
    return sanitizeItem(item);
}

/**
 * Validates that all IDs in an item are properly formatted (no trailing commas/spaces)
 * Returns an array of error messages for any invalid IDs found
 */
export function validateIds(item: unknown): string[] {
    const errors: string[] = [];
    const invalidIdPattern = /[,\s]$/;

    function check(node: unknown, path: string): void {
        if (Array.isArray(node)) {
            node.forEach((child, i) => check(child, `${path}[${i}]`));
        } else if (node && typeof node === 'object') {
            const obj = node as Record<string, unknown>;
            for (const [key, value] of Object.entries(obj)) {
                const currentPath = path ? `${path}.${key}` : key;
                if (key === 'id' && typeof value === 'string' && invalidIdPattern.test(value)) {
                    errors.push(`Invalid ID at ${currentPath}: "${value}"`);
                }
                check(value, currentPath);
            }
        }
    }

    check(item, '');
    return errors;
}
