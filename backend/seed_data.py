"""
Seed data for the admission system
Run this script to populate the database with universities, majors, exam combinations, batches, etc.
"""

from backend.database import SessionLocal, Base, engine
from backend.models import (
    University, Major, ExamCombination, AdmissionBatch, 
    StudentProfile, User
)
from backend.hash import hash_password
from datetime import date, timedelta

# Create all tables
Base.metadata.create_all(bind=engine)

# Get database session
db = SessionLocal()

# Clear existing data
db.query(ExamCombination).delete()
db.query(Major).delete()
db.query(University).delete()
db.query(AdmissionBatch).delete()
db.commit()

# ================== Seed Universities ==================
universities_data = [
    {"name": "Đại học Quốc gia Hà Nội", "description": "ĐH Quốc gia Hà Nội"},
    {"name": "Đại học Quốc gia TP. Hồ Chí Minh", "description": "ĐH QG TP.HCM"},
    {"name": "Đại học Bách Khoa Hà Nội", "description": "HUST"},
    {"name": "Đại học Kinh tế Quốc dân", "description": "NEU"},
    {"name": "Đại học FPT", "description": "FPT University"},
]

universities = []
for uni_data in universities_data:
    university = University(**uni_data)
    db.add(university)
    universities.append(university)

db.commit()

# ================== Seed Majors ==================
majors_by_university = {
    0: [  # ĐH Quốc gia Hà Nội
        {"name": "Công nghệ thông tin", "description": "CNTT"},
        {"name": "Điện tử - Viễn thông", "description": "ĐTVT"},
        {"name": "Cơ khí", "description": "Cơ khí"},
        {"name": "Xây dựng", "description": "Xây dựng"},
    ],
    1: [  # ĐH QG TP.HCM
        {"name": "Khoa học dữ liệu", "description": "Data Science"},
        {"name": "Trí tuệ nhân tạo", "description": "AI"},
        {"name": "An niệm mạng", "description": "Cybersecurity"},
        {"name": "Phần mềm", "description": "Software"},
    ],
    2: [  # Bách Khoa Hà Nội
        {"name": "Công nghệ thông tin", "description": "CNTT"},
        {"name": "Kỹ thuật phần mềm", "description": "Software Engineering"},
        {"name": "Hệ thống thông tin", "description": "Information Systems"},
        {"name": "Mạng máy tính", "description": "Computer Networks"},
    ],
    3: [  # Kinh tế Quốc dân
        {"name": "Kinh tế", "description": "Economics"},
        {"name": "Quản trị kinh doanh", "description": "Business Administration"},
        {"name": "Tài chính - Ngân hàng", "description": "Finance - Banking"},
        {"name": "Marketing", "description": "Marketing"},
    ],
    4: [  # FPT University
        {"name": "Kỹ thuật phần mềm", "description": "Software Engineering"},
        {"name": "Hệ thống thông tin", "description": "Information Systems"},
        {"name": "Trí tuệ nhân tạo", "description": "AI"},
        {"name": "Công nghệ blockchain", "description": "Blockchain"},
    ],
}

majors_map = {}
for uni_idx, majors in majors_by_university.items():
    for major_data in majors:
        major = Major(
            university_id=universities[uni_idx].id,
            **major_data
        )
        db.add(major)
        majors_map[f"{uni_idx}_{major_data['name']}"] = major

db.commit()

# ================== Seed Exam Combinations ==================
exam_combos = [
    # ĐH Quốc gia Hà Nội - CNTT
    {"major_id": majors_map["0_Công nghệ thông tin"].id, "code": "A00", "description": "Toán - Lý - Hóa", "subjects": "Toán,Lý,Hóa"},
    {"major_id": majors_map["0_Công nghệ thông tin"].id, "code": "A01", "description": "Toán - Lý - Tin", "subjects": "Toán,Lý,Tin"},
    
    # ĐH QG TP.HCM - Khoa học dữ liệu
    {"major_id": majors_map["1_Khoa học dữ liệu"].id, "code": "A00", "description": "Toán - Lý - Hóa", "subjects": "Toán,Lý,Hóa"},
    {"major_id": majors_map["1_Khoa học dữ liệu"].id, "code": "A01", "description": "Toán - Lý - Tin", "subjects": "Toán,Lý,Tin"},
    
    # Bách Khoa - CNTT
    {"major_id": majors_map["2_Công nghệ thông tin"].id, "code": "A00", "description": "Toán - Lý - Hóa", "subjects": "Toán,Lý,Hóa"},
    {"major_id": majors_map["2_Công nghệ thông tin"].id, "code": "A01", "description": "Toán - Lý - Tin", "subjects": "Toán,Lý,Tin"},
]

for combo_data in exam_combos:
    combo = ExamCombination(**combo_data)
    db.add(combo)

db.commit()

# ================== Seed Admission Batches ==================
today = date.today()
batches = [
    {
        "name": "Đợt 1 - 2024",
        "description": "Đợt xét tuyển thường quy 2024",
        "start_date": today,
        "end_date": today + timedelta(days=30),
    },
    {
        "name": "Đợt 2 - 2024",
        "description": "Đợt xét tuyển bổ sung 2024",
        "start_date": today + timedelta(days=31),
        "end_date": today + timedelta(days=60),
    },
]

for batch_data in batches:
    batch = AdmissionBatch(**batch_data)
    db.add(batch)

db.commit()

# ================== Seed Admin User ==================
# Clear admin user if exists
admin_user = db.query(User).filter(User.email == "admin@test.com").first()
if admin_user:
    db.delete(admin_user)
    db.commit()

admin = User(
    full_name="Administrator",
    email="admin@test.com",
    password=hash_password("admin123"),
    phone="0123456789",
    role="admin"
)
db.add(admin)
db.commit()

print("✅ Seed data created successfully!")
print(f"✓ Created {len(universities)} universities")
print(f"✓ Created {len(majors_map)} majors")
print(f"✓ Created {len(exam_combos)} exam combinations")
print(f"✓ Created {len(batches)} admission batches")
print(f"✓ Created admin account: admin@test.com / admin123")
