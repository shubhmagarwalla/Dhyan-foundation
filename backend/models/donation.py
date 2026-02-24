from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from database import Base


class DonationType(str, enum.Enum):
    ONE_TIME = "one_time"
    MONTHLY = "monthly"


class PaymentGateway(str, enum.Enum):
    RAZORPAY = "razorpay"
    CASHFREE = "cashfree"


class DonationStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"


class DonationCause(str, enum.Enum):
    GAUSEWA = "gausewa"
    MEDICAL = "medical"
    FEED = "feed"
    RESCUE = "rescue"
    GENERAL = "general"


class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null = guest

    # Donor details snapshot (for 80G — captured at time of donation)
    donor_name = Column(String(255), nullable=False)
    donor_email = Column(String(255), nullable=False)
    donor_phone = Column(String(20), nullable=False)
    donor_pan = Column(Text, nullable=True)           # encrypted
    donor_father_name = Column(String(255), nullable=True)
    donor_address = Column(String(500), nullable=True)
    donor_city = Column(String(100), nullable=True)
    donor_state = Column(String(100), nullable=True)
    donor_pincode = Column(String(10), nullable=True)
    donor_country = Column(String(100), default="India")
    on_behalf_of = Column(Boolean, default=False)

    # Donation details
    amount = Column(Float, nullable=False)
    currency = Column(String(10), default="INR")
    cause = Column(Enum(DonationCause), default=DonationCause.GENERAL)
    donation_type = Column(Enum(DonationType), default=DonationType.ONE_TIME)
    gateway = Column(Enum(PaymentGateway), nullable=False)
    status = Column(Enum(DonationStatus), default=DonationStatus.PENDING)

    # Gateway-specific IDs
    gateway_order_id = Column(String(255), nullable=True, index=True)
    gateway_payment_id = Column(String(255), nullable=True, index=True)
    gateway_signature = Column(String(500), nullable=True)
    subscription_id = Column(String(255), nullable=True)  # for monthly

    # 80G Certificate
    certificate_sent = Column(Boolean, default=False)
    certificate_path = Column(String(500), nullable=True)
    certificate_sent_at = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    user = relationship("User", backref="donations")
