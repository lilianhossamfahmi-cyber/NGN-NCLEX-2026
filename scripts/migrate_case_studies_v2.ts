/**
 * migrate_case_studies_v2.ts
 * 
 * Master NGN Migration Script
 * - Applies Matrix pluralization
 * - Transmutes Drop-Cloze flat arrays to object options
 * - Authoritative deep text sanitization
 * 
 * Usage: npx ts-node scripts/migrate_case_studies_v2.ts [--dry-run] [--local-only] [--db-only]
 */

import { supabase } from '../src/lib/supabase';
import { UnifiedDataPipeline } from '../src/services/UnifiedDataPipeline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
    const dryRun = process.argv.includes('--dry-run');
    const localOnly = process.argv.includes('--local-only');
    const dbOnly = process.argv.includes('--db-only');

    console.log(`\n🚀 Starting NCLEX-NGN V2 Migration...`);
    if (dryRun) console.log(`[DRY RUN MODE] No changes will be saved.\n`);

    // --- PART 1: LOCAL DATASTORES ---
    if (!dbOnly) {
        const localDirs = [
            path.join(__dirname, '../src/dataStore'),
            path.join(__dirname, '../src/data')
        ];

        console.log(`📂 Scanning Local Directories...`);
        for (const dir of localDirs) {
            if (!fs.existsSync(dir)) continue;
            const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                const filePath = path.join(dir, file);
                try {
                    const original = fs.readFileSync(filePath, 'utf8');
                    const caseStudy = JSON.parse(original);

                    // The transform call is now authoritative for V2 rules
                    const transformed = await UnifiedDataPipeline.transform(caseStudy);
                    const transformedStr = JSON.stringify(transformed, null, 2);

                    if (original !== transformedStr) {
                        console.log(`✅ [Local] ${file}: Fixed structure.`);
                        if (!dryRun) fs.writeFileSync(filePath, transformedStr);
                    } else {
                        console.log(`✔️  [Local] ${file}: Already canonical.`);
                    }
                } catch (e: any) {
                    console.error(`❌ [Local] ${file} Failed:`, e.message);
                }
            }
        }
    }

    // --- PART 2: DATABASE MIGRATION ---
    if (!localOnly) {
        console.log(`\n🗄️  Scanning DB: item_bank...`);
        try {
            let hasMore = true;
            let offset = 0;
            const limit = 1000;
            let dbSuccessCount = 0;

            while (hasMore) {
                const { data: rows, error } = await supabase
                    .from('item_bank')
                    .select('id, item_json, type_id')
                    .range(offset, offset + limit - 1);

                if (error) throw error;
                if (!rows || rows.length === 0) {
                    hasMore = false;
                    break;
                }

                console.log(`Processing ${rows.length} items (offset ${offset})...`);

                for (const row of rows) {
                    try {
                        const originalJson = typeof row.item_json === 'string' ? row.item_json : JSON.stringify(row.item_json);
                        const itemData = JSON.parse(originalJson);

                        const transformed = await UnifiedDataPipeline.transform(itemData);
                        const transformedJson = JSON.stringify(transformed);

                        if (originalJson !== transformedJson) {
                            console.log(`🛠️  [DB] ${row.id}: Migrating to V2 Canonical...`);

                            if (!dryRun) {
                                const { error: updateError } = await supabase
                                    .from('item_bank')
                                    .update({
                                        item_json: transformedJson,
                                        type_id: transformed.typeId || row.type_id
                                    })
                                    .eq('id', row.id);

                                if (updateError) throw updateError;
                            }
                            dbSuccessCount++;
                        }
                    } catch (e: any) {
                        console.error(`❌ [DB] Item ${row.id} Failed:`, e.message);
                    }
                }

                offset += limit;
                if (rows.length < limit) hasMore = false;
            }
            console.log(`\nDB Migration Complete. ${dbSuccessCount} items updated.`);
        } catch (e: any) {
            console.error(`❌ DB Migration Interrupted:`, e.message);
        }
    }

    console.log(`\n🎉 Migration Process Finished.`);
}

migrate().catch(console.error);
