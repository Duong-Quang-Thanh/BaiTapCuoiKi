from fastapi import APIRouter
from schemas import ApplicationCreate

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)


@router.post("/")
def create_application(data: ApplicationCreate):
    return {
        "message": "Nộp hồ sơ thành công",
        "data": data
    }


@router.get("/")
def get_applications():
    return [
        {
            "id": 1,
            "name": "Nguyễn Văn A",
            "status": "pending"
        }
    ]