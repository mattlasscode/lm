import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, createSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  const isValid = await verifyPassword(password);

  if (isValid) {
    await createSession();
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
