CREATE TABLE IF NOT EXISTS telemetry_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  payload JSONB DEFAULT '{}',
  session_id TEXT,
  user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_telemetry_event_name ON telemetry_events(event_name);
CREATE INDEX IF NOT EXISTS idx_telemetry_created ON telemetry_events(created_at DESC);
