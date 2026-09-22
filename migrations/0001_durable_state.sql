CREATE TABLE IF NOT EXISTS nyxthea_state (
  collection TEXT NOT NULL,
  record_key TEXT NOT NULL,
  value TEXT NOT NULL CHECK (json_valid(value)),
  updated_at TEXT NOT NULL,
  PRIMARY KEY (collection, record_key)
) WITHOUT ROWID;

CREATE INDEX IF NOT EXISTS nyxthea_state_updated_at ON nyxthea_state (updated_at);
