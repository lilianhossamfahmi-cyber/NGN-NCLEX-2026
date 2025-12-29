import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Cloze/Drag-Word Item Configuration
 * Mapped from "Prompt 6: Cloze/Drag-Word Sentence-Completion Item-Creator"
 */

// 1. Setup Tab
const setupFields: FormField[] = [
    {
        key: 'cloze.title.prefix',
        label: 'Title Prefix',
        type: 'text',
        helpText: 'e.g. "Case Study Screen X of Y"'
    },
    {
        key: 'cloze.taskPrompt.en',
        label: 'Task Prompt (EN)',
        type: 'rich-text',
        required: true,
        helpText: 'e.g. "Complete the following sentences by choosing from the lists of options."'
    },
    {
        key: 'cjmmPhasePrimary',
        label: 'Primary CJMM Phase',
        type: 'select',
        options: [
            { label: 'Prioritize Hypotheses', value: 'prioritizeHypotheses' },
            { label: 'Take Actions', value: 'takeActions' }
        ]
    }
];

// 2. Source Ingestion
// In a real app, this would be the specialized "IngestionController", 
// but we define the backing storage fields here.
const ingestionFields: FormField[] = [
    {
        key: 'sourceProvenance.sourceType',
        label: 'Source Type',
        type: 'select',
        options: [
            { label: 'Manual Entry', value: 'manual' },
            { label: 'AI Generated', value: 'aiGenerated' },
            { label: 'PDF Upload', value: 'uploadPdf' }
        ]
    }
];

// 3. Clinical Context
const clinicalContextFields: FormField[] = [
    {
        key: 'nursesNotes.timestamp',
        label: 'Timestamp',
        type: 'date-time'
    },
    {
        key: 'nursesNotes.text',
        label: 'Nurses Notes Content',
        type: 'rich-text',
        helpText: 'Client report, assessments, etc.'
    },
    {
        key: 'vitalSigns',
        label: 'Vital Signs Table',
        type: 'custom', // 'VITAL_SIGNS_EDITOR'
    },
    {
        key: 'labResults',
        label: 'Lab Results Table',
        type: 'custom', // 'LAB_RESULTS_EDITOR'
    }
];

// 4. Sentence Builder (The Core Cloze Interaction)
const comparisonFields: FormField[] = [
    {
        key: 'cloze.sentences',
        label: 'Sentence Builder',
        type: 'array',
        helpText: 'Define up to 3 sentences with embedded tokens.',
        arrayConfig: {
            itemSchema: [
                { key: 'sentenceId', label: 'ID', type: 'text' }, // S1, S2
                {
                    key: 'template.en',
                    label: 'Sentence Template',
                    type: 'rich-text',
                    helpText: 'Use [Select...] to insert a dropdown token.'
                },
                {
                    key: 'dropdowns',
                    label: 'Dropdown Configurations',
                    type: 'array',
                    arrayConfig: {
                        itemSchema: [
                            { key: 'dropdownId', label: 'Dropdown ID', type: 'text' },
                            {
                                key: 'options',
                                label: 'Options',
                                type: 'array',
                                arrayConfig: {
                                    itemSchema: [
                                        { key: 'text.en', label: 'Option Text', type: 'text' },
                                        { key: 'correct', label: 'Is Correct?', type: 'checkbox' },
                                        { key: 'clinicalRationale', label: 'Rationale', type: 'text' }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }
    }
];

// 5. Review
const reviewFields: FormField[] = [
    {
        key: 'manualReview',
        label: 'Manual Checklist',
        type: 'custom' // 'REVIEW_CHECKLIST'
    },
    {
        key: 'aiReview',
        label: 'AI Feedback',
        type: 'custom' // 'AI_REPORT_VIEWER'
    }
];


export const ClozeConfig: QuestionTypeDefinition = {
    typeId: 'cloze-dropdown',
    typeName: 'Cloze (Drag-Word / Drop-Down)',
    description: 'Complete 2-3 sentences by selecting or dragging options to fill blanks.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'cloze-dropdown',
        initialContent: {
            itemId: '',
            itemType: 'cloze',
            status: 'draft',
            cjmmPhasePrimary: 'prioritizeHypotheses',
            sourceProvenance: { sourceType: 'manual' },
            cloze: {
                title: { prefix: 'Case Study Screen X of Y' },
                taskPrompt: { en: 'Complete the following sentences by choosing from the lists of options.' },
                sentences: []
            },
            nursesNotes: { timestamp: '', text: '' },
            vitalSigns: [],
            manualReview: {},
            aiReview: {}
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Setup & Ingestion', fields: [...setupFields, ...ingestionFields] },
                { id: 'context', title: '2. Clinical Context', fields: clinicalContextFields },
                { id: 'sentences', title: '3. Sentence Builder', fields: comparisonFields },
                { id: 'preview', title: '4. Preview', fields: [] },
                { id: 'review', title: '5. Review', fields: reviewFields }
            ]
        },
        validation: {}
    }
};
