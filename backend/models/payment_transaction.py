"""
Separate table for every payment transaction — including gateway charges,
tax on charges, and net receivable. Linked to donations table.

Razorpay fee breakdown:
  - platform_fee (paise): Razorpay's fee
  - tax (paise): GST on platform fee (18%)
  - fee (paise): total deducted = platform_fee + tax
  - amount - fee = net_receivable

Cashfree fee breakdown:
  - Available via GET /orders/{order_id}/payments
"""
from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from database import Base


class TransactionStatus(str, enum.Enum):
    INITIATED = "initiated"
    AUTHORIZED = "authorized"
    CAPTURED = "captured"
    FAILED = "failed"
    REFUNDED = "refunded"
    PARTIALLY_REFUNDED = "partially_refunded"


class PaymentMethod(str, enum.Enum):
    UPI = "upi"
    CARD = "card"
    NET_BANKING = "netbanking"
    WALLET = "wallet"
    EMI = "emi"
    OTHER = "other"


class PaymentTransaction(Base):
    """
    One row per payment attempt. A donation may have multiple failed
    attempts before a successful one.
    """
    __tablename__ = "payment_transactions"

    id = Column(Integer, primary_key=True, index=True)

    # Links
    donation_id = Column(Integer, ForeignKey("donations.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Gateway identifiers
    gateway = Column(String(20), nullable=False)              # razorpay / cashfree
    gateway_order_id = Column(String(255), index=True)        # rzp order_id / cf order_id
    gateway_payment_id = Column(String(255), index=True)      # rzp payment_id / cf payment_id
    gateway_signature = Column(String(500), nullable=True)    # signature for verification
    subscription_id = Column(String(255), nullable=True)      # for recurring payments

    # Amounts (all in INR)
    gross_amount = Column(Float, nullable=False)              # amount donor intended to pay
    gateway_fee = Column(Float, nullable=True)                # fee charged by gateway
    gateway_tax = Column(Float, nullable=True)                # GST on gateway fee (18%)
    gateway_total_deduction = Column(Float, nullable=True)    # fee + tax
    net_receivable = Column(Float, nullable=True)             # gross - total_deduction
    currency = Column(String(5), default="INR")

    # Payment details
    status = Column(Enum(TransactionStatus), default=TransactionStatus.INITIATED)
    payment_method = Column(Enum(PaymentMethod), nullable=True)
    bank = Column(String(100), nullable=True)                 # bank name for netbanking
    card_network = Column(String(50), nullable=True)          # VISA / Mastercard / RuPay
    card_last4 = Column(String(4), nullable=True)             # last 4 digits
    upi_vpa = Column(String(100), nullable=True)              # UPI VPA/ID
    wallet = Column(String(50), nullable=True)                # Paytm / PhonePe etc.
    international = Column(Boolean, default=False)

    # Timestamps
    initiated_at = Column(DateTime(timezone=True), server_default=func.now())
    captured_at = Column(DateTime(timezone=True), nullable=True)
    failed_at = Column(DateTime(timezone=True), nullable=True)

    # Error details (for failed payments)
    error_code = Column(String(100), nullable=True)
    error_description = Column(Text, nullable=True)
    error_source = Column(String(100), nullable=True)         # customer / bank / gateway
    error_step = Column(String(100), nullable=True)           # payment_authorization etc.
    error_reason = Column(String(100), nullable=True)

    # Raw gateway response (JSON stored as text)
    raw_response = Column(Text, nullable=True)

    donation = relationship("Donation", backref="transactions")
    user = relationship("User", backref="transactions")
