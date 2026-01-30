// Node 18+ has built‑in fetch, but let's keep the polyfill just in case
// import 'cross-fetch/polyfill';

import { generateQuestions } from '../src/services/questionGenerationService';
import { validateGenerationSettings } from '../src/services/validationService';
import { saveBatchToBank } from '../src/services/itemStorage';
import { enrichItemWithQuality } from '../src/utils/autoQuality';
import { GenerationSettings } from '../src/types/master-schema';

/**
 * Simple bulk‑generation orchestrator for Phase 2.
 * It creates a batch of items using the existing question generation pipeline,
 * runs the Auto‑Quality Assurance (AQA) enrichment, and persists the results.
 */
interface BulkConfig {
    batchSize: number; // number of items per generation call
    totalBatches: number; // how many batches to run
    topics: string[]; // list of topic strings to feed into the generator
    difficultyDistribution: number[]; // array of difficulty levels to rotate through
}

const defaultConfig: BulkConfig = {
    batchSize: 20,
    totalBatches: 5,
    topics: ['Sepsis', 'Heart Failure', 'COPD', 'Pharmacology', 'Pediatrics'],
    difficultyDistribution: [2, 3, 4, 5],
};

// Hard-coded list of types to rotate through
const ALL_TYPES = [
    'case-study-6-screen',
    'bowtie-standalone',
    'trend-standalone',
    'cloze-dropdown',
    'drop-cloze',
    'highlight-text',
    'matrix-mr',
    'ordered-response',
    'multiple-response-sata',
    'hot-spot',
    'calculation'
];

/**
 * Build a GenerationSettings object for a given topic and difficulty.
 * Picks 3 random types per batch to keep token count safe.
 */
function buildSettings(topic: string, difficulty: number): GenerationSettings {
    const shuffled = ALL_TYPES.sort(() => 0.5 - Math.random());
    const selectedTypes = shuffled.slice(0, 1); // Limit to 1 type per batch call to avoid truncation

    return {
        mode: 'hybrid',
        selectedReferenceIds: [],
        targetTypes: selectedTypes,
        quantityPerType: 1,
        clinicalFocus: [topic],
        difficultyLevel: difficulty,
        temperature: 0.7,
        manualContext: '',
        aiPrompt: '',
        advanced: {
            includeAnswerKeys: true,
            includeRationales: true,
            detectDuplicates: true,
            flagCopyright: true,
            paraphraseStrictness: 'standard',
        },
    };
}

async function runBulkGeneration(config: BulkConfig = defaultConfig) {
    const allGenerated: any[] = [];
    let topicIdx = 0;
    let diffIdx = 0;

    for (let batch = 0; batch < config.totalBatches; batch++) {
        const settingsBatch: GenerationSettings[] = [];
        for (let i = 0; i < config.batchSize; i++) {
            const topic = config.topics[topicIdx % config.topics.length];
            const difficulty = config.difficultyDistribution[diffIdx % config.difficultyDistribution.length];
            settingsBatch.push(buildSettings(topic, difficulty));
            topicIdx++;
            diffIdx++;
        }

        // Validate once – all settings share the same shape
        const validation = validateGenerationSettings(settingsBatch[0]);
        if (!validation.valid) {
            console.error('Invalid generation settings:', validation.errors);
            return;
        }

        // Call the generation service for the whole batch (the service already supports quantityPerType)
        // Call the generation service for the whole batch (the service already supports quantityPerType)
        try {
            console.log(`Starting Batch ${batch + 1}/${config.totalBatches}...`);
            const response = await generateQuestions(settingsBatch[0], [], (s) => console.log(`[Batch ${batch + 1}] ${s}`), undefined);

            if (response.success && response.data) {
                console.log(`Batch ${batch + 1} Success. Enriching ${response.data.length} items...`);
                // Enrich each item with AQA before persisting
                const enriched = response.data.map(item => enrichItemWithQuality(item));
                console.log(`Saving to bank...`);
                const saved = await saveBatchToBank(enriched);
                console.log(`Batch ${batch + 1}/${config.totalBatches}: generated ${response.data.length}, saved ${saved}`);
                allGenerated.push(...enriched);
            } else {
                console.warn(`Batch ${batch + 1} failed logic:`, response.error);
            }
        } catch (err: any) {
            console.error(`Batch ${batch + 1} CRASHED:`, err);
        }
    }

    console.log('Bulk generation complete. Total items saved:', allGenerated.length);
    return allGenerated;
}

// Execute when run directly via ts-node
// Run when this script is executed directly
runBulkGeneration().catch(err => console.error('Bulk generation error:', err));
