// src/services/modePolicyService.ts
/**
 * Mode Policy Service
 * -------------------
 * Provides helper functions for retrieving mode policies from the database
 * and applying them to session creation.
 *
 * This file is deliberately framework‑agnostic – you can import it from
 * whichever server layer (e.g. Express, Fastify, Nest) you use.
 */
import { Pool } from 'pg';

// ---------------------------------------------------------------------------
// 1️⃣  DATABASE POOL
// ---------------------------------------------------------------------------
// The pool should be instantiated once in your app entry point and passed
// around. For the sake of this example we create a simple singleton.
const pool = new Pool({
    // NOTE: Replace these placeholders with your actual connection details.
    // They can also be supplied via environment variables (PGHOST, PGUSER, etc.)
    connectionString: process.env.DATABASE_URL,
});

// ---------------------------------------------------------------------------
// 2️⃣  TYPE DEFINITIONS
// ---------------------------------------------------------------------------
export interface ModePolicy {
    id: string;
    name: string;
    slug: string;
    description?: string;
    // UI control flags
    allow_navigation_back: boolean;
    show_rationale_immediate: boolean;
    show_timer_overall: boolean;
    show_timer_per_item: boolean;
    allow_pause: boolean;
    allow_hints: boolean;
    allow_notes: boolean;
    allow_highlighting: boolean;
    allow_calculator: string;
    // Feedback & remediation
    feedback_timing: string;
    show_correct_answer_key: boolean;
    remediation_links_enabled: boolean;
    // Integrity & audit
    strict_lockdown_enabled: boolean;
    track_focus_loss: boolean;
}

export interface SessionConfig {
    session_name?: string;
    exam_name?: string;
    mode_slug: string;
    item_selection: {
        source_bank: string;
        filters: {
            domains?: string[];
            cjmm_focus?: string[];
            difficulty_range?: [number, number];
            item_types?: string[];
        };
        limit: number;
        order: 'random' | 'sequential';
    };
    // Tutor‑specific
    coaching_settings?: {
        remediation_depth: 'light' | 'deep';
        micro_drills_enabled: boolean;
    };
    // Exam‑specific
    timing?: {
        duration_minutes: number;
        auto_submit_on_timeout: boolean;
        scheduled_breaks?: Array<{ after_item: number; duration_minutes: number }>;
    };
    adaptive_engine_config?: {
        algorithm: string;
        min_items: number;
        max_items: number;
        passing_standard: number;
        domains_distribution: Record<string, number>;
    };
    security?: {
        browser_lockdown: boolean;
        track_focus_loss: boolean;
        ip_whitelist?: string[] | null;
    };
}

// ---------------------------------------------------------------------------
// 3️⃣  FETCH POLICY BY SLUG
// ---------------------------------------------------------------------------
/**
 * Retrieve a ModePolicy from the DB by its slug.
 * Throws if not found – callers can catch and fallback to a default.
 */
export async function getPolicyBySlug(slug: string): Promise<ModePolicy> {
    const { rows } = await pool.query(
        `SELECT * FROM ngn_mode_policies WHERE slug = $1 LIMIT 1`,
        [slug]
    );
    if (rows.length === 0) {
        throw new Error(`Mode policy not found for slug: ${slug}`);
    }
    // PostgreSQL returns snake_case column names; map to camelCase for TS.
    const p = rows[0] as any;
    return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        allow_navigation_back: p.allow_navigation_back,
        show_rationale_immediate: p.show_rationale_immediate,
        show_timer_overall: p.show_timer_overall,
        show_timer_per_item: p.show_timer_per_item,
        allow_pause: p.allow_pause,
        allow_hints: p.allow_hints,
        allow_notes: p.allow_notes,
        allow_highlighting: p.allow_highlighting,
        allow_calculator: p.allow_calculator,
        feedback_timing: p.feedback_timing,
        show_correct_answer_key: p.show_correct_answer_key,
        remediation_links_enabled: p.remediation_links_enabled,
        strict_lockdown_enabled: p.strict_lockdown_enabled,
        track_focus_loss: p.track_focus_loss,
    };
}

// ---------------------------------------------------------------------------
// 4️⃣  CREATE SESSION WITH POLICY
// ---------------------------------------------------------------------------
/**
 * Helper to create a new session row that is bound to a specific policy.
 * Returns the newly created session ID.
 */
export async function createSessionWithPolicy(
    config: SessionConfig,
    userId: string
): Promise<string> {
    // 1️⃣ Load the policy
    const policy = await getPolicyBySlug(config.mode_slug);

    // 2️⃣ Insert the session row – we store the whole JSON config for audit.
    const { rows } = await pool.query(
        `INSERT INTO sessions (user_id, session_type, mode_policy_id, session_config, blueprint_locked, created_at)
     VALUES ($1, $2, $3, $4::jsonb, $5, NOW())
     RETURNING id`,
        [
            userId,
            // session_type derived from mode – simple mapping
            config.mode_slug === 'exam_strict' ? 'cat_exam' : 'review',
            policy.id,
            JSON.stringify(config),
            // Blueprint is locked for exam mode, mutable for tutor mode
            config.mode_slug === 'exam_strict',
        ]
    );
    return rows[0].id;
}

// ---------------------------------------------------------------------------
// 5️⃣  EXPORTED OBJECT
// ---------------------------------------------------------------------------
export const ModePolicyService = {
    getPolicyBySlug,
    createSessionWithPolicy,
};

// ---------------------------------------------------------------------------
// 6️⃣  NOTES FOR INTEGRATION
// ---------------------------------------------------------------------------
/**
 * • When a session is started from the API, call `createSessionWithPolicy`
 *   with the JSON payload the frontend sends (see mode_policy_config_examples.json).
 * • The `session_config` column stores the exact request – this guarantees a
 *   complete audit trail and prevents post‑creation tampering.
 * • `blueprint_locked` is set to true for exam mode; the backend must reject
 *   any subsequent item‑selection updates for that session.
 * • All attempt rows (`attempts` table) automatically inherit the `mode_policy_id`
 *   via the foreign‑key relationship on `session_id`.
 */
