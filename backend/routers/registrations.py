from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional

from db import query

router = APIRouter()


class RegistrationCreate(BaseModel):
    student_id: str
    event_id: str


class RegistrationDelete(BaseModel):
    student_id: str
    event_id: str


@router.get("")
def get_registrations(
    student_id: Optional[str] = Query(None),
    event_id: Optional[str] = Query(None),
    include_past: Optional[str] = Query(None),
):
    if not student_id and not event_id:
        raise HTTPException(status_code=400, detail="student_id or event_id is required")

    try:
        if event_id:
            sql = """
                SELECT u.name, u.email, r.registration_time
                FROM Registrations r
                JOIN Users u ON r.student_id = u.user_id
                WHERE r.event_id = %s
            """
            return query(sql, [event_id])

        elif student_id:
            sql = """
                SELECT r.*, e.*
                FROM Registrations r
                JOIN Event_Status_View e ON r.event_id = e.event_id
                WHERE r.student_id = %s
            """
            if include_past != "true":
                sql += " AND e.date >= CURRENT_DATE"
            return query(sql, [student_id])

        return []
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching registrations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch registrations")


@router.post("", status_code=201)
def create_registration(body: RegistrationCreate):
    try:
        if not body.student_id or not body.event_id:
            raise HTTPException(status_code=400, detail="student_id and event_id are required")

        query(
            "INSERT INTO Registrations (student_id, event_id, registration_time) VALUES (%s, %s, NOW())",
            [body.student_id, body.event_id],
        )
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating registration: {e}")
        msg = str(e)
        if "violates" in msg or "full" in msg:
            raise HTTPException(status_code=400, detail="Event is full or already registered")
        raise HTTPException(status_code=500, detail="Registration failed")


@router.delete("")
def delete_registration(body: RegistrationDelete):
    try:
        if not body.student_id or not body.event_id:
            raise HTTPException(status_code=400, detail="student_id and event_id are required")

        query(
            "DELETE FROM Registrations WHERE student_id = %s AND event_id = %s",
            [body.student_id, body.event_id],
        )
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting registration: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete registration")
