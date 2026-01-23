import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyItems_Batch3 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_HighFidelity_Batch3.ts';

async function pushHighFidelityBatch3() {
    console.log(`📦 Pushing 5 High-Fidelity Items (Batch 3)...`);
    try {
        const savedCount = await saveBatchToBank(CardiologyItems_Batch3);
        console.log(`✅ Saved ${savedCount} items with FULL CONTENT.`);
    } catch (error) {
        console.error('💥 Error:', error);
    }
}

pushHighFidelityBatch3();
