from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
import os
import logging

from backend.routers import auth
from backend.routers import application
from backend.routers import admin
from backend.routers.university import router as university_router
from backend.routers import exam_combination
from backend.routers import major
from backend.database import Base
from backend.database import engine
from backend import models

# Setup logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create tables
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Error creating database tables: {e}")

app = FastAPI()

# Add CORS middleware FIRST (before all routes)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://localhost:8001",
        "http://localhost:8002",
        "http://127.0.0.1:8000",
        "http://127.0.0.1:8001",
        "http://127.0.0.1:8002",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Add custom exception handler for validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    logger.error(f"Validation error: {exc}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

# Include routers
app.include_router(
    university_router
)
app.include_router(auth.router)
app.include_router(application.router)
app.include_router(admin.router)
app.include_router(exam_combination.router)
app.include_router(major.router)


@app.get("/")
def root():
    return {
        "message": "Admission System API Running"
    }

if not os.path.exists("uploads"):
    os.makedirs("uploads")

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

from backend.routers.major import router as major_router

app.include_router(major_router)