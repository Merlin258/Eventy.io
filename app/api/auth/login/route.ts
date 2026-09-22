import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password, role } = await req.json();
    
    // Frontend sends "admin", database stores "organizer"
    const dbRole = role === 'admin' ? 'organizer' : role;
    
    const { rows } = await query('SELECT * FROM Users WHERE email = $1 AND role = $2', [email, dbRole]);
    
    if (rows.length === 0 || rows[0].password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }
    
    const user = rows[0];
    const sessionData = { user_id: user.user_id, role: user.role, name: user.name };
    
    const cookieStore = await cookies();
    cookieStore.set('session', JSON.stringify(sessionData), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });
    
    const redirectTo = dbRole === 'organizer' ? '/dashboard/admin' : '/dashboard/students';
    
    return NextResponse.json({ success: true, user: sessionData, redirectTo });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Login failed' }, { status: 500 });
  }
}
