
import { selectItemsFromPool } from '../services/SessionGeneratorService';
import { MasterQuestionItem } from '../types/master-schema';

// --- Test Helper: Create Question ---
function createQuestion(id: string, level: number): MasterQuestionItem {
    return {
        id,
        typeId: 'multiple-choice',
        metadata: {
            title: `Q-${id}`,
            authorId: 'test',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'published',
            sourceOrigin: 'manual',
            sourceReferences: [],
            hasStudentPreview: false
        },
        pedagogy: {
            difficultyLevel: level,
            clinicalFocus: 'General'
        },
        content: {}
    };
}

// --- Test Helper: Run Suite ---
function runTests() {
    console.log("=== STARTING SESSION GENERATOR TESTS ===");
    let passed = 0;
    let failed = 0;

    function assert(desc: string, condition: boolean, msg?: string) {
        if (condition) {
            console.log(`✅ PASS: ${desc}`);
            passed++;
        } else {
            console.error(`❌ FAIL: ${desc} - ${msg || ''}`);
            failed++;
        }
    }

    // --- SCENARIO 1: Perfect Match ---
    // Req: L3(2). Available: L3(5)
    {
        console.log("\n[Scenario 1: Perfect Match]");
        const pool = {
            3: [createQuestion('q1', 3), createQuestion('q2', 3), createQuestion('q3', 3)]
        } as any;
        const req = { 3: 2 };
        const res = selectItemsFromPool(pool, req, 2);

        assert("Returns correct count", res.selectedItems.length === 2, `Got ${res.selectedItems.length}`);
        assert("Returns exact level", res.selectedItems.every(i => i.pedagogy.difficultyLevel === 3));
        assert("No fallback events", res.fallbackEvents.length === 0);
    }

    // --- SCENARIO 2: Simple Fallback ---
    // Req: L3(2). Available: L3(0), L4(5)
    {
        console.log("\n[Scenario 2: Simple Fallback]");
        const pool = {
            3: [],
            4: [createQuestion('q1', 4), createQuestion('q2', 4), createQuestion('q3', 4)]
        } as any;
        const req = { 3: 2 };
        const res = selectItemsFromPool(pool, req, 2);

        assert("Returns correct count", res.selectedItems.length === 2);
        assert("Uses Level 4", res.selectedItems.every(i => i.pedagogy.difficultyLevel === 4));
        assert("Drift Sum correct", res.totalDeltaSum === 2); // 2 items * |4-3| = 2
        assert("Fallback event logged", res.fallbackEvents.length === 1);
        assert("Fallback reports L4 source", res.fallbackEvents[0].sources.some(s => s.level === 4 && s.count === 2));
    }

    // --- SCENARIO 3: Tie Breaker (Prefer Higher) ---
    // Req: L3(2). Available: L2(5), L4(5). Distance 1 both ways.
    // Should prefer L4.
    {
        console.log("\n[Scenario 3: Tie Breaker - Prefer Higher]");
        const pool = {
            3: [],
            2: [createQuestion('q2a', 2), createQuestion('q2b', 2)],
            4: [createQuestion('q4a', 4), createQuestion('q4b', 4)]
        } as any;
        const req = { 3: 1 }; // Request 1 item
        const res = selectItemsFromPool(pool, req, 2);

        assert("Selected Level 4 over Level 2", res.selectedItems[0].pedagogy.difficultyLevel === 4, `Selected Level ${res.selectedItems[0].pedagogy.difficultyLevel}`);
    }

    // --- SCENARIO 4: Cascade (Exact -> Higher -> Lower) ---
    // Req: L3(3). Available: L3(1), L4(1), L2(1).
    // Should take L3, then L4, then L2.
    {
        console.log("\n[Scenario 4: Cascade]");
        const pool = {
            3: [createQuestion('q3', 3)],
            4: [createQuestion('q4', 4)],
            2: [createQuestion('q2', 2)]
        } as any;
        const req = { 3: 3 };
        const res = selectItemsFromPool(pool, req, 2);

        assert("Got 3 items", res.selectedItems.length === 3);
        const levels = res.selectedItems.map(i => i.pedagogy.difficultyLevel).sort();
        assert("Selected 2, 3, 4", JSON.stringify(levels) === JSON.stringify([2, 3, 4]));
    }

    // --- SCENARIO 5: Max Distance Limit ---
    // Req: L3(1). Available: L1(5), L5(5). Max dist 1.
    // L1 is dist 2. L5 is dist 2. Neither allowed.
    // Should return 0 items.
    {
        console.log("\n[Scenario 5: Max Distance Enforcement]");
        const pool = {
            1: [createQuestion('q1', 1)],
            5: [createQuestion('q5', 5)]
        } as any;
        const req = { 3: 1 };
        const res = selectItemsFromPool(pool, req, 1); // Max Dist 1

        assert("Selected 0 items", res.selectedItems.length === 0, `Got ${res.selectedItems.length}`);
        assert("Fallback event shows 0 filled", res.fallbackEvents[0].filled === 0);
    }

    console.log(`\n=== TESTS COMPLETED: ${passed} Passed, ${failed} Failed ===`);
    if (failed > 0) process.exit(1);
}

runTests();
