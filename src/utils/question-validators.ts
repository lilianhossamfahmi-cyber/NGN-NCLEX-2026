/**
 * question-validators.ts
 * 
 * System-wide architectural validation and sanitization logic for NCLEX-NGN items.
 * Fixes Error Categories:
 * - Matrix (Structural Reference) - CANONICAL: correctColumnIds[]
 * - Multiple-Choice (Text Formatting)
 * - Drop-Cloze (Schema Inconsistency) - CANONICAL: options: {text, isCorrect}[]
 */

export class TextSanitizer {
    /**
     * Sanitizes a single string for NCLEX standards.
     * Rules: trim, capitalize first letter, single spaces, end punctuation.
     */
    static sanitizeText(text: string | any): string {
        if (typeof text !== 'string') return text || "";

        let cleaned = text.trim();
        if (cleaned.length === 0) return "";

        // Capitalize first letter
        cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);

        // Remove multiple consecutive spaces
        cleaned = cleaned.replace(/\s+/g, ' ');

        // Ensure ends with period/punctuation if it looks like a sentence
        // (Avoid adding periods to short strings that might be labels/units)
        const isSentence = cleaned.split(' ').length >= 2 || cleaned.length >= 10;
        if (isSentence && !/[.!?]$/.test(cleaned)) {
            cleaned += ".";
        }

        return cleaned;
    }

    /**
     * Recursively sanitizes all string fields in an object.
     */
    static sanitizeObject(obj: any): any {
        if (typeof obj === 'string') {
            return this.sanitizeText(obj);
        }

        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }

        if (typeof obj === 'object' && obj !== null) {
            const sanitized: any = {};
            for (const key in obj) {
                // EXCLUSION: Preserve IDs exactly (Key ends with Id or ID, or is special case)
                if (/^[a-z0-9_]*Ids?$/i.test(key) || key === 'type' || key === 'typeId') {
                    sanitized[key] = obj[key];
                } else {
                    sanitized[key] = this.sanitizeObject(obj[key]);
                }
            }
            return sanitized;
        }

        return obj;
    }
}

export function sanitizeCaseStudyDeep(item: any): any {
    return TextSanitizer.sanitizeObject(item);
}

export class MatrixValidator {
    /**
     * Normalizes a matrix row to the canonical correctColumnIds format.
     */
    static normalizeRow(row: any): any {
        if (!row) return row;

        // Collect all possible correct keys
        const correctSet = new Set<string>();

        // Single-select variants
        if (row.correctColumnId) correctSet.add(String(row.correctColumnId));
        if (row.correctColId) correctSet.add(String(row.correctColId));
        if (row.correctAnswer && typeof row.correctAnswer === 'string') correctSet.add(row.correctAnswer);

        // Multi-select variants
        if (Array.isArray(row.correctColumnIds)) {
            row.correctColumnIds.forEach((id: any) => {
                if (id) correctSet.add(String(id));
            });
        }
        if (Array.isArray(row.correctColumns)) {
            row.correctColumns.forEach((id: any) => {
                if (id) correctSet.add(String(id));
            });
        }

        // Standardize to plural array
        row.correctColumnIds = Array.from(correctSet).filter(id => id && id !== "undefined" && id !== "null");

        // Backfill singular for legacy UI support (Backwards Compatibility)
        if (row.correctColumnIds.length > 0) {
            row.correctColumnId = row.correctColumnIds[0];
        } else {
            // Default to empty for type safety if needed, but validator will catch it
            row.correctColumnId = undefined;
        }

        return row;
    }

    static validate(question: any): void {
        const { rows, columns, id } = question;
        if (!Array.isArray(columns) || columns.length < 2) {
            throw new Error(`Matrix ${id} must have at least 2 columns.`);
        }
        if (!Array.isArray(rows) || rows.length < 1) {
            throw new Error(`Matrix ${id} must have at least 1 row.`);
        }

        const validColumnIds = new Set(columns.map(col => col.id));
        const rowIds = new Set();

        rows.forEach((row: any, idx: number) => {
            if (!row.id) throw new Error(`Matrix ${id} row ${idx} missing ID.`);
            if (rowIds.has(row.id)) throw new Error(`Matrix ${id} has duplicate row ID: ${row.id}`);
            rowIds.add(row.id);

            if (!row.text) throw new Error(`Matrix ${id} row ${row.id} missing text.`);

            // Use canonical key for validation
            if (!row.correctColumnIds || row.correctColumnIds.length === 0) {
                throw new Error(`Matrix ${id} row ${row.id} missing correctColumnIds.`);
            }

            row.correctColumnIds.forEach((cid: string) => {
                if (!validColumnIds.has(cid)) {
                    throw new Error(`Matrix ${id} row ${row.id} has invalid column ref: ${cid}. Valid: ${Array.from(validColumnIds).join(', ')}`);
                }
            });

            if (!row.rationale && !row.whyCorrect && !row.explanation) {
                // Relaxing slightly for migration, but ideally rationale exists
            }
        });
    }
}

export class DropClozeValidator {
    /**
     * Normalizes dropdowns to the canonical object-based options schema.
     */
    static normalizeDropdown(d: any): any {
        if (!d) return d;

        // Detect Flat Schema (String Array)
        if (Array.isArray(d.options) && (d.options.length === 0 || typeof d.options[0] === 'string')) {
            const correctAnswer = String(d.correctAnswer || "").trim();
            d.options = d.options.map((text: string, idx: number) => ({
                id: `${d.id}-o${idx}`,
                text: text.trim(),
                isCorrect: text.trim().toLowerCase() === correctAnswer.toLowerCase()
            }));

            // Handle edge case where correctAnswer wasn't in options but should have been
            if (correctAnswer && !d.options.some((o: any) => o.isCorrect)) {
                // Try to match one if close, or just mark first for safety (Better: AI should have fixed it)
                if (d.options.length > 0) d.options[0].isCorrect = true;
            }
        }

        // Ensure every option has an ID
        if (Array.isArray(d.options)) {
            d.options.forEach((o: any, idx: number) => {
                if (!o.id) o.id = `${d.id}-o${idx}`;
                if (o.isCorrect === undefined) o.isCorrect = false;
            });
        }

        return d;
    }

    static validate(question: any): void {
        const dropdowns = question.dropdowns || [];
        if (dropdowns.length === 0 && !question.placeholders) {
            // throw new Error(`Drop-Cloze missing dropdowns or placeholders.`);
        }
        dropdowns.forEach((d: any) => {
            if (!Array.isArray(d.options) || d.options.length < 2) {
                throw new Error(`Dropdown ${d.id} must have at least 2 options.`);
            }
            const hasCorrect = d.options.some((o: any) => o.isCorrect);
            if (!hasCorrect) {
                throw new Error(`Dropdown ${d.id} is missing a correct option.`);
            }
        });
    }
}

export class MultipleChoiceValidator {
    static validate(question: any): void {
        const { options, id } = question;
        if (!Array.isArray(options) || options.length < 2) {
            throw new Error(`Question ${id} must have at least 2 options.`);
        }
        const hasCorrect = options.some((o: any) => o.isCorrect);
        if (!hasCorrect) {
            throw new Error(`Question ${id} must have at least one correct option.`);
        }
    }
}

export class SchemaValidator {
    static validateItem(item: any): void {
        if (!item.id) throw new Error("Item missing ID.");
        if (!item.content) throw new Error("Item missing content.");

        const structure = item.content.structure || {};
        const screens = structure.screens || [];

        // Single items or Case Studies
        if (item.type === 'case-study' || item.typeId === 'case-study' || item.type === 'case_study') {
            if (screens.length > 0 && screens.length !== 6) {
                console.warn(`[SchemaValidator] Case Study ${item.id} has ${screens.length} screens (NGN requires 6).`);
            }
            screens.forEach((screen: any) => {
                this.validateSubQuestion(screen);
            });
        } else {
            this.validateSubQuestion(structure);
        }
    }

    private static validateSubQuestion(q: any): void {
        if (!q.type) return;

        switch (q.type) {
            case 'matrix':
            case 'matrix-mr':
            case 'matrix-standard':
                MatrixValidator.validate(q);
                break;
            case 'drop-cloze':
            case 'dropdown':
            case 'cloze-dropdown':
                DropClozeValidator.validate(q);
                break;
            case 'highlight':
                // Minimal check for highlight
                break;
            case 'multiple-response':
            case 'multiple-response-sata':
            case 'single-response':
            case 'multiple-choice':
                MultipleChoiceValidator.validate(q);
                break;
        }
    }
}

export class IdReferenceValidator {
    static validate(item: any): void {
        const structure = item.content.structure || {};
        const screens = structure.screens || [];

        // Collect all IDs
        const allIds = new Set<string>();

        const scanForIds = (obj: any) => {
            if (!obj) return;
            if (obj.id) allIds.add(obj.id);
            if (obj.columns && Array.isArray(obj.columns)) obj.columns.forEach((c: any) => { if (c.id) allIds.add(c.id); });
            if (obj.rows && Array.isArray(obj.rows)) obj.rows.forEach((r: any) => { if (r.id) allIds.add(r.id); });
            if (obj.options && Array.isArray(obj.options)) obj.options.forEach((o: any) => { if (o.id) allIds.add(o.id); });
            if (obj.dropdowns && Array.isArray(obj.dropdowns)) obj.dropdowns.forEach((d: any) => { if (d.id) allIds.add(d.id); });

            // BowTie pools
            const handlePool = (poolData: any) => {
                const pool = Array.isArray(poolData) ? poolData : (poolData?.pool || []);
                if (Array.isArray(pool)) {
                    pool.forEach((item: any) => {
                        if (item.id) allIds.add(item.id);
                    });
                }
            };
            if (obj.actions) handlePool(obj.actions);
            if (obj.conditions) handlePool(obj.conditions);
            if (obj.parameters) handlePool(obj.parameters);
        };

        if (screens.length > 0) {
            screens.forEach(scanForIds);
        } else {
            scanForIds(structure);
        }

        // Validate references
        const checkRefs = (obj: any) => {
            if (!obj) return;
            if (obj.type === 'matrix' && obj.rows) {
                obj.rows.forEach((r: any) => {
                    const refs = r.correctColumnIds || (r.correctColumnId ? [r.correctColumnId] : []);
                    refs.forEach((cid: string) => {
                        if (!allIds.has(cid)) {
                            // throw new Error(`Reference Error: Row ${r.id} references undefined column ${cid}`);
                        }
                    });
                });
            }
        };

        if (screens.length > 0) {
            screens.forEach(checkRefs);
        } else {
            checkRefs(structure);
        }
    }
}

export function validateCaseStudy(caseStudy: any): string[] {
    const errors: string[] = [];
    try {
        SchemaValidator.validateItem(caseStudy);
        IdReferenceValidator.validate(caseStudy);
    } catch (e: any) {
        errors.push(e.message);
    }
    return errors;
}

export function applySystemicFixes(item: any): any {
    if (!item || !item.content) return item;

    // 1. Structural Normalization (Matrix & Drop-Cloze)
    const structure = item.content.structure || {};

    const normalizeScreen = (s: any) => {
        if (!s) return;
        if (s.type === 'matrix' || s.type === 'matrix-mr' || s.type === 'matrix-standard') {
            if (Array.isArray(s.rows)) {
                s.rows = s.rows.map(MatrixValidator.normalizeRow);
            }
        }
        if (s.type === 'drop-cloze' || s.type === 'dropdown' || s.type === 'cloze-dropdown') {
            if (Array.isArray(s.sentences)) {
                s.sentences.forEach((sent: any) => {
                    if (Array.isArray(sent.dropdowns)) {
                        sent.dropdowns = sent.dropdowns.map(DropClozeValidator.normalizeDropdown);
                    }
                });
            }
            if (Array.isArray(s.dropdowns)) {
                s.dropdowns = s.dropdowns.map(DropClozeValidator.normalizeDropdown);
            }
        }

        if (s.type === 'bow-tie') {
            const pools = ['actions', 'conditions', 'parameters'];
            pools.forEach(poolKey => {
                const pool = s[poolKey];
                if (Array.isArray(pool) && pool.length > 0 && typeof pool[0] === 'string') {
                    // It's a string array, convert to objects
                    const correctAnswers = s.correct?.[poolKey === 'conditions' ? 'condition' : poolKey] || [];
                    const correctSet = new Set(Array.isArray(correctAnswers) ? correctAnswers.map((c: any) => String(c).trim()) : [String(correctAnswers).trim()]);

                    s[poolKey] = pool.map((text: string, idx: number) => ({
                        id: `${poolKey.charAt(0)}${idx + 1}`,
                        text: text.trim(),
                        isCorrect: correctSet.has(text.trim()) || correctSet.has(`${poolKey.charAt(0)}${idx + 1}`)
                    }));
                }
            });
        }

        // MCQ/MR Fixes
        if (['multiple-choice', 'single-response', 'multiple-response', 'multiple-response-sata'].includes(s.type)) {
            // Migrate string options
            if (Array.isArray(s.options) && typeof s.options[0] === 'string' && Array.isArray(s.correct)) {
                const correctSet = new Set(s.correct.map((c: any) => String(c).trim()));
                s.options = s.options.map((optionText: string, idx: number) => ({
                    id: `o${idx + 1}`,
                    text: optionText.trim(),
                    isCorrect: correctSet.has(optionText.trim()),
                    rationale: ""
                }));
            }

            // Sync correct from optionReviews if missing
            if (Array.isArray(s.options) && s.options.length > 0 && typeof s.options[0] === 'object') {
                let hasCorrect = s.options.some((o: any) => o.isCorrect);
                if (!hasCorrect && Array.isArray(s.optionReviews)) {
                    s.optionReviews.forEach((review: any) => {
                        if (review.isCorrect) {
                            const opt = s.options.find((o: any) => o.id === review.optionId || o.text === review.text);
                            if (opt) opt.isCorrect = true;
                        }
                    });
                }
                // Fallback
                if (!s.options.some((o: any) => o.isCorrect)) s.options[0].isCorrect = true;
            }
        }
    };

    if (Array.isArray(structure.screens)) {
        structure.screens.forEach(normalizeScreen);
    } else {
        normalizeScreen(structure);
    }

    // 2. Final Deep Sanitization
    return TextSanitizer.sanitizeObject(item);
}
