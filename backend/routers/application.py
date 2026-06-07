from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

import shutil
import uuid
from sqlalchemy.orm import Session
from fastapi import Depends

from database import SessionLocal
from models import Application

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...)
):

    filename = (
        str(uuid.uuid4())
        + "_"
        + file.filename
    )

    path = f"uploads/{filename}"

    with open(path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "file_path": filename
    }

@router.post("/")
def create_application(
    data: dict,
    db: Session = Depends(get_db)
):

    application = Application(
        user_id=data["user_id"],
        university_name=data["university_name"],
        major_name=data["major_name"],
        score=data["score"],
        document_path=data["document_path"],
        note=data.get("note", ""),
        status="pending"
    )

    db.add(application)
    db.commit()

    return {
        "message": "Nộp hồ sơ thành công"
    }

@router.get("/")
def get_applications(
    db: Session = Depends(get_db)
):
    applications = db.query(
        Application
    ).all()

    result = []

    for item in applications:
        result.append({
            "id": item.id,
            "user_id": item.user_id,
            "university_name":
                item.university_name,
            "major_name":
                item.major_name,
            "score": item.score,
            "status": item.status,
            "document_path":
                item.document_path
        })

    return result

@router.put("/{id}/approve")
def approve_application(
    id: int,
    db: Session = Depends(get_db)
):

    application = db.query(
        Application
    ).filter(
        Application.id == id
    ).first()

    application.status = "approved"

    db.commit()

    return {
        "message": "Đã duyệt"
    }

@router.put("/{id}/reject")
def reject_application(
    id: int,
    db: Session = Depends(get_db)
):

    application = db.query(
        Application
    ).filter(
        Application.id == id
    ).first()

    application.status = "rejected"

    db.commit()

    return {
        "message": "Đã từ chối"
    }
@router.get("/user/{user_id}")
def get_by_user(
    user_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Application)
        .filter(
            Application.user_id
            == user_id
        )
        .all()
    )