// src/services/itemSyncService.ts

import { supabase } from '../lib/supabase';
import { MasterQuestionItem } from '../types/master-schema';

/**
 * Helper to ensure we always have a valid UUID for Supabase.
 * If the ID is already a UUID, return it.
 * If it's a generated string (e.g. "unified_..."), hash it deterministically into a UUID.
 */
function toUUID(id: string): string {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(id)) return id;

    // Create a deterministic hash from the string ID
    let hex = '';
    for (let i = 0; i < id.length; i++) {
        // Simple hashing accumulation
        const char = id.charCodeAt(i);
        // hex accumulation
        hex += char.toString(16);
    }

    // Fill or truncate to 32 chars
    while (hex.length < 32) {
        hex += hex; // Repeat to fill
    }
    hex = hex.substring(0, 32);

    // Format as UUID: 8-4-4-4-12 (Pseudo-UUID v4-ish structure)
    // We force the version bit to 4 and variant to 8/9/a/b just to be "valid"
    const part1 = hex.substring(0, 8);
    const part2 = hex.substring(8, 12);
    // const part3 = '4' + hex.substring(13, 16); // Force v4
    // const part4 = 'a' + hex.substring(17, 20); // Force variant
    const part3 = '4' + hex.substring(13, 16);
    const part4 = '8' + hex.substring(17, 20); // 8, 9, a, or b
    const part5 = hex.substring(20, 32);

    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

/**
 * Sync a MasterQuestionItem to the Supabase "ngn_items" table.
 * Maps Admin Panel item structure to the actual Supabase schema.
 */
export async function syncItemToSupabase(item: MasterQuestionItem): Promise<void> {
    const validUUID = toUUID(item.id);

    // Helper to enforce valid status
    const sanitizeStatus = (s?: string) => {
        const lower = (s || '').toLowerCase().trim();
        return ['draft', 'published', 'archived'].includes(lower) ? lower : 'draft';
    };

    // Map to actual Supabase ngn_items schema (item_id is primary key)
    const payload = {
        item_id: validUUID, // Must be valid UUID
        content: item,
        item_type: item.typeId || null,
        type_id: item.typeId || null,
        difficulty_level: item.pedagogy?.difficultyLevel || 3,
        topic_focus: item.pedagogy?.clinicalFocus || 'General',
        expert_score: item.metadata?.qualityScore || 0,
        status: sanitizeStatus(item.metadata?.status),
        version: 1,
        prompt: item.prompt || null,
        options: item.options || null,
        pedagogy: item.pedagogy || null,
        metadata: item.metadata || null,
        allowed_modes: (item as any).allowed_modes || [],
        item_json: item,
        updated_at: new Date().toISOString()
    };

    console.log(`Syncing Item: ${item.id} -> UUID: ${validUUID}`);

    const { error } = await supabase
        .from('ngn_items')
        .upsert(payload, { onConflict: 'item_id' });

    if (error) {
        console.error('Supabase sync error:', error);
        throw error;
    }

    console.log('Item synced to Supabase:', item.id);
}
