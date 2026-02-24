"""
Admin panel router: certificate template management, donation overview, CSV export.
"""
import csv
import io
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.donation import Donation, DonationStatus
from models.certificate_template import CertificateTemplate
from routers.auth import get_admin_user
from services.certificate_service import generate_80g_certificate
from services.email_service import send_donation_confirmation
from models.user import User
import aiofiles
from pathlib import Path

router = APIRouter(prefix="/admin", tags=["admin"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# ── Schemas ───────────────────────────────────────────────────────────────────

class TemplateUpdate(BaseModel):
    name: str | None = None
    primary_color: str | None = None
    secondary_color: str | None = None
    font_family: str | None = None
    ngo_name: str | None = None
    ngo_pan: str | None = None
    ngo_80g_reg: str | None = None
    ngo_12a_reg: str | None = None
    ngo_address: str | None = None
    ngo_phone: str | None = None
    ngo_email: str | None = None
    header_text: str | None = None
    footer_text: str | None = None
    thank_you_message: str | None = None


# ── Certificate Template ──────────────────────────────────────────────────────

@router.get("/template")
def get_template(db: Session = Depends(get_db), _: User = Depends(get_admin_user)):
    t = db.query(CertificateTemplate).filter(CertificateTemplate.is_active == True).first()
    if not t:
        # Create default
        t = CertificateTemplate()
        db.add(t)
        db.commit()
        db.refresh(t)
    return t


@router.put("/template")
def update_template(
    req: TemplateUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    t = db.query(CertificateTemplate).filter(CertificateTemplate.is_active == True).first()
    if not t:
        t = CertificateTemplate()
        db.add(t)
    for field, value in req.model_dump(exclude_none=True).items():
        setattr(t, field, value)
    db.commit()
    db.refresh(t)
    return {"message": "Template updated", "template_id": t.id}


@router.post("/template/logo")
async def upload_logo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    path = UPLOAD_DIR / f"logo_{file.filename}"
    async with aiofiles.open(path, "wb") as f:
        content = await file.read()
        await f.write(content)
    t = db.query(CertificateTemplate).filter(CertificateTemplate.is_active == True).first()
    if t:
        t.logo_path = str(path)
        db.commit()
    return {"logo_path": str(path)}


@router.post("/template/signature")
async def upload_signature(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(400, "File must be an image")
    path = UPLOAD_DIR / f"signature_{file.filename}"
    async with aiofiles.open(path, "wb") as f:
        content = await file.read()
        await f.write(content)
    t = db.query(CertificateTemplate).filter(CertificateTemplate.is_active == True).first()
    if t:
        t.signature_path = str(path)
        db.commit()
    return {"signature_path": str(path)}


# ── Donations Dashboard ───────────────────────────────────────────────────────

@router.get("/donations")
def list_donations(
    page: int = 1,
    limit: int = 50,
    status: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    q = db.query(Donation)
    if status:
        q = q.filter(Donation.status == DonationStatus(status))
    total = q.count()
    donations = q.order_by(Donation.id.desc()).offset((page - 1) * limit).limit(limit).all()
    return {
        "total": total,
        "page": page,
        "limit": limit,
        "donations": [
            {
                "id": d.id,
                "donor_name": d.donor_name,
                "donor_email": d.donor_email,
                "donor_pan": "***" if d.donor_pan else None,
                "amount": d.amount,
                "cause": d.cause.value,
                "gateway": d.gateway.value,
                "status": d.status.value,
                "transaction_id": d.gateway_payment_id,
                "certificate_sent": d.certificate_sent,
                "date": d.created_at,
            }
            for d in donations
        ],
    }


@router.post("/donations/{donation_id}/resend-certificate")
def resend_certificate(
    donation_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    donation = db.query(Donation).filter(Donation.id == donation_id).first()
    if not donation:
        raise HTTPException(404, "Donation not found")
    if donation.status != DonationStatus.SUCCESS:
        raise HTTPException(400, "Donation not successful")

    from datetime import datetime
    t = db.query(CertificateTemplate).filter(CertificateTemplate.is_active == True).first()
    cert_path = generate_80g_certificate(
        donation_id=donation.id,
        donor_name=donation.donor_name,
        donor_pan=donation.donor_pan or "Not Provided",
        donor_father_name=donation.donor_father_name or "",
        donor_address=donation.donor_address or "",
        donor_city=donation.donor_city or "",
        donor_state=donation.donor_state or "",
        donor_pincode=donation.donor_pincode or "",
        donor_email=donation.donor_email,
        donor_phone=donation.donor_phone,
        amount=donation.amount,
        transaction_id=donation.gateway_payment_id or donation.gateway_order_id,
        gateway=donation.gateway.value,
        donation_date=donation.created_at or datetime.utcnow(),
        cause=donation.cause.value,
        template=t,
    )
    sent = send_donation_confirmation(
        donor_email=donation.donor_email,
        donor_name=donation.donor_name,
        amount=donation.amount,
        transaction_id=donation.gateway_payment_id or donation.gateway_order_id,
        certificate_path=cert_path,
    )
    if sent:
        from datetime import datetime
        donation.certificate_sent = True
        donation.certificate_sent_at = datetime.utcnow()
        db.commit()
    return {"message": "Certificate resent" if sent else "Failed to send", "success": sent}


@router.get("/export/csv")
def export_donations_csv(
    db: Session = Depends(get_db),
    _: User = Depends(get_admin_user),
):
    """Export all successful donations as CSV for Form 10BD filing."""
    donations = db.query(Donation).filter(Donation.status == DonationStatus.SUCCESS).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Sr No", "Donor Name", "Email", "Phone", "PAN", "Father's Name",
        "Address", "City", "State", "Pincode", "Amount (INR)", "Cause",
        "Transaction ID", "Gateway", "Date", "Certificate Sent",
    ])
    for i, d in enumerate(donations, 1):
        writer.writerow([
            i, d.donor_name, d.donor_email, d.donor_phone,
            d.donor_pan or "", d.donor_father_name or "",
            d.donor_address or "", d.donor_city or "",
            d.donor_state or "", d.donor_pincode or "",
            d.amount, d.cause.value,
            d.gateway_payment_id or d.gateway_order_id,
            d.gateway.value,
            d.created_at.strftime("%Y-%m-%d") if d.created_at else "",
            "Yes" if d.certificate_sent else "No",
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=donations_80G.csv"},
    )
