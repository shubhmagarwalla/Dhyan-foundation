"""
Auth service: JWT creation, password hashing, OAuth account linking.
"""
import secrets
import string
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from models.user import User
from services.email_service import send_email
from config import get_settings

settings = get_settings()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.access_token_expire_minutes))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.secret_key, algorithm=settings.algorithm)


def decode_token(token: str) -> dict | None:
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
    except JWTError:
        return None


def generate_temp_password(length: int = 12) -> str:
    alphabet = string.ascii_letters + string.digits + "!@#$%"
    return "".join(secrets.choice(alphabet) for _ in range(length))


def get_or_create_oauth_user(
    db: Session,
    email: str,
    name: str,
    oauth_provider: str,
    oauth_sub: str,
    avatar_url: str | None = None,
) -> tuple[User, bool]:
    """
    Get existing user or create new one from OAuth.
    Returns (user, is_new_user).
    If user exists with same email but different/no OAuth, links the account.
    """
    # Try find by oauth sub first
    user = db.query(User).filter(
        User.oauth_sub == oauth_sub,
        User.oauth_provider == oauth_provider,
    ).first()

    if user:
        return user, False

    # Try find by email (link accounts)
    user = db.query(User).filter(User.email == email).first()
    if user:
        # Link OAuth to existing account
        user.oauth_provider = oauth_provider
        user.oauth_sub = oauth_sub
        if avatar_url and not user.avatar_url:
            user.avatar_url = avatar_url
        if name and not user.name:
            user.name = name
        db.commit()
        db.refresh(user)
        return user, False

    # Create new user
    user = User(
        email=email,
        name=name,
        oauth_provider=oauth_provider,
        oauth_sub=oauth_sub,
        avatar_url=avatar_url,
        is_verified=True,  # OAuth emails are verified
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user, True


def send_welcome_email(user: User) -> None:
    """Send welcome email after OAuth signup."""
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
      <div style="background:linear-gradient(135deg,#FF6B00,#2D6A4F);padding:30px;border-radius:8px 8px 0 0;text-align:center">
        <h1 style="color:white;margin:0">Welcome to Dhyan Foundation Guwahati!</h1>
      </div>
      <div style="background:#fff8f0;padding:30px;border:1px solid #ffe0b2;border-top:none">
        <p>Dear <strong>{user.name or user.email}</strong>,</p>
        <p>Your account has been created successfully using <strong>{user.oauth_provider}</strong> sign-in.</p>
        <p>You can now:</p>
        <ul>
          <li>Make tax-deductible donations (Section 80G)</li>
          <li>Auto-receive your 80G certificates by email</li>
          <li>Explore our Astrology Corner</li>
          <li>Track your donation history</li>
        </ul>
        <p style="color:#666;font-size:13px">
          Please complete your profile (PAN, address, etc.) before making a donation
          so your 80G certificate can be generated correctly.
        </p>
        <p>🙏 Thank you for supporting Gau Seva!</p>
      </div>
    </div>
    """
    send_email(user.email, "Welcome to Dhyan Foundation Guwahati", html)
