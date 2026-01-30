import { UnifiedDataPipeline } from '../src/services/UnifiedDataPipeline';
import { saveItemToBank } from '../src/services/itemStorage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    const filePath = path.join(__dirname, '../src/dataStore/case-acute-hf-cardiogenic-shock.json');
    console.log(`📖 Reading case study from ${filePath}...`);

    if (!fs.existsSync(filePath)) {
        console.error('❌ File not found!');
        return;
    }

    try {
        const rawData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        console.log('🧪 Running through UnifiedDataPipeline (Normalization & Sanitization)...');
        const transformed = await UnifiedDataPipeline.transform(rawData);

        console.log('🚀 Importing into Supabase item_bank...');
        const result = await saveItemToBank(transformed);

        console.log('✅ Import Successful!');
        console.log(`Item ID: ${result.id}`);
        console.log(`Item Type: ${result.type}`);
    } catch (e: any) {
        console.error('❌ Import Failed:', e.message);
    }
}

main().catch(console.error);
