-- Complete Supabase Migration
-- Run this ONCE in your Supabase SQL Editor to set up everything

-- ============================================
-- PART 1: Core Tables
-- ============================================

-- Lists table
CREATE TABLE IF NOT EXISTS lists (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table (with user attribution)
CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  list_id BIGINT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Completions table
CREATE TABLE IF NOT EXISTS completions (
  id BIGSERIAL PRIMARY KEY,
  item_id BIGINT NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  comment TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PART 2: Slovak Learning
-- ============================================

-- Slovak words table for daily learning
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

-- ============================================
-- PART 3: Indexes
-- ============================================

CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
CREATE INDEX IF NOT EXISTS idx_completions_item_id ON completions(item_id);
CREATE INDEX IF NOT EXISTS idx_slovak_words_date ON slovak_words(date);

-- ============================================
-- PART 4: Row Level Security (RLS)
-- ============================================

ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE slovak_words ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (no auth required)
DROP POLICY IF EXISTS "Allow all operations on lists" ON lists;
CREATE POLICY "Allow all operations on lists" ON lists FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on items" ON items;
CREATE POLICY "Allow all operations on items" ON items FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on completions" ON completions;
CREATE POLICY "Allow all operations on completions" ON completions FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow all operations on slovak_words" ON slovak_words;
CREATE POLICY "Allow all operations on slovak_words" ON slovak_words FOR ALL USING (true);

-- ============================================
-- PART 5: Storage Buckets
-- ============================================

-- Bucket for list images
INSERT INTO storage.buckets (id, name, public)
VALUES ('list-images', 'list-images', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for audio recordings
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-recordings', 'audio-recordings', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- PART 6: Storage Policies
-- ============================================

DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
CREATE POLICY "Allow public uploads" ON storage.objects 
FOR ALL 
USING (bucket_id IN ('list-images', 'audio-recordings'));

-- ============================================
-- DONE! 🎉
-- ============================================
-- Your database is now ready for:
-- ✅ Shared lists with user attribution
-- ✅ Slovak learning with audio recordings
-- ✅ Image uploads for completed items
-- ✅ Full cloud persistence
