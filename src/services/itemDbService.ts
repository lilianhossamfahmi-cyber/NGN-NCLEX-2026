// src/services/itemDbService.ts
import { supabase } from '../../server/supabaseClient.ts';
import { MasterQuestionItem } from '../types/master-schema.ts';
import { enrichItemWithQuality } from '../utils/autoQuality.ts';

// No initDb needed for Supabase as client is stateless
export async function initDb() {
    return supabase;
}

function serializeArray(arr?: string[]): string | null {
    return arr ? JSON.stringify(arr) : null;
}

function inferTopic(item: any): string {
    const text = JSON.stringify(item).toLowerCase();
    const map: Record<string, string> = {
        'heart': 'Cardiology', 'cardio': 'Cardiology', 'atrial': 'Cardiology', 'ventricle': 'Cardiology',
        'lung': 'Respiratory', 'breath': 'Respiratory', 'alveoli': 'Respiratory', 'copd': 'Respiratory',
        'kidney': 'Renal', 'renal': 'Renal', 'urine': 'Renal', 'dialysis': 'Renal',
        'neuro': 'Neurology', 'brain': 'Neurology', 'seizure': 'Neurology', 'stroke': 'Neurology',
        'baby': 'Pediatrics', 'pediatric': 'Pediatrics', 'infant': 'Pediatrics', 'child': 'Pediatrics',
        'pregnant': 'Maternal', 'maternity': 'Maternal', 'labor': 'Maternal', 'fetal': 'Maternal',
        'drug': 'Pharmacology', 'medication': 'Pharmacology', 'dose': 'Pharmacology',
        'stomach': 'Gastrointestinal', 'bowel': 'Gastrointestinal', 'liver': 'Gastrointestinal',
        'bone': 'Musculoskeletal', 'fracture': 'Musculoskeletal',
        'mental': 'Mental Health', 'psych': 'Mental Health', 'depression': 'Mental Health'
    };
    for (const [key, topic] of Object.entries(map)) {
        if (text.includes(key)) return topic;
    }
    return 'General';
}

export interface ItemQueryOptions {
    page?: number;
    limit?: number;
    search?: string;
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

export async function getBankItems(options: ItemQueryOptions = {}): Promise<PaginatedResult> {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('item_bank')
        .select('*', { count: 'exact' });

    // Filters
    if (options.search) {
        query = query.ilike('item_json', `%${options.search}%`);
    }
    if (options.topic && options.topic !== 'All') {
        query = query.eq('clinical_focus', options.topic);
    }
    if (options.type && options.type !== 'All') {
        query = query.eq('type_id', options.type);
    }
    if (options.status && options.status !== 'All') {
        query = query.eq('status', options.status);
    }

    // Sorting
    const sortField = options.sortField || 'created_at';
    const sortDir = options.sortDir || 'desc';
    query = query.order(sortField, { ascending: sortDir === 'asc' });

    // Pagination
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Supabase Error:', error);
        throw new Error(error.message);
    }

    const items = (data || []).map((r: any) => {
        // Handle if item_json is returned as string or object
        return typeof r.item_json === 'string' ? JSON.parse(r.item_json) : r.item_json;
    });

    const total = count || 0;

    return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
}

export async function saveItemToBank(item: MasterQuestionItem, userId: string = 'system'): Promise<boolean> {
    return (await saveBatchToBank([item], userId)) > 0;
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

        // Update item content
        if (pedagogy) pedagogy.clinicalFocus = clinicalFocus;
        else (metadata as any).clinicalFocus = clinicalFocus;

        const difficultyLevel = pedagogy?.difficultyLevel ?? 1;
        const cjmmStep = (pedagogy as any)?.cjmmPhase ?? (metadata as any)?.cjmmStep ?? null;

        const rawClientNeeds = (metadata as any)?.clientNeeds ?? null;
        const clientNeeds = Array.isArray(rawClientNeeds) ? JSON.stringify(rawClientNeeds) : rawClientNeeds;
        const status = metadata?.status ?? 'draft';
        const score = metadata?.qualityScore ?? 0;
        const rawTags = pedagogy?.clinicalFocusTopics ?? (metadata as any)?.tags;
        const tags = serializeArray(rawTags);
        const itemJson = JSON.stringify(enriched);

        return {
            id,
            type_id: typeId,
            clinical_focus: clinicalFocus,
            difficulty_level: difficultyLevel,
            cjmm_step: cjmmStep,
            client_needs: clientNeeds,
            created_at: now, // For upsert, keeping original created_at might be better but this resets it. SQLite logic did this.
            updated_at: now,
            created_by: userId,
            updated_by: userId,
            status,
            quality_score: score,
            tags,
            allowed_modes: serializeArray((enriched as any).allowed_modes || []),
            item_json: itemJson
        };
    });

    const { error, count } = await supabase
        .from('item_bank')
        .upsert(upsertData, { onConflict: 'id' })
        .select(); // Select is needed to return data?

    if (error) {
        console.error('Supabase Save Error:', error);
        throw new Error(error.message);
    }

    // Supabase upsert doesn't always return count in V2 unless requested maybe? 
    // Assuming success matches input length
    return upsertData.length;
}

export async function deleteItemFromBank(id: string): Promise<void> {
    const { error } = await supabase.from('item_bank').delete().eq('id', id);
    if (error) console.error('Delete Error:', error);
}

export async function deleteBatchFromBank(ids: string[]): Promise<void> {
    if (!ids.length) return;
    const { error } = await supabase.from('item_bank').delete().in('id', ids);
    if (error) console.error('Delete Batch Error:', error);
}

export async function clearBank(): Promise<void> {
    // Dangerous, maybe restrict?
    const { error } = await supabase.from('item_bank').delete().neq('id', '0'); // Delete all not equal to 0 (effectively all UUIDs)
    if (error) console.error('Clear Bank Error:', error);
}

