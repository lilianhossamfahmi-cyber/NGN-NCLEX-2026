import { supabase } from '../src/lib/supabase';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function backup() {
    console.log('📡 Fetching item_bank for backup...');
    let allItems: any[] = [];
    let hasMore = true;
    let page = 0;
    const PAGE_SIZE = 100;

    while (hasMore) {
        const { data, error } = await supabase
            .from('item_bank')
            .select('*')
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) throw error;
        if (!data || data.length === 0) {
            hasMore = false;
        } else {
            allItems = [...allItems, ...data];
            page++;
            if (data.length < PAGE_SIZE) hasMore = false;
        }
    }

    const backupDir = path.join(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

    const backupPath = path.join(backupDir, 'item_bank_pre_v2.json');
    fs.writeFileSync(backupPath, JSON.stringify(allItems, null, 2));

    console.log(`✅ Backup complete. Saved ${allItems.length} items to ${backupPath}`);
}

backup().catch(console.error);
