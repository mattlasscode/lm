-- Create tables for the shared notes app
-- Run this in your Supabase SQL Editor

-- Lists table
CREATE TABLE IF NOT EXISTS lists (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  emoji TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items table
CREATE TABLE IF NOT EXISTS items (
  id BIGSERIAL PRIMARY KEY,
  list_id BIGINT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_list_id ON items(list_id);
CREATE INDEX IF NOT EXISTS idx_completions_item_id ON completions(item_id);

-- Enable Row Level Security (RLS)
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we're using password auth)
CREATE POLICY "Allow all operations on lists" ON lists FOR ALL USING (true);
CREATE POLICY "Allow all operations on items" ON items FOR ALL USING (true);
CREATE POLICY "Allow all operations on completions" ON completions FOR ALL USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('list-images', 'list-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy
CREATE POLICY "Allow public uploads" ON storage.objects FOR ALL USING (bucket_id = 'list-images');
