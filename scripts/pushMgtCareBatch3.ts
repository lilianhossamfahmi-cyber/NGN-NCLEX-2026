import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { MgtCareItems_Final_Batch3 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch3.ts';

async function pushMgtCareBatch3() {
    console.log(`🚀 Preparing to push Management of Care Batch 3 (FRESH IDs)...`);
    try {
        const now = new Date();
        const itemsWithFreshDates = MgtCareItems_Final_Batch3.map((item, index) => {
            const sequentialDate = new Date(now.getTime() + index * 1000).toISOString();

            return {
                ...item,
                type: 'trend', // FORCE PRECISE TYPE
                id: item.id,
                // Pipeline Bypass REMOVED - Using patched UnifiedDataPipeline
                metadata: {
                    ...item.metadata,
                    createdAt: sequentialDate,
                    updatedAt: sequentialDate,
                    difficultyLevel: 5
                },
                pedagogy: {
                    ...item.pedagogy,
                    difficultyLevel: 5
                }
            };
        });

        console.log(`🕒 Timestamps updated start: ${itemsWithFreshDates[0].metadata.createdAt}`);

        const count = await saveBatchToBank(itemsWithFreshDates);
        console.log(`✅ Success! ${count} items pushed with Fresh IDs & Shotgun Structure.`);
    } catch (err) {
        console.error('💥 Error pushing items:', err);
    }
}

pushMgtCareBatch3();
