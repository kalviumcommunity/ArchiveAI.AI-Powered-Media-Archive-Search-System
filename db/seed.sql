-- Seed data for ArchiveAI (minimal samples)
-- Note: run after enabling pgcrypto: CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Sample users
INSERT INTO users (id, username, display_name, email)
VALUES
  (gen_random_uuid(), 'admin', 'Administrator', 'admin@example.com')
ON CONFLICT (username) DO NOTHING;

-- Sample tags
INSERT INTO tags (name) VALUES
  ('politics'), ('science'), ('interview'), ('footage'), ('archive')
ON CONFLICT (name) DO NOTHING;

-- Sample article
INSERT INTO articles (id, title, author, source, published_date, summary, content, language)
VALUES (
  gen_random_uuid(),
  'Sample Article on ArchiveAI',
  'Jane Reporter',
  'News Daily',
  '2026-01-15',
  'A short summary of the sample article.',
  'Full article content goes here. This is a demo entry for ArchiveAI.',
  'en'
)
ON CONFLICT DO NOTHING;

-- Sample interview
INSERT INTO interviews (id, title, interviewer, interviewee, transcript, recorded_date, summary)
VALUES (
  gen_random_uuid(),
  'Interview with Scientist',
  'Host One',
  'Dr. Research',
  'Transcript text excerpt...',
  '2025-12-01',
  'Discussion about research and archives.'
)
ON CONFLICT DO NOTHING;

-- Sample footage note
INSERT INTO footage_notes (id, title, creator, location, notes, video_url, recorded_date, duration_seconds)
VALUES (
  gen_random_uuid(),
  'City Rally Footage',
  'Camera Team',
  'Downtown',
  'Notes about footage content and timestamps.',
  'https://example.com/video.mp4',
  '2025-11-20',
  345
)
ON CONFLICT DO NOTHING;
