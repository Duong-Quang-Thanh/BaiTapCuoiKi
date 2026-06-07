from sqlalchemy import *
from sqlalchemy import Text

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    full_name = Column(
        String(255)
    )

    email = Column(
        String(255),
        unique=True
    )

    phone = Column(
        String(20)
    )

    password = Column(
        String(255)
    )

    role = Column(
        String(50),
        default="student"
    )


class Application(Base):
    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    user_id = Column(Integer)

    university_name = Column(
        String(255)
    )

    major_name = Column(
        String(255)
    )

    score = Column(Float)

    document_path = Column(
        String(255)
    )

    status = Column(
        String(50),
        default="pending"
    )

    note = Column(Text)


class University(Base):
    __tablename__ = "universities"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    name = Column(
        String(255)
    )

    description = Column(
        Text
    )


class Major(Base):
    __tablename__ = "majors"

    id = Column(
        Integer,
        primary_key=True,
        autoincrement=True
    )

    university_id = Column(
        Integer
    )

    name = Column(
        String(255)
    )