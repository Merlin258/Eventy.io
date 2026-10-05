from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from db import close_pool
from routers import events, registrations, notifications, auth, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    close_pool()


app = FastAPI(title="Eventy.io API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Return errors as {"error": "..."} to match the original API contract."""
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})


app.include_router(events.router, prefix="/api/events", tags=["Events"])
app.include_router(registrations.router, prefix="/api/registrations", tags=["Registrations"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
