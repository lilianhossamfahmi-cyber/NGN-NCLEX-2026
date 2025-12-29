import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Matrix Multiple Response (Matrix MR) Configuration
 * Mapped from "Prompt 4: Matrix MR NGN Item Specification"
 */

// 1. Setup Tab (Screen 1)
const setupFields: FormField[] = [
    {
        key: 'coreMetadata.title',
        label: 'Item Title',
        type: 'text',
        required: true,
        helpText: 'Max 120 chars (e.g., "Screen 2 of 6 - Analyze Cues")'
    },
    {
        key: 'coreMetadata.clinicalFocus',
        label: 'Clinical Focus',
        type: 'textarea',
        required: true,
        helpText: 'Brief statement of clinical concept being tested'
    },
    {
        key: 'coreMetadata.difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Difficult', value: 'difficult' }
        ]
    },
    {
        key: 'coreMetadata.overlapPattern',
        label: 'Overlap Pattern',
        type: 'select',
        options: [
            { label: 'Low (Maps to 1)', value: 'low' },
            { label: 'Moderate (Maps to 2+)', value: 'moderate' },
            { label: 'High (All/Complex)', value: 'high' }
        ]
    },
    {
        key: 'coreMetadata.primaryCJMMPhase',
        label: 'Primary CJMM Phase',
        type: 'select',
        options: [
            { label: 'Recognize Cues', value: 'recognizeCues' },
            { label: 'Analyze Cues', value: 'analyzeCues' } // Prompt default
        ]
    },
    // Source Input Section would be a custom "Ingestion" component in the real app, 
    // here we stick to the config fields that store the result.
    {
        key: 'sourceMetadata.origin',
        label: 'Source Origin',
        type: 'select',
        options: [
            { label: 'Manual', value: 'manual' },
            { label: 'AI Generated', value: 'aiGenerated' },
            { label: 'PDF Import', value: 'pdfImport' }
        ]
    }
];

// 2. Clinical Context Editor (Screen 2)
const clinicalContextFields: FormField[] = [
    {
        key: 'clinicalContext.stem',
        label: 'Scenario Stem',
        type: 'rich-text',
        helpText: '1-3 sentence scenario introduction'
    },
    {
        key: 'clinicalContext.nursesNotes',
        label: 'Nurses Notes',
        type: 'custom', // 'NURSES_NOTE_BUILDER'
        helpText: 'Timestamped clinical narrative'
    },
    {
        key: 'clinicalContext.vitalSigns',
        label: 'Vital Signs',
        type: 'custom', // 'VITAL_SIGNS_GRID'
        helpText: 'Temp, Pulse, RR, BP, SpO2'
    },
    {
        key: 'clinicalContext.assessmentFindings',
        label: 'Additional Findings',
        type: 'array',
        arrayConfig: {
            itemSchema: [{ key: 'finding', label: 'Finding', type: 'text' }]
        }
    }
];

// 3. Matrix Builder (Screen 3)
const matrixBuilderFields: FormField[] = [
    {
        key: 'matrixStructure',
        label: 'Matrix Configuration',
        type: 'custom', // 'MATRIX_MR_BUILDER'
        helpText: 'Define Columns (Condition) and Rows (Findings) and their correct mappings.'
    },
    // Backing fields if the builder populates them directly, explicit here for schema:
    {
        key: 'matrixStructure.columns',
        label: 'Columns Definition',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'conditionText', label: 'Condition Name', type: 'text', required: true },
                { key: 'requiresAtLeastOne', label: 'Requires At Least One?', type: 'checkbox' }
            ]
        }
    },
    {
        key: 'matrixStructure.rows',
        label: 'Rows Definition',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'findingText', label: 'Finding', type: 'text', required: true },
                { key: 'rationale', label: 'Rationale', type: 'textarea' },
                // correctMappings is a flexible object, usually handled by change events in the custom builder
            ]
        }
    },
    {
        key: 'matrixStructure.scoring.scoringMethod',
        label: 'Scoring Method',
        type: 'select',
        options: [
            { label: 'Partial Credit (By Row)', value: 'partialByRow' },
            { label: 'Partial Credit (By Cell)', value: 'partialByCell' },
            { label: 'All or Nothing', value: 'allOrNothing' }
        ]
    }
];

// 5. Review & QA (Screen 5)
const reviewFields: FormField[] = [
    {
        key: 'reviewWorkflow.manualReview',
        label: 'Manual Review Checklist',
        type: 'custom', // 'REVIEW_CHECKLIST'
        helpText: 'Clinical Accuracy, Technical Validation, etc.'
    },
    {
        key: 'reviewWorkflow.aiReview',
        label: 'AI Review Results',
        type: 'custom' // 'AI_REPORT_VIEWER'
    }
];

export const MatrixMRConfig: QuestionTypeDefinition = {
    typeId: 'matrix-multiple-response',
    typeName: 'Matrix Multiple Response',
    description: 'Map assessment findings (rows) to multiple disease processes or conditions (columns).',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'matrix-multiple-response',
        initialContent: {
            matrixMRItem: {
                itemType: 'matrixMR',
                status: 'draft',
                coreMetadata: {
                    difficulty: 'moderate',
                    overlapPattern: 'moderate',
                    primaryCJMMPhase: 'analyzeCues'
                },
                clinicalContext: {
                    stem: '',
                    nursesNotes: {},
                    vitalSigns: {},
                    assessmentFindings: []
                },
                matrixStructure: {
                    columns: [
                        { columnId: 'c1', columnNumber: 1, conditionText: '' },
                        { columnId: 'c2', columnNumber: 2, conditionText: '' },
                        { columnId: 'c3', columnNumber: 3, conditionText: '' }
                    ],
                    rows: [],
                    scoring: { scoringMethod: 'partialByRow' }
                },
                reviewWorkflow: {
                    manualReview: {},
                    aiReview: {}
                }
            }
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Setup & Ingestion', fields: setupFields },
                { id: 'context', title: '2. Clinical Context', fields: clinicalContextFields },
                { id: 'matrix', title: '3. Matrix Builder', fields: matrixBuilderFields },
                { id: 'preview', title: '4. Preview', fields: [] },
                { id: 'review', title: '5. Review & QA', fields: reviewFields }
            ]
        },
        validation: {}
    }
};
