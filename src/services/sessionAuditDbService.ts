// src/services/sessionAuditDbService.ts
// REFACTORED: SQLite removed to prevent server crash on Railway.
// TODO: Migrate to Supabase if audit logging is needed.

interface SessionAuditLog {
    sessionId: string;
    timestamp: string;
    action: string;
    details?: any;
}

export async function initAuditDb() {
    console.log('Audit DB (SQLite) disabled for cloud compatibility.');
    return null;
}

export async function logSessionAction(sessionId: string, action: string, details?: any) {
    // console.log(`[AUDIT] ${sessionId}: ${action}`, details);
    return; // No-op
}

export async function getSessionLogs(sessionId: string) {
    return []; // Return empty
}
