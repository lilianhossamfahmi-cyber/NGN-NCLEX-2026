import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyTrendItems } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyTrendItems.ts';

async function pushGeneratedItems() {
    console.log(`📦 Preparing to push ${CardiologyTrendItems.length} Cardiology Trend items to the bank...`);

    try {
        const savedCount = await saveBatchToBank(CardiologyTrendItems);

        if (savedCount > 0) {
            console.log(`✅ Success! ${savedCount} items successfully pushed to Supabase.`);
            console.log(`🚀 All 50 high-complexity items are now live in the item bank.`);
        } else {
            console.error('❌ Failed to save items. See logs for details.');
        }
    } catch (error) {
        console.error('💥 Critical Error during push:', error);
    }
}

pushGeneratedItems();
