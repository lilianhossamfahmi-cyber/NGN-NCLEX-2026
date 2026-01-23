import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function fixTimestamps() {
    console.log('⏰ Fixing timestamps for the 20 premium items...');

    const now = new Date().toISOString();

    // Fetch the 20 premium items
    const { data: items, error: fetchErr } = await supabase
        .from('item_bank')
        .select('*')
        .ilike('id', 'CARDIOLOGY-TRD-%');

    if (fetchErr) {
        console.error('❌ Error fetching:', fetchErr);
        return;
    }

    const updates = items.map(row => {
        const itemJson = typeof row.item_json === 'string' ? JSON.parse(row.item_json) : row.item_json;

        // Update metadata
        itemJson.metadata.createdAt = now;
        itemJson.metadata.updatedAt = now;

        return {
            ...row,
            created_at: now,
            updated_at: now,
            item_json: JSON.stringify(itemJson)
        };
    });

    const { error: updateErr } = await supabase
        .from('item_bank')
        .upsert(updates);

    if (updateErr) {
        console.error('❌ Error updating timestamps:', updateErr);
    } else {
        console.log(`✅ Successfully updated timestamps for 20 items to ${now}`);
    }
}

fixTimestamps();
