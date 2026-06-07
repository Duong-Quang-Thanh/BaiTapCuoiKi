from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Major

router = APIRouter(
    prefix="/majors",
    tags=["Majors"]
)

@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return db.query(Major).all()

@router.get("/university/{university_id}")
def get_by_university(
    university_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Major)
        .filter(
            Major.university_id == university_id
        )
        .all()
    )

@router.put("/{id}")
def update_major(
    id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    major = (
        db.query(Major)
        .filter(
            Major.id == id
        )
        .first()
    )

    major.name = data["name"]

    db.commit()

    return {
        "message": "Updated"
    }

@router.delete("/{id}")
def delete_major(
    id: int,
    db: Session = Depends(get_db)
):
    major = (
        db.query(Major)
        .filter(
            Major.id == id
        )
        .first()
    )

    if major:
        db.delete(major)
        db.commit()

    return {
        "message": "Deleted"
    }