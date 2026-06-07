from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from sqlalchemy import and_
from pydantic import BaseModel
from typing import List, Optional
import shutil
import uuid
import os
from datetime import datetime

from backend.database import SessionLocal
from backend.models import Application, Document, User, University, Major, ExamCombination, AdmissionBatch

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

# ================== SCHEMAS ==================
class DocumentUploadResponse(BaseModel):
    file_path: str
    file_name: str

class ApplicationCreateRequest(BaseModel):
    user_id: int
    batch_id: int
    university_id: int
    major_id: int
    exam_combination_id: int
    score: float
    class Config:
        from_attributes = True

class ApplicationUpdateRequest(BaseModel):
    status: str
    note: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    batch_id: int
    university_id: int
    major_id: int
    exam_combination_id: int
    score: float
    status: str
    note: Optional[str]
    submitted_date: datetime
    updated_date: datetime
    
    class Config:
        from_attributes = True

# ================== UTILITIES ==================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ================== ENDPOINTS ==================

@router.post("/upload", response_model=DocumentUploadResponse)
async def upload_document(file: UploadFile = File(...)):
    """Upload document (PDF, JPEG, PNG)"""
    
    # Validate file type
    allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF, JPEG, PNG files allowed")
    
    # Generate unique filename
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = f"uploads/{filename}"
    
    # Create uploads directory if not exists
    os.makedirs("uploads", exist_ok=True)
    
    # Save file
    try:
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    return {
        "file_path": filename,
        "file_name": file.filename
    }

@router.post("/", response_model=ApplicationResponse)
def create_application(
    request: ApplicationCreateRequest,
    db: Session = Depends(get_db)
):
    """Create new application"""
    
    # Verify user exists
    user = db.query(User).filter(User.id == request.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Verify batch exists and is active
    batch = db.query(AdmissionBatch).filter(AdmissionBatch.id == request.batch_id).first()
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    
    # Verify exam combination exists
    exam_combo = db.query(ExamCombination).filter(
        ExamCombination.id == request.exam_combination_id
    ).first()
    if not exam_combo:
        raise HTTPException(status_code=404, detail="Exam combination not found")
    
    # Check for duplicate application (same user, batch, major)
    existing = db.query(Application).filter(
        and_(
            Application.user_id == request.user_id,
            Application.batch_id == request.batch_id,
            Application.major_id == request.major_id
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Application already exists for this major in this batch")
    
    # Create application
    application = Application(
        user_id=request.user_id,
        batch_id=request.batch_id,
        university_id=request.university_id,
        major_id=request.major_id,
        exam_combination_id=request.exam_combination_id,
        score=request.score,
        status="pending"
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    return application

@router.post("/{application_id}/documents")
async def upload_application_document(
    application_id: int,
    file: UploadFile = File(...),
    document_type: str = Form(...),
    db: Session = Depends(get_db)
):
    """Upload document for an application"""
    
    # Verify application exists
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Upload file
    allowed_types = ['application/pdf', 'image/jpeg', 'image/png']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Only PDF, JPEG, PNG files allowed")
    
    filename = f"{uuid.uuid4()}_{file.filename}"
    path = f"uploads/{filename}"
    
    os.makedirs("uploads", exist_ok=True)
    
    try:
        with open(path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    
    # Save document record in database
    document = Document(
        application_id=application_id,
        document_type=document_type,
        file_name=file.filename,
        file_path=filename
    )
    
    db.add(document)
    db.commit()
    db.refresh(document)
    
    return {
        "id": document.id,
        "file_path": filename,
        "file_name": file.filename,
        "document_type": document_type,
        "upload_date": document.upload_date
    }

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Get single application by ID"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return application

@router.get("/user/{user_id}")
def get_user_applications(
    user_id: int,
    db: Session = Depends(get_db)
):
    """Get all applications for a user"""
    
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    applications = db.query(Application).filter(Application.user_id == user_id).all()
    
    result = []
    for app in applications:
        # Get related data
        major = db.query(Major).filter(Major.id == app.major_id).first()
        university = db.query(University).filter(University.id == app.university_id).first()
        batch = db.query(AdmissionBatch).filter(AdmissionBatch.id == app.batch_id).first()
        documents = db.query(Document).filter(Document.application_id == app.id).all()
        
        result.append({
            "id": app.id,
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

@router.get("/{application_id}/documents")
def get_application_documents(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Get all documents for an application"""
    
    # Verify application exists
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    documents = db.query(Document).filter(Document.application_id == application_id).all()
    
    return [
        {
            "id": doc.id,
            "document_type": doc.document_type,
            "file_name": doc.file_name,
            "file_path": doc.file_path,
            "upload_date": doc.upload_date
        }
        for doc in documents
    ]

@router.patch("/{application_id}", response_model=ApplicationResponse)
def update_application(
    application_id: int,
    request: ApplicationUpdateRequest,
    db: Session = Depends(get_db)
):
    """Update application (admin only - for status changes)"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    # Valid status values
    valid_statuses = ["pending", "approved", "rejected"]
    if request.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    application.status = request.status
    if request.note:
        application.note = request.note
    
    db.commit()
    db.refresh(application)
    
    return application

@router.delete("/{application_id}")
def delete_application(
    application_id: int,
    db: Session = Depends(get_db)
):
    """Delete application (only if pending)"""
    
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise HTTPException(status_code=404, detail="Application not found")
    
    if application.status != "pending":
        raise HTTPException(status_code=400, detail="Can only delete pending applications")
    
    # Delete associated documents
    documents = db.query(Document).filter(Document.application_id == application_id).all()
    for doc in documents:
        try:
            os.remove(f"uploads/{doc.file_path}")
        except:
            pass
        db.delete(doc)
    
    db.delete(application)
    db.commit()
    
    return {"message": "Application deleted successfully"}