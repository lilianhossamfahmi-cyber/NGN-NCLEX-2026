
import { MasterQuestionItem } from '../../types/master-schema';
import { getBankItems } from '../../services/itemStorage';
import { generateQuestions } from '../../services/questionGenerationService';

/**
 * Service to fetch questions for student modes.
 * Prioritizes "Published" items from the Item Bank.
 * Falls back to AI Generation ONLY if bank is empty or exhausted (optional config).
 */

interface FetchOptions {
    targetDifficulty?: number; // 1-5
    excludedIds?: string[]; // IDs to avoid (already seen)
    excludedSignatures?: string[]; // Content signatures to avoid
    domain?: string; // Clinical focus
    allowAiFallback?: boolean;
    targetTypes?: string[]; // specific item types
}

const generateSignature = (item: any): string => {
    const text = item.stem || item.questionText || item.prompt || JSON.stringify(item.content);
    if (!text) return '';
    // simple "hash" - normalize and take first 100 chars
    return text.toString().trim().toLowerCase().replace(/\s+/g, '').substring(0, 100);
};

export const fetchNextQuestion = async (
    options: FetchOptions
): Promise<MasterQuestionItem | null> => {
    try {
        // 1. Fetch all items from bank
        // TODO: In production, this should be a filtered API call, not fetching all
        const response = await getBankItems({ limit: 100000 });
        const allItems = response.items || [];

        // 2. Filter for PUBLISHED items only
        // effectively ignored items that are draft or review_needed
        let candidates = allItems.filter(item => {
            // Check metadata status or top-level status (legacy support)
            const status = (item as any).metadata?.status || (item as any).status;
            return status === 'published';
        });

        // 3. Filter by Exclusions (ID & Content Signature)
        if (options.excludedIds && options.excludedIds.length > 0) {
            const seen = new Set(options.excludedIds);
            candidates = candidates.filter(item => !seen.has(item.id));
        }

        if (options.excludedSignatures && options.excludedSignatures.length > 0) {
            const seenSigs = new Set(options.excludedSignatures);
            candidates = candidates.filter(item => {
                const sig = generateSignature(item);
                return !seenSigs.has(sig);
            });
        }

        // 4. Filter by Domain (if specified)
        if (options.domain && options.domain !== 'General') {
            // Loose matching for now
            candidates = candidates.filter(item => {
                const topic = (item as any).metadata?.topic || (item.pedagogy?.clinicalFocus);
                return topic && topic.toLowerCase().includes(options.domain!.toLowerCase());
            });
        }

        // 5. Filter by Difficulty (Relaxed matching +/- 1)
        if (options.targetDifficulty) {
            const target = options.targetDifficulty;
            // First try exact match
            const exact = candidates.filter(i => i.pedagogy?.difficultyLevel === target);
            if (exact.length > 0) {
                candidates = exact;
            } else {
                // Try +/- 1
                const relaxed = candidates.filter(i =>
                    Math.abs((i.pedagogy?.difficultyLevel || 3) - target) <= 1
                );
                if (relaxed.length > 0) candidates = relaxed;
            }

            // 5.5 Filter by Types (if specified)
            if (options.targetTypes && options.targetTypes.length > 0 && !options.targetTypes.includes('All')) {
                candidates = candidates.filter(item => {
                    // Check top-level 'typeId' or metadata type
                    // Some items might use 'type' or 'questionType' depending on schema version
                    const type = (item as any).typeId || (item as any).type || (item as any).questionType;
                    return options.targetTypes!.includes(type);
                });
            }
        }

        // 6. Select One Randomly from Candidates
        if (candidates.length > 0) {
            const index = Math.floor(Math.random() * candidates.length);
            return candidates[index];
        }

        // 7. FALLBACK: If no bank items found, optionally trigger AI
        if (options.allowAiFallback) {
            console.warn("QuestionService: Bank exhausted, falling back to AI generation.");

            // Attempt to generate a unique item (max 3 tries)
            for (let i = 0; i < 3; i++) {
                // Vary the focus slightly to avoid repetition
                const fallbackTopics = ['Cardiology', 'Respiratory', 'Neurology', 'Gastrointestinal', 'Endocrine', 'Pediatrics', 'Maternity', 'Mental Health', 'Emergency'];
                const randomTopic = fallbackTopics[Math.floor(Math.random() * fallbackTopics.length)];
                const specificDomain = options.domain && options.domain !== 'General' ? options.domain : randomTopic;

                const result = await generateQuestions({
                    mode: 'ai',
                    difficultyLevel: (options.targetDifficulty || 3) as any,
                    targetTypes: (options.targetTypes && options.targetTypes.length > 0) ? options.targetTypes : ['mix-all'],
                    quantityPerType: 1,
                    clinicalFocus: [specificDomain],
                    selectedReferenceIds: [],
                    temperature: 0.8 + (i * 0.1), // Increase randomness on retries
                    aiPrompt: `Ensure this question is distinct from common ${specificDomain} questions. Unique scenario required.`,
                    manualContext: '',
                    advanced: {
                        includeAnswerKeys: true,
                        includeRationales: true,
                        detectDuplicates: false,
                        flagCopyright: false,
                        paraphraseStrictness: 'high'
                    }
                }, []);

                if (result.success && result.data && result.data.length > 0) {
                    const newItem = result.data[0];
                    // Check against exclusions
                    const newSig = generateSignature(newItem);

                    if (options.excludedSignatures && options.excludedSignatures.includes(newSig)) {
                        console.log(`[QuestionService] AI generated duplicate content (sig: ${newSig.substring(0, 10)}...). Retrying...`);
                        continue; // Try again
                    }

                    return newItem;
                }
            }
        }

        return null; // No questions available
    } catch (e) {
        console.error("Failed to fetch next question", e);
        return null;
    }
};

export const fetchItemById = async (id: string): Promise<MasterQuestionItem | null> => {
    try {
        // Ideally, we should have a getQuestionById(id) API.
        // For now, we reuse the bank fetcher.
        const allItems = await getBankItems();
        const item = allItems.find(i => String(i.id) === String(id));

        if (item) {
            // Respect unpublished items for PREVIEW purposes (Admin might want to preview drafts)
            return item;
        }
        return null;
    } catch (e) {
        console.error("Failed to fetch item by ID", e);
        return null;
    }
}

