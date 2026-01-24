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
import { CardiologyItems_Final_Batch8 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch8.ts';
import { CardiologyItems_Final_Batch9 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch9.ts';
import { CardiologyItems_Final_Batch10 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch10.ts';
import { CardiologyItems_Final_Batch11 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch11.ts';
import { CardiologyItems_Final_Batch12 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch12.ts';

const batches = [
    CardiologyItems_Final_Batch1,
    CardiologyItems_Final_Batch2,
    CardiologyItems_Final_Batch3,
    CardiologyItems_Final_Batch4,
    CardiologyItems_Final_Batch5,
    CardiologyItems_Final_Batch6,
    CardiologyItems_Final_Batch7,
    CardiologyItems_Final_Batch8,
    CardiologyItems_Final_Batch9,
    CardiologyItems_Final_Batch10,
    CardiologyItems_Final_Batch11,
    CardiologyItems_Final_Batch12
];

async function pushInChunks() {
    let totalSaved = 0;
    console.log(`🚀 Starting chunked push for Cardiology...`);

    for (const batch of batches) {
        try {
            const count = await saveBatchToBank(batch);
            totalSaved += count;
            console.log(`✅ Saved batch of ${count} items. Total: ${totalSaved}`);
        } catch (err) {
            console.error(`❌ Error saving batch:`, err);
        }
    }

    console.log(`🏁 Finished! Total saved: ${totalSaved} premium cardio items.`);
}

pushInChunks();
