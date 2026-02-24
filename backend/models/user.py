from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=True)
    hashed_password = Column(String(255), nullable=True)  # null for OAuth users

    # OAuth
    oauth_provider = Column(String(50), nullable=True)   # google/microsoft/apple
    oauth_sub = Column(String(255), nullable=True)        # provider user ID
    avatar_url = Column(String(500), nullable=True)

    # 80G certificate fields
    phone = Column(String(20), nullable=True)
    pan_number = Column(Text, nullable=True)              # stored encrypted via pgcrypto
    father_name = Column(String(255), nullable=True)
    address_line1 = Column(String(255), nullable=True)
    address_line2 = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    country = Column(String(100), default="India")

    # Account
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    is_verified = Column(Boolean, default=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
