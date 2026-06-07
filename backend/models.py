from sqlalchemy import Column, Integer, String, Float, Text, DateTime, Date, ForeignKey, TIMESTAMP
from sqlalchemy.sql import func
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    phone = Column(String(20))
    role = Column(String(50), default="student")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class University(Base):
    __tablename__ = "universities"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class Major(Base):
    __tablename__ = "majors"

    id = Column(Integer, primary_key=True, autoincrement=True)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())


class ExamCombination(Base):
    __tablename__ = "exam_combinations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    major_id = Column(Integer, ForeignKey("majors.id"), nullable=False)
    code = Column(String(50), nullable=False)
    description = Column(String(255))
    subjects = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())


class AdmissionBatch(Base):
    __tablename__ = "admission_batches"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    date_of_birth = Column(Date)
    id_number = Column(String(50))
    address = Column(String(500))
    priority_group = Column(String(50))
    gpa = Column(Float)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    batch_id = Column(Integer, ForeignKey("admission_batches.id"), nullable=False)
    university_id = Column(Integer, ForeignKey("universities.id"), nullable=False)
    major_id = Column(Integer, ForeignKey("majors.id"), nullable=False)
    exam_combination_id = Column(Integer, ForeignKey("exam_combinations.id"), nullable=False)
    score = Column(Float, nullable=False)
    status = Column(String(50), default="pending")
    note = Column(Text)
    submitted_date = Column(DateTime, server_default=func.now())
    updated_date = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    document_type = Column(String(100), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    upload_date = Column(DateTime, server_default=func.now())


class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    recipient_email = Column(String(255), nullable=False)
    subject = Column(String(255), nullable=False)
    body = Column(Text, nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"))
    sent_date = Column(DateTime, server_default=func.now())
    status = Column(String(50), default="sent")