CREATE TABLE IF NOT EXISTS repair_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL REFERENCES item_bank(id),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  mutation_class TEXT NOT NULL CHECK (mutation_class IN ('COSMETIC', 'STRUCTURAL')),
  action_taken TEXT NOT NULL CHECK (action_taken IN ('UPDATE_IN_PLACE', 'FORK_NEW_ITEM', 'REJECTED')),
  changed_paths TEXT[] DEFAULT '{}',
  before_snapshot JSONB,
  after_snapshot JSONB,
  repair_source TEXT NOT NULL DEFAULT 'ultraFixer',
  content_version_before INTEGER,
  content_version_after INTEGER,
  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_repair_audit_item ON repair_audit_log(item_id);
CREATE INDEX IF NOT EXISTS idx_repair_audit_time ON repair_audit_log(timestamp DESC);
