-- Migration V2: Add user attribution and Slovak learning feature

-- Add created_by column to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Create slovak_words table for daily Slovak learning
CREATE TABLE IF NOT EXISTS slovak_words (
  id BIGSERIAL PRIMARY KEY,
  word_slovak TEXT NOT NULL,
  word_english TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  matt_audio_url TEXT,
  leila_audio_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date)
);

-- Create index on date for quick lookups
CREATE INDEX IF NOT EXISTS idx_slovak_words_date ON slovak_words(date);

-- Enable RLS on slovak_words
ALTER TABLE slovak_words ENABLE ROW LEVEL SECURITY;

-- Create policy for slovak_words
CREATE POLICY "Allow all operations on slovak_words" ON slovak_words FOR ALL USING (true);

-- Create storage bucket for audio recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-recordings', 'audio-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for audio
CREATE POLICY "Allow public audio uploads" ON storage.objects FOR ALL USING (bucket_id = 'audio-recordings');
