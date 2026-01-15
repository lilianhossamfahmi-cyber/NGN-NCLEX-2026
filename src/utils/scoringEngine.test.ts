import { CognitiveAnalyticsEngine } from './scoringEngine';

describe('CognitiveAnalyticsEngine Correctness', () => {

    test('Bow-Tie: Exact Match', () => {
        const correct = {
            actions: ['a1', 'a2'],
            conditions: ['c1'],
            parameters: ['p1', 'p2'] // 2 params
        };
        const user = {
            actions: ['a2', 'a1'], // Order shouldn't matter
            conditions: ['c1'],
            parameters: ['p1', 'p2']
        };
        const result = CognitiveAnalyticsEngine.calculateScore('bow-tie', user, correct);
        expect(result.score).toBe(1);
        expect(result.explanation).toContain('Perfect Match');
    });

    test('Bow-Tie: Partial Fail (0/1 Rule)', () => {
        const correct = { actions: ['a1'], conditions: ['c1'], parameters: ['p1'] };
        const user = { actions: ['a1'], conditions: ['c2'], parameters: ['p1'] }; // Wrong condition
        const result = CognitiveAnalyticsEngine.calculateScore('bow-tie', user, correct);
        expect(result.score).toBe(0);
        expect(result.explanation).toContain('Missed components');
    });

    test('Matrix: Exact Match', () => {
        const correct = { r1: 'c1', r2: 'c2' };
        const user = { r1: 'c1', r2: 'c2' };
        const result = CognitiveAnalyticsEngine.calculateScore('matrix', user, correct);
        expect(result.score).toBe(1);
    });

    test('Matrix: One Wrong (0/1 Rule)', () => {
        const correct = { r1: 'c1', r2: 'c2' };
        const user = { r1: 'c1', r2: 'c3' }; // Wrong r2
        const result = CognitiveAnalyticsEngine.calculateScore('matrix', user, correct);
        expect(result.score).toBe(0);
    });

    test('Highlight: Exact Set', () => {
        const correct = ['h1', 'h3'];
        const user = ['h3', 'h1'];
        const result = CognitiveAnalyticsEngine.calculateScore('highlight', user, correct);
        expect(result.score).toBe(1);
    });

    test('Highlight: Extra Selection (Fail)', () => {
        const correct = ['h1'];
        const user = ['h1', 'h2']; // h2 is wrong
        const result = CognitiveAnalyticsEngine.calculateScore('highlight', user, correct);
        expect(result.score).toBe(0); // Strict set equality
    });

    test('Cloze: All Correct', () => {
        const correct = { d1: 'opt1', d2: 'opt2' };
        const user = { d1: 'opt1', d2: 'opt2' };
        const result = CognitiveAnalyticsEngine.calculateScore('drop-cloze', user, correct);
        expect(result.score).toBe(1);
    });

    test('Calculation: Exact', () => {
        const result = CognitiveAnalyticsEngine.calculateScore('calculation', '42.0', 42);
        expect(result.score).toBe(1);
    });

    test('Calculation: Within 2%', () => {
        // Target 100. 2% is 2. Range 98-102.
        const result = CognitiveAnalyticsEngine.calculateScore('calculation', '101.5', 100);
        expect(result.score).toBe(1);
    });

    test('Calculation: Outside 2%', () => {
        // Target 100. Range 98-102.
        const result = CognitiveAnalyticsEngine.calculateScore('calculation', '102.1', 100);
        expect(result.score).toBe(0);
    });

    test('Ordered Response: Wrong Sequence', () => {
        const correct = ['1', '2', '3'];
        const user = ['1', '3', '2'];
        const result = CognitiveAnalyticsEngine.calculateScore('ordered-response', user, correct);
        expect(result.score).toBe(0);
    });

    test('SATA: Strict 0/1 Scoring', () => {
        const correct = ['opt1', 'opt2'];
        const user = ['opt1']; // Missing one
        const result = CognitiveAnalyticsEngine.calculateScore('sata', user, correct);
        expect(result.score).toBe(0);

        const user2 = ['opt1', 'opt2'];
        const result2 = CognitiveAnalyticsEngine.calculateScore('sata', user2, correct);
        expect(result2.score).toBe(1);
    });

    test('Case Study: Average Scoring', () => {
        // Just verify it doesn't crash given empty inputs, since logic is complex to mock fully here
        const result = CognitiveAnalyticsEngine.scoreCaseStudy([], []);
        expect(result).toBe(0);
    });

});

describe('CognitiveAnalyticsEngine Performance', () => {
    test('Scores 100 items in < 500ms', () => {
        const start = performance.now();
        const iterations = 1000;

        for (let i = 0; i < iterations; i++) {
            CognitiveAnalyticsEngine.calculateScore('bow-tie',
                { actions: ['a'], conditions: ['c'], parameters: ['p'] },
                { actions: ['a'], conditions: ['c'], parameters: ['p'] }
            );
        }

        const end = performance.now();
        const duration = end - start;
        console.log(`Perf: ${iterations} items scored in ${duration.toFixed(2)}ms`);
        expect(duration).toBeLessThan(500);
    });
});
