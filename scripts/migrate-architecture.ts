/**
 * migrate-architecture.ts
 * 
 * RAPID SYSTEM MIGRATION SCRIPT
 * Applies radical structural fixes to all existing case studies.
 * Target: Resolves Matrix references, Drop-Cloze schemas, and Text formatting.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applySystemicFixes, validateCaseStudy } from '../src/utils/question-validators';

// ES Module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateFiles() {
    console.log('--- 🚀 NGN ARCHITECTURE MIGRATION STARTING 🚀 ---');
    console.log('Dirname:', __dirname);

    const dataStorePath = path.resolve(__dirname, '../src/dataStore');
    const files = fs.readdirSync(dataStorePath).filter(f => f.endsWith('.json'));

    let fixedCount = 0;
    let errorCount = 0;

    for (const file of files) {
        const filePath = path.join(dataStorePath, file);
        try {
            console.log(`Processing: ${file}...`);
            const rawData = fs.readFileSync(filePath, 'utf-8');
            const item = JSON.parse(rawData);

            // 1. APPLY SYSTEMIC FIXES (Sanitization + Schema Enforcement)
            const fixed = applySystemicFixes(item);

            // 2. VALIDATE
            const errors = validateCaseStudy(fixed);
            if (errors.length > 0) {
                console.warn(`[WARN] ${file} has remaining validation issues:`, errors);
            }

            // 3. SAVE BACK
            fs.writeFileSync(filePath, JSON.stringify(fixed, null, 4), 'utf-8');
            console.log(`✅ Fixed: ${file}`);
            fixedCount++;
        } catch (error) {
            console.error(`❌ Failed: ${file}`, error);
            errorCount++;
        }
    }

    console.log('\n--- MIGRATION SUMMARY ---');
    console.log(`Successfully Processed: ${fixedCount}`);
    console.log(`Failed/Errored: ${errorCount}`);
    console.log('--------------------------\n');
}

// NOTE: This function can be integrated into your DB service for Supabase migration
async function migrateDatabaseItems(dbService: any) {
    console.log('Migrating Supabase Items...');
    const allItems = await dbService.getAllItems();
    for (const item of allItems) {
        const fixed = applySystemicFixes(item);
        await dbService.updateItem(item.id, fixed);
    }
}

migrateFiles().catch(console.error);
