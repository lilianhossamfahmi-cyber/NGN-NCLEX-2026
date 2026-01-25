/**
 * Mock Data for Testing Rationale Flow
 */

import type { FullItemData, QuestionConfig, CanonicalRationale } from '@/types';

export const mockRationale: CanonicalRationale = {
    referenceInfo: {
        anatomy: 'The thalamus is the central relay station for sensory information. Key structures: Anterior, Medial, Lateral, and Intralaminar nuclei.',
        physiology: 'Thalamic relay involves specific neurotransmitter systems. GABA inhibition from reticular nucleus modulates relay to cortex.',
        pharm: 'Thalamic lesions can cause sensory loss on opposite body side. Management focuses on vascular stabilization.',
    },
    difficulty: {
        level: 3,
        score: 65,
        label: 'MODERATE',
        subtext: 'Requires integration of anatomical knowledge and clinical findings.',
        clinicalStrategy: 'Recognize classic thalamic syndrome presentation (sensory loss + pain/temperature dysesthesia)',
        recommendedActions: [
            'Assess for contralateral sensory deficits',
            'Monitor for neurovascular changes',
            'Differentiate from spinal cord involvement'
        ],
    },
    mnemonic: {
        title: 'THALAMUS',
        content: 'T-H-A-L-A-M-U-S',
        explanation: 'Transmits sensory information; Helps relay motor information; Active in consciousness regulation.',
    },
    cheatSheet: {
        title: 'Thalamus Quick Reference',
        points: [
            'Anterior: emotional processing | Medial: cognitive | Lateral: relay station',
            'Vascular Supply: PCA branches',
            'Pattern: Contralateral sensory loss + burning pain (Dejerine-Roussy)'
        ],
    },
};

export const mockQuestion: QuestionConfig = {
    id: 'test-q-thalamus-001',
    type: 'BowTie',
    content: {
        prompt: 'A 67-year-old man with hypertension presents with acute onset left-sided sensory loss and burning pain. Imaging shows right thalamic infarction.',
        rationale: mockRationale,
    },
};

export const mockFullItem: FullItemData = {
    id: 'test-q-thalamus-001',
    type: 'BowTie',
    content: {
        prompt: 'A 67-year-old man with hypertension presents with acute onset left-sided sensory loss and burning pain. Imaging shows right thalamic infarction.',
        rationale: mockRationale,
    },
};
