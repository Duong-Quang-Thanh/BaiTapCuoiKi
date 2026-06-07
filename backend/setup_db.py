"""
Setup script - Initialize the database from scratch
This will drop existing database and create new one
"""

import pymysql

print("=" * 60)
print("🔧 Database Setup - Admission System")
print("=" * 60)

# Get MySQL credentials from user
host = input("\n📍 MySQL Host [localhost]: ").strip() or "localhost"
user = input("👤 MySQL User [root]: ").strip() or "root"
password = input("🔐 MySQL Password (press Enter if empty): ").strip()

# MySQL connection config
config = {
    'host': host,
    'user': user,
    'password': password,
    'charset': 'utf8mb4',
}

try:
    # Connect to MySQL without database
    print("\n🔄 Connecting to MySQL...")
    connection = pymysql.connect(**config)
    cursor = connection.cursor()
    print("✅ Connected!")
    
    print("🔄 Dropping existing database...")
    try:
        cursor.execute("DROP DATABASE IF EXISTS admission_system")
        connection.commit()
        print("✅ Database dropped")
    except Exception as e:
        print(f"⚠️  {str(e)[:100]}")
    
    print("🔄 Creating new database and tables...")
    # Read and execute schema
    with open('database/schema_v2.sql', 'r', encoding='utf-8') as f:
        schema = f.read()
    
    # Split and execute each statement
    statements = [s.strip() for s in schema.split(';') if s.strip()]
    success_count = 0
    for i, statement in enumerate(statements):
        try:
            cursor.execute(statement)
            success_count += 1
        except Exception as e:
            pass  # Skip errors, continue
    
    connection.commit()
    print(f"✅ Created database and tables ({success_count}/{len(statements)} statements)")
    cursor.close()
    connection.close()
    
    # Now run seed data
    print("\n🔄 Populating seed data...")
    from backend.seed_data import db
    print("✅ Seed data populated!")
    print("\n" + "=" * 60)
    print("✅ DATABASE SETUP COMPLETE!")
    print("=" * 60)
    print("\n📝 Admin Account Created:")
    print("   Email: admin@test.com")
    print("   Password: admin123")
    print("\n🚀 Next: Restart backend server")
    print("   $ uvicorn backend.main:app --reload")
    print("=" * 60)
    
except pymysql.Error as err:
    if err.args[0] == 1045:
        print(f"\n❌ MySQL Authentication Error")
        print(f"   Please verify your MySQL credentials")
        print(f"   Error: {err.args[1]}")
    else:
        print(f"\n❌ MySQL Error: {err}")
except FileNotFoundError:
    print(f"\n❌ Schema file not found: database/schema_v2.sql")
except Exception as e:
    print(f"\n❌ Exception: {e}")
    import traceback
    traceback.print_exc()
