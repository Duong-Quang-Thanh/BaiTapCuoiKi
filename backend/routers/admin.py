from fastapi import APIRouter

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