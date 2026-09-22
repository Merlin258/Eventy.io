import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [{ rows: regRows }, { rows: eventRows }, { rows: recentRows }] = await Promise.all([
      query('SELECT COUNT(*) as count FROM Registrations'),
      query('SELECT COUNT(*) as count FROM Events WHERE date >= CURRENT_DATE'),
      query(`
        SELECT r.student_id, u.name as student_name, e.name as event_name, r.registration_time 
        FROM Registrations r 
        JOIN Users u ON r.student_id = u.user_id 
        JOIN Events e ON r.event_id = e.event_id 
        ORDER BY r.registration_time DESC 
        LIMIT 10
      `)
    ]);

    return NextResponse.json({
      totalRegistrations: Number(regRows[0]?.count || 0),
      activeEvents: Number(eventRows[0]?.count || 0),
      recentActivity: recentRows
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
