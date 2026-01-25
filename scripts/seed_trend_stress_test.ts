
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) { console.error('Missing Env Vars'); process.exit(1); }

const supabase = createClient(url, key);
const jsonPath = path.join(process.cwd(), 'docs/external_prompts/Generated_Trends/Golden_Trend_Batch_Level5.json');

async function seed() {
    try {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const items = JSON.parse(raw);
        console.log(`\n🧪 STARTING TREND STRESS TEST (N=${items.length})`);

        for (const item of items) {
            console.log(`\n---------------------------------------------------`);
            console.log(`🔎 ANALYZING: ${item.id} [Level ${item.content.metadata.difficulty}]`);

            // 1. GAP ANALYSIS: Check Metadata
            const diff = item.content.rationale.difficulty;
            if (!diff) console.error(`   ❌ FAIL: Missing Difficulty Object`);
            else {
                console.log(`   ✅ Difficulty: Level ${diff.level} (${diff.label})`);
                if (diff.clinicalStrategy) console.log(`   ✨ Strategy Found: "${diff.clinicalStrategy.substring(0, 40)}..."`);
                else if (item.content.metadata.difficulty > 2) console.warn(`   ⚠️ WARNING: Level ${item.content.metadata.difficulty} item missing Clinical Strategy!`);
                else console.log(`   ℹ️  (Level 1-2 may not require Strategy)`);
            }

            // 2. GAP ANALYSIS: Check Trend Data Validity
            const pts = item.content.clinicalData.vitals || item.content.clinicalData.labs;
            if (pts && pts.length >= 2) {
                console.log(`   ✅ Trend Data: ${pts.length} points detected.`);
            } else {
                console.error(`   ❌ FAIL: Insufficient Trend Data points!`);
            }

            // 3. PREPARE PAYLOAD
            // FIX: Ensure root-level metadata exists for frontend compatibility
            if (!item.metadata) {
                item.metadata = {
                    ...(item.content?.metadata || {}),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    status: 'published',
                    authorId: 'system_stress_test'
                };
            }

            const payload = {
                id: item.id,
                type_id: item.type,
                clinical_focus: item.content.metadata.topic || 'General',
                difficulty_level: item.content.metadata.difficulty,
                cjmm_step: item.content.metadata.cjmmStep,
                client_needs: JSON.stringify(item.content.metadata.clientNeeds),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                created_by: 'system_stress_test',
                updated_by: 'system_stress_test',
                status: 'published',
                quality_score: 100,
                item_json: JSON.stringify(item)
            };

            // 4. INGEST
            const { error } = await supabase.from('item_bank').upsert(payload, { onConflict: 'id' });
            if (error) console.error(`   ❌ DB INSERT FAIL:`, error.message);
            else console.log(`   🚀 DB INSERT SUCCESS`);
        }
        console.log(`\n✅ STRESS TEST COMPLETE.`);

    } catch (e) {
        console.error('Script Error:', e);
    }
}

seed();
