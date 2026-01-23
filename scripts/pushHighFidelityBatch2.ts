import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyItems_Batch2 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_HighFidelity_Batch2.ts';

async function pushHighFidelityBatch2() {
    console.log(`📦 Pushing 5 High-Fidelity Items (Batch 2)...`);
    try {
        const savedCount = await saveBatchToBank(CardiologyItems_Batch2);
        console.log(`✅ Saved ${savedCount} items with FULL CONTENT.`);
    } catch (error) {
        console.error('💥 Error:', error);
    }
}

pushHighFidelityBatch2();
