import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const supabase = createServerClient();
  const formData = await request.formData();
  const file = formData.get('file') as File;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const filename = `${Date.now()}-${file.name}`;
  const bytes = await file.arrayBuffer();

  const { data, error } = await supabase.storage
    .from('list-images')
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage
    .from('list-images')
    .getPublicUrl(filename);

  return NextResponse.json({ url: publicUrl });
}
