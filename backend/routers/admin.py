from fastapi import APIRouter, HTTPException

from db import query

router = APIRouter()


@router.get("/stats")
def get_stats():
    try:
        reg_rows = query("SELECT COUNT(*) as count FROM Registrations")
        event_rows = query(
            "SELECT COUNT(*) as count FROM Events WHERE date >= CURRENT_DATE"
        )
        recent_rows = query(
            """
            SELECT r.student_id,
                   u.name  AS student_name,
                   e.name  AS event_name,
                   r.registration_time
            FROM Registrations r
            JOIN Users u ON r.student_id = u.user_id
            JOIN Events e ON r.event_id = e.event_id
            ORDER BY r.registration_time DESC
            LIMIT 10
            """
        )

        return {
            "totalRegistrations": int(reg_rows[0]["count"]) if reg_rows else 0,
            "activeEvents": int(event_rows[0]["count"]) if event_rows else 0,
            "recentActivity": recent_rows,
        }
    except Exception as e:
        print(f"Error fetching admin stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch stats")
