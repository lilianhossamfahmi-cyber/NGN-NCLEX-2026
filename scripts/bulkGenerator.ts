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

const CONCURRENCY_LIMIT = 3;

async function runWithConcurrency<T>(
    tasks: (() => Promise<T>)[],
    limit: number,
    onProgress?: (completed: number, total: number) => void
): Promise<PromiseSettledResult<T>[]> {
    const results: PromiseSettledResult<T>[] = [];
    let idx = 0;
    let completed = 0;

    async function worker() {
        while (idx < tasks.length) {
            const currentIdx = idx++;
            try {
                const value = await tasks[currentIdx]();
                results[currentIdx] = { status: 'fulfilled', value };
            } catch (reason) {
                results[currentIdx] = { status: 'rejected', reason };
            }
            completed++;
            onProgress?.(completed, tasks.length);
        }
    }

    await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, () => worker()));
    return results;
}

async function runBulkGeneration(config: BulkConfig = defaultConfig) {
    console.log(`Starting Bulk Generation: ${config.totalBatches} batches, Concurrency: ${CONCURRENCY_LIMIT}`);

    const tasks = Array.from({ length: config.totalBatches }, (_, batch) => {
        return async () => {
            // Logic derived from original sequential loop
            const settingsBatch: GenerationSettings[] = [];

            // Calculate rotational indices based on batch number
            // Note: In parallel, 'topicIdx' / 'diffIdx' global counters would be race-prone.
            // We calculate them deterministically based on batch index.
            let localTopicIdx = batch * config.batchSize;
            let localDiffIdx = batch * config.batchSize;

            for (let i = 0; i < config.batchSize; i++) {
                const topic = config.topics[localTopicIdx % config.topics.length];
                const difficulty = config.difficultyDistribution[localDiffIdx % config.difficultyDistribution.length];
                settingsBatch.push(buildSettings(topic, difficulty));
                localTopicIdx++;
                localDiffIdx++;
            }

            // Validate once – all settings share the same shape
            const validation = validateGenerationSettings(settingsBatch[0]);
            if (!validation.valid) {
                throw new Error(`Invalid generation settings: ${validation.errors.join(', ')}`);
            }

            console.log(`[Batch ${batch + 1}] Generating...`);
            // Call the generation service for the whole batch
            const response = await generateQuestions(
                settingsBatch[0],
                [],
                (s) => { }, // Silence internal progress logs to avoid terminal spam
                undefined
            );

            if (response.success && response.data) {
                // Enrich each item with AQA before persisting
                const enriched = response.data.map(item => enrichItemWithQuality(item));
                const saved = await saveBatchToBank(enriched);
                return { generated: response.data.length, saved };
            } else {
                throw new Error(response.error || "Unknown generation error");
            }
        };
    });

    const results = await runWithConcurrency(tasks, CONCURRENCY_LIMIT, (done, total) => {
        console.log(`[BULK] Progress: ${done}/${total} (${Math.round(done / total * 100)}%)`);
    });

    // Report failures
    const failures = results.filter(r => r.status === 'rejected');
    const successes = results.filter(r => r.status === 'fulfilled');

    let totalItems = 0;
    successes.forEach((r: any) => {
        totalItems += r.value.saved;
    });

    if (failures.length > 0) {
        console.error(`[BULK] ${failures.length}/${results.length} batches failed.`);
        failures.forEach((f, i) => console.error(`  Batch failure:`, (f as any).reason?.message));
    }

    console.log('═══ BULK GENERATION COMPLETE ═══');
    console.log(`  Total Batches: ${tasks.length}`);
    console.log(`  Items Saved: ${totalItems}`);
    console.log(`  Success: ${successes.length} batches`);
    console.log(`  Failed: ${failures.length} batches`);

    return successes.map((s: any) => s.value);
}

// Execute when run directly via ts-node
// Run when this script is executed directly
runBulkGeneration().catch(err => console.error('Bulk generation error:', err));
