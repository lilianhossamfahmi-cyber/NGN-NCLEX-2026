// src/services/itemDbService.ts
import { createClient } from '@supabase/supabase-js';
import { MasterQuestionItem } from '../types/master-schema';
import { enrichItemWithQuality } from '../utils/autoQuality';

// 1. Setup Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('CRITICAL WARNING: Supabase Credentials MISSING. DB Operations will fail.');
} else {
    console.log('Supabase Client Configuring for URL:', supabaseUrl);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 2. Init DB - Just a connection check
export async function initDb() {
    console.log('Initializing DB Connection...');
    return supabase;
}

// 3. Helper Functions
function serializeArray(arr?: string[]): string | null {
    return arr ? JSON.stringify(arr) : null;
}

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

// 4. Data Access Methods
export async function getBankItems(options: ItemQueryOptions = {}): Promise<PaginatedResult> {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('item_bank').select('*', { count: 'exact' });

    if (options.search) query = query.ilike('item_json', `%${options.search}%`);
    if (options.topic && options.topic !== 'All') query = query.eq('clinical_focus', options.topic);
    if (options.type && options.type !== 'All') query = query.eq('type_id', options.type);
    if (options.status && options.status !== 'All') query = query.eq('status', options.status);

    const sortField = options.sortField || 'created_at';
    const sortDir = options.sortDir || 'desc';
    query = query.order(sortField, { ascending: sortDir === 'asc' });

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Supabase Query Error:', error);
        throw new Error(`DB Error: ${error.message}`);
    }

    const items = (data || []).map((r: any) => {
        return typeof r.item_json === 'string' ? JSON.parse(r.item_json) : r.item_json;
    });

    return {
        items,
        total: count || 0,
        page,
        totalPages: Math.ceil((count || 0) / limit)
    };
}

export async function saveItemToBank(item: MasterQuestionItem, userId: string = 'system'): Promise<boolean> {
    return (await saveBatchToBank([item], userId)) > 0;
}

import { SanitizeResult } from '../utils/mutationClassifier';

export async function saveBatchToBank(
    results: (MasterQuestionItem | SanitizeResult)[],
    userId: string = 'system'
): Promise<number> {
    if (results.length === 0) return 0;

    const itemsToUpsert: MasterQuestionItem[] = [];
    const idsToRetire: string[] = [];

    for (const res of results) {
        // Handle SanitizeResult wrapper from ultraFixerService
        if ('action' in res) {
            if (res.action === 'FORK_NEW_ITEM') {
                itemsToUpsert.push(res.newItem);
                if (res.retireOriginalId) {
                    idsToRetire.push(res.retireOriginalId);
                }
            } else {
                itemsToUpsert.push(res.newItem);
            }
        } else {
            // Raw item
            itemsToUpsert.push(res);
        }
    }

    // 1. Handle Retirements (Archiving original items that were forked)
    if (idsToRetire.length > 0) {
        console.log(`[DB_SERVICE] Archiving ${idsToRetire.length} original items due to forking.`);
        const now = new Date().toISOString();
        const { error: retireError } = await supabase
            .from('item_bank')
            .update({
                status: 'archived',
            } as any)
            .in('id', idsToRetire);

        if (retireError) {
            console.error('[DB_SERVICE] Error retiring original items:', retireError);
        }

        // Simple update if RPC is not available
        for (const id of idsToRetire) {
            const { data: original } = await supabase.from('item_bank').select('item_json').eq('id', id).single();
            if (original) {
                const json = typeof original.item_json === 'string' ? JSON.parse(original.item_json) : original.item_json;
                json.metadata.retiredAt = now;
                json.metadata.status = 'archived';
                await supabase.from('item_bank').update({
                    status: 'archived',
                    item_json: JSON.stringify(json)
                }).eq('id', id);
            }
        }
    }

    // 2. Prepare Upsert Data
    const upsertData = itemsToUpsert.map(item => {
        const enriched = enrichItemWithQuality(item);
        const now = new Date().toISOString();
        const { id, typeId, metadata, pedagogy } = enriched;

        let clinicalFocus = pedagogy?.clinicalFocus ?? (metadata as any)?.clinicalFocus;
        if (!clinicalFocus || clinicalFocus === 'General') clinicalFocus = inferTopic(item);

        const difficultyLevel = pedagogy?.difficultyLevel ?? 1;
        const cjmmStep = (pedagogy as any)?.cjmmPhase ?? (metadata as any)?.cjmmStep ?? null;
        const clientNeeds = (metadata as any)?.clientNeeds ?
            (typeof (metadata as any).clientNeeds === 'string' ? (metadata as any).clientNeeds : JSON.stringify((metadata as any).clientNeeds))
            : null;
        const tags = serializeArray(pedagogy?.clinicalFocusTopics ?? (metadata as any)?.tags);
        const itemJson = JSON.stringify(enriched);

        // Task C: Full Column Mirror
        return {
            id,
            type_id: typeId || item.type,
            clinical_focus: clinicalFocus,
            difficulty_level: difficultyLevel,
            cjmm_step: cjmmStep,
            client_needs: clientNeeds,
            created_at: item.metadata?.createdAt || now,
            updated_at: now,
            created_by: userId,
            updated_by: userId,
            status: metadata?.status ?? 'draft',
            quality_score: metadata?.qualityScore ?? 0,
            tags,
            allowed_modes: serializeArray((enriched as any).allowed_modes || []),
            item_json: itemJson,

            // New Versioning & Protection Columns
            content_version: metadata?.contentVersion ?? 1,
            supersedes_id: metadata?.supersedesId ?? null,
            retired_at: metadata?.retiredAt ?? null
        };
    });

    const { error } = await supabase.from('item_bank').upsert(upsertData, { onConflict: 'id' });

    if (error) {
        console.error('Supabase Upsert Error:', error);
        throw new Error(`DB Save Failed: ${error.message}`);
    }

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
    const { error } = await supabase.from('item_bank').delete().neq('id', '0');
    if (error) console.error('Clear Bank Error:', error);
}
