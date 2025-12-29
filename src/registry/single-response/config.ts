import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * NGN Single Response Item Configuration
 * 
 * DESIGN SPECIFICATION:
 * - Purpose: Assess specific clinical judgment using a rich-text Scenario/Exhibit and a single correct option.
 * - Structure: Stimulus -> Question Stem -> 4 Options (1 Correct).
 * - CJMM Alignment: Can target any phase found in standalone items (usually Recognize, Analyze, or Evaluate).
 */

// 1. Setup Tab
const setupFields: FormField[] = [
    {
        key: 'title',
        label: 'Item Title',
        type: 'text',
        helpText: 'e.g. "Screen 1 - Medication Administration"'
    },
    {
        key: 'clinicalFocus',
        label: 'Clinical Focus',
        type: 'text',
        required: true
    },
    {
        key: 'cjmmAlignment.phase',
        label: 'CJMM Phase',
        type: 'select',
        options: [
            { label: 'Recognize Cues', value: 'recognizeCues' },
            { label: 'Analyze Cues', value: 'analyzeCues' },
            { label: 'Prioritize Hypotheses', value: 'prioritizeHypotheses' },
            { label: 'Generate Solutions', value: 'generateSolutions' },
            { label: 'Take Actions', value: 'takeActions' },
            { label: 'Evaluate Outcomes', value: 'evaluateOutcomes' }
        ]
    },
    {
        key: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [{ label: 'Easy', value: 'easy' }, { label: 'Moderate', value: 'moderate' }, { label: 'Difficult', value: 'difficult' }]
    }
];

// 2. Stimulus (Shared with SATA/Case Study)
// NGN Single Response often relies on "Exhibits" or "Charts".
const stimulusFields: FormField[] = [
    {
        key: 'stimulus.type',
        label: 'Stimulus Type',
        type: 'select',
        options: [
            { label: 'Narrative Only', value: 'narrative' },
            { label: 'Chart/Exhibit', value: 'chart' },
            { label: 'Graphic', value: 'graphic' }
        ]
    },
    {
        key: 'stimulus.narrative',
        label: 'Scenario / Nurses Note',
        type: 'rich-text',
        helpText: 'The main clinical scenario text.'
    },
    {
        key: 'stimulus.tabs',
        label: 'Chart Exhibits',
        type: 'array',
        helpText: 'Optional tabs (e.g. Lab Results, H&P) available to the student.',
        arrayConfig: {
            itemSchema: [
                { key: 'tabTitle', label: 'Tab Title', type: 'text' },
                { key: 'content', label: 'Tab Content', type: 'rich-text' }
            ]
        }
    }
];

// 3. Question & Options
const questionFields: FormField[] = [
    {
        key: 'stem.text',
        label: 'Question Stem',
        type: 'rich-text',
        required: true,
        helpText: 'e.g. "Which action should the nurse take first?"'
    },
    {
        key: 'options',
        label: 'Answer Options',
        type: 'array',
        helpText: 'Exactly 4 options required. 1 must be correct.',
        arrayConfig: {
            itemSchema: [
                { key: 'text', label: 'Option Text', type: 'rich-text' },
                { key: 'isCorrect', label: 'Is Correct?', type: 'checkbox' },
                { key: 'rationale', label: 'Rationale', type: 'textarea' }
            ]
        }
    }
];

// 4. Review
const reviewFields: FormField[] = [
    {
        key: 'manualReview',
        label: 'Review Checklist',
        type: 'custom'
    },
    {
        key: 'aiReview',
        label: 'AI Analysis',
        type: 'custom'
    }
];

export const SingleResponseConfig: QuestionTypeDefinition = {
    typeId: 'single-response',
    typeName: 'Single Response (NGN)',
    description: 'Standard multiple choice (1 of 4) grounded in a clinical scenario or exhibit.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'single-response',
        initialContent: {
            title: '',
            clinicalFocus: '',
            cjmmAlignment: { phase: 'analyzeCues' },
            difficulty: 'moderate',
            stimulus: {
                type: 'narrative',
                narrative: '',
                tabs: []
            },
            stem: { text: '' },
            options: [
                { text: '', isCorrect: false, rationale: '' },
                { text: '', isCorrect: false, rationale: '' },
                { text: '', isCorrect: false, rationale: '' },
                { text: '', isCorrect: false, rationale: '' }
            ],
            manualReview: {},
            aiReview: {}
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Setup', fields: setupFields },
                { id: 'stimulus', title: '2. Scenario/Exhibits', fields: stimulusFields },
                { id: 'question', title: '3. Question & Options', fields: questionFields },
                { id: 'preview', title: '4. Preview', fields: [] },
                { id: 'review', title: '5. Review', fields: reviewFields }
            ]
        },
        validation: {}
    }
};
