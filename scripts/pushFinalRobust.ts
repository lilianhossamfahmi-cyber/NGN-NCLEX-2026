import dotenv from 'dotenv';
dotenv.config();
import { saveBatchToBank } from '../src/services/itemApiService.ts';
import fs from 'fs';
import path from 'path';

async function pushAllInFolders() {
    const dir = 'docs/external_prompts/Generated_Cardiology_50';
    const files = fs.readdirSync(dir).filter(f => f.startsWith('CardiologyItems_Final_Batch') && f.endsWith('.ts'));
    
    console.log(`🚀 Found ${files.length} batches to push.`);
    
    for (const file of files) {
        console.log(`📦 Processing ${file}...`);
        try {
            // We use a dynamic import to load one batch at a time
            const filePath = path.join(process.cwd(), dir, file);
            const module = await import('file://' + filePath.replace(/\\/g, '/'));
            const exportName = file.replace('.ts', '');
            const items = module[exportName];
            
            if (items && Array.isArray(items)) {
                const count = await saveBatchToBank(items);
                console.log(`✅ Successfully pushed ${count} items from ${file}.`);
            } else {
                console.error(`⚠️ No valid export found in ${file}`);
            }
        } catch (err) {
            console.error(`❌ Failed to push ${file}:`, err);
        }
    }
    
    console.log('🏁 All batches processed.');
}

pushAllInFolders();
