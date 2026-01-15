-- Migration: Add allowed_modes column to ngn_items
-- Created: 2026-01-14

-- 1. Add the column if it doesn't exist
ALTER TABLE public.ngn_items 
ADD COLUMN IF NOT EXISTS allowed_modes text[] DEFAULT '{}';

-- 2. Create an index for faster filtering by mode
CREATE INDEX IF NOT EXISTS idx_ngn_items_allowed_modes 
ON public.ngn_items USING GIN (allowed_modes);

-- 3. Comment explaining the modes
COMMENT ON COLUMN public.ngn_items.allowed_modes IS 'Array of modes this item is available in: ["exam", "tutor", "memory_master", "clinical_cases", "survival", "exam_builder"]';
