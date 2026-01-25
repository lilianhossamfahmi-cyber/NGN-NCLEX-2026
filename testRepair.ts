console.log("🟢 Script started...");
import { UnifiedDataPipeline } from './src/services/UnifiedDataPipeline';
import { supabase } from './src/lib/supabase';

const ITEM_ID = 'CARDIOLOGY-TRD-PAPRUPT-F3G4';

async function test() {
    console.log("🚀 Fetching item for test repair...");
    const { data: item } = await supabase.from('item_bank').select('*').eq('id', ITEM_ID).single();
    if (!item) {
        console.error("Item not found");
        return;
    }

    let rawJson = item.item_json;
    if (typeof rawJson === 'string') {
        try {
            rawJson = JSON.parse(rawJson);
        } catch (e) {
            console.error("Failed to parse item_json string");
            return;
        }
    }

    console.log("🛠️ Running deepTransform with autofill: true...");

    // This will trigger magicFixItem because strategy/knowledge are missing
    const repaired = await UnifiedDataPipeline.deepTransform(rawJson, { autofill: true });

    console.log("✅ Repair Complete.");
    console.log("DIFFICULTY:", repaired.content.rationale.difficulty?.level);
    console.log("MNEMONIC TITLE:", repaired.content.rationale.mnemonic?.title);
    console.log("STRATEGY:", repaired.content.rationale.clinicalStrategy);
    console.log("ANATOMY:", repaired.content.rationale.referenceInfo?.anatomy);
}

test().catch(console.error);
