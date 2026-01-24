import dotenv from 'dotenv';
dotenv.config();
import { supabase } from '../src/lib/supabase';

async function purgeMgtCareItems() {
    console.log('🗑️ Purging Management of Care items...');

    // Delete items starting with MGTCARE-
    const { error, count } = await supabase
        .from('item_bank')
        .delete({ count: 'exact' })
        .ilike('id', 'MGTCARE%');

    if (error) {
        console.error('❌ Error deleting items:', error);
    } else {
        console.log(`✅ Successfully deleted ${count} items starting with MGTCARE-`);
    }

    // Also delete any with title containing "Management of Care" just in case they have a different ID (like numeric ones)
    // Wait, the Numeric ones had IDs starting with MGTCARE still.
    // The "unknown" ID ones? No, I always assigned an ID.

    // Check for any recent items created today (optional, but safer to stick to ID pattern)
}

purgeMgtCareItems();
