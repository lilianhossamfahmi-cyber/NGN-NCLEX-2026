import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function purgeCardiologyItems() {
    console.log('🗑️ Purging Cardiology items...');

    // Deleting items where id starts with 'Cardiology-Trend' or 'Cardiology-Items'
    const { data, error } = await supabase
        .from('QuestionBank')
        .delete()
        .or('id.ilike.Cardiology-Trend%,id.ilike.Cardiology-Items%')
        .select();

    if (error) {
        console.error('❌ Error purging items:', error);
    } else {
        console.log(`✅ Cleaned up ${data?.length || 0} existing low-quality items.`);
    }
}

purgeCardiologyItems();
