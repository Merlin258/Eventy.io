import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const student_id = searchParams.get('student_id');
  const event_id = searchParams.get('event_id');
  const include_past = searchParams.get('include_past');
  
  if (!student_id && !event_id) {
    return NextResponse.json({ error: 'student_id or event_id is required' }, { status: 400 });
  }
  
  try {
    if (event_id) {
      // Fetch attendees for a specific event
      const sql = `
        SELECT u.name, u.email, r.registration_time
        FROM Registrations r
        JOIN Users u ON r.student_id = u.user_id
        WHERE r.event_id = $1
      `;
      const { rows } = await query(sql, [event_id]);
      return NextResponse.json(rows);
    } else if (student_id) {
      // Fetch events for a specific student
      let sql = `
        SELECT r.*, e.* 
        FROM Registrations r
        JOIN Event_Status_View e ON r.event_id = e.event_id
        WHERE r.student_id = $1
      `;
      
      if (include_past !== 'true') {
        sql += ' AND e.date >= CURRENT_DATE';
      }
      
      const { rows } = await query(sql, [student_id]);
      return NextResponse.json(rows);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { student_id, event_id } = await req.json();
    
    if (!student_id || !event_id) {
      return NextResponse.json({ error: 'student_id and event_id are required' }, { status: 400 });
    }
    
    await query(
      'INSERT INTO Registrations (student_id, event_id, registration_time) VALUES ($1, $2, NOW())',
      [student_id, event_id]
    );
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating registration:', error);
    if (error.message?.includes('violates') || error.message?.includes('full')) {
      return NextResponse.json({ error: 'Event is full or already registered' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { student_id, event_id } = await req.json();
    
    if (!student_id || !event_id) {
      return NextResponse.json({ error: 'student_id and event_id are required' }, { status: 400 });
    }
    
    await query('DELETE FROM Registrations WHERE student_id = $1 AND event_id = $2', [student_id, event_id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting registration:', error);
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 });
  }
}
