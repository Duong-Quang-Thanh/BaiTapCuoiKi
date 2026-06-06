from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File

import shutil
import uuid

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
def create_application(data: dict):

    return {
        "message": "Nộp hồ sơ thành công",
        "data": data
    }