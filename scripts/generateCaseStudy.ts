/**
 * Generate Case Study Script
 * 
 * Prepares the Golden Prompt V2 for a given topic and outputs it for AI processing.
 * 
 * Usage:
 *   npx ts-node scripts/generateCaseStudy.ts "Septic Shock"
 *   npx ts-node scripts/generateCaseStudy.ts "Acute PE"
 *   npx ts-node scripts/generateCaseStudy.ts "DKA"
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPT_PATH = path.join(__dirname, '../src/prompts/case-study-golden-v2.md');
const OUTPUT_DIR = path.join(__dirname, '../src/dataStore');

function main() {
    const topic = process.argv[2] || 'Acute Asthma Exacerbation';

    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║         NGN CASE STUDY GENERATOR - GOLDEN PROMPT V2           ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log(`📋 Topic: ${topic}\n`);
    console.log('─'.repeat(60));

    // Load prompt
    if (!fs.existsSync(PROMPT_PATH)) {
        console.error(`❌ Prompt file not found: ${PROMPT_PATH}`);
        process.exit(1);
    }

    const template = fs.readFileSync(PROMPT_PATH, 'utf-8');
    const prompt = template.replace(/\{TOPIC\}/g, topic);

    // Save prompt to temp file for easy copying
    const promptOutputPath = path.join(OUTPUT_DIR, `_prompt_${topic.replace(/\s+/g, '_').toLowerCase()}.md`);
    fs.writeFileSync(promptOutputPath, prompt, 'utf-8');

    console.log(`\n✅ Prompt prepared (${prompt.length} characters)`);
    console.log(`📁 Saved to: ${promptOutputPath}\n`);

    console.log('─'.repeat(60));
    console.log('\n🚀 NEXT STEPS:\n');
    console.log('   1. Open the prompt file above OR copy from console below');
    console.log('   2. Paste into ChatGPT, Claude, or Gemini');
    console.log('   3. Get the JSON response');
    console.log('   4. Save the response as a .json file in src/dataStore/');
    console.log('   5. Run validation:');
    console.log(`      npx ts-node scripts/validate_case_study.ts src/dataStore/[your-file].json\n`);

    console.log('─'.repeat(60));
    console.log('\n📝 PROMPT PREVIEW (first 500 chars):\n');
    console.log(prompt.substring(0, 500) + '...\n');

    console.log('─'.repeat(60));
    console.log('\n💡 QUICK VALIDATION COMMANDS:\n');
    console.log('   # Validate a single case:');
    console.log('   npx ts-node scripts/validate_case_study.ts src/dataStore/my_case.json\n');
    console.log('   # Validate all cases in dataStore:');
    console.log('   for f in src/dataStore/*.json; do npx ts-node scripts/validate_case_study.ts "$f"; done\n');

    console.log('═'.repeat(60));
    console.log('\n✨ Generation complete! Good luck with your case study.\n');
}

main();
