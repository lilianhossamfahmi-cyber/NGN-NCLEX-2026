import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { MgtCareItems_Final_Batch1 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch1.ts';

async function pushMgtCare() {
    console.log(`🚀 Preparing to push Management of Care Batch 1 (Vitals FIXED)...`);
    try {
        const now = new Date();
        const itemsWithFreshDates = MgtCareItems_Final_Batch1.map((item, index) => {
            const sequentialDate = new Date(now.getTime() + index * 1000).toISOString();

            return {
                ...item,
                type: item.typeId || 'trend',
                metadata: {
                    ...item.metadata,
                    createdAt: sequentialDate,
                    updatedAt: sequentialDate,
                    difficultyLevel: 5 // FORCE DIFF 5
                },
                pedagogy: {
                    ...item.pedagogy,
                    difficultyLevel: 5 // FORCE DIFF 5
                }
            };
        });

        const count = await saveBatchToBank(itemsWithFreshDates);
        console.log(`✅ Success! ${count} items pushed with TrendTable FIXED & FRESH Timestamps.`);
    } catch (err) {
        console.error('💥 Error pushing items:', err);
    }
}

pushMgtCare();
