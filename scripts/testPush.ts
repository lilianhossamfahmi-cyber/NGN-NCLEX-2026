import dotenv from 'dotenv';
dotenv.config();
import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { CardiologyItems_Final_Batch1 } from '../docs/external_prompts/Generated_Cardiology_50/CardiologyItems_Final_Batch1.ts';

async function test() {
    console.log('Pushing Batch 1...');
    await saveBatchToBank(CardiologyItems_Final_Batch1);
    console.log('Batch 1 done.');
}
test();
