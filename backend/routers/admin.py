from fastapi import APIRouter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import SessionLocal
from models import Application
from openpyxl import Workbook
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


@router.get("/dashboard")
def dashboard():
    return {
        "total_applications": 120,
        "approved": 80,
        "rejected": 20,
        "pending": 20
    }
@router.get("/statistics")
def statistics(
    db: Session = Depends(get_db)
):
    total = db.query(
        Application
    ).count()

    approved = db.query(
        Application
    ).filter(
        Application.status == "approved"
    ).count()

    rejected = db.query(
        Application
    ).filter(
        Application.status == "rejected"
    ).count()

    pending = db.query(
        Application
    ).filter(
        Application.status == "pending"
    ).count()

    return {
        "total": total,
        "approved": approved,
        "rejected": rejected,
        "pending": pending
    }
@router.get("/export")
def export_excel(
    db: Session = Depends(get_db)
):

    workbook = Workbook()

    sheet = workbook.active

    sheet.append([
        "ID",
        "University",
        "Major",
        "Score",
        "Status"
    ])

    applications = db.query(
        Application
    ).all()

    for item in applications:
        sheet.append([
            item.id,
            item.university_name,
            item.major_name,
            item.score,
            item.status
        ])

    filename = "applications.xlsx"

    workbook.save(filename)

    return FileResponse(
        filename,
        filename=filename
    )