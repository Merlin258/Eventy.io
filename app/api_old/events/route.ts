import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { rows } = await query('SELECT * FROM Event_Status_View');
    
    if (rows.length === 0) {
      return NextResponse.json({ events: [] });
    }

    const events = rows.map((row: any) => ({
      id: row.event_id,
      title: row.name,
      category: row.category || 'Academic', 
      date: row.date ? new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD',
      time: row.time || 'TBD',
      location: row.venue || 'TBD',
      attendeeCount: Number(row.total_registered) || 0,
      capacity: Number(row.total_seats) || 0,
      gradient: 'bg-gradient-to-br from-indigo-600 to-violet-700'
    }));

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, description, category, date, time, venue, total_seats } = data;
    
    // Auto-generate event_id
    const { rows } = await query('SELECT event_id FROM Events ORDER BY event_id DESC LIMIT 1');
    let nextId = 'EVT-1001';
    
    if (rows.length > 0 && rows[0].event_id.startsWith('EVT-')) {
      const lastIdNum = parseInt(rows[0].event_id.replace('EVT-', ''), 10);
      if (!isNaN(lastIdNum)) {
        nextId = `EVT-${lastIdNum + 1}`;
      }
    }
    
    await query(
      'INSERT INTO Events (event_id, name, description, category, date, time, venue, total_seats) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [nextId, name, description, category, date, time, venue, total_seats]
    );
    
    const { rows: newRows } = await query('SELECT * FROM Events WHERE event_id = $1', [nextId]);
    
    return NextResponse.json(newRows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const data = await req.json();
    const { event_id, name, description, category, date, time, venue, total_seats } = data;
    
    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 });
    }
    
    await query(
      'UPDATE Events SET name = $1, description = $2, category = $3, date = $4, time = $5, venue = $6, total_seats = $7 WHERE event_id = $8',
      [name, description, category, date, time, venue, total_seats, event_id]
    );
    
    const { rows } = await query('SELECT * FROM Events WHERE event_id = $1', [event_id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const data = await req.json();
    const { event_id } = data;
    
    if (!event_id) {
      return NextResponse.json({ error: 'event_id is required' }, { status: 400 });
    }
    
    await query('DELETE FROM Events WHERE event_id = $1', [event_id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
