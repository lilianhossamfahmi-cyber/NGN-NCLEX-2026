import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyItems_Batch1 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_HighFidelity_Batch1.ts';

async function pushHighFidelityBatch1() {
    console.log(`📦 Pushing 3 High-Fidelity Items...`);
    try {
        const savedCount = await saveBatchToBank(CardiologyItems_Batch1);
        console.log(`✅ Saved ${savedCount} items with FULL CONTENT.`);
    } catch (error) {
        console.error('💥 Error:', error);
    }
}

pushHighFidelityBatch1();
