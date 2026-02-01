
import * as fs from 'fs';
import * as path from 'path';

// Mock the greedy search logic from CaseStudyRenderer.tsx
function testGreedySearch(config: any) {
    console.log('--- Testing Greedy Search ---');
    const screens = config.screens ||
        config.structure?.screens ||
        config.content?.structure?.screens ||
        [];

    console.log(`Found ${screens.length} screens.`);
    if (screens.length > 0) {
        screens.forEach((s: any, i: number) => {
            console.log(`Screen ${i + 1} Type: ${s.type}`);
            if (s.type === 'highlight') {
                const hasSpans = s.text.includes('<span id=');
                console.log(`  - Highlight HTML Tags detected: ${hasSpans ? 'YES' : 'NO'}`);
                if (!hasSpans) {
                    console.error('  - ERROR: Missing mandatory <span> tags in Highlight screen!');
                }
            }
        });
    } else {
        console.error('  - ERROR: No screens found! Ghost Screen bug is present.');
    }
}

// Mock the grading logic from CaseStudyManager.ts
function testGrading(userAnswer: any, correctContent: any) {
    console.log('\n--- Testing Grading Logic ---');
    const screens = correctContent.screens ||
        correctContent.structure?.screens ||
        correctContent.content?.structure?.screens ||
        [];

    let totalScore = 0;
    let totalMax = 0;

    screens.forEach((_screen: any, index: number) => {
        const screenAns = userAnswer ? userAnswer[index] : null;
        const isAnswered = screenAns !== null && screenAns !== undefined && screenAns !== '' && (Array.isArray(screenAns) ? screenAns.length > 0 : true);
        const score = isAnswered ? 1 : 0;

        totalScore += score;
        totalMax += 1;
    });

    if (totalMax === 0) totalMax = 6;

    console.log(`Calculated Score: ${totalScore}/${totalMax}`);
    if (totalScore === 0 && totalMax > 0) {
        console.warn('  - WARNING: Scoring zero. Ensure userAnswer mimics real interaction.');
    } else {
        console.log('  - SUCCESS: Scoring engine produced a valid result.');
    }
}

function main() {
    const filePath = path.join(process.cwd(), 'src/dataStore/chemotherapy_spill_case.json');
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        return;
    }

    const json = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    testGreedySearch(json);

    // Mock an interaction: User answered the first 3 screens
    const mockUserAnswer = {
        0: ['h2', 'h4'], // Highlight
        1: { r1: 'c1' },  // Matrix
        2: ['o1']        // Ordered
    };
    testGrading(mockUserAnswer, json);
}

main();
