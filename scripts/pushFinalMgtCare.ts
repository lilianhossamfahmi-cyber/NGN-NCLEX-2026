import dotenv from 'dotenv';
dotenv.config();
import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { MgtCareItems_Final_Batch1 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch1';
import { MgtCareItems_Final_Batch2 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch2';
import { MgtCareItems_Final_Batch3 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch3';
import { MgtCareItems_Final_Batch4 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch4';
import { MgtCareItems_Final_Batch5 } from '../docs/external_prompts/Generated_Cardiology_50/MgtCareItems_Final_Batch5';

const allItems = [
    ...MgtCareItems_Final_Batch1,
    ...MgtCareItems_Final_Batch2,
    ...MgtCareItems_Final_Batch3,
    ...MgtCareItems_Final_Batch4,
    ...MgtCareItems_Final_Batch5
];

async function pushMgtCare() {
    console.log(`🚀 Pushing ${allItems.length} High-Fidelity Management of Care items...`);
    try {
        const count = await saveBatchToBank(allItems);
        console.log(`✅ Successfully pushed ${count} Mgt Care items to the bank.`);
    } catch (err) {
        console.error('💥 Error pushing Mgt Care items:', err);
    }
}

pushMgtCare();
