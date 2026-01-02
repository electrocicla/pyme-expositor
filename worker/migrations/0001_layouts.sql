-- Create persisted editor layouts table

CREATE TABLE IF NOT EXISTS layouts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  elements_json TEXT NOT NULL,
  is_preset INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_layouts_updated ON layouts(updated_at);
CREATE INDEX IF NOT EXISTS idx_layouts_name ON layouts(name);
