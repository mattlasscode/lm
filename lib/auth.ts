import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const CORRECT_PASSWORD = 'leslistesdeleilaetmatt';
const SESSION_COOKIE = 'lm_session';

export async function verifyPassword(password: string): Promise<boolean> {
  return password === CORRECT_PASSWORD;
}

export async function createSession() {
  const cookieStore = await cookies();
  const hashedSession = await bcrypt.hash(CORRECT_PASSWORD, 10);
  cookieStore.set(SESSION_COOKIE, hashedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE);
  return !!session;
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
