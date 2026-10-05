import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const user = JSON.parse(session.value);
    // Fetch latest from DB to ensure it's up to date
    const { rows } = await query('SELECT user_id, name, email, role FROM Users WHERE user_id = $1', [user.user_id]);
    if (rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: rows[0] });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  
  if (!session?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const user = JSON.parse(session.value);
    const { name, password } = await req.json();
    
    if (password) {
      await query('UPDATE Users SET name = $1, password = $2 WHERE user_id = $3', [name, password, user.user_id]);
    } else {
      await query('UPDATE Users SET name = $1 WHERE user_id = $2', [name, user.user_id]);
    }

    // Update session cookie
    const updatedSession = { ...user, name };
    cookieStore.set('session', JSON.stringify(updatedSession), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24
    });
    
    return NextResponse.json({ success: true, user: updatedSession });
  } catch (error) {
    console.error("Failed to update profile", error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
