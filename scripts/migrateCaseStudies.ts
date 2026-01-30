import fs from 'fs';
import path from 'path';
import { applySystemicFixes, validateCaseStudy } from '../src/utils/question-validators';

/**
 * migrateCaseStudies.ts
 * 
 * System-wide migration script to apply architectural fixes and validation
 * to all existing case studies in the project.
 */

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const directories = [
        path.join(__dirname, '../src/dataStore'),
        path.join(__dirname, '../src/data')
    ];

    let totalFixed = 0;
    let totalErrors = 0;

    for (const dir of directories) {
        if (!fs.existsSync(dir)) continue;

        console.log(`\n📂 Scanning directory: ${dir}`);
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            const filePath = path.join(dir, file);
            try {
                const rawData = fs.readFileSync(filePath, 'utf8');
                let caseStudy = JSON.parse(rawData);

                // Apply fixes
                const fixedCaseStudy = applySystemicFixes(caseStudy);

                // Validate
                const errors = validateCaseStudy(fixedCaseStudy);

                if (errors.length > 0) {
                    console.warn(`⚠️  [${file}] Validation failed after fix:`, errors);
                    totalErrors++;
                } else {
                    // Only write back if it's valid or improved
                    fs.writeFileSync(filePath, JSON.stringify(fixedCaseStudy, null, 2));
                    console.log(`✅ [${file}] Fixed and validated.`);
                    totalFixed++;
                }
            } catch (error: any) {
                console.error(`❌ [${file}] Failed to process:`, error.message);
                totalErrors++;
            }
        }
    }

    console.log(`\n--- Migration Summary ---`);
    console.log(`Total Files Fixed: ${totalFixed}`);
    console.log(`Total Files with Errors: ${totalErrors}`);
    console.log(`-------------------------\n`);
}

main().catch(console.error);
