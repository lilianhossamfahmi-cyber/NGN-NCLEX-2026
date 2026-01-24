import dotenv from 'dotenv';
dotenv.config();
import { supabase } from '../src/lib/supabase';

async function verifyItem() {
    const id = 'MGTCARE-TRD-ETHIC-M5N6';
    console.log(`Checking DB for ${id}...`);

    const { data, error } = await supabase
        .from('item_bank')
        .select('item_json')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error:', error);
        return;
    }

    const json = typeof data.item_json === 'string' ? JSON.parse(data.item_json) : data.item_json;

    console.log('--- DB ITEM STATE ---');
    console.log('Processed Flag:', json._unifiedPipelineProcessed); // Check JSON flag
    console.log('Structure Keys:', Object.keys(json.content?.structure || {}));
    console.log('Has TrendTable in Structure:', !!json.content?.structure?.trendTable);

    if (json.content?.structure?.trendTable) {
        console.log('TrendTable Rows:', json.content.structure.trendTable.rows?.length);
    } else {
        console.log('❌ TREND TABLE MISSING IN DB!');
    }
}

verifyItem();
