
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs/promises';
import path from 'path';

async function exportAllItems() {
    const dbPath = path.resolve('./itemBank.db');
    console.log(`Open DB: ${dbPath}`);

    const db = await open({
        filename: dbPath,
        driver: sqlite3.Database,
    });

    const rows = await db.all('SELECT item_json FROM item_bank');
    console.log(`Found ${rows.length} items.`);

    const items = rows.map(row => JSON.parse(row.item_json));

    const outputPath = path.resolve('./dump_all_items.json');
    await fs.writeFile(outputPath, JSON.stringify(items, null, 2));

    console.log(`Exported ${items.length} items to ${outputPath}`);
}

exportAllItems().catch(console.error);
