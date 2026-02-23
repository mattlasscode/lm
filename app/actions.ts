'use server';

import { createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function getLists() {
  const supabase = createServerClient();
  const { data: lists, error } = await supabase
    .from('lists')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return lists || [];
}

export async function getListWithItems(listId: number) {
  const supabase = createServerClient();
  
  const { data: list, error: listError } = await supabase
    .from('lists')
    .select('*')
    .eq('id', listId)
    .single();
  
  if (listError) throw listError;
  
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('*')
    .eq('list_id', listId)
    .order('completed', { ascending: true })
    .order('created_at', { ascending: false });
  
  if (itemsError) throw itemsError;
  
  const itemsWithCompletions = await Promise.all(
    (items || []).map(async (item: any) => {
      const { data: completions } = await supabase
        .from('completions')
        .select('*')
        .eq('item_id', item.id)
        .order('created_at', { ascending: false });
      
      return { ...item, completions: completions || [] };
    })
  );
  
  return { list, items: itemsWithCompletions };
}

export async function createList(formData: FormData) {
  const supabase = createServerClient();
  const name = formData.get('name') as string;
  const emoji = formData.get('emoji') as string;
  const color = formData.get('color') as string;
  
  const { data, error } = await supabase
    .from('lists')
    .insert({ name, emoji, color })
    .select()
    .single();
  
  if (error) throw error;
  
  revalidatePath('/');
  return data.id;
}

export async function updateList(listId: number, formData: FormData) {
  const supabase = createServerClient();
  const name = formData.get('name') as string;
  const emoji = formData.get('emoji') as string;
  const color = formData.get('color') as string;
  
  const { error } = await supabase
    .from('lists')
    .update({ name, emoji, color, updated_at: new Date().toISOString() })
    .eq('id', listId);
  
  if (error) throw error;
  
  revalidatePath('/');
  revalidatePath(`/list/${listId}`);
}

export async function deleteList(listId: number) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);
  
  if (error) throw error;
  revalidatePath('/');
}

export async function createItem(listId: number, text: string, createdBy?: string) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('items')
    .insert({ list_id: listId, text, created_by: createdBy || null })
    .select()
    .single();
  
  if (error) throw error;
  
  revalidatePath(`/list/${listId}`);
  return data.id;
}

export async function toggleItemComplete(itemId: number, listId: number) {
  const supabase = createServerClient();
  
  const { data: item, error: fetchError } = await supabase
    .from('items')
    .select('completed')
    .eq('id', itemId)
    .single();
  
  if (fetchError) throw fetchError;
  
  const { error } = await supabase
    .from('items')
    .update({
      completed: !item.completed,
      completed_at: item.completed ? null : new Date().toISOString()
    })
    .eq('id', itemId);
  
  if (error) throw error;
  
  revalidatePath(`/list/${listId}`);
}

export async function deleteItem(itemId: number, listId: number) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
  revalidatePath(`/list/${listId}`);
}

export async function addCompletion(itemId: number, listId: number, formData: FormData) {
  const supabase = createServerClient();
  const comment = formData.get('comment') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  const { error } = await supabase
    .from('completions')
    .insert({
      item_id: itemId,
      comment: comment || null,
      image_url: imageUrl || null
    });
  
  if (error) throw error;
  
  revalidatePath(`/list/${listId}`);
}

export async function uploadImage(formData: FormData) {
  const supabase = createServerClient();
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  const filename = `${Date.now()}-${file.name}`;
  const bytes = await file.arrayBuffer();
  
  const { data, error } = await supabase.storage
    .from('list-images')
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: false
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('list-images')
    .getPublicUrl(filename);
  
  return publicUrl;
}

// Slovak learning actions
export async function getTodaysSlovakWord() {
  const supabase = createServerClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('slovak_words')
    .select('*')
    .eq('date', today)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getAllSlovakWords() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('slovak_words')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function createSlovakWord(formData: FormData) {
  const supabase = createServerClient();
  const wordSlovak = formData.get('wordSlovak') as string;
  const wordEnglish = formData.get('wordEnglish') as string;
  const date = formData.get('date') as string;
  const notes = formData.get('notes') as string;
  
  const { data, error } = await supabase
    .from('slovak_words')
    .insert({
      word_slovak: wordSlovak,
      word_english: wordEnglish,
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || null
    })
    .select()
    .single();
  
  if (error) throw error;
  revalidatePath('/slovak');
  return data.id;
}

export async function updateSlovakWordAudio(wordId: number, person: 'matt' | 'leila', audioUrl: string) {
  const supabase = createServerClient();
  const field = person === 'matt' ? 'matt_audio_url' : 'leila_audio_url';
  
  const { error } = await supabase
    .from('slovak_words')
    .update({ [field]: audioUrl })
    .eq('id', wordId);
  
  if (error) throw error;
  revalidatePath('/slovak');
}

export async function uploadAudio(formData: FormData) {
  const supabase = createServerClient();
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  const filename = `${Date.now()}-${file.name}`;
  const bytes = await file.arrayBuffer();
  
  const { data, error } = await supabase.storage
    .from('audio-recordings')
    .upload(filename, bytes, {
      contentType: file.type,
      upsert: false
    });
  
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('audio-recordings')
    .getPublicUrl(filename);
  
  return publicUrl;
}
