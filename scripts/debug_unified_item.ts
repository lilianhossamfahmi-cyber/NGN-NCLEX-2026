
import fetch from 'cross-fetch';

const API_URL = 'http://localhost:4000/api';

async function main() {
    console.log("Fetching items...");
    try {
        const res = await fetch(`${API_URL}/items`);
        if (!res.ok) {
            throw new Error(`Failed: ${res.status} ${res.statusText}`);
        }
        const items = await res.json();
        console.log(`Found ${items.length} items.`);

        // Find a unified item
        const unifiedItem = items.find((i: any) => i.id.startsWith('unified'));

        if (unifiedItem) {
            console.log("--- SUSPECT ITEM DUMP ---");
            console.log(JSON.stringify(unifiedItem, null, 2));
            console.log("-------------------------");
        } else {
            console.log("No 'unified_' items found.");
        }

    } catch (e) {
        console.error(e);
    }
}

main();
