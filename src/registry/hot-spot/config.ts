import { QuestionTypeDefinition, FormField } from '../../types/master-schema';

/**
 * Hot Spot Item Configuration
 * Mapped from "Prompt 10: Hot Spot Item-Creator"
 */

// 1. Setup Tab
const setupFields: FormField[] = [
    {
        key: 'metadata.title',
        label: 'Item Title',
        type: 'text',
        required: true
    },
    {
        key: 'metadata.clinicalFocus',
        label: 'Clinical Focus',
        type: 'text'
    }
];

// 2. Image & Scenario
const imageFields: FormField[] = [
    {
        key: 'content.scenario',
        label: 'Clinical Scenario',
        type: 'rich-text'
    },
    {
        key: 'content.imageUrl',
        label: 'Image Source URL',
        type: 'text', // In a real app, this would be an Image Uploader
        helpText: 'URL of the anatomical diagram or clinical photo.'
    },
    {
        key: 'content.altText',
        label: 'Alt Text (Accessibility)',
        type: 'text'
    }
];

// 3. Hot Spot Tool
const regionFields: FormField[] = [
    {
        key: 'content.regions',
        label: 'Define Regions',
        type: 'custom', // 'IMAGE_REGION_EDITOR'
        helpText: 'Draw polygons or rectangles on the image.',
        arrayConfig: {
            itemSchema: [
                { key: 'id', label: 'ID', type: 'text' },
                { key: 'coordinates', label: 'Coords', type: 'text' },
                { key: 'isCorrect', label: 'Is Correct?', type: 'checkbox' },
                { key: 'rationale', label: 'Rationale', type: 'text' }
            ]
        }
    }
];

export const HotSpotConfig: QuestionTypeDefinition = {
    typeId: 'hot-spot',
    typeName: 'Hot Spot (Image)',
    description: 'Select a specific area on an anatomical figure or diagram.',
    status: 'Completed',
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    config: {
        typeId: 'hot-spot',
        initialContent: {
            itemType: 'hotSpot',
            status: 'draft',
            metadata: { title: '', clinicalFocus: '' },
            content: {
                scenario: '',
                imageUrl: '',
                regions: []
            },
            reviewState: { manualReview: {}, aiReview: {} }
        },
        uiSchema: {
            layout: 'tabbed-steps',
            sections: [
                { id: 'setup', title: '1. Metadata', fields: setupFields },
                { id: 'image', title: '2. Image Setup', fields: imageFields },
                { id: 'regions', title: '3. Define Regions', fields: regionFields },
                { id: 'preview', title: '4. Preview', fields: [] }
            ]
        },
        validation: {}
    }
};
