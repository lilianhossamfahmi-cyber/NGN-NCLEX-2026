/**
 * sanitizeIds.test.ts
 * 
 * Unit tests for the sanitizeIds middleware
 */

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

import { sanitizeItem, validateIds } from '../middleware/sanitizeIds';

describe('sanitizeIds Middleware', () => {
    describe('ID Cleaning', () => {
        it('should strip trailing commas from IDs', () => {
            const item = {
                id: 'a1, ',
                options: [
                    { id: 'opt1, ', text: 'Option 1' },
                    { id: 'opt2,  ', text: 'Option 2' }
                ]
            };

            sanitizeItem(item);

            expect(item.id).toBe('a1');
            expect(item.options[0].id).toBe('opt1');
            expect(item.options[1].id).toBe('opt2');
        });

        it('should strip trailing and internal whitespace from IDs', () => {
            const item = {
                id: '  action 1  ',
                nested: {
                    id: 'condition  2 '
                }
            };

            sanitizeItem(item);

            expect(item.id).toBe('action1');
            expect(item.nested.id).toBe('condition2');
        });

        it('should handle deeply nested structures', () => {
            const item = {
                content: {
                    structure: {
                        screens: [
                            {
                                id: 's1, ',
                                options: [
                                    { id: 'o1,  ', text: 'Test' }
                                ]
                            }
                        ]
                    }
                }
            };

            sanitizeItem(item);

            expect(item.content.structure.screens[0].id).toBe('s1');
            expect(item.content.structure.screens[0].options[0].id).toBe('o1');
        });

        it('should not modify valid IDs', () => {
            const item = {
                id: 'valid-id-123',
                options: [
                    { id: 'NGN-BOW-A1B2C3', text: 'Test' }
                ]
            };

            const originalId = item.id;
            const originalOptionId = item.options[0].id;

            sanitizeItem(item);

            expect(item.id).toBe(originalId);
            expect(item.options[0].id).toBe(originalOptionId);
        });
    });

    describe('Double-Encoded JSON Revival', () => {
        it('should parse double-encoded JSON objects', () => {
            const item = {
                metadata: '{"title":"Test","author":"AI"}'
            };

            sanitizeItem(item);

            expect(typeof item.metadata).toBe('object');
            expect((item.metadata as any).title).toBe('Test');
            expect((item.metadata as any).author).toBe('AI');
        });

        it('should parse double-encoded JSON arrays', () => {
            const item = {
                options: '[{"id":"o1","text":"A"},{"id":"o2","text":"B"}]'
            };

            sanitizeItem(item);

            expect(Array.isArray(item.options)).toBe(true);
            expect((item.options as any)[0].id).toBe('o1');
        });

        it('should not modify non-JSON strings', () => {
            const item = {
                prompt: 'This is a regular string with {curly braces}',
                notes: '[Some notes in brackets]'
            };

            const originalPrompt = item.prompt;
            const originalNotes = item.notes;

            sanitizeItem(item);

            expect(item.prompt).toBe(originalPrompt);
            expect(item.notes).toBe(originalNotes);
        });

        it('should recursively clean IDs in revived JSON', () => {
            const item = {
                structure: '{"actions":[{"id":"a1, ","text":"Action"}]}'
            };

            sanitizeItem(item);

            expect(typeof item.structure).toBe('object');
            expect((item.structure as any).actions[0].id).toBe('a1');
        });
    });

    describe('validateIds', () => {
        it('should return empty array for valid IDs', () => {
            const item = {
                id: 'valid-id',
                options: [{ id: 'opt1' }, { id: 'opt2' }]
            };

            const errors = validateIds(item);

            expect(errors).toHaveLength(0);
        });

        it('should detect invalid IDs with trailing commas', () => {
            const item = {
                id: 'a1,',
                nested: { id: 'b2, ' }
            };

            const errors = validateIds(item);

            expect(errors.length).toBeGreaterThan(0);
            expect(errors[0]).toContain('a1,');
        });

        it('should report full path to invalid ID', () => {
            const item = {
                content: {
                    structure: {
                        options: [{ id: 'bad, ' }]
                    }
                }
            };

            const errors = validateIds(item);

            expect(errors[0]).toContain('content.structure.options');
        });
    });

    describe('Edge Cases', () => {
        it('should handle null input gracefully', () => {
            expect(() => sanitizeItem(null as any)).not.toThrow();
        });

        it('should handle undefined input gracefully', () => {
            expect(() => sanitizeItem(undefined as any)).not.toThrow();
        });

        it('should handle empty objects', () => {
            const item = {};
            expect(() => sanitizeItem(item)).not.toThrow();
            expect(item).toEqual({});
        });

        it('should handle the crasher payload from debug_dump.json', () => {
            // This is the exact payload structure that was crashing BowTieRenderer
            const crasherPayload = {
                type: 'bow-tie',
                actions: [
                    { id: 'a1, ', text: 'Increase IV fluid rate', isCorrect: true },
                    { id: 'a2, ', text: 'Administer Sodium Bicarbonate', isCorrect: true },
                    { id: 'a3, ', text: 'Prepare for escharotomy', isCorrect: false }
                ],
                conditions: [
                    { id: 'c1, ', text: 'Rhabdomyolysis', isCorrect: true }
                ],
                parameters: [
                    { id: 'p1, ', text: 'Urine output', isCorrect: true }
                ]
            };

            sanitizeItem(crasherPayload);

            expect(crasherPayload.actions[0].id).toBe('a1');
            expect(crasherPayload.actions[1].id).toBe('a2');
            expect(crasherPayload.conditions[0].id).toBe('c1');
            expect(crasherPayload.parameters[0].id).toBe('p1');

            // Validate all IDs are now clean
            const errors = validateIds(crasherPayload);
            expect(errors).toHaveLength(0);
        });
    });
});
