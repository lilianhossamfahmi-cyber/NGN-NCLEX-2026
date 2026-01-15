-- MIGRATION: 001_phase1_complete_schema.sql
-- Description: Core NGN Infrastructure (Phase 1)
-- Date: 2026-01-11

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- -----------------------------------------------------------------------------
-- 1. NGN_STUDENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ngn_students (
    student_id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    institution_id UUID,
    subscription_status TEXT DEFAULT 'active',
    subscription_tier TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login_at TIMESTAMPTZ,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- RLS
ALTER TABLE public.ngn_students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own profile" ON public.ngn_students 
    FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Users update own profile" ON public.ngn_students 
    FOR UPDATE USING (auth.uid() = student_id);

-- -----------------------------------------------------------------------------
-- 2. NGN_ITEMS (Item Bank)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ngn_items (
    item_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content JSONB NOT NULL,
    item_type TEXT NOT NULL,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    topic_focus TEXT,
    expert_score INTEGER,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    version INTEGER DEFAULT 1,
    author_id UUID REFERENCES public.ngn_students(student_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_items_type_diff ON public.ngn_items (item_type, difficulty_level, status);
CREATE INDEX IF NOT EXISTS idx_items_gin ON public.ngn_items USING GIN (content);

-- RLS
ALTER TABLE public.ngn_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public items are viewable by all" ON public.ngn_items 
    FOR SELECT USING (status = 'published');
CREATE POLICY "Admins full access" ON public.ngn_items 
    USING (EXISTS (SELECT 1 FROM public.ngn_students WHERE student_id = auth.uid() AND role = 'admin'));

-- -----------------------------------------------------------------------------
-- 3. NGN_SESSIONS (Quiz Attempts)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ngn_sessions (
    session_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.ngn_students(student_id),
    mode TEXT NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    start_time TIMESTAMPTZ DEFAULT NOW(),
    end_time TIMESTAMPTZ,
    duration_seconds INTEGER,
    total_items INTEGER DEFAULT 0,
    score_raw INTEGER DEFAULT 0,
    score_percentage NUMERIC(5,2),
    current_difficulty_theta NUMERIC(4,2)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_sessions_student ON public.ngn_sessions (student_id, start_time DESC);

-- RLS
ALTER TABLE public.ngn_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own sessions" ON public.ngn_sessions 
    USING (auth.uid() = student_id);

-- -----------------------------------------------------------------------------
-- 4. NGN_RESPONSES (Answers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ngn_responses (
    response_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id UUID REFERENCES public.ngn_sessions(session_id),
    student_id UUID REFERENCES public.ngn_students(student_id),
    item_id UUID REFERENCES public.ngn_items(item_id),
    student_answer JSONB NOT NULL,
    is_correct BOOLEAN,
    score_awarded NUMERIC(4,2),
    time_spent_seconds INTEGER,
    changed_answer_count INTEGER DEFAULT 0,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_responses_session ON public.ngn_responses (session_id);

-- RLS
ALTER TABLE public.ngn_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students manage own responses" ON public.ngn_responses 
    USING (auth.uid() = student_id);

-- -----------------------------------------------------------------------------
-- 5. NGN_METRICS (Analytics)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ngn_metrics (
    metric_id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES public.ngn_students(student_id),
    domain TEXT,
    metric_date DATE DEFAULT CURRENT_DATE,
    items_attempted INTEGER DEFAULT 0,
    items_correct INTEGER DEFAULT 0,
    average_time_seconds NUMERIC(6,2),
    difficulty_average NUMERIC(4,2),
    performance_index NUMERIC(4,2)
);

-- Indices
CREATE INDEX IF NOT EXISTS idx_metrics_student ON public.ngn_metrics (student_id, domain);

-- RLS
ALTER TABLE public.ngn_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students view own metrics" ON public.ngn_metrics 
    FOR SELECT USING (auth.uid() = student_id);

-- -----------------------------------------------------------------------------
-- TRIGGERS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_ngn_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.ngn_students (student_id, email, full_name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'student')
  ON CONFLICT (student_id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_ngn ON auth.users;
CREATE TRIGGER on_auth_user_created_ngn
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_ngn_user();
