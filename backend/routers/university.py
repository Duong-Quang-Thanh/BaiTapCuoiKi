from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import University

router = APIRouter(
    prefix="/universities",
    tags=["Universities"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Lấy danh sách trường
@router.get("/")
def get_universities(
    db: Session = Depends(get_db)
):
    return db.query(
        University
    ).all()


# Thêm trường
@router.post("/")
def create_university(
    data: dict,
    db: Session = Depends(get_db)
):
    university = University(
        name=data["name"],
        description=data.get(
            "description",
            ""
        )
    )

    db.add(university)
    db.commit()

    return {
        "message": "Thêm thành công"
    }


# Xóa trường
@router.delete("/{id}")
def delete_university(
    id: int,
    db: Session = Depends(get_db)
):
    university = (
        db.query(University)
        .filter(
            University.id == id
        )
        .first()
    )

    if not university:
        return {
            "message": "Không tìm thấy"
        }

    db.delete(university)
    db.commit()

    return {
        "message": "Đã xóa"
    }