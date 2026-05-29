from fastapi import APIRouter

router = APIRouter(prefix='/applications')

@router.post('/')
def create_application(data: dict):
    return {'message': 'Nộp hồ sơ thành công'}

@router.get('/')
def get_applications():
    return []