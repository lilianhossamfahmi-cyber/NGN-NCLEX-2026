import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Multiple Response (SATA) Item Configuration
 * Mapped from "Prompt 7: SATA Item-Creator Engine"
 */

// 1. Setup Tab (Screen 2)
const setupFields: FormField[] = [
    {
        key: 'title',
        label: 'Item Title',
        type: 'text',
        helpText: 'e.g. "[Case Study Screen 3 of 6]"'
    },
    {
        key: 'clinicalFocus',
        label: 'Clinical Focus',
        type: 'array',
        arrayConfig: {
            itemSchema: [{ key: 'topic', label: 'Topic', type: 'text' }]
        }
    },
    {
        key: 'population.ageGroup',
        label: 'Age Group',
        type: 'select',
        options: [
            { label: 'Neonate', value: 'neonate' },
            { label: 'Pediatric', value: 'pediatric' },
            { label: 'Adult', value: 'adult' },
            { label: 'Geriatric', value: 'geriatric' }
        ]
    },
    {
        key: 'cjmmAlignment.primaryPhase',
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

// 2. Stimulus Content Screen
const stimulusFields: FormField[] = [
    {
        key: 'stimulus.narrative',
        label: 'Clinical Narrative',
        type: 'rich-text'
    },
    {
        key: 'stimulus.nursesNotes',
        label: 'Nurses Notes',
        type: 'rich-text'
    },
    {
        key: 'stimulus.vitalSigns',
        label: 'Vital Signs',
        type: 'custom', // 'VITAL_SIGNS_EDITOR' reused
    },
    {
        key: 'stimulus.labResults',
        label: 'Lab Results',
        type: 'custom', // 'LAB_RESULTS_EDITOR' reused
    }
];

// 3. SATA Task & Options Builder (Screen 3)
const sataBuilderFields: FormField[] = [
    {
        key: 'stem.promptText',
        label: 'Question Stem',
        type: 'rich-text',
        helpText: 'e.g. "Which of the following require immediate follow-up? Select all that apply."'
    },
    {
        key: 'sataOptions',
        label: 'Response Options',
        type: 'array',
        helpText: 'Define 5-8 options. 2-4 should be correct.',
        arrayConfig: {
            itemSchema: [
                { key: 'text', label: 'Option Text', type: 'rich-text' },
                { key: 'isCorrect', label: 'Correct?', type: 'checkbox' },
                {
                    key: 'distractorType',
                    label: 'Distractor Type',
                    type: 'select',
                    options: [
                        { label: 'N/A (Correct)', value: 'none' },
                        { label: 'Clinically Relevant but Not Optimal', value: 'clinicallyRelevantButNotOptimal' },
                        { label: 'Common Mistake', value: 'commonMistake' },
                        { label: 'True but Not Addressing Question', value: 'trueButNotAddressingQuestion' },
                        { label: 'Opposite of Correct', value: 'oppositeOfCorrect' }
                    ]
                },
                { key: 'rationale', label: 'Rationale', type: 'textarea' }
            ]
        }
    },
    {
        key: 'sataConfiguration.optionGrouping',
        label: 'Visual Grouping',
        type: 'select',
        options: [
            { label: 'None', value: 'none' },
            { label: 'System Based', value: 'systemBased' },
            { label: 'Priority Based', value: 'priorityBased' }
        ]
    }
];

// 4. Review (Screen 4-5)
const reviewFields: FormField[] = [
    {
        key: 'manualReview',
        label: 'Manual Review Checklist',
        type: 'custom' // 'REVIEW_CHECKLIST'
    },
    {
        key: 'aiReview',
        label: 'AI Check Results',
        type: 'custom' // 'AI_REPORT_VIEWER'
    }
];

export const SATAConfig: QuestionTypeDefinition = {
    typeId: 'multiple-response-sata',
    typeName: 'Multiple Response (SATA)',
    description: 'Select All That Apply standard NGN item.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'multiple-response-sata',
        initialContent: {
            type: 'sata',
            status: 'draft',
            title: '[Case Study Screen X of Y]',
            clinicalFocus: [],
            population: { ageGroup: 'adult' },
            cjmmAlignment: { primaryPhase: 'recognizeCues' },
            difficulty: 'moderate',
            stimulus: {
                narrative: '',
                nursesNotes: '',
                vitalSigns: [],
                labResults: [],
                bodySystemFindings: []
            },
            stem: {
                promptText: 'Which of the following... Select all that apply.',
                format: 'sata'
            },
            sataOptions: [],
            sataConfiguration: { totalOptions: 5, correctOptionsCount: 2, partialCreditAllowed: false, optionGrouping: 'none' },
            manualReview: {},
            aiReview: {}
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Pedagogical Setup', fields: setupFields },
                { id: 'stimulus', title: '2. Stimulus Content', fields: stimulusFields },
                { id: 'options', title: '3. Task & Options', fields: sataBuilderFields },
                { id: 'preview', title: '4. Preview', fields: [] },
                { id: 'review', title: '5. Review & QA', fields: reviewFields }
            ]
        },
        validation: {}
    }
};
