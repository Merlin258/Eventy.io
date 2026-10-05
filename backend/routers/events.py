import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from db import query

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------

class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    date: Optional[str] = None
    time: Optional[str] = None
    venue: Optional[str] = None
    total_seats: Optional[int] = None


class EventUpdate(EventCreate):
    event_id: str


class EventDelete(BaseModel):
    event_id: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _format_date(dt) -> str:
    """Format a date to 'Sep 15' style, matching the original JS behaviour."""
    if dt is None:
        return "TBD"
    if isinstance(dt, (datetime.date, datetime.datetime)):
        return f"{dt.strftime('%b')} {dt.day}"
    return str(dt)


def _format_time(t) -> str:
    if t is None:
        return "TBD"
    if isinstance(t, datetime.time):
        return t.strftime("%H:%M")
    return str(t) or "TBD"


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.get("")
def get_events():
    try:
        rows = query("SELECT * FROM Event_Status_View")
        events = [
            {
                "id": row["event_id"],
                "title": row["name"],
                "category": row.get("category") or "Academic",
                "date": _format_date(row.get("date")),
                "time": _format_time(row.get("time")),
                "location": row.get("venue") or "TBD",
                "attendeeCount": int(row.get("total_registered") or 0),
                "capacity": int(row.get("total_seats") or 0),
                "gradient": "bg-gradient-to-br from-indigo-600 to-violet-700",
            }
            for row in rows
        ]
        return {"events": events}
    except Exception as e:
        print(f"Error fetching events: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch events")


@router.post("", status_code=201)
def create_event(body: EventCreate):
    try:
        # Auto-generate event_id
        rows = query("SELECT event_id FROM Events ORDER BY event_id DESC LIMIT 1")
        next_id = "EVT-1001"

        if rows and rows[0]["event_id"].startswith("EVT-"):
            last_num = rows[0]["event_id"].replace("EVT-", "")
            if last_num.isdigit():
                next_id = f"EVT-{int(last_num) + 1}"

        query(
            "INSERT INTO Events (event_id, name, description, category, date, time, venue, total_seats) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
            [next_id, body.name, body.description, body.category,
             body.date, body.time, body.venue, body.total_seats],
        )

        new_rows = query("SELECT * FROM Events WHERE event_id = %s", [next_id])
        return new_rows[0] if new_rows else {"event_id": next_id}
    except Exception as e:
        print(f"Error creating event: {e}")
        raise HTTPException(status_code=500, detail="Failed to create event")


@router.put("")
def update_event(body: EventUpdate):
    try:
        if not body.event_id:
            raise HTTPException(status_code=400, detail="event_id is required")

        query(
            "UPDATE Events SET name=%s, description=%s, category=%s, date=%s, "
            "time=%s, venue=%s, total_seats=%s WHERE event_id=%s",
            [body.name, body.description, body.category, body.date,
             body.time, body.venue, body.total_seats, body.event_id],
        )

        rows = query("SELECT * FROM Events WHERE event_id = %s", [body.event_id])
        if not rows:
            raise HTTPException(status_code=404, detail="Event not found")
        return rows[0]
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating event: {e}")
        raise HTTPException(status_code=500, detail="Failed to update event")


@router.delete("")
def delete_event(body: EventDelete):
    try:
        if not body.event_id:
            raise HTTPException(status_code=400, detail="event_id is required")
        query("DELETE FROM Events WHERE event_id = %s", [body.event_id])
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting event: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete event")
