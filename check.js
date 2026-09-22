const { Pool } = require('pg');
const p = new Pool({ connectionString: 'postgresql://postgres:greagory@localhost:5432/postgres' });
p.query('SELECT user_id, name, email, role, password FROM Users')
  .then(r => { console.log(JSON.stringify(r.rows, null, 2)); p.end(); })
  .catch(e => { console.error(e.message); p.end(); });
