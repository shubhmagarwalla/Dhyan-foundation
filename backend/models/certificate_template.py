from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, JSON
from sqlalchemy.sql import func
from database import Base


class CertificateTemplate(Base):
    __tablename__ = "certificate_templates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), default="Default Template")
    is_active = Column(Boolean, default=True)

    # Branding
    logo_path = Column(String(500), nullable=True)
    signature_path = Column(String(500), nullable=True)
    primary_color = Column(String(7), default="#FF6B00")   # saffron
    secondary_color = Column(String(7), default="#2D6A4F")  # green
    font_family = Column(String(100), default="Helvetica")

    # NGO details (overrides env defaults)
    ngo_name = Column(String(255), nullable=True)
    ngo_pan = Column(String(20), nullable=True)
    ngo_80g_reg = Column(String(100), nullable=True)
    ngo_12a_reg = Column(String(100), nullable=True)
    ngo_address = Column(String(500), nullable=True)
    ngo_phone = Column(String(20), nullable=True)
    ngo_email = Column(String(255), nullable=True)

    # Certificate content
    header_text = Column(Text, default="DONATION RECEIPT CUM CERTIFICATE")
    footer_text = Column(Text, default=(
        "This donation is eligible for deduction under Section 80G of the Income Tax Act, 1961. "
        "The organization is registered under Section 80G of the Income Tax Act."
    ))
    thank_you_message = Column(Text, default=(
        "Thank you for your generous contribution towards Gau Seva. "
        "Your support helps us rescue and care for cows and Nandis across Assam."
    ))

    # Layout config (JSON)
    layout_config = Column(JSON, default={})

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
