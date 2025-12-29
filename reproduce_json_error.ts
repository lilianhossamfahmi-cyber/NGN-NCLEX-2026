
import { aggressiveRepairJson } from './src/services/importService';

const testCases = [
    {
        name: "Trailing Comma in Object",
        input: `{ "a": 1, }`,
        expectError: false
    },
    {
        name: "Trailing Comma in Array",
        input: `[ 1, 2, ]`,
        expectError: false
    },
    {
        name: "HTML with Double Quotes (Style)",
        input: `{ "history": "<table style=\"width:100%\">" }`,
        // Note: In raw text it would be style="width" which breaks json structure if not escaped or if escaped poorly
        expectError: false
    },
    {
        name: "Nested Unescaped Quotes (The Real Villain)",
        input: `{ "key": "Value with "quotes" inside" }`,
        expectError: false
    },
    {
        name: "The 'Expected property name' case",
        input: `{
            "key1": "value",
            "key2": "value",
             
        }`, // Trailing comma with whitespace
        expectError: false
    }
];

console.log("Starting Deep Dive JSON Tests...\n");

testCases.forEach(tc => {
    console.log(`Test: ${tc.name}`);
    console.log(`Original: ${tc.input}`);

    const repaired = aggressiveRepairJson(tc.input);
    console.log(`Repaired: ${repaired}`);

    try {
        JSON.parse(repaired);
        console.log("✅ PARSE SUCCESS\n");
    } catch (e: any) {
        console.log(`❌ PARSE FAILED: ${e.message}\n`);
    }
});
