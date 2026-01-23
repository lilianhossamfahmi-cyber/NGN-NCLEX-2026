import dotenv from 'dotenv';
dotenv.config();
import { supabase } from '../src/lib/supabase';

async function verifyCardiologyItem() {
    console.log('🔍 Verifying Cardiology Item Data...');

    // Fetch one of the specific high-fidelity items
    const { data, error } = await supabase
        .from('item_bank')
        .select('*')
        .eq('id', 'CARDIOLOGY-TRD-SHOCK-A1B2')
        .single();

    if (error) {
        console.error('❌ Error fetching item:', error);
        return;
    }

    if (!data) {
        console.error('❌ Item not found!');
        return;
    }

    console.log('✅ Item Found:', data.id);

    // Parse JSON
    const json = typeof data.item_json === 'string' ? JSON.parse(data.item_json) : data.item_json;

    // Check Vitals
    const vitals = json.content.clinicalData.vitals;
    console.log('📊 Vitals Check:', vitals?.length, 'points');
    console.log(JSON.stringify(vitals, null, 2));

    // Check Options
    const options = json.content.structure.options;
    console.log('✅ Options Check:', options?.length, 'options');
    console.log(JSON.stringify(options, null, 2));

    // Check Rationale
    console.log('🧠 Rationale Check:', json.content.rationale ? 'Present' : 'Missing');
}

verifyCardiologyItem();
