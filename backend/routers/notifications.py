from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from db import query

router = APIRouter()


class NotificationDelete(BaseModel):
    notification_id: int


@router.get("")
def get_notifications(student_id: Optional[str] = Query(None)):
    if not student_id:
        return JSONResponse(
            status_code=400, content={"error": "student_id is required"}
        )

    try:
        rows = query(
            "SELECT * FROM Notifications WHERE student_id = %s AND clear_date > NOW() "
            "ORDER BY notification_id DESC",
            [student_id],
        )
        return rows
    except Exception as e:
        print(f"Error fetching notifications: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch notifications")


@router.delete("")
def delete_notification(body: NotificationDelete):
    try:
        if not body.notification_id:
            raise HTTPException(status_code=400, detail="notification_id is required")

        query(
            "DELETE FROM Notifications WHERE notification_id = %s",
            [body.notification_id],
        )
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting notification: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete notification")
