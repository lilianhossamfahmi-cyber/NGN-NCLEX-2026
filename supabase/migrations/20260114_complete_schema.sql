-- Complete ngn_items table schema for Admin Panel sync
-- Run this in Supabase SQL Editor

-- Ensure the table exists with all required columns
CREATE TABLE IF NOT EXISTS public.ngn_items (
    id TEXT PRIMARY KEY,
    type_id TEXT,
    prompt JSONB,
    options JSONB,
    pedagogy JSONB,
    metadata JSONB,
    allowed_modes TEXT[] DEFAULT '{}',
    item_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add any missing columns (safe to run multiple times)
DO $$ 
BEGIN
    -- type_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='type_id') THEN
        ALTER TABLE public.ngn_items ADD COLUMN type_id TEXT;
    END IF;
    
    -- prompt
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='prompt') THEN
        ALTER TABLE public.ngn_items ADD COLUMN prompt JSONB;
    END IF;
    
    -- options
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='options') THEN
        ALTER TABLE public.ngn_items ADD COLUMN options JSONB;
    END IF;
    
    -- pedagogy
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='pedagogy') THEN
        ALTER TABLE public.ngn_items ADD COLUMN pedagogy JSONB;
    END IF;
    
    -- metadata
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='metadata') THEN
        ALTER TABLE public.ngn_items ADD COLUMN metadata JSONB;
    END IF;
    
    -- allowed_modes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='allowed_modes') THEN
        ALTER TABLE public.ngn_items ADD COLUMN allowed_modes TEXT[] DEFAULT '{}';
    END IF;
    
    -- item_json (stores complete item for reconstruction)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='item_json') THEN
        ALTER TABLE public.ngn_items ADD COLUMN item_json JSONB;
    END IF;
    
    -- created_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='created_at') THEN
        ALTER TABLE public.ngn_items ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- updated_at
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ngn_items' AND column_name='updated_at') THEN
        ALTER TABLE public.ngn_items ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_ngn_items_type_id ON public.ngn_items(type_id);
CREATE INDEX IF NOT EXISTS idx_ngn_items_allowed_modes ON public.ngn_items USING GIN(allowed_modes);

-- Add helpful comments
COMMENT ON TABLE public.ngn_items IS 'NGN exam items synced from Admin Panel';
COMMENT ON COLUMN public.ngn_items.allowed_modes IS 'Array of modes: exam, tutor, memory_master, survival, exam_builder, clinical_cases';
COMMENT ON COLUMN public.ngn_items.item_json IS 'Complete item JSON for full data reconstruction';
