import { parseAiResponse, validateItemSchema, validateItems, preprocessAiResponse, parseAndValidate } from './jsonParser';

describe('JSON Parser - Error Recovery', () => {

    describe('Direct Parsing (Attempt 1)', () => {
        test('Should parse valid JSON directly', () => {
            const validJson = '{"id": "test_123", "typeId": "mcq", "metadata": {"title": "Test"}, "content": {"structure": {}}}';
            const result = parseAiResponse(validJson);

            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.attemptUsed).toBe(1);
        });

        test('Should parse valid JSON array', () => {
            const validJson = '[{"id": "1"}, {"id": "2"}]';
            const result = parseAiResponse(validJson);

            expect(result.success).toBe(true);
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.data).toHaveLength(2);
        });
    });

    describe('Markdown Stripping (Attempt 2)', () => {
        test('Should strip ```json code fences', () => {
            const markdown = '```json\n{"id": "test"}\n```';
            const result = parseAiResponse(markdown);

            expect(result.success).toBe(true);
            expect(result.attemptUsed).toBe(2);
        });

        test('Should strip ```JSON code fences (case insensitive)', () => {
            const markdown = '```JSON\n{"id": "test"}\n```';
            const result = parseAiResponse(markdown);

            expect(result.success).toBe(true);
        });

        test('Should strip plain ``` code fences', () => {
            const markdown = '```\n{"id": "test"}\n```';
            const result = parseAiResponse(markdown);

            expect(result.success).toBe(true);
        });
    });

    describe('JSON Extraction (Attempt 3)', () => {
        test('Should extract JSON from conversational text', () => {
            const conversational = 'Here is the JSON:\n{"id": "test"}\nLet me know if you need anything else!';
            const result = parseAiResponse(conversational);

            expect(result.success).toBe(true);
            expect(result.data.id).toBe('test');
        });

        test('Should extract JSON array from surrounding text', () => {
            const text = 'Sure! Here are the items: [{"id": "1"}, {"id": "2"}] Hope this helps!';
            const result = parseAiResponse(text);

            expect(result.success).toBe(true);
            expect(Array.isArray(result.data)).toBe(true);
        });

        test('Should extract nested JSON object', () => {
            const text = 'Result: {"outer": {"inner": "value"}} end';
            const result = parseAiResponse(text);

            expect(result.success).toBe(true);
            expect(result.data.outer.inner).toBe('value');
        });
    });

    describe('Common Error Fixes (Attempt 4)', () => {
        test('Should fix trailing commas before closing brace', () => {
            const json = '{"id": "test", "value": 123,}';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
        });

        test('Should fix trailing commas before closing bracket', () => {
            const json = '["item1", "item2",]';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
        });

        test('Should fix smart quotes', () => {
            const json = '{"id": "test"}'; // Smart quotes
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
        });

        test('Should fix missing commas between objects', () => {
            const json = '[{"id": "1"}{"id": "2"}]';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
            expect(Array.isArray(result.data)).toBe(true);
        });
    });

    describe('Aggressive Repair (Attempt 5)', () => {
        test('Should auto-close missing closing braces', () => {
            const json = '{"id": "test", "nested": {"value": 123';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
        });

        test('Should auto-close missing closing brackets', () => {
            const json = '[{"id": "1"}, {"id": "2"';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
        });

        test('Should remove incomplete trailing entries', () => {
            const json = '{"id": "test", "incomplete';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
            expect(result.data.id).toBe('test');
        });

        test('Should handle complex broken JSON', () => {
            const json = '{"items": [{"id": "1", "title": "Test"}, {"id": "2"';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
            expect(result.data.items).toBeDefined();
        });
    });

    describe('Preprocessing', () => {
        test('Should remove common AI prefixes', () => {
            const text = 'Here is the JSON: {"id": "test"}';
            const processed = preprocessAiResponse(text);

            expect(processed).not.toContain('Here is the JSON:');
        });

        test('Should remove trailing AI explanations', () => {
            const text = '{"id": "test"}\n\nLet me know if you need anything else!';
            const processed = preprocessAiResponse(text);

            expect(processed).not.toContain('Let me know');
        });

        test('Should handle "Sure! Here\'s" prefix', () => {
            const text = 'Sure! Here\'s what you need: {"id": "test"}';
            const processed = preprocessAiResponse(text);

            expect(processed.trim()).toMatch(/^{/);
        });
    });

    describe('Schema Validation', () => {
        test('Should validate complete item', () => {
            const item = {
                id: 'test_123',
                typeId: 'mcq',
                metadata: { title: 'Test Item', createdAt: new Date().toISOString() },
                content: { structure: {} }
            };

            const result = validateItemSchema(item);
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('Should detect missing required fields', () => {
            const item = { id: 'test_123' }; // Missing typeId, metadata, content

            const result = validateItemSchema(item);
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });

        test('Should validate case study screens', () => {
            const item = {
                id: 'test',
                typeId: 'case-study-6-screen',
                metadata: { title: 'Test', createdAt: new Date().toISOString() },
                content: { structure: { screens: [1, 2, 3, 4, 5, 6] } }
            };

            const result = validateItemSchema(item);
            expect(result.valid).toBe(true);
        });

        test('Should detect incorrect screen count', () => {
            const item = {
                id: 'test',
                typeId: 'case-study-6-screen',
                metadata: { title: 'Test', createdAt: new Date().toISOString() },
                content: { structure: { screens: [1, 2, 3] } } // Only 3 screens
            };

            const result = validateItemSchema(item);
            expect(result.valid).toBe(false);
            expect(result.errors[0]).toContain('exactly 6 screens');
        });

        test('Should validate options for multiple choice', () => {
            const item = {
                id: 'test',
                typeId: 'multiple-choice',
                metadata: { title: 'Test', createdAt: new Date().toISOString() },
                content: { structure: { options: [{ id: 'a', text: 'Option A' }] } }
            };

            const result = validateItemSchema(item);
            expect(result.valid).toBe(true);
        });
    });

    describe('Batch Validation', () => {
        test('Should validate array of items', () => {
            const items = [
                { id: '1', typeId: 'mcq', metadata: { title: 'Q1', createdAt: '' }, content: { structure: {} } },
                { id: '2', typeId: 'sata', metadata: { title: 'Q2', createdAt: '' }, content: { structure: {} } }
            ];

            const result = validateItems(items);
            expect(result.valid).toBe(true);
            expect(result.validCount).toBe(2);
        });

        test('Should detect invalid items in batch', () => {
            const items = [
                { id: '1', typeId: 'mcq' }, // Missing required fields
                { id: '2', typeId: 'sata', metadata: { title: 'Q2', createdAt: '' }, content: { structure: {} } }
            ];

            const result = validateItems(items);
            expect(result.valid).toBe(false);
            expect(result.validCount).toBe(1);
            expect(result.errors).toHaveLength(1);
        });
    });

    describe('Parse and Validate Combined', () => {
        test('Should parse and validate in one call', () => {
            const json = '{"id": "test", "typeId": "mcq", "metadata": {"title": "Test", "createdAt": ""}, "content": {"structure": {}}}';
            const result = parseAndValidate(json);

            expect(result.parseResult.success).toBe(true);
            expect(result.validationResult?.valid).toBe(true);
        });

        test('Should handle parsing failure', () => {
            const invalid = 'This is not JSON at all, just random text with no structure';
            const result = parseAndValidate(invalid);

            expect(result.parseResult.success).toBe(false);
            expect(result.validationResult).toBeUndefined();
        });
    });

    describe('Edge Cases', () => {
        test('Should handle empty string', () => {
            const result = parseAiResponse('');
            expect(result.success).toBe(false);
        });

        test('Should handle null/undefined gracefully', () => {
            const result1 = parseAiResponse(null as any);
            const result2 = parseAiResponse(undefined as any);

            expect(result1.success).toBe(false);
            expect(result2.success).toBe(false);
        });

        test('Should handle deeply nested object', () => {
            const json = '{"a": {"b": {"c": {"d": {"e": "value"}}}}}';
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
            expect(result.data.a.b.c.d.e).toBe('value');
        });

        test('Should handle large JSON', () => {
            const items = Array(100).fill(null).map((_, i) => ({ id: `item_${i}` }));
            const json = JSON.stringify(items);
            const result = parseAiResponse(json);

            expect(result.success).toBe(true);
            expect(result.data).toHaveLength(100);
        });
    });
});
