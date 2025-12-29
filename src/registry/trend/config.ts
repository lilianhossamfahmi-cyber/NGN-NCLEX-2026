import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Trend Item Configuration
 */

// 1. Setup Tab Fields
const setupFields: FormField[] = [
    {
        key: 'metadata.title',
        label: 'Scenario Title',
        type: 'text',
        required: true,
        helpText: 'e.g., "Trend Analysis: Postoperative Hemodynamics"'
    },
    {
        key: 'metadata.clinicalFocus',
        label: 'Clinical Focus',
        type: 'array',
        arrayConfig: {
            itemSchema: [{ key: 'tag', label: 'Tag', type: 'text' }]
        }
    },
    {
        key: 'metadata.trendDirection',
        label: 'Trend Direction',
        type: 'select',
        options: [
            { label: 'Worsening', value: 'worsening' },
            { label: 'Improving', value: 'improving' },
            { label: 'Fluctuating', value: 'fluctuating' },
            { label: 'Plateauing', value: 'plateauing' }
        ]
    },
    {
        key: 'trendData.scenarioContext.en',
        label: 'Scenario Context',
        type: 'rich-text',
        helpText: 'Provide 1-2 sentences of clinical background...'
    },
    {
        key: 'trendData.timePoints',
        label: 'Time Points',
        type: 'array',
        helpText: 'Define 3-8 time points (e.g. 0800, 1200...)',
        arrayConfig: {
            itemSchema: [
                { key: 'timeLabel', label: 'Time Label', type: 'text', required: true },
                { key: 'isBaseline', label: 'Is Baseline?', type: 'checkbox' }
            ]
        }
    }
];

// 2. Data Entry Tab Fields
// This uses a custom component type designed for the Trend Grid matrix
const dataEntryFields: FormField[] = [
    {
        key: 'trendData',
        label: 'Trend Data Grid',
        type: 'custom',
        // In the real implementation, this generic 'custom' type would map to a Registry of Custom Components
        // specifically the 'TrendDataGrid' which handles the dynamic parameters vs time points matrix
        helpText: 'Edit parameter values across configured time points.'
    }
];

// 3. Response Options Tab
const responseFields: FormField[] = [
    {
        key: 'itemStem.en',
        label: 'Question Stem',
        type: 'text',
        required: true,
        helpText: 'e.g. "Which of the following best describes the client\'s current trend?"'
    },
    {
        key: 'responseOptions',
        label: 'Options',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'text.en', label: 'Option Text', type: 'rich-text' },
                { key: 'isCorrect', label: 'Is Correct?', type: 'checkbox' },
                {
                    key: 'distractorType',
                    label: 'Distractor Type',
                    type: 'select',
                    options: [
                        { label: 'N/A (Correct Answer)', value: 'none' },
                        { label: 'Single Data Point Focus', value: 'single_data_point_focus' },
                        { label: 'Trend Reversal', value: 'trend_reversal' },
                        { label: 'Normalization', value: 'normalization' },
                        { label: 'Over-Reaction', value: 'over_reaction' },
                        { label: 'Under-Reaction', value: 'under_reaction' }
                    ]
                },
                { key: 'rationale.en', label: 'Rationale', type: 'textarea' }
            ]
        }
    }
];

export const TrendConfig: QuestionTypeDefinition = {
    typeId: 'trend-standalone',
    typeName: 'Stand-Alone Trend Item',
    description: 'Analyze multi-point timelines of clinical parameters to identify improvement, deterioration, or stability.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'trend-standalone',
        initialContent: {
            itemId: '', // Generated on init
            itemType: 'trend',
            metadata: {
                title: { en: '' },
                clinicalFocus: [],
                population: {},
                trendDirection: 'worsening',
                status: 'draft'
            },
            trendData: {
                scenarioContext: { en: '' },
                timePoints: [
                    { timeLabel: '0800', isBaseline: true },
                    { timeLabel: '1200', isBaseline: false },
                    { timeLabel: '1600', isBaseline: false },
                    { timeLabel: '2000', isBaseline: false }
                ],
                parameters: [], // Will be populated by the Data Grid
                visualizationSettings: {
                    tableLayout: 'vertical_parameters',
                    showReferenceRanges: true,
                    showFlags: true
                }
            },
            itemStem: { en: '' },
            responseOptions: []
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Trend Configuration', fields: setupFields },
                { id: 'data', title: '2. Data Entry', fields: dataEntryFields },
                { id: 'options', title: '3. Responses', fields: responseFields },
                { id: 'preview', title: '4. Preview', fields: [] } // Preview is a read-only view
            ]
        },
        validation: {} // Zod schema placeholder
    }
};
