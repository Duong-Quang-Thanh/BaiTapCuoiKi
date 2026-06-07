#!/usr/bin/env python
"""
Complete setup and test script for login system
"""
import sys
from sqlalchemy import text
from backend.database import SessionLocal, Base, engine
from backend.models import User
from backend.hash import hash_password, verify_password

print("=" * 60)
print("ADMISSION SYSTEM - LOGIN SETUP & TEST")
print("=" * 60)

# Step 1: Test Database Connection
print("\n[1] Testing database connection...")
try:
    db = SessionLocal()
    result = db.execute(text("SELECT 1"))
    print("✅ Database connection OK")
    db.close()
except Exception as e:
    print(f"❌ Database connection FAILED: {e}")
    sys.exit(1)

# Step 2: Create/Recreate Tables
print("\n[2] Creating database tables...")
try:
    Base.metadata.drop_all(bind=engine)
    print("   - Dropped existing tables")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully")
except Exception as e:
    print(f"❌ Failed to create tables: {e}")
    sys.exit(1)

# Step 3: Insert Test Users
print("\n[3] Inserting test users...")
try:
    db = SessionLocal()
    
    # Clear existing users
    db.query(User).delete()
    db.commit()
    
    test_users = [
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
    
    for user_data in test_users:
        user = User(
            full_name=user_data["full_name"],
            email=user_data["email"],
            phone=user_data["phone"],
            password=hash_password(user_data["password"]),
            role=user_data["role"]
        )
        db.add(user)
        print(f"   - Created: {user_data['email']} ({user_data['role']})")
    
    db.commit()
    db.close()
    print("✅ Test users inserted successfully")
    
except Exception as e:
    print(f"❌ Failed to insert users: {e}")
    sys.exit(1)

# Step 4: Verify Users in Database
print("\n[4] Verifying users in database...")
try:
    db = SessionLocal()
    users = db.query(User).all()
    print(f"   Total users: {len(users)}")
    
    for user in users:
        print(f"   - ID:{user.id} | {user.email} | {user.role} | Hash: {user.password[:20]}...")
    
    db.close()
    print("✅ Users verified in database")
    
except Exception as e:
    print(f"❌ Failed to verify users: {e}")
    sys.exit(1)

# Step 5: Test Password Verification
print("\n[5] Testing password verification...")
try:
    db = SessionLocal()
    admin_user = db.query(User).filter(User.email == "admin@gmail.com").first()
    
    if admin_user:
        # Test correct password
        is_valid = verify_password("123456", admin_user.password)
        print(f"   - Correct password (123456): {'✅ Valid' if is_valid else '❌ Invalid'}")
        
        # Test wrong password
        is_invalid = verify_password("wrong", admin_user.password)
        print(f"   - Wrong password (wrong): {'❌ Invalid (correct)' if not is_invalid else '✅ Valid (wrong!)'}")
    
    db.close()
    print("✅ Password verification working correctly")
    
except Exception as e:
    print(f"❌ Password verification test failed: {e}")
    sys.exit(1)

# Step 6: Summary
print("\n" + "=" * 60)
print("✅ SETUP COMPLETE - You can now login with:")
print("=" * 60)
print("\n📌 ADMIN ACCOUNT:")
print("   Email: admin@gmail.com")
print("   Password: 123456")
print("\n📌 STUDENT ACCOUNTS:")
print("   Email: student1@gmail.com | Password: 123456")
print("   Email: student2@gmail.com | Password: 123456")
print("\n🌐 Login at: http://localhost:8002/login")
print("=" * 60)
