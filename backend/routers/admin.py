from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from backend.database import SessionLocal
from backend.models import Application, Document, User, University, Major, AdmissionBatch

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

# ================== UTILITIES ==================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================== ENDPOINTS ==================

@router.get("/applications", response_model=list)
def get_all_applications(
    batch_id: Optional[int] = None,
    university_id: Optional[int] = None,
    major_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all applications with filtering options"""
    
    query = db.query(Application)
    
    if batch_id:
        query = query.filter(Application.batch_id == batch_id)
    if university_id:
        query = query.filter(Application.university_id == university_id)
    if major_id:
        query = query.filter(Application.major_id == major_id)
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.all()
    
    result = []
    for app in applications:
        user = db.query(User).filter(User.id == app.user_id).first()
        major = db.query(Major).filter(Major.id == app.major_id).first()
        university = db.query(University).filter(University.id == app.university_id).first()
        batch = db.query(AdmissionBatch).filter(AdmissionBatch.id == app.batch_id).first()
        documents = db.query(Document).filter(Document.application_id == app.id).all()
        
        result.append({
            "id": app.id,
            "user_id": app.user_id,
            "user_name": user.full_name if user else None,
            "user_email": user.email if user else None,
            "batch_name": batch.name if batch else None,
            "university_name": university.name if university else None,
            "major_name": major.name if major else None,
            "score": app.score,
            "status": app.status,
            "note": app.note,
            "submitted_date": app.submitted_date,
            "updated_date": app.updated_date,
            "documents_count": len(documents)
        })
    
    return result

@router.get("/applications/{application_id}")
def get_application_detail(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Get application detail with documents"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    user = db.query(User).filter(User.id == application.user_id).first()
    major = db.query(Major).filter(Major.id == application.major_id).first()
    university = db.query(University).filter(University.id == application.university_id).first()
    batch = db.query(AdmissionBatch).filter(AdmissionBatch.id == application.batch_id).first()
    documents = db.query(Document).filter(Document.application_id == application_id).all()
    
    return {
        "id": application.id,
        "user_id": application.user_id,
        "user_name": user.full_name if user else None,
        "user_email": user.email if user else None,
        "user_phone": user.phone if user else None,
        "batch_name": batch.name if batch else None,
        "university_name": university.name if university else None,
        "major_name": major.name if major else None,
        "score": application.score,
        "status": application.status,
        "note": application.note,
        "submitted_date": application.submitted_date,
        "updated_date": application.updated_date,
        "documents": [
            {
                "id": doc.id,
                "document_type": doc.document_type,
                "file_name": doc.file_name,
                "file_path": doc.file_path,
                "upload_date": doc.upload_date
            }
            for doc in documents
        ]
    }

@router.patch("/applications/{application_id}/status")
def update_application_status(
    application_id: int,
    status: str,
    note: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Update application status (approve/reject)"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Valid status values
    valid_statuses = ["pending", "approved", "rejected"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    application.status = status
    if note:
        application.note = note
    
    db.commit()
    db.refresh(application)
    
    return {
        "id": application.id,
        "status": application.status,
        "note": application.note,
        "updated_date": application.updated_date
    }

@router.get("/statistics")
def get_statistics(
    batch_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get admission statistics"""
    
    query = db.query(Application)
    if batch_id:
        query = query.filter(Application.batch_id == batch_id)
    
    # Count by status
    total = query.count()
    pending = query.filter(Application.status == "pending").count()
    approved = query.filter(Application.status == "approved").count()
    rejected = query.filter(Application.status == "rejected").count()
    
    # Count by university
    applications_by_university = {}
    university_query = db.query(
        University.name,
        func.count(Application.id).label('count')
    ).join(Application, Application.university_id == University.id)
    
    if batch_id:
        university_query = university_query.filter(Application.batch_id == batch_id)
    
    for uni_name, count in university_query.group_by(University.name).all():
        applications_by_university[uni_name] = count
    
    # Count by major
    applications_by_major = {}
    major_query = db.query(
        Major.name,
        func.count(Application.id).label('count')
    ).join(Application, Application.major_id == Major.id)
    
    if batch_id:
        major_query = major_query.filter(Application.batch_id == batch_id)
    
    for major_name, count in major_query.group_by(Major.name).all():
        applications_by_major[major_name] = count
    
    return {
        "total_applications": total,
        "pending_count": pending,
        "approved_count": approved,
        "rejected_count": rejected,
        "applications_by_university": applications_by_university,
        "applications_by_major": applications_by_major
    }

@router.get("/batches")
def get_admission_batches(
    db: Session = Depends(get_db)
):
    """Get all admission batches"""
    
    batches = db.query(AdmissionBatch).all()
    
    return [
        {
            "id": batch.id,
            "name": batch.name,
            "description": batch.description,
            "start_date": batch.start_date,
            "end_date": batch.end_date
        }
        for batch in batches
    ]

@router.get("/dashboard")
def get_dashboard(
    db: Session = Depends(get_db)
):
    """Get admin dashboard overview"""
    
    total = db.query(Application).count()
    pending = db.query(Application).filter(Application.status == "pending").count()
    approved = db.query(Application).filter(Application.status == "approved").count()
    rejected = db.query(Application).filter(Application.status == "rejected").count()
    
    return {
        "total_applications": total,
        "pending_count": pending,
        "approved_count": approved,
        "rejected_count": rejected
    }