// src/services/sessionAuditDbService.ts
// REFACTORED: SQLite removed to prevent server crash on Railway.
// All functions are no-ops. TODO: Migrate to Supabase if needed.

// Types expected by SessionGeneratorService
export interface DriftMetrics {
    totalRequested: number;
    totalSelected: number;
    avgDifficultyDelta: number;
    maxDifficultyDelta: number;
    driftWarning: boolean;
}

export interface FallbackEvent {
    requestedLevel: number;
    needed: number;
    foundExact: number;
    filled: number;
    sources: any[];
}

export async function initAuditDb() {
    console.log('Audit DB (SQLite) disabled for cloud compatibility.');
    return null;
}

// Main audit function used by SessionGeneratorService
export async function logSessionAudit(
    _sessionId: string,
    _action: string,
    _driftMetrics?: DriftMetrics,
    _fallbackEvents?: FallbackEvent[],
    _details?: any
) {
    // console.log(`[AUDIT] ${_sessionId}: ${_action}`, { _driftMetrics, _fallbackEvents, _details });
    return; // No-op for now
}

export async function logSessionAction(_sessionId: string, _action: string, _details?: any) {
    return; // No-op
}

export async function getSessionLogs(_sessionId: string) {
    return []; // Return empty
}
