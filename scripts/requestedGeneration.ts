import dotenv from 'dotenv';
dotenv.config();

import { generateQuestions } from '../src/services/questionGenerationService.ts';
import { saveBatchToBank } from '../src/services/itemApiService.ts';
import { GenerationSettings } from '../src/types/master-schema.ts';

/**
 * CUSTOM GENERATOR FOR USER REQUEST:
 * topic: Cardiology
 * quantity: 50
 * difficultyLevel: 5
 * targetScore: 90
 * itemType: Trend
 */

async function runCustomGeneration() {
    const totalToGenerate = 50;
    const batchSize = 10;
    const allItems: any[] = [];

    console.log(`🚀 Starting Targeted Bulk Generation (${totalToGenerate} Cardiology Trend Items in batches of ${batchSize})...`);

    for (let i = 0; i < totalToGenerate / batchSize; i++) {
        console.log(`\n[Batch ${i + 1}/${totalToGenerate / batchSize}] Starting...`);
        const settings: GenerationSettings = {
            mode: 'ai',
            selectedReferenceIds: [],
            targetTypes: ['trend'],
            quantityPerType: batchSize,
            clinicalFocus: ['Cardiology'],
            difficultyLevel: 5,
            temperature: 0.8,
            manualContext: '',
            aiPrompt: 'Generate high-complexity Cardiology Trend items (deteriorating HF, MI, shock). MUST have 3+ time points. Complete 4-pillar rationales required.',
            advanced: {
                includeAnswerKeys: true,
                includeRationales: true,
                detectDuplicates: true,
                flagCopyright: true,
                paraphraseStrictness: 'strict',
            },
        };

        try {
            const response = await generateQuestions(settings, [], (s) => process.stdout.write(`\r[Batch ${i + 1}] ${s}`));
            if (response.success && response.data) {
                allItems.push(...response.data);
                console.log(`\n[Batch ${i + 1}] Success: ${response.data.length} items aggregated.`);
            } else {
                console.error(`\n[Batch ${i + 1}] Failed:`, response.error);
            }
        } catch (err) {
            console.error(`\n[Batch ${i + 1}] Crash:`, err);
        }
    }

    if (allItems.length > 0) {
        console.log(`\n✅ Generation Complete. Total items: ${allItems.length}`);
        const savedCount = await saveBatchToBank(allItems);
        console.log(`🎉 Operation Complete! ${savedCount} items added to the bank.`);

        // Output for terminal history
        console.log('\n--- DATA READY ---');
    } else {
        console.log('\n❌ No items were generated.');
    }
}

runCustomGeneration();
