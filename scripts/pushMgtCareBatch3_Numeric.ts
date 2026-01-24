import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { MgtCareItems_Final_Batch3_Numeric } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch3_Numeric.ts';

async function pushMgtCareBatch3Numeric() {
    console.log(`🚀 Preparing to push Management of Care Batch 3 (NUMERIC REWORK)...`);
    try {
        const now = new Date();
        const itemsWithFreshDates = MgtCareItems_Final_Batch3_Numeric.map((item, index) => {
            const sequentialDate = new Date(now.getTime() + index * 1000).toISOString();

            return {
                ...item,
                type: 'trend',
                id: item.id,
                // STANDARD PIPELINE PUSH (Quality > Hacked)
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
        console.log(`✅ Success! ${count} Numeric Trend items pushed.`);
    } catch (err) {
        console.error('💥 Error pushing items:', err);
    }
}

pushMgtCareBatch3Numeric();
