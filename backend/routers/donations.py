import uuid
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
from models.donation import Donation, DonationType, PaymentGateway, DonationStatus, DonationCause
from models.certificate_template import CertificateTemplate
from models.payment_transaction import PaymentTransaction, TransactionStatus, PaymentMethod
from services import razorpay_service, cashfree_service
from services.certificate_service import generate_80g_certificate
from services.email_service import send_donation_confirmation
from routers.auth import get_current_user
from models.user import User

router = APIRouter(prefix="/donations", tags=["donations"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class DonorDetails(BaseModel):
    name: str
    email: EmailStr
    phone: str
    pan_number: str | None = None
    father_name: str | None = None
    address: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    country: str = "India"
    on_behalf_of: bool = False


class CreateOrderRequest(BaseModel):
    amount: float
    cause: str = "general"
    donation_type: str = "one_time"
    gateway: str = "razorpay"
    donor: DonorDetails


class VerifyPaymentRequest(BaseModel):
    donation_id: int
    gateway_order_id: str
    gateway_payment_id: str
    gateway_signature: str | None = None
    gateway: str = "razorpay"


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_active_template(db: Session) -> CertificateTemplate | None:
    return db.query(CertificateTemplate).filter(CertificateTemplate.is_active == True).first()


def _record_transaction(
    db: Session,
    donation: Donation,
    payment_id: str,
    gateway: str,
    raw: dict,
) -> PaymentTransaction:
    """
    Create a PaymentTransaction record with full fee breakdown.
    raw = full gateway payment object (from Razorpay payment.fetch or Cashfree).
    """
    # Razorpay: fee and tax are in paise
    fee_paise = raw.get("fee", 0) or 0
    tax_paise = raw.get("tax", 0) or 0
    gross = donation.amount
    gateway_fee = round(fee_paise / 100, 2)
    gateway_tax = round(tax_paise / 100, 2)
    total_deduction = round(gateway_fee + gateway_tax, 2)
    net_receivable = round(gross - total_deduction, 2)

    method_str = raw.get("method", "other")
    try:
        method = PaymentMethod(method_str)
    except Exception:
        method = PaymentMethod.OTHER

    card = raw.get("card") or {}
    txn = PaymentTransaction(
        donation_id=donation.id,
        user_id=donation.user_id,
        gateway=gateway,
        gateway_order_id=donation.gateway_order_id,
        gateway_payment_id=payment_id,
        subscription_id=donation.subscription_id,
        gross_amount=gross,
        gateway_fee=gateway_fee,
        gateway_tax=gateway_tax,
        gateway_total_deduction=total_deduction,
        net_receivable=net_receivable,
        currency=raw.get("currency", "INR"),
        status=TransactionStatus.CAPTURED,
        payment_method=method,
        bank=raw.get("bank"),
        card_network=card.get("network"),
        card_last4=card.get("last4"),
        upi_vpa=raw.get("vpa"),
        wallet=raw.get("wallet"),
        international=raw.get("international", False),
        captured_at=datetime.utcnow(),
        raw_response=json.dumps(raw)[:5000],  # cap at 5KB
    )
    db.add(txn)
    db.commit()
    return txn


def _process_certificate(db: Session, donation: Donation):
    """Generate 80G certificate PDF and email it to donor."""
    try:
        template = _get_active_template(db)
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
            template=template,
        )
        donation.certificate_path = cert_path
        sent = send_donation_confirmation(
            donor_email=donation.donor_email,
            donor_name=donation.donor_name,
            amount=donation.amount,
            transaction_id=donation.gateway_payment_id or donation.gateway_order_id,
            certificate_path=cert_path,
        )
        donation.certificate_sent = sent
        donation.certificate_sent_at = datetime.utcnow() if sent else None
        db.commit()
    except Exception as e:
        print(f"[Cert] Failed for donation {donation.id}: {e}")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/create-order")
async def create_order(
    req: CreateOrderRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(lambda credentials=None, db=None: None),
):
    # Validate cause/type
    try:
        cause = DonationCause(req.cause)
        dtype = DonationType(req.donation_type)
        gateway = PaymentGateway(req.gateway)
    except ValueError as e:
        raise HTTPException(400, str(e))

    # Create DB record
    donation = Donation(
        donor_name=req.donor.name,
        donor_email=req.donor.email,
        donor_phone=req.donor.phone,
        donor_pan=req.donor.pan_number,
        donor_father_name=req.donor.father_name,
        donor_address=req.donor.address,
        donor_city=req.donor.city,
        donor_state=req.donor.state,
        donor_pincode=req.donor.pincode,
        donor_country=req.donor.country,
        on_behalf_of=req.donor.on_behalf_of,
        amount=req.amount,
        cause=cause,
        donation_type=dtype,
        gateway=gateway,
        status=DonationStatus.PENDING,
    )
    db.add(donation)
    db.commit()
    db.refresh(donation)

    receipt = f"DFG_{donation.id}"

    if gateway == PaymentGateway.RAZORPAY:
        if dtype == DonationType.ONE_TIME:
            order = razorpay_service.create_order(
                amount_inr=req.amount,
                receipt=receipt,
                notes={"cause": req.cause, "donor_name": req.donor.name},
            )
            donation.gateway_order_id = order["id"]
            db.commit()
            return {
                "donation_id": donation.id,
                "order_id": order["id"],
                "amount": req.amount,
                "currency": "INR",
                "gateway": "razorpay",
            }
        else:
            plan = razorpay_service.create_subscription_plan(
                amount_inr=req.amount,
                plan_name=f"Monthly Donation - {req.cause.title()}",
            )
            sub = razorpay_service.create_subscription(
                plan_id=plan["id"],
                notify_email=req.donor.email,
            )
            donation.subscription_id = sub["id"]
            donation.gateway_order_id = sub["id"]
            db.commit()
            return {
                "donation_id": donation.id,
                "subscription_id": sub["id"],
                "short_url": sub.get("short_url"),
                "gateway": "razorpay",
            }

    elif gateway == PaymentGateway.CASHFREE:
        cf_order = await cashfree_service.create_order(
            order_id=receipt,
            amount_inr=req.amount,
            customer_id=f"donor_{donation.id}",
            customer_email=req.donor.email,
            customer_phone=req.donor.phone,
            customer_name=req.donor.name,
            return_url=f"http://localhost:3000/donate/success",
        )
        donation.gateway_order_id = cf_order.get("order_id", receipt)
        db.commit()
        return {
            "donation_id": donation.id,
            "order_id": cf_order.get("order_id"),
            "payment_session_id": cf_order.get("payment_session_id"),
            "gateway": "cashfree",
        }


@router.post("/verify")
async def verify_payment(
    req: VerifyPaymentRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    donation = db.query(Donation).filter(Donation.id == req.donation_id).first()
    if not donation:
        raise HTTPException(404, "Donation not found")
    if donation.status == DonationStatus.SUCCESS:
        return {"message": "Already verified", "donation_id": donation.id}

    gateway = PaymentGateway(req.gateway)

    if gateway == PaymentGateway.RAZORPAY:
        if req.gateway_signature:
            valid = razorpay_service.verify_payment_signature(
                req.gateway_order_id, req.gateway_payment_id, req.gateway_signature
            )
            if not valid:
                raise HTTPException(400, "Invalid payment signature")

    elif gateway == PaymentGateway.CASHFREE:
        cf_status = await cashfree_service.get_order_status(req.gateway_order_id)
        if cf_status.get("order_status") != "PAID":
            raise HTTPException(400, "Payment not completed")

    donation.gateway_payment_id = req.gateway_payment_id
    donation.gateway_signature = req.gateway_signature
    donation.status = DonationStatus.SUCCESS
    db.commit()

    # Fetch full payment details for fee breakdown
    raw_payment = {}
    if gateway == PaymentGateway.RAZORPAY and req.gateway_payment_id:
        raw_payment = razorpay_service.fetch_payment_details(req.gateway_payment_id)
    _record_transaction(db, donation, req.gateway_payment_id, req.gateway, raw_payment)

    # Generate certificate in background
    background_tasks.add_task(_process_certificate, db, donation)

    txn = db.query(PaymentTransaction).filter(
        PaymentTransaction.gateway_payment_id == req.gateway_payment_id
    ).first()

    return {
        "message": "Payment verified",
        "donation_id": donation.id,
        "transaction_id": req.gateway_payment_id,
        "gross_amount": donation.amount,
        "gateway_fee": txn.gateway_fee if txn else None,
        "gateway_tax": txn.gateway_tax if txn else None,
        "net_receivable": txn.net_receivable if txn else None,
        "certificate": "will be emailed shortly",
    }


@router.post("/webhook/razorpay")
async def razorpay_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    body = await request.body()
    sig = request.headers.get("X-Razorpay-Signature", "")
    if not razorpay_service.verify_webhook_signature(body, sig):
        raise HTTPException(400, "Invalid webhook signature")

    import json
    event = json.loads(body)
    event_type = event.get("event")

    if event_type in ("payment.captured", "subscription.charged"):
        payload = event.get("payload", {})
        payment = payload.get("payment", {}).get("entity", {})
        order_id = payment.get("order_id") or payload.get("subscription", {}).get("entity", {}).get("id")
        payment_id = payment.get("id")

        donation = db.query(Donation).filter(
            Donation.gateway_order_id == order_id
        ).first() or db.query(Donation).filter(
            Donation.subscription_id == order_id
        ).first()

        if donation and donation.status != DonationStatus.SUCCESS:
            donation.gateway_payment_id = payment_id
            donation.status = DonationStatus.SUCCESS
            db.commit()
            background_tasks.add_task(_process_certificate, db, donation)

    return {"status": "ok"}


@router.post("/webhook/cashfree")
async def cashfree_webhook(request: Request, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    body = await request.body()
    timestamp = request.headers.get("x-webhook-timestamp", "")
    signature = request.headers.get("x-webhook-signature", "")

    if not cashfree_service.verify_webhook_signature(body.decode(), timestamp, signature):
        raise HTTPException(400, "Invalid webhook signature")

    import json
    event = json.loads(body)
    if event.get("type") == "PAYMENT_SUCCESS_WEBHOOK":
        data = event.get("data", {})
        order_id = data.get("order", {}).get("order_id")
        payment_id = data.get("payment", {}).get("cf_payment_id")
        donation = db.query(Donation).filter(Donation.gateway_order_id == order_id).first()
        if donation and donation.status != DonationStatus.SUCCESS:
            donation.gateway_payment_id = str(payment_id)
            donation.status = DonationStatus.SUCCESS
            db.commit()
            background_tasks.add_task(_process_certificate, db, donation)

    return {"status": "ok"}


@router.get("/history")
def donation_history(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    donations = db.query(Donation).filter(Donation.user_id == user.id).order_by(Donation.id.desc()).all()
    return [
        {
            "id": d.id,
            "amount": d.amount,
            "cause": d.cause.value,
            "status": d.status.value,
            "transaction_id": d.gateway_payment_id,
            "date": d.created_at,
            "certificate_sent": d.certificate_sent,
        }
        for d in donations
    ]
