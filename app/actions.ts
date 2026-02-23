'use server';

import db from '@/lib/db';
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
  const lists = db.prepare('SELECT * FROM lists ORDER BY created_at DESC').all();
  return lists;
}

export async function getListWithItems(listId: number) {
  await requireAuth();
  const list = db.prepare('SELECT * FROM lists WHERE id = ?').get(listId);
  const items = db.prepare(`
    SELECT * FROM items 
    WHERE list_id = ? 
    ORDER BY completed ASC, created_at DESC
  `).all(listId);
  
  const itemsWithCompletions = items.map((item: any) => {
    const completions = db.prepare(`
      SELECT * FROM completions 
      WHERE item_id = ? 
      ORDER BY created_at DESC
    `).all(item.id);
    return { ...item, completions };
  });
  
  return { list, items: itemsWithCompletions };
}

export async function createList(formData: FormData) {
  await requireAuth();
  const name = formData.get('name') as string;
  const emoji = formData.get('emoji') as string;
  const color = formData.get('color') as string;
  
  const result = db.prepare(`
    INSERT INTO lists (name, emoji, color) 
    VALUES (?, ?, ?)
  `).run(name, emoji, color);
  
  revalidatePath('/');
  return result.lastInsertRowid;
}

export async function updateList(listId: number, formData: FormData) {
  await requireAuth();
  const name = formData.get('name') as string;
  const emoji = formData.get('emoji') as string;
  const color = formData.get('color') as string;
  
  db.prepare(`
    UPDATE lists 
    SET name = ?, emoji = ?, color = ?, updated_at = CURRENT_TIMESTAMP 
    WHERE id = ?
  `).run(name, emoji, color, listId);
  
  revalidatePath('/');
  revalidatePath(`/list/${listId}`);
}

export async function deleteList(listId: number) {
  await requireAuth();
  db.prepare('DELETE FROM lists WHERE id = ?').run(listId);
  revalidatePath('/');
}

export async function createItem(listId: number, text: string) {
  await requireAuth();
  const result = db.prepare(`
    INSERT INTO items (list_id, text) 
    VALUES (?, ?)
  `).run(listId, text);
  
  revalidatePath(`/list/${listId}`);
  return result.lastInsertRowid;
}

export async function toggleItemComplete(itemId: number, listId: number) {
  await requireAuth();
  const item = db.prepare('SELECT completed FROM items WHERE id = ?').get(itemId) as any;
  
  db.prepare(`
    UPDATE items 
    SET completed = ?, completed_at = ? 
    WHERE id = ?
  `).run(item.completed ? 0 : 1, item.completed ? null : new Date().toISOString(), itemId);
  
  revalidatePath(`/list/${listId}`);
}

export async function deleteItem(itemId: number, listId: number) {
  await requireAuth();
  db.prepare('DELETE FROM items WHERE id = ?').run(itemId);
  revalidatePath(`/list/${listId}`);
}

export async function addCompletion(itemId: number, listId: number, formData: FormData) {
  await requireAuth();
  const comment = formData.get('comment') as string;
  const imageUrl = formData.get('imageUrl') as string;
  
  db.prepare(`
    INSERT INTO completions (item_id, comment, image_url) 
    VALUES (?, ?, ?)
  `).run(itemId, comment || null, imageUrl || null);
  
  revalidatePath(`/list/${listId}`);
}

export async function uploadImage(formData: FormData) {
  await requireAuth();
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }
  
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fs = require('fs').promises;
  const path = require('path');
  
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(uploadsDir, filename);
  
  await fs.writeFile(filepath, buffer);
  
  return `/uploads/${filename}`;
}
