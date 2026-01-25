import dotenv from 'dotenv';
dotenv.config();

import { repairAllItemsInBank } from '../src/services/itemApiService';

/**
 * CLI Entry point for bulk item repair.
 * This script fetches all items from the Supabase bank and runs them through
 * the UnifiedDataPipeline to ensure data consistency and modern NGN formatting.
 */
async function main() {
    console.log('--- 🛠️  NGN BANK BULK REPAIR UTILITY 🛠️  ---');

    try {
        const result = await repairAllItemsInBank((count, total) => {
            const pct = Math.round((count / total) * 100);
            process.stdout.write(`\rProgress: ${pct}% (${count}/${total} items processed)`);
        });

        console.log('\n\n✅ Bulk Repair Complete!');
        console.log(`Summary: ${result} items successfully transformed and updated.`);
        process.exit(0);
    } catch (error) {
        console.error('\n\n❌ FATAL ERROR DURING BULK REPAIR:');
        console.error(error);
        process.exit(1);
    }
}

main();
