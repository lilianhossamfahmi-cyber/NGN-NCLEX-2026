/**
 * CustomExamEngine.ts
 * 
 * Logic for Mode 6: Custom Exam Builder ("The Flex Master").
 * Handles configuration, validation, and generation of custom exams.
 */

import { fetchNextQuestion } from '../services/QuestionService';
import { MasterQuestionItem } from '../../types/master-schema';

export interface ExamConfiguration {
    type: 'FULL' | 'MINI' | 'DOMAIN' | 'CJMM' | 'SPEED' | 'CUSTOM';
    title: string;

    // Timing
    timeLimitMinutes: number | null; // null = untimed
    showTimer: boolean;
    allowBackNavigation: boolean;

    // Content Selection
    itemCount: number;
    difficultyMixin: { [level: number]: number }; // e.g. {1: 0, 2: 20, 3: 50, 4: 30, 5: 0} %
    domains: string[]; // ['All'] or specific
    questionTypes: string[]; // ['All'] or specific typeIds

    // NGN Specifics
    includeCaseStudies: boolean;
    cjmmFocus?: string;
}

export type ExamPresetName =
    | 'FULL_SIM'
    | 'MINI_QUIZ'
    | 'PEDS_DEEP'
    | 'PHARM_FOCUS'
    | 'CRIT_CARE'
    | 'CASE_ONLY'
    | 'SPEED_RUN'
    | 'FOUNDATION'
    | 'NGN_READY'
    | 'SPEED_RUN'
    | 'FOUNDATION'
    | 'NGN_READY'
    | 'NGN_BLUEPRINT'
    | 'FINAL_BOSS';

export const EXAM_PRESETS: Record<ExamPresetName, ExamConfiguration> = {
    FULL_SIM: {
        type: 'FULL',
        title: "Full NCLEX Simulation",
        timeLimitMinutes: 300, // 5 hrs
        showTimer: true,
        allowBackNavigation: false,
        itemCount: 150, // Max
        difficultyMixin: { 1: 10, 2: 20, 3: 40, 4: 20, 5: 10 },
        domains: ['All'],
        questionTypes: ['All'],
        includeCaseStudies: true
    },
    MINI_QUIZ: {
        type: 'MINI',
        title: "Quick 10-Question Quiz",
        timeLimitMinutes: null,
        showTimer: false,
        allowBackNavigation: true,
        itemCount: 10,
        difficultyMixin: { 1: 0, 2: 30, 3: 40, 4: 30, 5: 0 },
        domains: ['All'],
        questionTypes: ['All'],
        includeCaseStudies: false
    },
    PEDS_DEEP: {
        type: 'DOMAIN',
        title: "Pediatrics Deep Dive",
        timeLimitMinutes: null,
        showTimer: true,
        allowBackNavigation: true,
        itemCount: 30,
        difficultyMixin: { 1: 0, 2: 0, 3: 50, 4: 50, 5: 0 },
        domains: ['Pediatrics'],
        questionTypes: ['All'],
        includeCaseStudies: true
    },
    PHARM_FOCUS: {
        type: 'DOMAIN',
        title: "Pharmacology Focus",
        timeLimitMinutes: null,
        showTimer: true,
        allowBackNavigation: true,
        itemCount: 25,
        difficultyMixin: { 1: 0, 2: 0, 3: 40, 4: 40, 5: 20 },
        domains: ['Pharmacology'],
        questionTypes: ['All'],
        includeCaseStudies: true
    },
    CRIT_CARE: {
        type: 'DOMAIN',
        title: "Critical Care Challenge",
        timeLimitMinutes: 60,
        showTimer: true,
        allowBackNavigation: false,
        itemCount: 30,
        difficultyMixin: { 1: 0, 2: 0, 3: 10, 4: 60, 5: 30 },
        domains: ['Critical Care'],
        questionTypes: ['All'],
        includeCaseStudies: true
    },
    CASE_ONLY: {
        type: 'CJMM',
        title: "Case Studies Only",
        timeLimitMinutes: null,
        showTimer: false,
        allowBackNavigation: false,
        itemCount: 18, // 3 cases x 6 screens ? Or 18 items.
        difficultyMixin: { 1: 0, 2: 0, 3: 50, 4: 50, 5: 0 },
        domains: ['All'],
        questionTypes: ['case-study'],
        includeCaseStudies: true
    },
    SPEED_RUN: {
        type: 'SPEED',
        title: "Speed Challenge (60s)",
        timeLimitMinutes: 20, // 20 Q * 1 min
        showTimer: true,
        allowBackNavigation: false,
        itemCount: 20,
        difficultyMixin: { 1: 20, 2: 40, 3: 40, 4: 0, 5: 0 },
        domains: ['All'],
        questionTypes: ['multiple-choice', 'choice'],
        includeCaseStudies: false
    },
    FOUNDATION: {
        type: 'CUSTOM',
        title: "Foundation Check",
        timeLimitMinutes: null,
        showTimer: false,
        allowBackNavigation: true,
        itemCount: 15,
        difficultyMixin: { 1: 70, 2: 30, 3: 0, 4: 0, 5: 0 },
        domains: ['All'],
        questionTypes: ['All'],
        includeCaseStudies: false
    },
    NGN_BLUEPRINT: {
        type: 'CUSTOM', // Actually a special blueprint type, but reusing custom
        title: "NCLEX NGN Blueprint (Auto)",
        timeLimitMinutes: 150,
        showTimer: true,
        allowBackNavigation: false,
        itemCount: 85,
        difficultyMixin: { 1: 10, 2: 20, 3: 40, 4: 20, 5: 10 },
        domains: ['All'],
        questionTypes: ['All'],
        includeCaseStudies: true
    },
    NGN_READY: {
        type: 'CUSTOM',
        title: "NGN Readiness Check",
        timeLimitMinutes: 120,
        showTimer: true,
        allowBackNavigation: false,
        itemCount: 40,
        difficultyMixin: { 1: 0, 2: 10, 3: 40, 4: 40, 5: 10 },
        domains: ['All'],
        questionTypes: ['All'],
        includeCaseStudies: true
    },
    FINAL_BOSS: {
        type: 'FULL',
        title: "The Final Exam",
        timeLimitMinutes: 300,
        showTimer: true,
        allowBackNavigation: false,
        itemCount: 150,
        difficultyMixin: { 1: 0, 2: 0, 3: 20, 4: 50, 5: 30 },
        domains: ['All'],
        questionTypes: ['All'],
        includeCaseStudies: true
    }
};

export class CustomExamEngine {

    /**
     * Builds and validates the exam configuration, then triggers generation.
     */
    static async buildExam(config: ExamConfiguration): Promise<MasterQuestionItem[]> {

        // 1. Convert config Mixin to actual request params
        // Finding average difficulty for simple generation call
        // (In advanced version, we'd make multiple calls per bucket)
        let totalWeight = 0;
        let weightedSum = 0;
        Object.entries(config.difficultyMixin).forEach(([level, pct]) => {
            totalWeight += pct;
            weightedSum += (parseInt(level) * pct);
        });
        const avgDifficulty = Math.round(weightedSum / totalWeight) || 3;

        // 2. Prepare Types
        let types = config.questionTypes;
        if (types.includes('All')) {
            types = ['multiple-choice', 'multiple-response', 'matrix', 'ordered-response', 'bow-tie'];
            if (config.includeCaseStudies) types.push('case-study');
        }

        // 3. Prepare Domains
        const domains = config.domains.includes('All') ? ['General'] : config.domains;

        try {
            const items: MasterQuestionItem[] = [];

            // Generate items one by one to respect bank prioritization
            // In a real app, this should be a bulk API call or specialized service method
            for (let i = 0; i < config.itemCount; i++) {
                // Pick a domain if multiple are selected
                const domain = domains.length > 0 ? domains[Math.floor(Math.random() * domains.length)] : 'General';

                const item = await fetchNextQuestion({
                    targetDifficulty: avgDifficulty,
                    targetTypes: types,
                    excludedIds: items.map(x => x.id),
                    domain: domain,
                    allowAiFallback: true
                });

                if (item) {
                    items.push(item);
                } else {
                    console.warn(`Could not fetch enough items. Got ${items.length} of ${config.itemCount}`);
                    break;
                }
            }

            return items;

        } catch (e) {
            console.error("Exam Generation Failed", e);
            throw e;
        }
    }

    /**
     * Estimates duration string based on item count.
     */
    static estimateDuration(itemCount: number, includeCases: boolean): string {
        // Simple heuristic: 1.5 min per normal item, 3 min per valid case screen/item
        const avgTime = includeCases ? 2.0 : 1.5;
        const minutes = Math.round(itemCount * avgTime);

        if (minutes > 60) {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h} hr ${m} min`;
        }
        return `${minutes} min`;
    }

    /**
     * Logic for NGN Blueprint filtering.
     * 18-22% Management of Care
     * 9-15% Safety & Infection Control
     * 6-12% Health Promotion
     * 6-12% Psychosocial
     * 6-12% Basic Care
     * 12-18% Pharm
     * 9-15% Risk Reduction
     * 11-17% Physio Adaptation
     */
    static async generateBlueprintExam(count: number): Promise<MasterQuestionItem[]> {
        // Fallback for now - just uses general mix, but in future can be strict buckets.
        // For MVP, we simulated the "Auto Select" by just fetching 'All' domains in a balanced loop.
        const domains = [
            'Management of Care', 'Safety', 'Health Promotion', 'Psychosocial',
            'Basic Care', 'Pharmacology', 'Risk Reduction', 'Physiological Adaptation'
        ];

        const items: MasterQuestionItem[] = [];

        for (let i = 0; i < count; i++) {
            const domain = domains[i % domains.length]; // Round robin for even spread
            const item = await fetchNextQuestion({
                targetDifficulty: 3,
                domain: domain,
                allowAiFallback: true,
                excludedIds: items.map(x => x.id)
            });
            if (item) items.push(item);
        }

        return items;
    }
}
