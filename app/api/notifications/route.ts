import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const student_id = searchParams.get('student_id');
  
  if (!student_id) {
    return NextResponse.json({ error: 'student_id is required' }, { status: 400 });
  }
  
  try {
    const { rows } = await query(
      'SELECT * FROM Notifications WHERE student_id = $1 AND clear_date > NOW() ORDER BY notification_id DESC',
      [student_id]
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { notification_id } = await req.json();
    
    if (!notification_id) {
      return NextResponse.json({ error: 'notification_id is required' }, { status: 400 });
    }
    
    await query('DELETE FROM Notifications WHERE notification_id = $1', [notification_id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
