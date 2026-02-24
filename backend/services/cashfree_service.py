"""
Cashfree Payments integration.
Docs: https://docs.cashfree.com/reference/pg-new-apis-endpoint
"""
import hmac
import hashlib
import base64
import httpx
from config import get_settings

settings = get_settings()

CASHFREE_BASE = {
    "TEST": "https://sandbox.cashfree.com/pg",
    "PROD": "https://api.cashfree.com/pg",
}


def _headers() -> dict:
    return {
        "x-api-version": "2023-08-01",
        "x-client-id": settings.cashfree_app_id,
        "x-client-secret": settings.cashfree_secret_key,
        "Content-Type": "application/json",
    }


def _base_url() -> str:
    return CASHFREE_BASE.get(settings.cashfree_env.upper(), CASHFREE_BASE["TEST"])


async def create_order(
    order_id: str,
    amount_inr: float,
    customer_id: str,
    customer_email: str,
    customer_phone: str,
    customer_name: str,
    return_url: str,
) -> dict:
    """Create a Cashfree payment order."""
    payload = {
        "order_id": order_id,
        "order_amount": round(amount_inr, 2),
        "order_currency": "INR",
        "customer_details": {
            "customer_id": customer_id,
            "customer_email": customer_email,
            "customer_phone": customer_phone,
            "customer_name": customer_name,
        },
        "order_meta": {
            "return_url": f"{return_url}?order_id={{order_id}}&order_token={{order_token}}",
        },
    }
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            f"{_base_url()}/orders",
            json=payload,
            headers=_headers(),
        )
        resp.raise_for_status()
        return resp.json()


async def get_order_status(order_id: str) -> dict:
    """Fetch payment status for a Cashfree order."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{_base_url()}/orders/{order_id}",
            headers=_headers(),
        )
        resp.raise_for_status()
        return resp.json()


def verify_webhook_signature(raw_body: str, timestamp: str, signature: str) -> bool:
    """Verify Cashfree webhook signature."""
    message = f"{timestamp}{raw_body}"
    secret = settings.cashfree_secret_key.encode()
    computed = base64.b64encode(
        hmac.new(secret, message.encode(), hashlib.sha256).digest()
    ).decode()
    return hmac.compare_digest(computed, signature)
