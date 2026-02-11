
import { CognitiveAnalyticsEngine } from '../src/utils/scoringEngine';
import { ultraFixerService } from '../src/services/ultraFixerService';
import { UnifiedDataPipeline } from '../src/services/UnifiedDataPipeline';

async function runSmokeTests() {
    console.log("Starting Smoke Tests...");
    let passed = 0;

    function assert(condition: boolean, message: string) {
        if (condition) {
            console.log(`✅ ${message}`);
            passed++;
        } else {
            console.error(`❌ ${message}`);
            throw new Error(`Assertion failed: ${message}`);
        }
    }

    try {
        // Test 1: Scoring Guard (Using SATA for Empty Check)
        console.log("\n--- Test 1: Scoring Guard ---");
        const zeroRes = CognitiveAnalyticsEngine.calculateScore('sata', [], []);
        assert(zeroRes.score === 0, "Score should be 0");
        assert(zeroRes.maxScore === 0, "MaxScore should be 0 for empty correct answers");
        assert(Number.isFinite(zeroRes.score), "Score should be finite");

        // Test 2: Matrix Normalization
        console.log("\n--- Test 2: Matrix Normalization ---");
        const matrixRaw = {
            type: 'matrix',
            rows: ["Row 1", "Row 2"], // Raw strings
            columns: ["Col 1"]
        };
        const normalizedMatrix = await UnifiedDataPipeline.transform(matrixRaw);
        const rows = normalizedMatrix.content?.structure?.rows || [];

        assert(rows.length === 2, "Should have 2 rows");
        assert(typeof rows[0] === 'object', "Row should be object");
        assert(rows[0].correctAnswer === null, "Row correctness should be null");
        assert(normalizedMatrix.metadata?.status === 'draft', "Status should be draft");
        assert(Array.isArray(normalizedMatrix.metadata?.repairNotes) && normalizedMatrix.metadata.repairNotes.some((n: string) => n.includes('Matrix rows')), "Should have repair notes");

        // Test 3: Structural Forking
        console.log("\n--- Test 3: Structural Forking ---");
        const original: any = {
            id: 'orig-1',
            type: 'multiple-choice',
            metadata: { status: 'published', contentVersion: 1 },
            content: { structure: { options: [{ id: '1', text: 'A' }] } }
        };
        const patchedStruct: any = {
            ...original,
            content: { structure: { options: [{ id: '1', text: 'B' }] } }
        };
        // We simulate the service call - calling logic directly
        const resFork = ultraFixerService.sanitizeOutput(original, patchedStruct);

        assert(resFork.action === 'FORK_NEW_ITEM', "Should fork on structural change");
        assert(resFork.newItem.id !== original.id, "New ID should be generated");
        assert(resFork.newItem.metadata.supersedesId === original.id, "Should supersede original");

        // Test 4: Semantic Update
        console.log("\n--- Test 4: Semantic Update ---");
        const patchedSem: any = {
            ...original,
            content: { ...original.content, rationale: { coreConcept: "New Concept" } }
        };
        const resUpdate = ultraFixerService.sanitizeOutput(original, patchedSem);

        assert(resUpdate.action === 'UPDATE_IN_PLACE', "Should update in place for cosmetic");
        assert(resUpdate.newItem.id === original.id, "ID should match");
        assert(resUpdate.newItem.metadata.contentVersion === 2, "Version should increment");

        console.log(`\n🎉 ALL SMOKE TESTS PASSED (${passed} assertions verified)`);
        process.exit(0);

    } catch (e: any) {
        console.error("\n❌ SMOKE TESTS FAILED", e);
        process.exit(1);
    }
}

runSmokeTests();
