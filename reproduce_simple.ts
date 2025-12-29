
// Mocking the function directly to avoid build/env issues
const aggressiveRepairJson = (raw: string): string => {
    let clean = raw.trim();

    // 1. Remove Markdown
    if (clean.includes('```')) {
        const match = clean.match(/```(?:json)?([\s\S]*?)```/);
        if (match) clean = match[1].trim();
    }

    // 2. ESCAPE NEWLINES inside strings
    clean = clean.replace(/\nCr/g, "\\n");
    clean = clean.replace(/(?<!\\)\n/g, "\\n");

    // 3. TARGETED HTML FIX (UPDATED WITH SMART LOOKAHEAD)
    const htmlFields = ['history', 'historyPhysical', 'labs', 'orders', 'radiology', 'notes', 'rationale', 'text', 'prompt'];
    htmlFields.forEach(field => {
        // Look for: "field": "CONTENT"
        // Lookahead: End quote followed by } OR , "NextKey":
        const regex = new RegExp(`"${field}"\\s*:\\s*"([\\s\\S]*?)"(?=\\s*\\}|\\s*,\\s*"[^"]+"\\s*:)`, 'g');

        clean = clean.replace(regex, (match, content) => {
            const safeContent = content.replace(/"/g, "'");
            return `"${field}": "${safeContent}"`;
        });
    });

    // 4. GLOBAL FALLBACK
    clean = clean.replace(/style="([^"]*)"/g, "style='$1'");
    clean = clean.replace(/class="([^"]*)"/g, "class='$1'");

    // 5. Smart Quotes
    clean = clean.replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"');
    clean = clean.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");

    // 6. Fix Unquoted Keys
    clean = clean.replace(/([{,]\s*)([a-zA-Z0-9._-]+)\s*:/g, '$1"$2":');

    // 7. MISSING COMMAS
    clean = clean.replace(/"\s*"/g, '", "');
    clean = clean.replace(/(\d+|true|false|null)(\s*)"/g, '$1, "$2');
    clean = clean.replace(/\}\s*\{/g, '}, {');
    clean = clean.replace(/\]\s*\{/g, '], {');
    clean = clean.replace(/\}\s*\[/g, '}, [');
    clean = clean.replace(/"\s*\{/g, '", {');

    // 8. TRAILING COMMAS
    clean = clean.replace(/,(\s*[,\]\}])/g, '$1');
    clean = clean.replace(/,\s*([\}\]])/g, '$1');

    return clean;
};

const testCases = [
    {
        name: "Quote followed by Comma inside String",
        input: `{ "history": "Patient reports \\"pain\\", \\"nausea\\", and dizziness." }`,
        expectError: false
    },
    {
        name: "Quote followed by Brace inside String",
        input: `{ "history": "Code: { id: \\"1\\" } " }`,
        expectError: false
    },
    {
        name: "Quote followed by Comma AND Next Key",
        input: `{ "history": "Val \\"A\\", Val \\"B\\".", "next": 1 }`,
        expectError: false
    },
    {
        name: "Trailing Comma Object",
        input: `{ "a": 1, }`,
        expectError: false
    }
];

console.log("--- START TESTS (SMART REGEX) ---");

testCases.forEach(tc => {
    console.log(`\nTEST: ${tc.name}`);
    const badInput = tc.input.replace(/\\"/g, '"');
    console.log(`INPUT RAW: ${badInput}`);

    const fixed = aggressiveRepairJson(badInput);
    console.log(`FIXED: ${fixed.replace(/\n/g, '')}`);

    try {
        JSON.parse(fixed);
        console.log("✅ PARSE OK");
    } catch (e: any) {
        console.log(`❌ FAIL: ${e.message}`);
    }
});
