"""
Simple migration - Drop and recreate database tables
This will delete all existing data and create fresh tables
"""

from backend.database import Base, engine, SessionLocal
# IMPORTANT: Import all models BEFORE calling create_all()
# This registers all model classes with Base.metadata
from backend.models import (
    User, University, Major, ExamCombination, 
    AdmissionBatch, StudentProfile, Application, Document, EmailLog
)

print("=" * 60)
print("🔄 Database Migration")
print("=" * 60)

print("\n⚠️  This will DELETE all existing data")
confirm = input("\nAre you sure? Type 'yes' to confirm: ").strip().lower()

if confirm != 'yes':
    print("❌ Migration cancelled")
    exit(1)

print("\n🔄 Dropping all tables...")
Base.metadata.drop_all(bind=engine)
print("✅ Tables dropped")

print("🔄 Creating new tables...")
Base.metadata.create_all(bind=engine)
print("✅ Tables created")

print("\n🔄 Populating seed data...")

try:
    # Import after tables are created
    from backend.models import (
        University, Major, ExamCombination, AdmissionBatch, User
    )
    import bcrypt
    from datetime import date, timedelta
    
    db = SessionLocal()
    
    # Hash password using bcrypt directly
    admin_password = bcrypt.hashpw("admin123".encode(), bcrypt.gensalt()).decode()
    
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
        0: [
            {"name": "Công nghệ thông tin", "description": "CNTT"},
            {"name": "Điện tử - Viễn thông", "description": "ĐTVT"},
            {"name": "Cơ khí", "description": "Cơ khí"},
            {"name": "Xây dựng", "description": "Xây dựng"},
        ],
        1: [
            {"name": "Khoa học dữ liệu", "description": "Data Science"},
            {"name": "Trí tuệ nhân tạo", "description": "AI"},
            {"name": "An niệm mạng", "description": "Cybersecurity"},
            {"name": "Phần mềm", "description": "Software"},
        ],
        2: [
            {"name": "Công nghệ thông tin", "description": "CNTT"},
            {"name": "Kỹ thuật phần mềm", "description": "Software Engineering"},
            {"name": "Hệ thống thông tin", "description": "Information Systems"},
            {"name": "Mạng máy tính", "description": "Computer Networks"},
        ],
        3: [
            {"name": "Kinh tế", "description": "Economics"},
            {"name": "Quản trị kinh doanh", "description": "Business Administration"},
            {"name": "Tài chính - Ngân hàng", "description": "Finance - Banking"},
            {"name": "Marketing", "description": "Marketing"},
        ],
        4: [
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
    exam_combos_data = [
        {"major_key": "0_Công nghệ thông tin", "code": "A00", "description": "Toán - Lý - Hóa", "subjects": "Toán,Lý,Hóa"},
        {"major_key": "0_Công nghệ thông tin", "code": "A01", "description": "Toán - Lý - Tin", "subjects": "Toán,Lý,Tin"},
        {"major_key": "1_Khoa học dữ liệu", "code": "A00", "description": "Toán - Lý - Hóa", "subjects": "Toán,Lý,Hóa"},
        {"major_key": "1_Khoa học dữ liệu", "code": "A01", "description": "Toán - Lý - Tin", "subjects": "Toán,Lý,Tin"},
        {"major_key": "2_Công nghệ thông tin", "code": "A00", "description": "Toán - Lý - Hóa", "subjects": "Toán,Lý,Hóa"},
        {"major_key": "2_Công nghệ thông tin", "code": "A01", "description": "Toán - Lý - Tin", "subjects": "Toán,Lý,Tin"},
    ]
    
    for combo_data in exam_combos_data:
        major_key = combo_data.pop("major_key")
        major_id = majors_map[major_key].id
        combo = ExamCombination(major_id=major_id, **combo_data)
        db.add(combo)
    
    db.commit()
    
    # ================== Seed Admission Batches ==================
    today = date.today()
    batches_data = [
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
    
    for batch_data in batches_data:
        batch = AdmissionBatch(**batch_data)
        db.add(batch)
    
    db.commit()
    
    # ================== Seed Admin User ==================
    admin = User(
        full_name="Administrator",
        email="admin@test.com",
        password=admin_password,
        phone="0123456789",
        role="admin"
    )
    db.add(admin)
    db.commit()
    db.close()
    
    print("✅ Seed data populated!")
    print("\n" + "=" * 60)
    print("✅ DATABASE MIGRATION COMPLETE!")
    print("=" * 60)
    print("\n📝 Admin Account:")
    print("   Email: admin@test.com")
    print("   Password: admin123")
    print("\n✓ 5 Universities created")
    print("✓ 20 Majors created")
    print("✓ 6 Exam Combinations created")
    print("✓ 2 Admission Batches created")
    print("\n🚀 Restart backend server:")
    print("   $ uvicorn backend.main:app --reload")
    print("=" * 60)
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
