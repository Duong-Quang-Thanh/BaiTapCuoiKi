from backend.database import SessionLocal
from backend.models import User
from backend.hash import hash_password

db = SessionLocal()

users = [
    {
        "full_name": "Admin User",
        "email": "admin@gmail.com",
        "phone": "0123456789",
        "password": "123456",
        "role": "admin"
    },
    {
        "full_name": "Student One",
        "email": "student1@gmail.com",
        "phone": "0987654321",
        "password": "123456",
        "role": "student"
    },
    {
        "full_name": "Student Two",
        "email": "student2@gmail.com",
        "phone": "0911223344",
        "password": "123456",
        "role": "student"
    }
]

for u in users:
    user = User(
        full_name=u["full_name"],
        email=u["email"],
        phone=u["phone"],
        password=hash_password(u["password"]),
        role=u["role"]
    )
    db.add(user)

db.commit()
db.close()

print("Seed data inserted successfully")