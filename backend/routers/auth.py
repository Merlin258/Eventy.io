import json

from fastapi import APIRouter, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional

from db import query

router = APIRouter()

SESSION_MAX_AGE = 60 * 60 * 24  # 1 day in seconds


class LoginRequest(BaseModel):
    email: str
    password: str
    role: str


class ProfileUpdate(BaseModel):
    name: str
    password: Optional[str] = None


# ---------------------------------------------------------------------------
# POST /api/auth/login
# ---------------------------------------------------------------------------

@router.post("/login")
def login(body: LoginRequest, response: Response):
    try:
        # Frontend sends "admin", database stores "organizer"
        db_role = "organizer" if body.role == "admin" else body.role

        rows = query(
            "SELECT * FROM Users WHERE email = %s AND role = %s",
            [body.email, db_role],
        )

        if not rows or rows[0]["password"] != body.password:
            return JSONResponse(
                status_code=401,
                content={"success": False, "error": "Invalid credentials"},
            )

        user = rows[0]
        session_data = {
            "user_id": user["user_id"],
            "role": user["role"],
            "name": user["name"],
        }

        response.set_cookie(
            key="session",
            value=json.dumps(session_data),
            httponly=True,
            path="/",
            max_age=SESSION_MAX_AGE,
        )

        redirect_to = "/dashboard/admin" if db_role == "organizer" else "/dashboard/students"
        return {"success": True, "user": session_data, "redirectTo": redirect_to}

    except Exception as e:
        print(f"Login error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": "Login failed"},
        )


# ---------------------------------------------------------------------------
# POST /api/auth/logout
# ---------------------------------------------------------------------------

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="session", path="/")
    return {"success": True}


# ---------------------------------------------------------------------------
# GET /api/auth/me
# ---------------------------------------------------------------------------

@router.get("/me")
def get_me(request: Request):
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})

    try:
        session = json.loads(session_cookie)
        rows = query(
            "SELECT user_id, name, email, role FROM Users WHERE user_id = %s",
            [session["user_id"]],
        )
        if not rows:
            return JSONResponse(status_code=404, content={"error": "User not found"})
        return {"user": rows[0]}
    except Exception:
        return JSONResponse(status_code=401, content={"error": "Invalid session"})


# ---------------------------------------------------------------------------
# PUT /api/auth/me
# ---------------------------------------------------------------------------

@router.put("/me")
def update_profile(body: ProfileUpdate, request: Request, response: Response):
    session_cookie = request.cookies.get("session")
    if not session_cookie:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})

    try:
        session = json.loads(session_cookie)

        if body.password:
            query(
                "UPDATE Users SET name = %s, password = %s WHERE user_id = %s",
                [body.name, body.password, session["user_id"]],
            )
        else:
            query(
                "UPDATE Users SET name = %s WHERE user_id = %s",
                [body.name, session["user_id"]],
            )

        updated_session = {**session, "name": body.name}
        response.set_cookie(
            key="session",
            value=json.dumps(updated_session),
            httponly=True,
            path="/",
            max_age=SESSION_MAX_AGE,
        )
        return {"success": True, "user": updated_session}

    except Exception as e:
        print(f"Failed to update profile: {e}")
        return JSONResponse(
            status_code=500, content={"error": "Failed to update profile"}
        )
