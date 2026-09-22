const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:greagory@localhost:5432/postgres',
});

async function test() {
  // Simulate what /api/registrations does
  const { rows } = await pool.query(`
    SELECT r.*, e.* 
    FROM Registrations r
    JOIN Event_Status_View e ON r.event_id = e.event_id
    WHERE r.student_id = $1
  `, ['AM.SC.U4CSE25243']);
  
  console.log('=== Raw registrations response ===');
  console.log('Row count:', rows.length);
  if (rows.length > 0) {
    console.log('First row keys:', Object.keys(rows[0]));
    console.log('First row:', JSON.stringify(rows[0], null, 2));
  }
  
  // Check what registeredIds would contain
  const ids = rows.map(r => r.event_id);
  console.log('\n=== registeredIds set would be ===');
  console.log(ids);
  
  // Simulate what /api/events returns
  const eventsRes = await pool.query('SELECT * FROM Event_Status_View');
  const events = eventsRes.rows.map(row => ({
    id: row.event_id,
    title: row.name,
  }));
  console.log('\n=== Event IDs from /api/events ===');
  console.log(events.map(e => e.id));
  
  // Check match
  const regSet = new Set(ids);
  console.log('\n=== Match check ===');
  events.forEach(e => {
    console.log(`${e.id} (${e.title}): isRegistered=${regSet.has(e.id)}`);
  });
  
  await pool.end();
}
test();
