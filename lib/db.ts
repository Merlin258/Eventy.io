import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = async (text: string, params?: any[]) => {
  if (!process.env.DATABASE_URL) {
    console.warn("No DATABASE_URL provided. Returning empty rows.");
    return { rows: [] };
  }
  
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error', err);
    throw err;
  }
};
