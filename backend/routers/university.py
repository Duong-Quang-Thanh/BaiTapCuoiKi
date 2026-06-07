from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from backend.database import get_db
from backend.models import University

router = APIRouter(
    prefix="/universities",
    tags=["Universities"]
)

# ======================
# SCHEMA
# ======================
class UniversityCreate(BaseModel):
    name: str


# ======================
# GET ALL UNIVERSITIES
# ======================
@router.get("/")
def get_universities(db: Session = Depends(get_db)):
    return db.query(University).all()


# ======================
# CREATE UNIVERSITY
# ======================
@router.post("/")
def create_university(
    data: UniversityCreate,
    db: Session = Depends(get_db)
):
    university = University(
        name=data.name
    )

    db.add(university)
    db.commit()
    db.refresh(university)

    return {
        "message": "Thêm thành công",
        "id": university.id
    }


# ======================
# DELETE UNIVERSITY
# ======================
@router.delete("/{id}")
def delete_university(
    id: int,
    db: Session = Depends(get_db)
):
    university = db.query(University).filter(University.id == id).first()

    if not university:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy"
        )

    db.delete(university)
    db.commit()

    return {
        "message": "Đã xóa"
    }


# ======================
# UPDATE UNIVERSITY
# ======================
@router.put("/{id}")
def update_university(
    id: int,
    data: UniversityCreate,
    db: Session = Depends(get_db)
):
    university = db.query(University).filter(University.id == id).first()

    if not university:
        raise HTTPException(
            status_code=404,
            detail="Không tìm thấy"
        )

    university.name = data.name

    db.commit()
    db.refresh(university)

    return {
        "message": "Cập nhật thành công"
    }