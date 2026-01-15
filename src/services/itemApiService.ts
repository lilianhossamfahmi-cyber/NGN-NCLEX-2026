// src/services/itemApiService.ts
import { MasterQuestionItem } from '../types/master-schema.ts';
import { syncItemToSupabase } from './itemSyncService';
import { supabase } from '../lib/supabase';

// Detect environment for API URL
const getApiBase = () => {
    // Check for Node.js process.env
    if (typeof process !== 'undefined' && process.env && process.env.API_URL) {
        return process.env.API_URL;
    }
    // Check for Vite import.meta.env (suppress TS error for Node context)
    try {
        // @ts-ignore
        if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
            // @ts-ignore
            return import.meta.env.VITE_API_URL;
        }
    } catch (e) {
        // ignore
    }
    return 'http://localhost:4000/api';
};

const API_BASE = getApiBase();

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

export async function updateItem(item: MasterQuestionItem): Promise<boolean> {
    const res = await fetch(`${API_BASE}/items/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (res.ok) {
        await syncItemToSupabase(item);
    }
    return res.ok;
}

export async function getBankItems(options: ItemQueryOptions = {}): Promise<PaginatedResult> {
    const params = new URLSearchParams();
    if (options.page) params.append('page', String(options.page));
    if (options.limit) params.append('limit', String(options.limit));
    if (options.search) params.append('search', options.search);
    if (options.topic) params.append('topic', options.topic);
    if (options.type) params.append('type', options.type);
    if (options.status) params.append('status', options.status);
    if (options.sortField) params.append('sortField', options.sortField);
    if (options.sortDir) params.append('sortDir', options.sortDir);

    const res = await fetch(`${API_BASE}/items?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch items');
    return res.json();
}

export async function saveItemToBank(item: MasterQuestionItem): Promise<boolean> {
    const res = await fetch(`${API_BASE}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
    });
    if (res.ok) {
        // Sync to Supabase
        await syncItemToSupabase(item);
    }
    return res.ok;
}

export async function saveBatchToBank(items: MasterQuestionItem[]): Promise<number> {
    const res = await fetch(`${API_BASE}/items/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(items),
    });
    if (!res.ok) throw new Error('Batch save failed');
    const data = await res.json();
    // Sync each item to Supabase
    for (const it of items) {
        await syncItemToSupabase(it);
    }
    return data.added ?? 0;
}

export async function deleteItemFromBank(id: string): Promise<void> {
    await fetch(`${API_BASE}/items/${id}`, { method: 'DELETE' });
    // Delete from Supabase as well
    await supabase.from('ngn_items').delete().eq('id', id);
}

export async function clearBank(): Promise<void> {
    await fetch(`${API_BASE}/clear`, { method: 'DELETE' });
    // Clear Supabase table
    await supabase.from('ngn_items').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all rows
}

export async function deleteBatchFromBank(ids: string[]): Promise<void> {
    await fetch(`${API_BASE}/items`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids),
    });
    // Delete each from Supabase
    for (const id of ids) {
        await supabase.from('ngn_items').delete().eq('id', id);
    }
}
