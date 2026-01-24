import dotenv from 'dotenv';
dotenv.config();
import { supabase } from '../src/lib/supabase';

async function forceCleanMgtCare() {
    console.log('🔥 Force Cleaning ALL Management of Care Items...');

    // 1. Delete by ID pattern (matches MGTCARE-...)
    const { count: count1, error: error1 } = await supabase
        .from('item_bank')
        .delete({ count: 'exact' })
        .ilike('id', '%mgtcare%');

    if (error1) console.error('Error deleting by ID:', error1);
    else console.log(`Deleted ${count1 || 0} items by ID pattern.`);

    // 2. Delete by Clinical Focus
    const { count: count2, error: error2 } = await supabase
        .from('item_bank')
        .delete({ count: 'exact' })
        .eq('clinical_focus', 'Management of Care');

    if (error2) console.error('Error deleting by Focus:', error2);
    else console.log(`Deleted ${count2 || 0} items by Clinical Focus.`);

    console.log('✅ Management of Care section wiped clean.');
}

forceCleanMgtCare();
