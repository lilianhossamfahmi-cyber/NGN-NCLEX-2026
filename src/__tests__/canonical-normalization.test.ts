
// Mocks to bypass import.meta and heavy service dependencies
jest.mock('../config/apiConfig', () => ({
    AppConfig: { features: { aiGeneration: false } },
    getGenAI: jest.fn(),
    getAuthorizedApiKey: jest.fn()
}));

jest.mock('../lib/supabase', () => ({
    supabase: {
        from: jest.fn(() => ({
            select: jest.fn(),
            upsert: jest.fn()
        }))
    }
}));

import { UnifiedDataPipeline } from '../services/UnifiedDataPipeline';
import { TextSanitizer, MatrixValidator, DropClozeValidator } from '../utils/question-validators';
import { MatrixRowSchema } from '../schemas/standard';

describe('Canonical Normalization & Sanitization', () => {

    describe('TextSanitizer', () => {
        it('should clean messy strings authoritative-ly', () => {
            const messy = "  bronchoconstriction is the  cause ";
            const cleaned = TextSanitizer.sanitizeText(messy);
            expect(cleaned).toBe("Bronchoconstriction is the cause.");
        });

        it('should preserve IDs while cleaning other fields', () => {
            const obj = {
                id: "ITEM_123",
                text: " messy text  ",
                correctOptionId: "opt_abc",
                rationale: " needs a period "
            };
            const sanitized = TextSanitizer.sanitizeObject(obj);
            expect(sanitized.id).toBe("ITEM_123");
            expect(sanitized.text).toBe("Messy text.");
            expect(sanitized.correctOptionId).toBe("opt_abc");
            expect(sanitized.rationale).toBe("Needs a period.");
        });
    });

    describe('Matrix Normalization', () => {
        it('should migrate legacy keys to correctColumnIds array', () => {
            const row1: any = { id: 'r1', text: 'Row 1', correctColumnId: 'col_a' };
            const row2: any = { id: 'r2', text: 'Row 2', correctColId: 'col_b' };
            const row3: any = { id: 'r3', text: 'Row 3', correctColumnIds: ['col_c'] };

            MatrixValidator.normalizeRow(row1);
            MatrixValidator.normalizeRow(row2);
            MatrixValidator.normalizeRow(row3);

            expect(row1.correctColumnIds).toEqual(['col_a']);
            expect(row2.correctColumnIds).toEqual(['col_b']);
            expect(row3.correctColumnIds).toEqual(['col_c']);

            // Should also have singular backfill for compat
            expect(row1.correctColumnId).toBe('col_a');
        });

        it('should deduplicate and clean matrix row IDs', () => {
            const row: any = {
                id: 'r1',
                text: 'Row 1',
                correctColumnId: 'col_a',
                correctColumnIds: ['col_a', 'col_b', 'col_a']
            };
            MatrixValidator.normalizeRow(row);
            expect(row.correctColumnIds).toEqual(['col_a', 'col_b']);
        });

        it('should pass MatrixRowSchema after normalization', () => {
            const row: any = { id: 'r1', text: 'Row 1', correctColumnId: 'col_a' };
            MatrixValidator.normalizeRow(row);
            const result = MatrixRowSchema.safeParse(row);
            expect(result.success).toBe(true);
        });
    });

    describe('Drop-Cloze Normalization', () => {
        it('should convert flat AI output to object-based options', () => {
            const flatDropdown: any = {
                id: 'd1',
                options: ['Option A', 'Option B', 'Option C'],
                correctAnswer: 'Option B'
            };
            DropClozeValidator.normalizeDropdown(flatDropdown);

            expect(flatDropdown.options.length).toBe(3);
            expect(flatDropdown.options[1].isCorrect).toBe(true);
            expect(flatDropdown.options[1].text).toBe('Option B');
            expect(flatDropdown.options[0].isCorrect).toBe(false);
            expect(flatDropdown.options[0].id).toBe('d1-o0');
        });

        it('should be a no-op for already canonical dropdowns', () => {
            const canonical = {
                id: 'd1',
                options: [
                    { id: 'o1', text: 'A', isCorrect: true },
                    { id: 'o2', text: 'B', isCorrect: false }
                ]
            };
            const original = JSON.stringify(canonical);
            DropClozeValidator.normalizeDropdown(canonical);
            expect(JSON.stringify(canonical)).toBe(original);
        });
    });

    describe('Integration: UnifiedDataPipeline', () => {
        it('should handle a nested messy object in one authoritative pass', async () => {
            const rawMock = {
                type: 'matrix',
                content: {
                    structure: {
                        prompt: " messy prompt ",
                        columns: [{ id: 'c1', text: 'Yes' }, { id: 'c2', text: 'No' }],
                        rows: [
                            { id: 'r1', text: ' row messy ', correctColId: 'c1' }
                        ]
                    }
                }
            };

            const result = await UnifiedDataPipeline.transform(rawMock);

            // Check Sanitization
            expect(result.content.structure.prompt).toBe("Messy prompt.");
            expect(result.content.structure.rows[0].text).toBe("Row messy.");

            // Check Matrix Pluralization
            expect(result.content.structure.rows[0].correctColumnIds).toEqual(['c1']);
        });
    });
});
