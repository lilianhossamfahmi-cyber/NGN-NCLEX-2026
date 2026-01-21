-- Create the item_bank table used by the Admin Dashboard and Analytics
-- This ensures the database matches the code in itemApiService.ts

CREATE TABLE IF NOT EXISTS public.item_bank (
    id TEXT PRIMARY KEY,
    type_id TEXT NOT NULL,
    clinical_focus TEXT,
    difficulty_level INTEGER NOT NULL DEFAULT 1,
    cjmm_step TEXT,
    client_needs TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by TEXT DEFAULT 'system',
    updated_by TEXT DEFAULT 'system',
    status TEXT NOT NULL DEFAULT 'draft',
    quality_score INTEGER NOT NULL DEFAULT 0,
    tags TEXT,
    allowed_modes TEXT[] DEFAULT '{}',
    item_json JSONB NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_item_bank_type ON public.item_bank(type_id);
CREATE INDEX IF NOT EXISTS idx_item_bank_status ON public.item_bank(status);
CREATE INDEX IF NOT EXISTS idx_item_bank_focus ON public.item_bank(clinical_focus);

-- Enable RLS
ALTER TABLE public.item_bank ENABLE ROW LEVEL SECURITY;

-- Allow all for now (as per existing project policy)
CREATE POLICY "Allow All Access" ON public.item_bank FOR ALL USING (true) WITH CHECK (true);
