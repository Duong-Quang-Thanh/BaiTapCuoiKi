from sqlalchemy import *
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)

    full_name = Column(String(255))

    email = Column(
        String(255),
        unique=True
    )

    password = Column(String(255))

    role = Column(String(50))

    phone = Column(String(20))