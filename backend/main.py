from fastapi import FastAPI
from routers import auth, application, admin

app = FastAPI()

app.include_router(auth.router)
app.include_router(application.router)
app.include_router(admin.router)