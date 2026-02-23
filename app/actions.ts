'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';

async function requireAuth() {
  const isAuthenticated = await verifySession();
  if (!isAuthenticated) {
    redirect('/login');
  }
}

export async function getLists() {
  await requireAuth();
  const { data: lists, error } = await supabase
    .from('lists')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return lists || [];
}

export async function getListWithItems(listId: number) {
  await requireAuth();
  
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
  await requireAuth();
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
  await requireAuth();
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
  await requireAuth();
  const { error } = await supabase
    .from('lists')
    .delete()
    .eq('id', listId);
  
  if (error) throw error;
  revalidatePath('/');
}

export async function createItem(listId: number, text: string) {
  await requireAuth();
  const { data, error } = await supabase
    .from('items')
    .insert({ list_id: listId, text })
    .select()
    .single();
  
  if (error) throw error;
  
  revalidatePath(`/list/${listId}`);
  return data.id;
}

export async function toggleItemComplete(itemId: number, listId: number) {
  await requireAuth();
  
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
  await requireAuth();
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', itemId);
  
  if (error) throw error;
  revalidatePath(`/list/${listId}`);
}

export async function addCompletion(itemId: number, listId: number, formData: FormData) {
  await requireAuth();
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
  await requireAuth();
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
