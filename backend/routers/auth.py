"""
Auth router: email/password + OAuth (Google, Microsoft, Apple) via NextAuth token validation.

OAuth Setup Notes (for the admin):
- Google: console.cloud.google.com → New Project → APIs & Services → OAuth 2.0 Client ID
  Authorized redirect URI: https://dhyanfoundationguwahati.org/api/auth/callback/google
- Microsoft: portal.azure.com → App registrations → New → Redirect URI:
  https://dhyanfoundationguwahati.org/api/auth/callback/azure-ad
- Apple: developer.apple.com → Certificates → Sign In with Apple → Service ID
  Redirect URI: https://dhyanfoundationguwahati.org/api/auth/callback/apple
All client IDs/secrets go into .env
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from database import get_db
from models.user import User
from services.auth_service import (
    hash_password, verify_password, create_access_token,
    decode_token, get_or_create_oauth_user, send_welcome_email,
)

router = APIRouter(prefix="/auth", tags=["auth"])
bearer = HTTPBearer(auto_error=False)


# ── Schemas ───────────────────────────────────────────────────────────────────

class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class OAuthRequest(BaseModel):
    """Called by Next.js frontend after successful OAuth callback."""
    provider: str       # google / microsoft / apple
    oauth_sub: str      # provider's user ID
    email: EmailStr
    name: str | None = None
    avatar_url: str | None = None


class UserProfile(BaseModel):
    id: int
    email: str
    name: str | None
    avatar_url: str | None
    phone: str | None
    pan_number: str | None
    father_name: str | None
    address_line1: str | None
    address_line2: str | None
    city: str | None
    state: str | None
    pincode: str | None
    country: str | None
    is_admin: bool

    class Config:
        from_attributes = True


class ProfileUpdateRequest(BaseModel):
    name: str | None = None
    phone: str | None = None
    pan_number: str | None = None
    father_name: str | None = None
    address_line1: str | None = None
    address_line2: str | None = None
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    country: str | None = None


# ── Helpers ───────────────────────────────────────────────────────────────────

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_token(credentials.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def get_admin_user(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return user


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = User(
        email=req.email,
        name=req.name,
        hashed_password=hash_password(req.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token({"sub": user.id, "email": user.email})
    send_welcome_email(user)
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}


@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.id, "email": user.email})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}


@router.post("/oauth")
def oauth_signin(req: OAuthRequest, db: Session = Depends(get_db)):
    """
    Called by frontend after Google/Microsoft/Apple OAuth succeeds.
    Creates or links user account and returns JWT.
    """
    user, is_new = get_or_create_oauth_user(
        db=db,
        email=req.email,
        name=req.name or "",
        oauth_provider=req.provider,
        oauth_sub=req.oauth_sub,
        avatar_url=req.avatar_url,
    )
    if is_new:
        send_welcome_email(user)
    token = create_access_token({"sub": user.id, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "is_new_user": is_new,
        "profile_complete": bool(user.pan_number and user.phone and user.address_line1),
    }


@router.get("/me", response_model=UserProfile)
def get_me(user: User = Depends(get_current_user)):
    return user


@router.put("/profile")
def update_profile(req: ProfileUpdateRequest, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    for field, value in req.model_dump(exclude_none=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return {"message": "Profile updated", "profile_complete": bool(user.pan_number and user.phone)}
