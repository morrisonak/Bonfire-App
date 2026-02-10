-- Cache table for agency API responses
CREATE TABLE IF NOT EXISTS agency_cache (
  agency_name TEXT PRIMARY KEY,
  response_data TEXT NOT NULL,
  fetched_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

CREATE INDEX idx_agency_cache_expires ON agency_cache(expires_at);

-- Historical opportunity tracking
CREATE TABLE IF NOT EXISTS opportunities_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  agency_name TEXT NOT NULL,
  project_id TEXT NOT NULL,
  project_name TEXT NOT NULL,
  reference_id TEXT,
  date_open TEXT,
  date_close TEXT,
  first_seen_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  UNIQUE(agency_name, project_id)
);

CREATE INDEX idx_opportunities_agency ON opportunities_history(agency_name);
CREATE INDEX idx_opportunities_close ON opportunities_history(date_close);
