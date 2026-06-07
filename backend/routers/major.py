from fastapi import *
from sqlalchemy.orm import *

from database import SessionLocal
from models import Major

router = APIRouter(
    prefix="/majors",
    tags=["Majors"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
def get_all(
    db: Session = Depends(get_db)
):
    return db.query(Major).all()

@router.get(
    "/university/{university_id}"
)
def get_by_university(
    university_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Major)
        .filter(
            Major.university_id
            == university_id
        )
        .all()
    )