-- ==============================================================================
-- POSTGRESQL MIGRATION: NGN MODE POLICY ARCHITECTURE
-- Designed for Master NGN Simulator Platform
-- Date: 2026-01-13
-- ==============================================================================

-- 1. MODE POLICIES TABLE
-- This table stores reusable configuration objects that define "how" a session behaves.
-- Separating policy from session data allows us to tweak "Exam Mode" rules globally
-- without having to update every single historical session record.

CREATE TABLE IF NOT EXISTS public.ngn_mode_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,              -- e.g., "Standard Tutor", "Strict Exam", "Timed Drill"
    slug VARCHAR(50) UNIQUE NOT NULL,        -- e.g., "tutor_default", "exam_strict"
    description TEXT,
    
    -- UI CONTROL FLAGS (The "Rules of Engagement")
    allow_navigation_back BOOLEAN DEFAULT TRUE,  -- False for CAT/Exam
    show_rationale_immediate BOOLEAN DEFAULT TRUE, -- True for Tutor, False for Exam
    show_timer_overall BOOLEAN DEFAULT FALSE,    -- True for Exam
    show_timer_per_item BOOLEAN DEFAULT FALSE,   -- True for Drills
    allow_pause BOOLEAN DEFAULT TRUE,            -- False for Strict Exam
    allow_hints BOOLEAN DEFAULT TRUE,            -- True for Tutor (if implemented)
    allow_notes BOOLEAN DEFAULT TRUE,            -- Usually True for all
    allow_highlighting BOOLEAN DEFAULT TRUE,     -- Usually True for all (accessibility)
    allow_calculator VARCHAR(20) DEFAULT 'basic',-- 'none', 'basic', 'scientific'
    
    -- FEEDBACK & REMEDIATION
    feedback_timing VARCHAR(20) DEFAULT 'immediate', -- 'immediate', 'end_of_session'
    show_correct_answer_key BOOLEAN DEFAULT TRUE,    -- False might be used for "blind" assessments
    remediation_links_enabled BOOLEAN DEFAULT TRUE,  -- Show links to videos/articles?
    
    -- INTEGRITY & AUDIT
    strict_lockdown_enabled BOOLEAN DEFAULT FALSE,   -- Triggers browser lockdown integration if available
    track_focus_loss BOOLEAN DEFAULT FALSE,          -- Track tab switching?
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SESSIONS TABLE UPDATES
-- We attach the policy to the session itself. The 'session_config' JSON field 
-- allows for infinite flexibility in defining the "blueprint" (which items, domains, etc.)
-- without cluttering the schema with 50 columns.

ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS session_type VARCHAR(50) DEFAULT 'review', -- 'review', 'cat_exam', 'readiness_assessment', 'custom_quiz'
ADD COLUMN IF NOT EXISTS mode_policy_id UUID REFERENCES public.ngn_mode_policies(id),
ADD COLUMN IF NOT EXISTS blueprint_locked BOOLEAN DEFAULT FALSE,    -- If True, the item list cannot be changed (integrity)
ADD COLUMN IF NOT EXISTS session_config JSONB DEFAULT '{}'::JSONB;  -- Stores the distribution rules, active domains, timer settings specific to this instance

-- 3. ATTEMPTS TABLE UPDATES (Telemetry)
-- We need to track HOW the student interacted with the item.
-- Did they guess? Did they panic-switch answers?
-- Note: We do NOT duplicate item data here. Only the interaction.

ALTER TABLE public.attempts
ADD COLUMN IF NOT EXISTS hint_used BOOLEAN DEFAULT FALSE,           -- Did they click the "Hint" button? (Tutor only)
ADD COLUMN IF NOT EXISTS answer_reversals INTEGER DEFAULT 0,        -- Count of times they switched answer before submitting
ADD COLUMN IF NOT EXISTS time_spent_ms INTEGER,                     -- Precise timing for stamina analysis
ADD COLUMN IF NOT EXISTS marked_for_review BOOLEAN DEFAULT FALSE,   -- Student flagged this item
ADD COLUMN IF NOT EXISTS confidence_rating INTEGER CHECK (confidence_rating BETWEEN 1 AND 5), -- Optional metacognitive check
ADD COLUMN IF NOT EXISTS safety_breach BOOLEAN DEFAULT FALSE;       -- (Computed) Did they miss a fatal distractor?

-- ==============================================================================
-- SEED DATA: DEFAULT POLICIES
-- ==============================================================================

INSERT INTO public.ngn_mode_policies (name, slug, description, allow_navigation_back, show_rationale_immediate, show_timer_overall, allow_pause, allow_hints, feedback_timing)
VALUES 
(
    'Standard Tutor Mode', 
    'tutor_default', 
    'Low-stress learning environment with immediate feedback and navigation freedom.',
    TRUE,   -- Navigation Back: YES
    TRUE,   -- Rationale: IMMEDIATE
    FALSE,  -- Timer: Hidden
    TRUE,   -- Pause: YES
    TRUE,   -- Hints: YES
    'immediate' 
),
(
    'Strict Exam Simulation', 
    'exam_strict', 
    'High-fidelity simulation matching NCLEX constraints. No feedback until completion.',
    FALSE,  -- Navigation Back: NO (Forward only)
    FALSE,  -- Rationale: HIDDEN
    TRUE,   -- Timer: VISIBLE
    FALSE,  -- Pause: NO (unless accommodation)
    FALSE,  -- Hints: NO
    'end_of_session' -- Feedback: ONLY AT END
)
ON CONFLICT (slug) DO NOTHING;

-- ==============================================================================
-- INDEXING FOR PERFORMANCE
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_sessions_mode_policy ON public.sessions(mode_policy_id);
CREATE INDEX IF NOT EXISTS idx_attempts_integrity ON public.attempts(session_id, answer_reversals);
