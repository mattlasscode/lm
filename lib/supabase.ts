import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client (for server actions and API routes)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

// Client-side client (for browser usage)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type List = {
  id: number;
  name: string;
  emoji: string;
  color: string;
  created_at: string;
  updated_at: string;
};

export type Item = {
  id: number;
  list_id: number;
  text: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
};

export type Completion = {
  id: number;
  item_id: number;
  comment: string | null;
  image_url: string | null;
  created_at: string;
};
