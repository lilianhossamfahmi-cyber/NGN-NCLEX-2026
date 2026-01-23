import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.VITE_SUPABASE_ANON_KEY!
);

async function inspectBank() {
    console.log('🔍 Inspecting Item Bank...');

    const { data, error } = await supabase
        .from('item_bank')
        .select('id, clinical_focus, created_at, updated_at, quality_score')
        .order('created_at', { ascending: false })
        .limit(40);

    if (error) {
        console.error('❌ Error:', error);
    } else {
        console.table(data);
    }
}

inspectBank();
