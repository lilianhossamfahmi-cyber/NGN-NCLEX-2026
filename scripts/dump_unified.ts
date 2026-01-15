
import fetch from 'cross-fetch';
import fs from 'fs';

const API_URL = 'http://localhost:4000/api';

async function main() {
    try {
        const res = await fetch(`${API_URL}/items`);
        const items = await res.json();

        const unifiedItems = items.filter((i: any) => i.id.startsWith('unified'));

        console.log(`Found ${unifiedItems.length} unified items.`);

        if (unifiedItems.length > 0) {
            fs.writeFileSync('debug_dump.json', JSON.stringify(unifiedItems.slice(0, 3), null, 2));
            console.log("Dumped first 3 unified items to debug_dump.json");
        }

    } catch (e) {
        console.error(e);
    }
}

main();
