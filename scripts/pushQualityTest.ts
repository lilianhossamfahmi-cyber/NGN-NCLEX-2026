import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyItems_Part1 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyTrendItems_Part1.ts';

async function pushQualityTest() {
    console.log(`📦 Preparing to push ${CardiologyItems_Part1.length} HIGH-FIDELITY test items...`);

    // Log the structure of the first item to debug "Poor Presentation" issues
    console.log("🔍 INSPECTING ITEM 1 STRUCTURE:");
    console.log(JSON.stringify(CardiologyItems_Part1[0], null, 2));

    try {
        const savedCount = await saveBatchToBank(CardiologyItems_Part1);

        if (savedCount > 0) {
            console.log(`✅ Success! ${savedCount} high-quality test items pushed.`);
            console.log(`🚀 Please check the Admin Dashboard to verify "Level 5" presentation.`);
        } else {
            console.error('❌ Failed to save items.');
        }
    } catch (error) {
        console.error('💥 Critical Error:', error);
    }
}

pushQualityTest();
