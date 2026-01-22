// src/services/itemApiService.ts
// DIRECT SUPABASE - No Railway Backend Required!

import { MasterQuestionItem } from '../types/master-schema.ts';
import { supabase } from '../lib/supabase';
import { enrichItemWithQuality } from '../utils/autoQuality.ts';

export interface ItemQueryOptions {
    page?: number;     // 1-based
    limit?: number;
    search?: string;   // Full text search on item_json
    topic?: string;
    type?: string;
    level?: number;
    status?: string;
    sortField?: string;
    sortDir?: 'asc' | 'desc';
}

export interface PaginatedResult {
    items: MasterQuestionItem[];
    total: number;
    page: number;
    totalPages: number;
}

// Helper to infer topic from item content
function inferTopic(item: any): string {
    const text = JSON.stringify(item).toLowerCase();
    const map: Record<string, string> = {
        'heart': 'Cardiology', 'cardio': 'Cardiology', 'atrial': 'Cardiology',
        'lung': 'Respiratory', 'breath': 'Respiratory', 'copd': 'Respiratory',
        'kidney': 'Renal', 'renal': 'Renal',
        'neuro': 'Neurology', 'brain': 'Neurology', 'stroke': 'Neurology',
        'baby': 'Pediatrics', 'pediatric': 'Pediatrics', 'child': 'Pediatrics',
        'pregnant': 'Maternal', 'maternity': 'Maternal', 'labor': 'Maternal',
        'drug': 'Pharmacology', 'medication': 'Pharmacology',
        'mental': 'Mental Health', 'psych': 'Mental Health'
    };
    for (const [key, topic] of Object.entries(map)) {
        if (text.includes(key)) return topic;
    }
    return 'General';
}

function serializeArray(arr?: string[]): string | null {
    return arr ? JSON.stringify(arr) : null;
}

// ==================== DIRECT SUPABASE OPERATIONS ====================

export async function getBankItems(options: ItemQueryOptions = {}): Promise<PaginatedResult> {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('item_bank').select('*', { count: 'exact' });

    // Apply filters
    if (options.search) query = query.ilike('item_json', `%${options.search}%`);
    if (options.topic && options.topic !== 'All') query = query.eq('clinical_focus', options.topic);
    if (options.type && options.type !== 'All') query = query.eq('type_id', options.type);
    if (options.status && options.status !== 'All') query = query.eq('status', options.status);

    // Sorting
    const sortField = options.sortField || 'created_at';
    const sortDir = options.sortDir || 'desc';
    query = query.order(sortField, { ascending: sortDir === 'asc' });

    // Pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Supabase getBankItems Error:', error);
        throw new Error(`Failed to fetch items: ${error.message}`);
    }

    // Parse item_json back to objects
    const items = (data || []).map((row: any) => {
        try {
            return typeof row.item_json === 'string'
                ? JSON.parse(row.item_json)
                : row.item_json;
        } catch {
            return row;
        }
    });

    // DEBUG: Log retrieved items
    console.log('[getBankItems] Retrieved items:', items.map((item: any, i: number) => ({
        index: i,
        id: item?.id,
        prompt: (item?.prompt || item?.stem || item?.content?.structure?.prompt || '').substring(0, 50),
        type: item?.type || item?.typeId
    })));

    return {
        items,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
    };
}

export async function saveItemToBank(item: MasterQuestionItem, userId: string = 'system'): Promise<boolean> {
    const count = await saveBatchToBank([item], userId);
    return count > 0;
}

export async function saveBatchToBank(items: MasterQuestionItem[], userId: string = 'system'): Promise<number> {
    if (items.length === 0) return 0;

    // DEBUG: Log items being saved
    console.log('[saveBatchToBank] Items to save:', items.map((item, i) => ({
        index: i,
        id: item.id || (item as any)._id,
        prompt: ((item as any).prompt || (item as any).stem || (item as any).content?.structure?.prompt || '').substring(0, 50),
        type: (item as any).type || (item as any).typeId
    })));

    const upsertData = [];
    for (const rawItem of items) {
        // 1. DUAL-LAYER ID PRESERVATION & REPAIR
        // IMPORTANT: Pass through Pipeline to ensure Managers (Smart Repair) handle it
        const item = await UnifiedDataPipeline.transform(rawItem);

        const rawId = item.id || (item as any)._id || (item as any).item_id;
        const backupId = `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        let finalId = rawId || backupId;

        // Try native crypto if available
        try { if (!rawId && typeof crypto !== 'undefined' && crypto.randomUUID) finalId = crypto.randomUUID(); } catch (e) { }

        const enriched = enrichItemWithQuality(item);
        const now = new Date().toISOString();
        const { typeId, metadata, pedagogy } = enriched;

        // 2. PEDAGOGY & METADATA DEFAULTS
        const difficultyLevel = pedagogy?.difficultyLevel ?? (item.pedagogy as any)?.difficultyLevel ?? 1;
        const cjmmStep = (pedagogy as any)?.cjmmPhase ?? (metadata as any)?.cjmmStep ?? (item.pedagogy as any)?.cjmmStep ?? 'Analyze Cues';

        let clinicalFocus = pedagogy?.clinicalFocus || (item as any)?.clinical_focus || 'General Nursing';
        if (!clinicalFocus || clinicalFocus === 'General') {
            clinicalFocus = inferTopic(item);
        }

        const clientNeedsVal = (metadata as any)?.clientNeeds || (item.metadata as any)?.clientNeeds || 'Physiological Integrity';
        const clientNeeds = JSON.stringify(clientNeedsVal);
        const tags = serializeArray(pedagogy?.clinicalFocusTopics || (metadata as any)?.tags) || '[]';

        // 3. SECURE JSON PAYLOAD
        const itemJson = JSON.stringify({ ...enriched, id: finalId });

        upsertData.push({
            id: finalId, // PRIMARY KEY - GUARANTEED NON-NULL
            type_id: typeId || item.typeId || 'multiple-choice',
            clinical_focus: clinicalFocus,
            difficulty_level: difficultyLevel,
            cjmm_step: cjmmStep,
            client_needs: clientNeeds,
            created_at: (item as any).created_at || now,
            updated_at: now,
            created_by: userId || 'system',
            updated_by: userId || 'system',
            status: (metadata?.status || item.metadata?.status || 'draft').toLowerCase(),
            quality_score: metadata?.qualityScore || 0,
            tags: tags,
            allowed_modes: serializeArray((enriched as any).allowed_modes || []) || '[]',
            item_json: itemJson
        });
    }

    const { error } = await supabase
        .from('item_bank')
        .upsert(upsertData, { onConflict: 'id' });

    if (error) {
        console.error('Supabase saveBatchToBank Error:', error);
        throw new Error(`Failed to save items: ${error.message}`);
    }

    console.log(`✅ Saved ${upsertData.length} items to Supabase`);
    return upsertData.length;
}

export async function updateItem(item: MasterQuestionItem): Promise<boolean> {
    return saveItemToBank(item, 'system');
}

export async function deleteItemFromBank(id: string): Promise<void> {
    const { error } = await supabase
        .from('item_bank')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Supabase deleteItem Error:', error);
    }
}

export async function deleteBatchFromBank(ids: string[]): Promise<void> {
    if (!ids.length) return;

    const { error } = await supabase
        .from('item_bank')
        .delete()
        .in('id', ids);

    if (error) {
        console.error('Supabase deleteBatch Error:', error);
    }
}

export async function clearBank(): Promise<void> {
    const { error } = await supabase
        .from('item_bank')
        .delete()
        .neq('id', '0'); // Delete all rows

    if (error) {
        console.error('Supabase clearBank Error:', error);
    }
}

/**
 * BULK REPAIR: Migrates all items in the bank through the Unified Data Pipeline
 * to ensure they follow the latest schemas and clinicalData nesting.
 */
import { UnifiedDataPipeline } from './UnifiedDataPipeline';

export async function repairAllItemsInBank(onProgress?: (count: number, total: number) => void): Promise<number> {
    console.log('🚀 Starting Bulk Bank Repair...');
    let totalItems: any[] = [];
    let hasMore = true;
    let page = 0;
    const PAGE_SIZE = 100;

    // 1. Fetch ALL raw items from DB
    while (hasMore) {
        const { data, error } = await supabase
            .from('item_bank')
            .select('*')
            .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

        if (error) throw error;
        if (!data || data.length === 0) {
            hasMore = false;
        } else {
            totalItems = [...totalItems, ...data];
            page++;
            if (data.length < PAGE_SIZE) hasMore = false;
        }
    }

    console.log(`📦 Fetched ${totalItems.length} items for repair.`);
    let successCount = 0;
    const repairedItems: MasterQuestionItem[] = [];

    // 2. Process through Pipeline
    for (let i = 0; i < totalItems.length; i++) {
        try {
            const rawRow = totalItems[i];
            const rawJson = typeof rawRow.item_json === 'string' ? JSON.parse(rawRow.item_json) : rawRow.item_json;

            // Critical: Pass through Pipeline
            const repaired = await UnifiedDataPipeline.transform(rawJson);

            // Preserve original metadata if not overriden
            repairedItems.push(repaired);
            successCount++;

            if (onProgress && i % 10 === 0) {
                onProgress(i + 1, totalItems.length);
            }
        } catch (err) {
            console.error(`❌ Failed to repair item at index ${i}:`, err);
        }
    }

    // 3. Batch Save back to DB
    if (repairedItems.length > 0) {
        // Save in chunks of 50 to avoid payload limits
        for (let j = 0; j < repairedItems.length; j += 50) {
            const chunk = repairedItems.slice(j, j + 50);
            await saveBatchToBank(chunk);
            console.log(`✅ Saved chunk ${j / 50 + 1}`);
        }
    }

    return successCount;
}
