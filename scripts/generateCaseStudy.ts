import dotenv from 'dotenv';
dotenv.config();

import { generateQuestions } from '../src/services/questionGenerationService';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('--- 🚀 GENERATING NEW NCLEX-NGN CASE STUDY 🚀 ---');

    // Custom settings for a Level 5 Pulmonary Embolism case
    const settings: any = {
        mode: 'ai',
        selectedReferenceIds: [],
        targetTypes: ['case-study-6-screen'],
        quantityPerType: 1,
        clinicalFocus: ['Respiratory Distress', 'Pulmonary Embolism'],
        difficultyLevel: 5,
        temperature: 0.2,
        manualContext: 'A 68-year-old female post-hip replacement (POD 3) develops sudden onset dyspnea and pleuritic chest pain.',
        aiPrompt: '',
        advanced: {
            includeAnswerKeys: true,
            includeRationales: true
        }
    };

    try {
        const response = await generateQuestions(settings, [], (status) => console.log(`[STATUS] ${status}`));

        if (response.success && response.data && response.data.length > 0) {
            const item = response.data[0];
            const fileName = `generated_pe_case_${Date.now()}.json`;
            const filePath = path.join(__dirname, '../src/dataStore', fileName);

            fs.writeFileSync(filePath, JSON.stringify(item, null, 4));

            console.log('\n✅ Case Study Generated Successfully!');
            console.log(`Location: ${filePath}`);
            console.log(`Title: ${item.metadata?.title || 'Untitled'}`);
        } else {
            console.error('❌ Generation Failed:', response.error);
            // On JSON error we want to see the end of the text
            if (response.error?.includes('JSON')) {
                console.log('Response summary or end here would be helpful');
            }
            console.log('Full Response Metadata:', { success: response.success, error: response.error });
        }
    } catch (error) {
        console.error('❌ CRASHED during generation:', error);
    }
}

main();
