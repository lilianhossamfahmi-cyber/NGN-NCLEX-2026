import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Calculation / Dosage Logic Item Configuration
 * Mapped from "Prompt 12: Calculation Item-Creator"
 */

// 1. Setup Tab
const setupFields: FormField[] = [
    {
        key: 'metadata.title',
        label: 'Item Title',
        type: 'text',
        required: true,
        helpText: 'e.g., "[Calculation] Heparin Protocol"'
    },
    {
        key: 'metadata.clinicalFocus',
        label: 'Clinical Focus',
        type: 'text',
        helpText: 'e.g. Critical Care, Pediatrics, Medication Safety'
    },
    {
        key: 'metadata.difficulty',
        label: 'Difficulty',
        type: 'select',
        options: [
            { label: 'Basic (Tablet/Vol)', value: 'basic' },
            { label: 'Moderate (IV Rate/Weight)', value: 'moderate' },
            { label: 'Advanced (Titration/Protocol)', value: 'advanced' }
        ]
    }
];

// 2. Clinical Scenario
const scenarioFields: FormField[] = [
    {
        key: 'clinicalData.patientInfo',
        label: 'Patient Data',
        type: 'custom', // 'PATIENT_CARD_EDITOR'
    },
    {
        key: 'clinicalData.medicationOrder',
        label: 'Physician Order',
        type: 'rich-text',
        helpText: 'The core order (Dose, Route, Frequency).'
    },
    {
        key: 'clinicalData.supplyInfo',
        label: 'Pharmacy Supply / Label',
        type: 'rich-text',
        helpText: 'Concentration, Volume, Labels available.'
    }
];

// 3. Calculation & Answer Key
const answerFields: FormField[] = [
    {
        key: 'structure.inputLabel',
        label: 'Answer Unit Label',
        type: 'text',
        helpText: 'e.g. mL/hr, tablets, gtt/min'
    },
    {
        key: 'structure.correctValue',
        label: 'Correct Numerical Answer',
        type: 'number',
        required: true
    },
    {
        key: 'structure.acceptableRange',
        label: 'Acceptable Range (+/-)',
        type: 'array',
        helpText: 'Optional: [Min, Max] for slight rounding variations.',
        arrayConfig: {
            itemSchema: [
                { key: 'min', label: 'Min', type: 'number' },
                { key: 'max', label: 'Max', type: 'number' }
            ]
        }
    },
    {
        key: 'structure.stepByStepSolution',
        label: 'Step-by-Step Rationale',
        type: 'rich-text',
        helpText: 'Show the math work (DA, Formula, etc).'
    }
];

export const CalculationConfig: QuestionTypeDefinition = {
    typeId: 'calculation',
    typeName: 'Dosage Calculation',
    description: 'Mathematical dosage problems involving input validation and rounding rules.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'calculation',
        initialContent: {
            itemType: 'calculation',
            status: 'draft',
            metadata: {
                title: '',
                clinicalFocus: 'Medication Safety',
                difficulty: 'moderate'
            },
            clinicalData: {
                patientInfo: { age: '', weight: '', allergies: '' },
                medicationOrder: '',
                supplyInfo: ''
            },
            structure: {
                inputLabel: 'mL',
                correctValue: 0,
                stepByStepSolution: ''
            },
            reviewState: { manualReview: {}, aiReview: {} }
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Metadata', fields: setupFields },
                { id: 'scenario', title: '2. Scenario', fields: scenarioFields },
                { id: 'answer', title: '3. Answer Key', fields: answerFields },
                { id: 'preview', title: '4. Preview', fields: [] }
            ]
        },
        validation: {}
    }
};
