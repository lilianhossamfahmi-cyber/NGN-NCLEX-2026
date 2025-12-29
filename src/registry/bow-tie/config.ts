import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Bow-Tie Item Configuration
 * Mapped from "Prompt 3: Standalone Bow-Tie Engine"
 */

// 1. Setup Tab (Screen 1)
const setupFields: FormField[] = [
    {
        key: 'itemHeader.metadata.title',
        label: 'Title',
        type: 'text',
        required: true,
        helpText: 'e.g., "[Standalone Bow-Tie] - Linking Diagnosis to Care"'
    },
    {
        key: 'clinicalFocus.systemCategory',
        label: 'System Category',
        type: 'select',
        options: [
            { label: 'Cardiovascular', value: 'cardiovascular' },
            { label: 'Respiratory', value: 'respiratory' },
            { label: 'Neurological', value: 'neuro' },
            { label: 'Gastrointestinal', value: 'GI' },
            { label: 'Genitourinary', value: 'GU' },
            // ... others
            { label: 'Multisystem', value: 'multisystem' }
        ]
    },
    {
        key: 'clinicalFocus.patientPopulation.ageGroup',
        label: 'Age Group',
        type: 'select',
        options: [
            { label: 'Adult', value: 'adult' },
            { label: 'Older Adult', value: 'olderAdult' },
            { label: 'Pediatric', value: 'pediatric' }
        ]
    },
    {
        key: 'clinicalFocus.cjmmAlignment.primaryPhase',
        label: 'Primary CJMM Phase',
        type: 'select',
        options: [
            { label: 'Recognize Cues', value: 'recognizeCues' },
            { label: 'Analyze Cues', value: 'analyzeCues' },
            { label: 'Prioritize Hypotheses', value: 'prioritizeHypotheses' },
            { label: 'Generate Solutions', value: 'generateSolutions' },
            { label: 'Take Actions', value: 'takeActions' }
        ]
    },
    {
        key: 'clinicalFocus.difficultyLevel',
        label: 'Difficulty',
        type: 'select',
        options: [
            { label: 'Easy', value: 'easy' },
            { label: 'Moderate', value: 'moderate' },
            { label: 'Difficult', value: 'difficult' }
        ]
    }
];

// 2. Clinical Data (Screen 2)
const clinicalDataFields: FormField[] = [
    {
        key: 'contentBlocks.vignette.narrative',
        label: 'Clinical Vignette',
        type: 'rich-text',
        helpText: '2-3 sentences. Do NOT name the condition explicitly.'
    },
    {
        key: 'contentBlocks.vignette.nursesNotes',
        label: 'Nurses Notes',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'timestamp', label: 'Time', type: 'text' },
                { key: 'noteText', label: 'Note', type: 'rich-text' },
                { key: 'bodySystemFindings.system', label: 'System', type: 'text' }
            ]
        }
    },
    {
        key: 'contentBlocks.vignette.vitalSigns.readings',
        label: 'Vital Signs Table',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'timestamp', label: 'Time', type: 'text' },
                { key: 'temperature', label: 'Temp', type: 'text' },
                { key: 'pulse', label: 'Pulse', type: 'text' },
                { key: 'respirations', label: 'RR', type: 'text' },
                { key: 'bloodPressure', label: 'BP', type: 'text' }
            ]
        }
    }
];

// 3. Bow-Tie Configuration (Screen 3)
const bowTieConfigFields: FormField[] = [
    {
        key: 'bowTieConfiguration.diagramLayout.orientation',
        label: 'Diagram Orientation',
        type: 'select',
        options: [{ label: 'Horizontal', value: 'horizontal' }, { label: 'Vertical', value: 'vertical' }]
    },
    {
        key: 'bowTieConfiguration',
        label: 'Bow-Tie Diagram Builder',
        type: 'custom',
        // This 'custom' type maps to a specialized React component 'BOW_TIE_BUILDER'
        // dealing with the Condition (Center), Actions (Left/Right), Parameters (Left/Right)
        helpText: 'Drag and drop options to define Correct Answers vs Distractors.'
    },
    {
        key: 'bowTieConfiguration.conditionOptions',
        label: 'Condition Options (Detailed)',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'text', label: 'Diagnosis', type: 'text' },
                { key: 'isCorrect', label: 'Is Correct?', type: 'checkbox' },
                { key: 'rationale', label: 'Rationale', type: 'textarea' }
            ]
        }
    },
    {
        key: 'bowTieConfiguration.actionOptions',
        label: 'Action Options (Detailed)',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'text', label: 'Action', type: 'text' },
                { key: 'isCorrect', label: 'Is Target?', type: 'checkbox' },
                { key: 'priorityLevel', label: 'Priority', type: 'select', options: [{ label: 'Immediate', value: 'immediate' }, { label: 'Routine', value: 'routine' }] }
            ]
        }
    },
    // Parameters would follow similar pattern
];

// 4. Review
const reviewFields: FormField[] = [
    {
        key: 'reviewData.aiReview',
        label: 'AI Review Report',
        type: 'custom', // 'AI_REPORT_VIEWER'
        helpText: 'Clarity Score, Warnings, and Suggested Edits'
    },
    {
        key: 'reviewData.manualReview.contentExpert.comments',
        label: 'Content Expert Comments',
        type: 'array',
        arrayConfig: {
            itemSchema: [{ key: 'comment', label: 'Comment', type: 'text' }]
        }
    }
];

export const BowTieConfig: QuestionTypeDefinition = {
    typeId: 'bow-tie',
    typeName: 'Standalone Bow-Tie',
    description: 'Single-screen item to Link Diagnosis (Condition) to Actions and Monitoring Parameters.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'bow-tie',
        initialContent: {
            itemHeader: {
                itemType: 'standaloneBowTie',
                status: 'draft',
                metadata: { title: '' }
            },
            clinicalFocus: {
                systemCategory: 'cardiovascular',
                patientPopulation: { ageGroup: 'adult' },
                cjmmAlignment: {},
                difficultyLevel: 'moderate'
            },
            contentBlocks: {
                title: { text: '', language: 'en' },
                vignette: {
                    narrative: '',
                    nursesNotes: [],
                    vitalSigns: { displayFormat: 'TABLE', readings: [] }
                }
            },
            bowTieConfiguration: {
                diagramLayout: { orientation: 'horizontal' },
                conditionOptions: [],
                actionOptions: [],
                parameterOptions: [],
                selectionRules: {
                    conditionSelections: { min: 1, max: 1 },
                    actionSelections: { min: 2, max: 2 },
                    parameterSelections: { min: 2, max: 2 }
                }
            },
            reviewData: {
                manualReview: {},
                aiReview: {}
            }
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Quick Start', fields: setupFields },
                { id: 'vignette', title: '2. Clinical Data', fields: clinicalDataFields },
                { id: 'bowtie', title: '3. Diagram & Answers', fields: bowTieConfigFields },
                { id: 'review', title: '4. Review & Validate', fields: reviewFields }
            ]
        },
        validation: {}
    }
};
