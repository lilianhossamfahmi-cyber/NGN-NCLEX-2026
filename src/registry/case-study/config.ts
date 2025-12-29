import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

const setupFields: FormField[] = [
    { key: 'scenarioTitle', label: 'Scenario Title', type: 'text', required: true, helpText: 'Brief title for internal tracking' },
    {
        key: 'pedagogy.clinicalFocus',
        label: 'Clinical Focus',
        type: 'select', // In reality multiselect
        options: [
            { label: 'Sepsis', value: 'sepsis' },
            { label: 'COPD', value: 'copd' },
            { label: 'Myocardial Infarction', value: 'mi' }
        ]
    },
    { key: 'pedagogy.population.age', label: 'Patient Age', type: 'text' },
    {
        key: 'pedagogy.difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [{ label: 'Easy', value: 'easy' }, { label: 'Moderate', value: 'moderate' }, { label: 'Difficult', value: 'difficult' }]
    }
];

const screen1Fields: FormField[] = [
    { key: 'screens[0].timestamp', label: 'Timestamp', type: 'date-time', helpText: '24-hr format (e.g. 1100)' },
    { key: 'screens[0].nursesNotes.text', label: 'Nurses Notes', type: 'rich-text', required: true },
    { key: 'screens[0].nursesNotes.vitalSigns.tempF', label: 'Temp (F)', type: 'number' },
    { key: 'screens[0].nursesNotes.vitalSigns.pulse', label: 'Pulse', type: 'number' },
    { key: 'screens[0].nursesNotes.vitalSigns.resp', label: 'Resp. Rate', type: 'number' },
    { key: 'screens[0].nursesNotes.vitalSigns.bpSystolic', label: 'BP Systolic', type: 'number' },
    { key: 'screens[0].nursesNotes.vitalSigns.bpDiastolic', label: 'BP Diastolic', type: 'number' },
    // ... more vitals
    { key: 'screens[0].task.instruction', label: 'Task Instruction', type: 'textarea', helpText: 'e.g. Select the 4 findings...' },
    {
        key: 'screens[0].task.options',
        label: 'Answer Options',
        type: 'array',
        arrayConfig: {
            itemSchema: [
                { key: 'text', label: 'Option Text', type: 'text' },
                { key: 'isCorrect', label: 'Is Correct?', type: 'checkbox' }
            ]
        }
    }
];

// Placeholder for screens 2-6 to keep file concise for this architecture demo
const placeholderScreenFields = (screenNum: number, phase: string): FormField[] => [
    { key: `screens[${screenNum - 1}].timestamp`, label: 'Timestamp', type: 'date-time' },
    { key: `screens[${screenNum - 1}].nursesNotes.text`, label: 'Update Notes', type: 'rich-text' },
    { key: `screens[${screenNum - 1}].task.instruction`, label: `Instruction (${phase})`, type: 'textarea' },
    // Matrix or Dropdown configs would go here
];

export const CaseStudyConfig: QuestionTypeDefinition = {
    typeId: 'case-study-6-screen',
    typeName: 'Case Study (6-Screen)',
    description: 'Standard NGN 6-screen clinical judgment case study.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'case-study-6-screen',
        initialContent: {
            screens: [{}, {}, {}, {}, {}, {}], // 6 empty screens
            pedagogy: {},
            language: { primary: 'en' }
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: 'Item Setup', fields: setupFields },
                { id: 'screen1', title: '1. Recognize Cues', fields: screen1Fields },
                { id: 'screen2', title: '2. Analyze Cues', fields: placeholderScreenFields(2, 'Analyze Cues') },
                { id: 'screen3', title: '3. Prioritize Hypotheses', fields: placeholderScreenFields(3, 'Prioritize') },
                { id: 'screen4', title: '4. Generate Solutions', fields: placeholderScreenFields(4, 'Generate') },
                { id: 'screen5', title: '5. Take Action', fields: placeholderScreenFields(5, 'Action') },
                { id: 'screen6', title: '6. Evaluate Outcomes', fields: placeholderScreenFields(6, 'Evaluate') },
            ]
        },
        validation: {} // Zod schema would be defined here
    }
};
