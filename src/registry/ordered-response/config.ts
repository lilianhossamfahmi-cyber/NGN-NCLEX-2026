import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Ordered Response (Drag-And-Drop) Item Configuration
 * NGN Type: Ranking / Ordered Response
 */

// 1. Setup Tab
const setupFields: FormField[] = [
    {
        key: 'title',
        label: 'Item Title',
        type: 'text',
        helpText: 'e.g. "Steps for Foley Catheter Insertion"'
    },
    {
        key: 'clinicalFocus',
        label: 'Clinical Focus',
        type: 'array',
        arrayConfig: { itemSchema: [{ key: 'topic', label: 'Topic', type: 'text' }] }
    },
    {
        key: 'difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [{ label: 'Easy', value: 'easy' }, { label: 'Moderate', value: 'moderate' }, { label: 'Difficult', value: 'difficult' }]
    }
];

// 2. Stimulus Content
const stimulusFields: FormField[] = [
    {
        key: 'stimulus.prompt',
        label: 'Question Prompt',
        type: 'rich-text',
        required: true,
        helpText: 'e.g. "Drag the steps below into the correct order."'
    },
    {
        key: 'stimulus.narrative',
        label: 'Context/Scenario (Optional)',
        type: 'rich-text'
    }
];

// 3. Ordered Options Builder
const interactionFields: FormField[] = [
    {
        key: 'orderedOptions',
        label: 'Ordered Steps',
        type: 'array',
        helpText: 'Add the steps in the CORRECT order (1 to N). They will be shuffled for the student.',
        arrayConfig: {
            itemSchema: [
                { key: 'text', label: 'Step Text', type: 'text' },
                { key: 'rationale', label: 'Rationale', type: 'text', helpText: 'Explanation for this step\'s position.' }
            ]
        }
    }
];

// 4. Review
const reviewFields: FormField[] = [
    { key: 'manualReview', label: 'Manual Review', type: 'custom' },
    { key: 'aiReview', label: 'AI Review', type: 'custom' }
];

export const OrderedResponseConfig: QuestionTypeDefinition = {
    typeId: 'drag-drop-ordered',
    typeName: 'Drag-and-Drop Ordered Response',
    description: 'Rank a list of options in the correct order (e.g., procedural steps).',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'drag-drop-ordered',
        initialContent: {
            type: 'ordered-response',
            status: 'draft',
            title: '',
            stimulus: { prompt: 'Drag the following steps into the correct order.', narrative: '' },
            orderedOptions: [], // Array of { id, text, rationale }
            manualReview: {},
            aiReview: {}
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Setup', fields: setupFields },
                { id: 'content', title: '2. Content', fields: stimulusFields },
                { id: 'steps', title: '3. Define Order', fields: interactionFields },
                { id: 'preview', title: '4. Preview', fields: [] },
                { id: 'review', title: '5. Review', fields: reviewFields }
            ]
        },
        validation: {}
    }
};
