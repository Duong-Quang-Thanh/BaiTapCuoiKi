from sqlalchemy import *
from database import Base
from sqlalchemy import Text

class Application(Base):
    __tablename__ = "applications"

    id = Column(
        Integer,
        primary_key=True
    )

    user_id = Column(Integer)

    university_name =Column(String(255))

    major_name =Column(String(255))

    score = Column(Float)

    document_path =Column(String(255))

    status = Column(
        String(50),
        default="pending"
    )

    note = Column(Text)
class University(Base):
    __tablename__ = "universities"

    id = Column(
        Integer,
        primary_key=True
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
        primary_key=True
    )

    university_id = Column(
        Integer
    )

    name = Column(
        String(255)
    )