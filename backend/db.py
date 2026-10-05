import os
import psycopg2
import psycopg2.pool
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

# Load .env from project root (parent of backend/)
load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

DATABASE_URL = os.getenv("DATABASE_URL")

_pool = None


def get_pool():
    global _pool
    if _pool is None:
        if not DATABASE_URL:
            raise RuntimeError("No DATABASE_URL environment variable set.")
        _pool = psycopg2.pool.SimpleConnectionPool(1, 10, dsn=DATABASE_URL)
    return _pool


def query(sql: str, params=None):
    """Execute a SQL query and return rows as a list of dicts."""
    if not DATABASE_URL:
        print("Warning: No DATABASE_URL provided. Returning empty list.")
        return []

    pool = get_pool()
    conn = pool.getconn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(sql, params)
            rows = [dict(row) for row in cur.fetchall()] if cur.description else []
            conn.commit()
            return rows
    except Exception as e:
        conn.rollback()
        print(f"Database query error: {e}")
        raise
    finally:
        pool.putconn(conn)


def close_pool():
    global _pool
    if _pool:
        _pool.closeall()
        _pool = None
