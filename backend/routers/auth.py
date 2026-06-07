from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database import SessionLocal
from backend.models import User
from backend.hash import hash_password, verify_password
from backend.security import create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)

# ======================
# DB DEPENDENCY
# ======================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ======================
# SCHEMAS
# ======================
class RegisterRequest(BaseModel):
    full_name: str
    email: str
    phone: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


class RegisterResponse(BaseModel):
    message: str


class LoginResponse(BaseModel):
    access_token: str
    role: str
    user_id: int
    full_name: str
    email: str


# ======================
# REGISTER
# ======================
@router.post("/register", response_model=RegisterResponse)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):
    # check email exists
    user = db.query(User).filter(User.email == data.email).first()

    if user:
        raise HTTPException(
            status_code=400,
            detail="Email đã tồn tại"
        )

    new_user = User(
        full_name=data.full_name,
        email=data.email,
        phone=data.phone,
        password=hash_password(data.password),
        role="student"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Đăng ký thành công"
    }


# ======================
# LOGIN
# ======================
@router.post("/login", response_model=LoginResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == data.email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Sai tài khoản"
        )

    if not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=401,
            detail="Sai mật khẩu"
        )

    token = create_access_token({
        "id": user.id,
        "role": user.role
    })

    return {
        "access_token": token,
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }