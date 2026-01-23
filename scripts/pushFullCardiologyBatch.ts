import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyTrendItems } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyTrendItems.ts';

async function pushAllItems() {
    console.log(`📦 Loaded ${CardiologyTrendItems.length} Cardiology Trend items.`);

    // Process in smaller chunks to be safe with Supabase limits
    const chunkSize = 10;
    for (let i = 0; i < CardiologyTrendItems.length; i += chunkSize) {
        const chunk = CardiologyTrendItems.slice(i, i + chunkSize);
        console.log(`🚀 Pushing items ${i + 1}-${Math.min(i + chunkSize, CardiologyTrendItems.length)}...`);
        try {
            const savedCount = await saveBatchToBank(chunk);
            console.log(`   ✅ Saved ${savedCount} items.`);
        } catch (error) {
            console.error(`   ❌ Error pushing batch:`, error);
        }
    }

    console.log('🎉 All operations complete.');
}

pushAllItems();
