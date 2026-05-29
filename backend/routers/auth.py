from fastapi import APIRouter

router = APIRouter(prefix='/auth')

@router.post('/register')
def register(user: dict):
    return {'message': 'Đăng ký thành công'}

@router.post('/login')
def login(user: dict):
    return {'message': 'Đăng nhập thành công'}