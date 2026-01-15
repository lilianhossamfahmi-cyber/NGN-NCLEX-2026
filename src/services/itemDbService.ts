// src/services/itemDbService.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { MasterQuestionItem } from '../types/master-schema.ts';
import { enrichItemWithQuality } from '../utils/autoQuality.ts';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initDb() {
    if (db) return db;
    db = await open({
        filename: './itemBank.db',
        driver: sqlite3.Database,
    });

    await db.exec(`
  CREATE TABLE IF NOT EXISTS item_bank (
    id TEXT PRIMARY KEY,
    type_id TEXT NOT NULL,
    clinical_focus TEXT,
    difficulty_level INTEGER NOT NULL,
    cjmm_step TEXT,
    client_needs TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    status TEXT NOT NULL,
    quality_score INTEGER NOT NULL,
    tags TEXT,
    allowed_modes TEXT,
    item_json TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS ix_item_bank_type ON item_bank (type_id);
  CREATE INDEX IF NOT EXISTS ix_item_bank_difficulty ON item_bank (difficulty_level);
  CREATE INDEX IF NOT EXISTS ix_item_bank_status ON item_bank (status);
  CREATE INDEX IF NOT EXISTS ix_item_bank_created_at ON item_bank (created_at DESC);
  CREATE INDEX IF NOT EXISTS ix_item_bank_tags ON item_bank (tags);
`);

    const columns = await db.all('PRAGMA table_info(item_bank)');
    if (!columns.some((c: any) => c.name === 'allowed_modes')) {
        await db.exec('ALTER TABLE item_bank ADD COLUMN allowed_modes TEXT');
    }

    return db;
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
    const db = await initDb();

    let query = `SELECT item_json FROM item_bank WHERE 1=1`;
    let countQuery = `SELECT COUNT(*) as total FROM item_bank WHERE 1=1`;
    const params: any[] = [];

    if (options.search) {
        const term = `%${options.search}%`;
        const clause = ` AND item_json LIKE ?`;
        query += clause;
        countQuery += clause;
        params.push(term);
    }
    if (options.topic && options.topic !== 'All') {
        query += ` AND clinical_focus = ?`;
        countQuery += ` AND clinical_focus = ?`;
        params.push(options.topic);
    }
    if (options.type && options.type !== 'All') {
        query += ` AND type_id = ?`;
        countQuery += ` AND type_id = ?`;
        params.push(options.type);
    }
    if (options.status && options.status !== 'All') {
        query += ` AND status = ?`;
        countQuery += ` AND status = ?`;
        params.push(options.status);
    }

    const sortField = options.sortField || 'created_at';
    const sortDir = options.sortDir || 'desc';
    const allowedSorts = ['created_at', 'quality_score', 'difficulty_level', 'status', 'type_id'];
    const safeSort = allowedSorts.includes(sortField) ? sortField : 'created_at';
    query += ` ORDER BY ${safeSort} ${sortDir.toUpperCase()}`;

    const page = options.page || 1;
    const limit = options.limit || 50;
    const offset = (page - 1) * limit;
    query += ` LIMIT ? OFFSET ?`;

    const queryParams = [...params, limit, offset];

    const countRes = await db.get(countQuery, params);
    const total = countRes?.total || 0;

    const rows = await db.all(query, queryParams);
    const items = rows.map((r: any) => JSON.parse(r.item_json) as MasterQuestionItem);

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
    const db = await initDb();
    let added = 0;

    for (const item of items) {
        const enriched = enrichItemWithQuality(item);
        const now = new Date().toISOString();
        const { id, typeId, metadata, pedagogy } = enriched;

        let clinicalFocus = pedagogy?.clinicalFocus ?? (metadata as any)?.clinicalFocus;
        if (!clinicalFocus || clinicalFocus === 'General') {
            clinicalFocus = inferTopic(item);
        }

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

        const result = await db.run(
            `INSERT INTO item_bank (id, type_id, clinical_focus, difficulty_level, cjmm_step, client_needs,
            created_at, updated_at, created_by, updated_by, status, quality_score, tags, allowed_modes, item_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              item_json = excluded.item_json,
              updated_at = excluded.updated_at,
              updated_by = excluded.updated_by,
              status = excluded.status,
              clinical_focus = excluded.clinical_focus,
              quality_score = excluded.quality_score,
              tags = excluded.tags,
              allowed_modes = excluded.allowed_modes;`,
            id, typeId, clinicalFocus, difficultyLevel, cjmmStep, clientNeeds,
            now, now, userId, userId, status, score, tags,
            serializeArray((enriched as any).allowed_modes || []),
            itemJson
        );
        if (result.changes && result.changes > 0) added++;
    }
    return added;
}

export async function deleteItemFromBank(id: string): Promise<void> {
    const db = await initDb();
    await db.run(`DELETE FROM item_bank WHERE id = ?`, id);
}

export async function deleteBatchFromBank(ids: string[]): Promise<void> {
    if (!ids.length) return;
    const db = await initDb();
    const placeholders = ids.map(() => '?').join(',');
    await db.run(`DELETE FROM item_bank WHERE id IN (${placeholders})`, ...ids);
}

export async function clearBank(): Promise<void> {
    const db = await initDb();
    await db.run(`DELETE FROM item_bank`);
}
