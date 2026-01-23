
import { MgtCareItems_Batch1 } from '../docs/external_prompts/Generated_ManagementOfCare_20/MgtCareItems_Batch1';
import { MgtCareItems_Batch2 } from '../docs/external_prompts/Generated_ManagementOfCare_20/MgtCareItems_Batch2';
import { MgtCareItems_Batch3 } from '../docs/external_prompts/Generated_ManagementOfCare_20/MgtCareItems_Batch3';
import { MgtCareItems_Batch4 } from '../docs/external_prompts/Generated_ManagementOfCare_20/MgtCareItems_Batch4';
import { MgtCareItems_Batch5 } from '../docs/external_prompts/Generated_ManagementOfCare_20/MgtCareItems_Batch5';
import { saveItemToBank } from '../src/services/itemApiService';
import { syncItemToSupabase } from '../src/services/itemSyncService';

async function pushManagementOfCareBatch() {
    const allItems = [
        ...MgtCareItems_Batch1,
        ...MgtCareItems_Batch2,
        ...MgtCareItems_Batch3,
        ...MgtCareItems_Batch4,
        ...MgtCareItems_Batch5
    ];

    console.log(`🚀 Starting push for ${allItems.length} Management of Care items...`);

    let success = 0;
    for (const item of allItems) {
        try {
            // 1. Save to local SQLite
            await saveItemToBank(item);

            // 2. Sync to Supabase
            await syncItemToSupabase(item as any);

            success++;
            console.log(`✅ [${success}/${allItems.length}] Pushed: ${item.id}`);
        } catch (err) {
            console.error(`❌ Failed to push ${item.id}:`, err);
        }
    }

    console.log(`\n🎉 Finished! Successfully pushed ${success} items.`);
}

pushManagementOfCareBatch().catch(console.error);
