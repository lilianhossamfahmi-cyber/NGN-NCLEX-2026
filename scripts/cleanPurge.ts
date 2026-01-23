import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function cleanPurge() {
    console.log('🗑️ Cleaning up poor quality items...');

    // Delete anything with the old ID pattern "Cardiology-Trend-"
    const { data: d1, error: e1 } = await supabase
        .from('item_bank')
        .delete()
        .ilike('id', 'Cardiology-Trend-%')
        .select();

    // Also delete any with lowercase "cardiology-items"
    const { data: d2, error: e2 } = await supabase
        .from('item_bank')
        .delete()
        .ilike('id', 'Cardiology-Items-%')
        .select();

    if (e1 || e2) {
        console.error('❌ Error during purge:', e1 || e2);
    } else {
        console.log(`✅ Purged ${(d1?.length || 0) + (d2?.length || 0)} old poor-quality items.`);
    }
}

cleanPurge();
