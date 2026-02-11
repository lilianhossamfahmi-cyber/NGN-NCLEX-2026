-- Migration: Add v2.1 Protection System Fields to item_bank
-- Description: Adds content_version, supersedes_id, and retired_at columns to support published item protection.

-- 1. Add Columns
ALTER TABLE item_bank 
ADD COLUMN IF NOT EXISTS content_version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS supersedes_id UUID,
ADD COLUMN IF NOT EXISTS retired_at TIMESTAMPTZ;

-- 2. Add Index for Versioning/Audit Trail
CREATE INDEX IF NOT EXISTS idx_item_bank_supersedes ON item_bank(supersedes_id);
CREATE INDEX IF NOT EXISTS idx_item_bank_retired ON item_bank(retired_at) WHERE retired_at IS NOT NULL;

-- 3. Update existing records (Optional: set defaults if necessary, though DEFAULT 1 handles version)
-- UPDATE item_bank SET content_version = 1 WHERE content_version IS NULL;

-- 4. RPC for Atomic Retirement (Optional but recommended)
-- This allows updating the retired_at field inside the item_jsonb blob efficiently
CREATE OR REPLACE FUNCTION jsonb_set_retired_at(retired_at_val TEXT) 
RETURNS jsonb AS $$
BEGIN
  -- This assumes item_json is the column name in the table this is called on
  -- However, since it's a generic RPC, it's better used in a specific way.
  -- For now, the application will handle the JSON merge.
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
