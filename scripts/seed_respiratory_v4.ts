
import fs from 'fs';
import path from 'path';
import { saveBatchToBank } from '../src/services/itemStorage';

const jsonPath = path.join(process.cwd(), 'docs/external_prompts/Generated_Respiratory/Respiratory_Trends_Expert_V4.json');

async function seed() {
    try {
        console.log(`Reading from: ${jsonPath}`);
        if (!fs.existsSync(jsonPath)) {
            console.error('File not found!');
            process.exit(1);
        }

        const raw = fs.readFileSync(jsonPath, 'utf-8');
        const items = JSON.parse(raw);
        console.log(`Found ${items.length} items.`);

        // Minimal prep to satisfy TypeScript/Database required fields if missing
        const preppedItems = items.map((item: any) => {
            // Ensure ID is set (JSON has it, but good to double check)
            if (!item.id) console.warn('Item missing ID, one will be generated.');

            // Map JSON structure to expected MasterQuestionItem root fields if needed
            return {
                ...item,
                typeId: item.type, // Map root type to typeId for DB
                metadata: {
                    ...(item.content?.metadata || {}),
                    status: 'published',
                    authorId: 'system_seed_v4',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                },
                pedagogy: {
                    clinicalFocus: item.content?.metadata?.topic || 'Respiratory',
                    difficultyLevel: item.content?.metadata?.difficulty || 5
                }
            };
        });

        console.log('Pushing to Supabase...');
        const result = await saveBatchToBank(preppedItems);
        console.log(`✅ Seeding SUCCESS. Saved ${result} items to the Bank.`);
    } catch (e) {
        console.error('❌ Seeding FAILED:', e);
        process.exit(1);
    }
}

seed();
