"""
Exam Combinations Router
Endpoints for exam combination management
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import ExamCombination

router = APIRouter(prefix="/exam-combinations", tags=["exam-combinations"])


@router.get("/")
def get_all_exam_combinations(db: Session = Depends(get_db)):
    """Get all exam combinations"""
    return db.query(ExamCombination).all()


@router.get("/major/{major_id}")
def get_exam_combinations_by_major(major_id: int, db: Session = Depends(get_db)):
    """Get exam combinations for a specific major"""
    return db.query(ExamCombination).filter(ExamCombination.major_id == major_id).all()
