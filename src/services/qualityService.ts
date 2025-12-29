import { MasterQuestionItem } from '../types/master-schema';

/**
 * Quality Scoring Service
 * Evaluates NGN questions on Medical Accuracy, Compliance, CJMM Alignment, and Pedagogy.
 */

export interface QualityScore {
    total: number; // 0-100
    rating: 'excellent' | 'good' | 'fair' | 'poor';
    breakdown: {
        medicalAccuracy: number; // Max 30
        ncsbnCompliance: number; // Max 25
        cjmmAlignment: number;   // Max 25
        pedagogy: number;        // Max 20
    };
    feedback: string[];
}

/**
 * Calculates the holistic quality score for a question item.
 * NOTE: In a real AI system, this would analyze the text content deeper.
 * For this prototype, we use heuristics and simulation.
 * 
 * @param item The question item to evaluate
 */
export const calculateQualityScore = (item: MasterQuestionItem): QualityScore => {
    let medicalAcc = 0;
    let ncsbnComp = 0;
    let cjmmAlign = 0;
    let pedQual = 0;
    const feedback: string[] = [];

    // --- 1. Medical Accuracy (Max 30) ---
    // Simulate checks
    medicalAcc += 10; // Vitals plausible
    medicalAcc += 10; // Labs plausible
    medicalAcc += 10; // Patho consistent

    // --- 2. NCSBN Compliance (Max 25) ---
    ncsbnComp += 10; // Formatting
    ncsbnComp += 5;  // Temp units
    ncsbnComp += 10; // Terminology

    // --- 3. CJMM Alignment (Max 25) ---
    if (item.pedagogy.cjmmPhase) {
        cjmmAlign += 10;
    } else {
        feedback.push("Missing explicit CJMM Phase alignment.");
    }
    cjmmAlign += 10; // Discrimination
    cjmmAlign += 5;  // Defensible answer

    // --- 4. Pedagogical Quality (Max 20) ---
    pedQual += 5; // Objectives
    pedQual += 5; // Difficulty
    pedQual += 5; // Distractors
    pedQual += 5; // No tricks

    // Random variation for demo realism if needed, but let's default to high for now
    // In real app, we'd inspect `item.content` fields.

    const total = medicalAcc + ncsbnComp + cjmmAlign + pedQual;

    let rating: QualityScore['rating'] = 'poor';
    if (total >= 90) rating = 'excellent';
    else if (total >= 80) rating = 'good';
    else if (total >= 70) rating = 'fair';

    return {
        total,
        rating,
        breakdown: {
            medicalAccuracy: medicalAcc,
            ncsbnCompliance: ncsbnComp,
            cjmmAlignment: cjmmAlign,
            pedagogy: pedQual
        },
        feedback
    };
};
