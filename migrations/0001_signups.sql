CREATE TABLE IF NOT EXISTS signups (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 first_name TEXT NOT NULL,
 email TEXT NOT NULL,
 event TEXT NOT NULL,
 consent_version TEXT NOT NULL,
 created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
 UNIQUE(email,event)
);
