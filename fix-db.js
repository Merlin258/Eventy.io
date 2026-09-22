const { Pool } = require('pg');
const pool = new Pool({
  connectionString: 'postgresql://postgres:greagory@localhost:5432/postgres',
});

async function run() {
  await pool.query(`UPDATE Users SET name = 'Rajiv A R', email = 'rajiv@amrita.edu', password = 'pass123' WHERE user_id = 'AM.SC.U4CSE25243'`);
  console.log('Fixed Rajiv user record.');
  
  const res = await pool.query('SELECT user_id, email, password FROM Users');
  console.log(res.rows);
  await pool.end();
}
run();
