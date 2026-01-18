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

    const upsertData = items.map(item => {
        const enriched = enrichItemWithQuality(item);
        const now = new Date().toISOString();
        const { id, typeId, metadata, pedagogy } = enriched;

        let clinicalFocus = pedagogy?.clinicalFocus ?? (metadata as any)?.clinicalFocus;
        if (!clinicalFocus || clinicalFocus === 'General') {
            clinicalFocus = inferTopic(item);
        }

        const difficultyLevel = pedagogy?.difficultyLevel ?? 1;
        const cjmmStep = (pedagogy as any)?.cjmmPhase ?? (metadata as any)?.cjmmStep ?? 'Analyze Cues'; // Default for NOT NULL
        const clientNeeds = (metadata as any)?.clientNeeds
            ? JSON.stringify((metadata as any).clientNeeds)
            : JSON.stringify('Physiological Integrity'); // Default for NOT NULL constraint
        const tags = serializeArray(pedagogy?.clinicalFocusTopics ?? (metadata as any)?.tags) || '[]'; // Default empty array
        const itemJson = JSON.stringify(enriched);

        return {
            id,
            type_id: typeId || 'multiple-choice', // Default for NOT NULL
            clinical_focus: clinicalFocus || 'General', // Default for NOT NULL
            difficulty_level: difficultyLevel,
            cjmm_step: cjmmStep,
            client_needs: clientNeeds,
            created_at: now,
            updated_at: now,
            created_by: userId || 'system', // Default for NOT NULL
            updated_by: userId || 'system', // Default for NOT NULL
            status: metadata?.status ?? 'draft',
            quality_score: metadata?.qualityScore ?? 0,
            tags: tags,
            allowed_modes: serializeArray((enriched as any).allowed_modes || []) || '[]', // Default empty
            item_json: itemJson
        };
    });

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
