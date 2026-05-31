from fastapi import APIRouter
from schemas import UserCreate

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(user: UserCreate):
    return {
        "message": "Đăng ký thành công",
        "user": user
    }


@router.post("/login")
def login(data: dict):
    return {
        "message": "Đăng nhập thành công"
    }