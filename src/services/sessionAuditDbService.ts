
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initAuditDb() {
    if (db) return db;
    db = await open({
        filename: './itemBank.db', // Use same DB file
        driver: sqlite3.Database,
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS session_audits (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      mode TEXT,
      requested_config TEXT,
      actual_config TEXT,
      fallback_events TEXT,
      drift_metrics TEXT,
      created_at TEXT
    );
    CREATE INDEX IF NOT EXISTS ix_session_audits_created ON session_audits (created_at DESC);
    `);

    return db;
}

export interface SessionAuditLog {
    id: string;
    sessionId: string;
    mode: 'tutor' | 'exam';
    requestedConfig: any;
    actualConfig: any;
    fallbackEvents: FallbackEvent[];
    driftMetrics: DriftMetrics;
    createdAt: string;
}

export interface FallbackEvent {
    requestedLevel: number;
    needed: number;
    foundExact: number;
    filled: number;
    sources: { level: number, count: number }[];
}

export interface DriftMetrics {
    totalRequested: number;
    totalSelected: number;
    avgDifficultyDelta: number; // Average absolute deviation
    maxDifficultyDelta: number;
    driftWarning: boolean; // items drifted > 1.0 avg
}

export async function logSessionAudit(audit: SessionAuditLog): Promise<void> {
    const db = await initAuditDb();
    await db.run(
        `INSERT INTO session_audits (id, session_id, mode, requested_config, actual_config, fallback_events, drift_metrics, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        audit.id,
        audit.sessionId,
        audit.mode,
        JSON.stringify(audit.requestedConfig),
        JSON.stringify(audit.actualConfig),
        JSON.stringify(audit.fallbackEvents),
        JSON.stringify(audit.driftMetrics),
        audit.createdAt
    );
    console.log(`[SessionAudit] Logged audit for session ${audit.sessionId} (Fallback: ${audit.fallbackEvents.length > 0})`);
}
