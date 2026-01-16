// src/services/sessionAuditDbService.ts
// REFACTORED: SQLite removed to prevent server crash on Railway.
// All functions are no-ops. TODO: Migrate to Supabase if needed.

// Types expected by SessionGeneratorService
export interface DriftMetrics {
    totalDrift: number;
    maxSingleDrift: number;
    driftWarnings: string[];
}

export interface FallbackEvent {
    type: string;
    targetLevel: number;
    actualLevel: number;
    reason: string;
}

// Audit Log Entry
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

// Main audit function used by SessionGeneratorService
export async function logSessionAudit(
    sessionId: string,
    action: string,
    driftMetrics?: DriftMetrics,
    fallbackEvents?: FallbackEvent[],
    details?: any
) {
    // console.log(`[AUDIT] ${sessionId}: ${action}`, { driftMetrics, fallbackEvents, details });
    return; // No-op for now
}

export async function logSessionAction(sessionId: string, action: string, details?: any) {
    return; // No-op
}

export async function getSessionLogs(sessionId: string) {
    return []; // Return empty
}
