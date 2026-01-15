
import { CognitiveAnalyticsEngine } from './scoringEngine';

/**
 * STANDALONE VERIFICATION SUITE FOR SCORING ENGINE (V2)
 * Run this to verify NGN Scoring Logic Fixes.
 */

function expect(label: string, result: any, expectedScore: number) {
    // Check float equality with tolerance
    const pass = Math.abs(result.score - expectedScore) < 0.001;
    if (pass) {
        console.log(`✅ PASS: ${label}`);
        console.log(`   Input Score: ${result.score.toFixed(3)} | Expected: ${expectedScore}`);
        if (result.explanation) console.log(`   Reason: ${result.explanation}`);
    } else {
        console.error(`❌ FAIL: ${label}`);
        console.error(`   Expected: ${expectedScore}`);
        console.error(`   Received: ${result.score}`);
        console.error(`   Full Result:`, result);
    }
    console.log('---------------------------------------------------');
}

console.log("===================================================");
console.log("   NGN SCORING LOGIC VERIFICATION SUITE (V2)       ");
console.log("===================================================");

// --- TEST CASE 1: MATRIX MULTI-SELECT (+/- Rule) ---
// Scenario: A row has 2 correct answers. 
// User selects 2 correct + 1 incorrect.
// NGN Rule: +1 +1 -1 = 1 point.
// Max Points: 2.
// Normalized Score: 1/2 = 0.5.

const t1_user = { 'r1': { 'c1': true, 'c2': true, 'c3': true } };
const t1_correct = { 'r1': ['c1', 'c2'] }; // Engine receives array for row

const r1 = CognitiveAnalyticsEngine.calculateScore('matrix', t1_user, t1_correct);
expect("Matrix Multi-Select (+/- Rule)", r1, 0.5);


// --- TEST CASE 2: MATRIX SINGULAR (0/1 Logic via +/-) ---
// Scenario: Standard radio matrix row.
// User selects correct.
// NGN Rule: +1 = 1 point. Max 1.

const t2_user = { 'r1': 'c1' };
const t2_correct = { 'r1': ['c1'] }; // Singular standardizes to array

const r2 = CognitiveAnalyticsEngine.calculateScore('matrix', t2_user, t2_correct);
expect("Matrix Singular (Correct)", r2, 1.0);


// --- TEST CASE 3: NEGATIVE FLOOR ---
// User selects 3 wrong options.
// Score: -3 -> Floor to 0.

const t3_user = { 'r1': { 'x1': true, 'x2': true, 'x3': true } };
const t3_correct = { 'r1': ['c1'] };

const r3 = CognitiveAnalyticsEngine.calculateScore('matrix', t3_user, t3_correct);
expect("Negative Floor Rule", r3, 0);


// --- TEST CASE 4: EXTRACTION LOGIC (Fixing "Blindness") ---
// Validating that scoreCaseStudy can read 'correctColumnIds' (plural)

const t4_question = {
    type: 'matrix',
    rows: [
        { id: 'r1', correctColumnIds: ['c1', 'c2'] } // The Plural Field causing the bug
    ]
};
// User answers perfectly
const t4_userAns = { 'r1': { 'c1': true, 'c2': true } };

// scoreCaseStudy expects arrays of answers
const r4_score = CognitiveAnalyticsEngine.scoreCaseStudy([t4_userAns], [t4_question]);

// If extraction works, score is 1. If fails (undefined), score is 0.
if (r4_score === 1) {
    console.log(`✅ PASS: Matrix Field Extraction (Plural Support)`);
    console.log(`   Score: ${r4_score}`);
} else {
    console.error(`❌ FAIL: Matrix Field Extraction`);
    console.error(`   Expected 1, Got ${r4_score}`);
    console.error(`   The engine likely missed 'correctColumnIds' and saw undefined.`);
}
console.log('---------------------------------------------------');


console.log("\nVerification Complete.");
