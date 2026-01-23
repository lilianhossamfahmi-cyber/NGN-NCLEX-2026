import dotenv from 'dotenv';
dotenv.config();
import { supabase } from '../src/lib/supabase';

async function forceCleanCardiology() {
    console.log('🔥 Force Cleaning ALL Cardiology Items...');

    // 1. Delete by ID pattern (broad)
    const { count: count1, error: error1 } = await supabase
        .from('item_bank')
        .delete({ count: 'exact' })
        .ilike('id', '%cardiol%');

    if (error1) console.error('Error deleting by ID:', error1);
    else console.log(`Deleted ${count1 || 0} items by ID pattern.`);

    // 2. Delete by Clinical Focus (broad)
    const { count: count2, error: error2 } = await supabase
        .from('item_bank')
        .delete({ count: 'exact' })
        .eq('clinical_focus', 'Cardiology');

    if (error2) console.error('Error deleting by Focus:', error2);
    else console.log(`Deleted ${count2 || 0} items by Clinical Focus.`);

    console.log('✅ Cardiology section wiped clean.');
}

forceCleanCardiology();
