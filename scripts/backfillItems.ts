import { supabase } from '../src/lib/supabase';
import { UnifiedDataPipeline } from '../src/services/UnifiedDataPipeline';

/**
 * scripts/backfillItems.ts
 * 
 * Migrates existing items in the database to the v1.0.0 schema.
 * - Runs every item through UnifiedDataPipeline.transform()
 * - Sanitizes malformed IDs
 * - Fixes metadata drift
 * - Reports validation failures
 */

async function backfill() {
    console.log('🚀 Starting legacy data migration to v1.0.0...');

    // 1. Fetch all items
    const { data: items, error } = await supabase
        .from('items')
        .select('*');

    if (error) {
        console.error('Error fetching items:', error);
        return;
    }

    console.log(`Found ${items.length} items to process.`);

    let successCount = 0;
    let failureCount = 0;

    for (const rawItem of items) {
        try {
            // 2. Transform through the new authoritative pipeline
            // This applies sanitization and Ajv validation
            const sanitized = await UnifiedDataPipeline.transform(rawItem);

            // 3. Update the database
            const { error: updateError } = await supabase
                .from('items')
                .upsert(sanitized);

            if (updateError) {
                console.error(`Failed to update item ${rawItem.id}:`, updateError.message);
                failureCount++;
            } else {
                successCount++;
            }
        } catch (err) {
            console.error(`Critical failure on item ${rawItem.id}:`, err);
            failureCount++;
        }
    }

    console.log('\n--- Migration Summary ---');
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`❌ Failed: ${failureCount}`);
    console.log('--------------------------');
}

backfill().catch(console.error);
