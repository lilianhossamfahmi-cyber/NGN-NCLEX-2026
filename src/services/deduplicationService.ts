import { MasterQuestionItem } from '../types/master-schema';

/**
 * Deduplication Service
 * Implements the 4-step SMART algorithm for detecting duplicate items.
 */

export interface DuplicateAnalysis {
    isDuplicate: boolean;
    riskScore: number; // 0-100
    recommendation: 'APPROVE' | 'REVIEW' | 'REGENERATE' | 'REJECT';
    matches: {
        itemId: string;
        similarity: number;
        reason: string;
    }[];
}

/**
 * Analyzes a new item against an existing batch or database.
 */
export const analyzeDuplicateRisk = (newItem: MasterQuestionItem, existingBatch: MasterQuestionItem[]): DuplicateAnalysis => {
    let maxScore = 0;
    const matches: any[] = [];

    const newFingerprint = semanticFingerprint(newItem);

    for (const existing of existingBatch) {
        if (newItem.id === existing.id) continue;

        const structScore = structuralSimilarity(newItem, existing);
        const contentScore = contentOverlap(newItem, existing);
        const fingerprintMatch = newFingerprint === semanticFingerprint(existing) ? 100 : 0;

        // Weighted Average
        // Fingerprint (scenario core) is matched heavily
        const totalScore = (structScore * 0.2) + (contentScore * 0.3) + (fingerprintMatch * 0.5);

        if (totalScore > maxScore) maxScore = totalScore;

        if (totalScore > 20) {
            matches.push({
                itemId: existing.id,
                similarity: totalScore,
                reason: 'Scenario overlap detected'
            });
        }
    }

    return {
        isDuplicate: maxScore > 70,
        riskScore: maxScore,
        recommendation: generateRecommendation(maxScore),
        matches
    };
};

/**
 * Step 1: Semantic Fingerprinting
 * Hashes the core clinical scenario elements.
 */
const semanticFingerprint = (item: MasterQuestionItem): string => {
    // In real system: use NLP extraction.
    // Here: Simple string concat of key fields for hash
    const focus = item.pedagogy.clinicalFocus;
    const title = item.metadata.title;
    // We would need to dig into content here
    return `${focus}-${title}`.toLowerCase().replace(/\s/g, '');
};

/**
 * Step 2: Structural Similarity
 */
const structuralSimilarity = (item1: MasterQuestionItem, item2: MasterQuestionItem): number => {
    if (item1.typeId !== item2.typeId) return 0; // Different types are visually distinct
    return 50; // Same type is inherently somewhat similar structurally
};

/**
 * Step 3: Content Overlap
 */
const contentOverlap = (item1: MasterQuestionItem, item2: MasterQuestionItem): number => {
    if (item1.pedagogy.clinicalFocus === item2.pedagogy.clinicalFocus) return 60;
    return 0;
};

const generateRecommendation = (score: number): DuplicateAnalysis['recommendation'] => {
    if (score <= 20) return 'APPROVE';
    if (score <= 50) return 'REVIEW';
    if (score <= 70) return 'REGENERATE';
    return 'REJECT';
};
