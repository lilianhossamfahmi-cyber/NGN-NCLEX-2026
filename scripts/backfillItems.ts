import { supabase } from '../src/lib/supabase';
import { UnifiedDataPipeline } from '../src/services/UnifiedDataPipeline';

/**
 * scripts/backfillItems.ts
 * 
 * Migrates existing items in the database to the v1.0.0 schema.
 * Uses pagination to handle large datasets and replicates production sync logic.
 */

function toUUID(id: string): string {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return id;

    let hex = '';
    for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hex += char.toString(16);
    }
    while (hex.length < 32) {
        hex += hex;
    }
    hex = hex.substring(0, 32);

    const part1 = hex.substring(0, 8);
    const part2 = hex.substring(8, 12);
    const part3 = '4' + hex.substring(13, 16);
    const part4 = '8' + hex.substring(17, 20);
    const part5 = hex.substring(20, 32);

    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

async function backfill() {
    console.log('🚀 Starting legacy data migration to v1.0.0 (Paginated)...');

    const BATCH_SIZE = 50;
    let offset = 0;
    let successTotal = 0;
    let failureTotal = 0;
    let hasMore = true;

    while (hasMore) {
        console.log(`\n[Backfill] Fetching batch: items ${offset} to ${offset + BATCH_SIZE}...`);

        const { data: items, error } = await supabase
            .from('ngn_items')
            .select('*')
            .range(offset, offset + BATCH_SIZE - 1);

        if (error) {
            console.error('Error fetching batch:', error);
            break;
        }

        if (!items || items.length === 0) {
            hasMore = false;
            break;
        }

        console.log(`[Backfill] Processing ${items.length} items...`);

        for (const rawItem of items) {
            try {
                const itemData = rawItem.item_json || rawItem.content || rawItem;
                const sanitized: any = await UnifiedDataPipeline.transform(itemData);
                const validUUID = toUUID(sanitized.id);

                const sanitizeStatus = (s?: string) => {
                    const lower = (s || '').toLowerCase().trim();
                    return ['draft', 'published', 'archived'].includes(lower) ? lower : 'draft';
                };

                const dbPayload = {
                    item_id: validUUID,
                    content: sanitized,
                    item_type: sanitized.typeId || sanitized.type || null,
                    type_id: sanitized.typeId || sanitized.type || null,
                    difficulty_level: sanitized.pedagogy?.difficultyLevel || 3,
                    topic_focus: sanitized.pedagogy?.clinicalFocus || 'General',
                    expert_score: sanitized.metadata?.qualityScore || 0,
                    status: sanitizeStatus(sanitized.metadata?.status),
                    version: 1,
                    prompt: sanitized.prompt || null,
                    options: sanitized.options || sanitized.structure?.options || null,
                    pedagogy: sanitized.pedagogy || null,
                    metadata: sanitized.metadata || null,
                    item_json: sanitized,
                    updated_at: new Date().toISOString()
                };

                const { error: updateError } = await supabase
                    .from('ngn_items')
                    .upsert(dbPayload, { onConflict: 'item_id' });

                if (updateError) {
                    console.error(`  - Failed item ${sanitized.id}:`, updateError.message);
                    failureTotal++;
                } else {
                    successTotal++;
                }
            } catch (err) {
                console.error(`  - Critical failure on item ${rawItem.item_id || 'unknown'}:`, err);
                failureTotal++;
            }
        }

        offset += BATCH_SIZE;
        if (items.length < BATCH_SIZE) {
            hasMore = false;
        }
    }

    console.log('\n--- Migration Summary ---');
    console.log(`✅ Successfully migrated: ${successTotal}`);
    console.log(`❌ Failed: ${failureTotal}`);
    console.log('--------------------------');
}

backfill().catch(console.error);
