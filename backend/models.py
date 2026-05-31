from sqlalchemy import Column, Integer, String, Float, ForeignKey
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255))
    email = Column(String(255), unique=True)
    password = Column(String(255))
    role = Column(String(50))
    phone = Column(String(20))


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    university_id = Column(Integer)
    major_id = Column(Integer)

    score = Column(Float)

    status = Column(String(50), default="pending")

    note = Column(String(255))