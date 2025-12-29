import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Highlight Text Item Configuration
 * Mapped from "Prompt 5: Highlight Text Technical Specification"
 */

// 1. Setup Tab (Screen 1)
const setupFields: FormField[] = [
    {
        key: 'metadata.title',
        label: 'Item Title',
        type: 'text',
        required: true,
        helpText: 'Appears at top of item. Include setting and focus.'
    },
    {
        key: 'metadata.clinicalFocus',
        label: 'Clinical Focus',
        type: 'text',
        required: true,
        helpText: 'e.g., Post-op complications, Sepsis recognition'
    },
    {
        key: 'metadata.targetPopulation.ageRange',
        label: 'Age Range',
        type: 'text',
        required: true
    },
    {
        key: 'metadata.targetPopulation.clinicalSetting',
        label: 'Clinical Setting',
        type: 'text',
        required: true
    },
    {
        key: 'metadata.difficultyLevel',
        label: 'Difficulty',
        type: 'select',
        options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Difficult', value: 'difficult' }
        ]
    },
    {
        key: 'metadata.learningObjectives',
        label: 'Learning Objectives',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'code', label: 'Code', type: 'text' },
                { key: 'description', label: 'Description', type: 'text' }
            ]
        }
    }
];

// 2. Passage Construction (Screen 2)
const passageFields: FormField[] = [
    {
        key: 'content.ingestion',
        label: 'Ingestion Source',
        type: 'custom', // 'INGESTION_CONTROLLER'
        helpText: 'Manual / PDF / AI Draft'
    },
    {
        key: 'content.passageTitle.en',
        label: 'Passage Heading',
        type: 'text'
    },
    {
        key: 'content.passageText.en',
        label: 'Passage Text',
        type: 'rich-text',
        helpText: 'Enter specific narrative text here.'
    },
    {
        key: 'content.segments',
        label: 'Highlighter Segments',
        type: 'custom', // 'HIGHLIGHT_SEGMENTER'
        helpText: 'Select text to create segments. Classify as Significant/Insignificant.',
        // The backing data structure
        arrayConfig: {
            itemSchema: [
                { key: 'text', label: 'Segment Text', type: 'text' },
                { key: 'classification', label: 'Class', type: 'select', options: [{ label: 'Significant', value: 'significant' }, { label: 'Insignificant', value: 'insignificant' }] },
                { key: 'rationale.en', label: 'Rationale', type: 'textarea' },
                { key: 'startIndex', label: 'Start', type: 'number' },
                { key: 'endIndex', label: 'End', type: 'number' }
            ]
        }
    }
];

// 3. Task Prompt & Scoring (Screen 3)
const taskScoringFields: FormField[] = [
    {
        key: 'content.taskPrompt.en',
        label: 'Task Prompt',
        type: 'select',
        options: [
            { label: 'Highlight findings requiring follow-up', value: 'Click to highlight the findings below that would require follow-up.' },
            { label: 'Highlight findings indicating worsening status', value: 'Click to highlight the findings below that indicate a worsening of the client\'s status.' },
            { label: 'Highlight abnormal/significant findings', value: 'Click to highlight the findings below that are abnormal or significant.' },
            { label: 'Highlight immediate intervention findings', value: 'Click to highlight the assessment findings that require immediate nursing intervention.' }
        ]
    },
    {
        key: 'content.scoring.method',
        label: 'Scoring Method',
        type: 'select',
        options: [
            { label: 'All or Nothing', value: 'allOrNothing' },
            { label: 'Partial Credit', value: 'partialCredit' },
            { label: 'Differential Scoring', value: 'differentialScoring' }
        ]
    },
    {
        key: 'content.scoring.pointsPerSignificantFinding',
        label: 'Points per Significant',
        type: 'number'
    },
    {
        key: 'content.scoring.penaltyPerInsignificantFinding',
        label: 'Penalty per Insignificant',
        type: 'number'
    },
    {
        key: 'content.highlightConstraints.minimumHighlights',
        label: 'Minimum Highlights',
        type: 'number'
    },
    {
        key: 'content.highlightConstraints.maximumHighlights',
        label: 'Maximum Highlights',
        type: 'number'
    }
];

// 4. Review
const reviewFields: FormField[] = [
    {
        key: 'reviewState.manualReview',
        label: 'Review Checklist',
        type: 'custom' // 'REVIEW_CHECKLIST'
    },
    {
        key: 'reviewState.aiReview',
        label: 'AI Analysis',
        type: 'custom' // 'AI_REPORT_VIEWER'
    }
];


export const HighlightConfig: QuestionTypeDefinition = {
    typeId: 'highlight',
    typeName: 'Highlight Text',
    description: 'Identify clinically significant findings within a narrative passage by clicking/highlighting.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'highlight',
        initialContent: {
            itemType: 'highlightText',
            metadata: {
                title: '',
                clinicalFocus: '',
                targetPopulation: { ageRange: '', clinicalSetting: '' },
                difficultyLevel: 'moderate',
                learningObjectives: [],
                cjmmAlignment: { primaryPhase: 'recognizeCues' },
                status: 'draft'
            },
            content: {
                quickStart: { summary: '' },
                clinicalData: { history: '', historyPhysical: '', vitals: [], labs: '', orders: '', radiology: '' },
                structure: {
                    taskPrompt: 'Click to highlight the findings below that would require follow-up.',
                    passageTitle: '',
                    passageText: '',
                    segments: [],
                    highlightConstraints: { minimumHighlights: 3, allowPartialHighlight: false },
                    scoring: { method: 'partialCredit', pointsPerSignificantFinding: 1, penaltyPerInsignificantFinding: 0.5 }
                }
            },
            reviewState: {
                manualReview: {},
                aiReview: {}
            }
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Metadata & Setup', fields: setupFields },
                { id: 'passage', title: '2. Passage & Segments', fields: passageFields },
                { id: 'scoring', title: '3. Task & Scoring', fields: taskScoringFields },
                { id: 'preview', title: '4. Preview', fields: [] },
                { id: 'review', title: '5. Review', fields: reviewFields }
            ]
        },
        validation: {}
    }
};
