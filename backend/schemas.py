from pydantic import BaseModel


class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str
    phone: str
    role: str = "student"


class ApplicationCreate(BaseModel):
    user_id: int
    university_id: int
    major_id: int
    score: float
    note: str = ""