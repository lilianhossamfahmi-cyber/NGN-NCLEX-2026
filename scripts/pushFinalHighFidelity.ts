import dotenv from 'dotenv';
dotenv.config();

import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyItems_Final_Batch1 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch1.ts';
import { CardiologyItems_Final_Batch2 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch2.ts';
import { CardiologyItems_Final_Batch3 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch3.ts';
import { CardiologyItems_Final_Batch4 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch4.ts';
import { CardiologyItems_Final_Batch5 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch5.ts';
import { CardiologyItems_Final_Batch6 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch6.ts';
import { CardiologyItems_Final_Batch7 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch7.ts';

const allItems = [
    ...CardiologyItems_Final_Batch1,
    ...CardiologyItems_Final_Batch2,
    ...CardiologyItems_Final_Batch3,
    ...CardiologyItems_Final_Batch4,
    ...CardiologyItems_Final_Batch5,
    ...CardiologyItems_Final_Batch6,
    ...CardiologyItems_Final_Batch7
];

async function pushFinalHighFidelity() {
    console.log(`🚀 Pushing 20 Ultra-High-Fidelity Items (Grade A)...`);
    try {
        const savedCount = await saveBatchToBank(allItems);
        console.log(`✅ Success! ${savedCount} premium items are now in the Bank.`);
    } catch (error) {
        console.error('💥 Critical Push Error:', error);
    }
}

pushFinalHighFidelity();
