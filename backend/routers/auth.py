from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from database import SessionLocal
from models import User

from hash import hash_password
from hash import verify_password

from security import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


@router.post("/register")
def register(
    data: dict,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email ==
            data["email"]
        )
        .first()
    )

    if user:
        raise HTTPException(
            status_code=400,
            detail="Email đã tồn tại"
        )

    new_user = User(
        full_name=data["full_name"],
        email=data["email"],
        phone=data["phone"],
        password=hash_password(
            data["password"]
        ),
        role="student"
    )

    db.add(new_user)

    db.commit()

    return {
        "message": "Đăng ký thành công"
    }


@router.post("/login")
def login(
    data: dict,
    db: Session = Depends(get_db)
):

    user = (
        db.query(User)
        .filter(
            User.email ==
            data["email"]
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Sai tài khoản"
        )

    if not verify_password(
        data["password"],
        user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Sai mật khẩu"
        )

    token = create_access_token(
        {
            "id": user.id,
            "role": user.role
        }
    )

    return {
        "access_token": token,
        "role": user.role,
        "user_id": user.id,
        "full_name": user.full_name,
        "email": user.email
    }