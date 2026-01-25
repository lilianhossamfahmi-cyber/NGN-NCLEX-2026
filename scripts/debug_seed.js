
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

console.log('Starting debug seed...');
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error('Missing env vars! Check .env file.');
    process.exit(1);
}
console.log('Env vars found. Connectng to Supabase...');

const supabase = createClient(url, key);

const jsonPath = path.join(process.cwd(), 'docs/external_prompts/Generated_Respiratory/Respiratory_Trends_Expert_V4.json');

(async () => {
    try {
        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const items = JSON.parse(raw);
        console.log(`Loaded ${items.length} items from JSON.`);

        for (const item of items) {
            const payload = {
                id: item.id,
                type_id: item.type,
                clinical_focus: 'Respiratory',
                difficulty_level: 5,
                cjmm_step: item.content.metadata.cjmmStep || 'Analyze Cues',
                client_needs: JSON.stringify(item.content.metadata.clientNeeds || 'Physiological Integrity'),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                created_by: 'system_manual_push',
                updated_by: 'system_manual_push',
                status: 'published',
                quality_score: 100,
                item_json: JSON.stringify(item)
            };

            console.log(`Upserting ${item.id}...`);
            const { error } = await supabase.from('item_bank').upsert(payload, { onConflict: 'id' });

            if (error) {
                console.error(`Failed to upsert ${item.id}:`, error);
            } else {
                console.log(`✅ Successfully pushed ${item.id}`);
            }
        }
    } catch (err) {
        console.error('Script failed:', err);
    }
})();
