import hmac
import hashlib
import razorpay
from config import get_settings

settings = get_settings()


def get_razorpay_client():
    return razorpay.Client(auth=(settings.razorpay_key_id, settings.razorpay_key_secret))


def create_order(amount_inr: float, receipt: str, notes: dict = None) -> dict:
    """Create a Razorpay order. Amount in INR (converted to paise internally)."""
    client = get_razorpay_client()
    order = client.order.create({
        "amount": int(amount_inr * 100),  # paise
        "currency": "INR",
        "receipt": receipt,
        "notes": notes or {},
    })
    return order


def create_subscription_plan(amount_inr: float, plan_name: str) -> dict:
    """Create or reuse a monthly plan."""
    client = get_razorpay_client()
    plan = client.plan.create({
        "period": "monthly",
        "interval": 1,
        "item": {
            "name": plan_name,
            "amount": int(amount_inr * 100),
            "currency": "INR",
        },
    })
    return plan


def create_subscription(plan_id: str, total_count: int = 120, notify_email: str = None) -> dict:
    """Create a subscription for recurring monthly donations. total_count=120 = 10 years."""
    client = get_razorpay_client()
    payload = {
        "plan_id": plan_id,
        "total_count": total_count,
        "quantity": 1,
        "customer_notify": 1,
    }
    if notify_email:
        payload["notify_email"] = notify_email
    sub = client.subscription.create(payload)
    return sub


def verify_payment_signature(order_id: str, payment_id: str, signature: str) -> bool:
    """Verify Razorpay payment signature (HMAC-SHA256)."""
    message = f"{order_id}|{payment_id}"
    expected = hmac.new(
        settings.razorpay_key_secret.encode(),
        message.encode(),
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)


def verify_webhook_signature(body: bytes, signature: str) -> bool:
    """Verify Razorpay webhook signature."""
    expected = hmac.new(
        settings.razorpay_key_secret.encode(),
        body,
        hashlib.sha256,
    ).hexdigest()
    return hmac.compare_digest(expected, signature)
