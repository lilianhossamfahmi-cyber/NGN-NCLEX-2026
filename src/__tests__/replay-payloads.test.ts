/**
 * replay-payloads.test.ts
 * 
 * Regression test harness that replays items from debug_dump.json 
 * through the UnifiedDataPipeline.
 */

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

describe('Payload Replay Regression Tests', () => {
    // Use require for JSON to ensure compatibility with Jest's loader
    const payloads = require('../../debug_dump.json');
    const itemsToTest = Array.isArray(payloads) ? payloads : [payloads];

    it('should load at least one payload from debug_dump.json', () => {
        expect(itemsToTest.length).toBeGreaterThan(0);
    });

    itemsToTest.forEach((payload: any, index: number) => {
        const itemId = payload.id || `payload_${index}`;
        const itemType = payload.type || 'unknown';

        it(`should successfully transform ${itemType} item: ${itemId}`, async () => {
            const result = await UnifiedDataPipeline.transform(payload) as any;

            expect(result).toBeDefined();
            expect(result.id).toBeDefined();

            // Log errors if any, but don't fail yet if we expect dirty data in dump
            if (result._validationErrors?.length > 0) {
                console.warn(`[Replay] Validation errors in ${itemId}:`, result._validationErrors);
            }

            // Gatekeeper check - we want 0 errors for production readiness
            expect(result._validationErrors || []).toHaveLength(0);
        });
    });
});
