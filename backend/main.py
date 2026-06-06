from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import auth
from routers import application
from routers import admin
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(application.router)
app.include_router(admin.router)


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