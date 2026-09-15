-- ArchiveAI database schema
-- Tables: users, articles, interviews, footage_notes, tags, document_tags, searches

-- Users (for attribution and ownership)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    display_name TEXT,
    email TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Articles
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    author TEXT,
    source TEXT,
    published_date DATE,
    summary TEXT,
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    doc_type TEXT DEFAULT 'article',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Interviews
CREATE TABLE IF NOT EXISTS interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    interviewer TEXT,
    interviewee TEXT,
    transcript TEXT,
    audio_url TEXT,
    recorded_date DATE,
    summary TEXT,
    language VARCHAR(10) DEFAULT 'en',
    doc_type TEXT DEFAULT 'interview',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Footage notes
CREATE TABLE IF NOT EXISTS footage_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    creator TEXT,
    location TEXT,
    notes TEXT,
    video_url TEXT,
    recorded_date DATE,
    duration_seconds INTEGER,
    language VARCHAR(10) DEFAULT 'en',
    doc_type TEXT DEFAULT 'footage',
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tags (shared across documents)
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Document tags mapping (polymorphic via doc_type + doc_id)
CREATE TABLE IF NOT EXISTS document_tags (
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    doc_type TEXT NOT NULL,
    doc_id UUID NOT NULL,
    PRIMARY KEY (tag_id, doc_type, doc_id)
);

-- Search history
CREATE TABLE IF NOT EXISTS searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    query TEXT NOT NULL,
    filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes to speed up text search (Postgres full-text search suggestions)
CREATE INDEX IF NOT EXISTS articles_fulltext_idx ON articles USING GIN (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(content,''))
);

CREATE INDEX IF NOT EXISTS interviews_fulltext_idx ON interviews USING GIN (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(transcript,''))
);

CREATE INDEX IF NOT EXISTS footage_fulltext_idx ON footage_notes USING GIN (
    to_tsvector('english', coalesce(title,'') || ' ' || coalesce(notes,''))
);

-- Trigger helpers to keep updated_at fresh
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated_at BEFORE UPDATE ON articles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER interviews_updated_at BEFORE UPDATE ON interviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER footage_updated_at BEFORE UPDATE ON footage_notes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional extension for UUID generation: pgcrypto or uuid-ossp
-- Example: CREATE EXTENSION IF NOT EXISTS pgcrypto;
