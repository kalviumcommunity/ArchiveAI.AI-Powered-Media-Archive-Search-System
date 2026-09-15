Database schema and usage for ArchiveAI

Files:
- schema.sql: Creates tables for `users`, `articles`, `interviews`, `footage_notes`, `tags`, `document_tags`, and `searches`.
- seed.sql: Minimal sample data for development.

Notes:
- The schema uses `gen_random_uuid()` for UUIDs. Enable `pgcrypto` in Postgres: `CREATE EXTENSION IF NOT EXISTS pgcrypto;`.
- Full-text search indexes are created using `to_tsvector`. Tune language and weights as needed.
- `document_tags` uses a polymorphic mapping (`doc_type` + `doc_id`) to relate tags to any document table.

Applying schema:
1. Connect to your Postgres DB.
2. Run `schema.sql` then `seed.sql`.

Example:
```
psql -d archiveai -f db/schema.sql
psql -d archiveai -f db/seed.sql
```
