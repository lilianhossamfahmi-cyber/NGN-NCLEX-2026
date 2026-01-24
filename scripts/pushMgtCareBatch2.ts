import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { MgtCareItems_Final_Batch2 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch2.ts';

async function pushMgtCareBatch2() {
    console.log(`🚀 Preparing to push Management of Care Batch 2...`);
    try {
        const now = new Date();
        const itemsWithFreshDates = MgtCareItems_Final_Batch2.map((item, index) => {
            const sequentialDate = new Date(now.getTime() + index * 1000).toISOString();

            // SHOTGUN DATA INJECTION: Ensure data exists at every possible path
            const modifiedContent = {
                ...item.content,
                trendTable: (item.content as any).structure?.trendTable, // Path A
                options: (item.content as any).structure?.options, // Path B
                structure: {
                    ...(item.content as any).structure,
                    trendTable: (item.content as any).structure?.trendTable, // Path C
                    options: (item.content as any).structure?.options // Path D
                }
            };

            return {
                ...item,
                type: item.typeId || 'trend',
                // Explicitly hoist data to ROOT for legacy renderers
                trendTable: (item.content as any).structure?.trendTable,
                options: (item.content as any).structure?.options,

                content: modifiedContent,

                _unifiedPipelineProcessed: true,
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
            } as any;
        });

        console.log(`🕒 Timestamps updated start: ${itemsWithFreshDates[0].metadata.createdAt}`);

        const count = await saveBatchToBank(itemsWithFreshDates);
        console.log(`✅ Success! ${count} items pushed with High-Fidelity Bypass Enabled.`);
    } catch (err) {
        console.error('💥 Error pushing items:', err);
    }
}

pushMgtCareBatch2();
