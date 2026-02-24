from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://dhyan_user:dhyan_pass@localhost:5432/dhyan_db"

    # JWT
    secret_key: str = "change-this-secret"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # OAuth
    google_client_id: str = ""
    google_client_secret: str = ""
    microsoft_client_id: str = ""
    microsoft_client_secret: str = ""
    apple_client_id: str = ""
    apple_client_secret: str = ""

    # NextAuth
    nextauth_secret: str = ""
    nextauth_url: str = "http://localhost:3000"

    # Payments
    razorpay_key_id: str = ""
    razorpay_key_secret: str = ""
    cashfree_app_id: str = ""
    cashfree_secret_key: str = ""
    cashfree_env: str = "TEST"

    # Email
    support_email: str = "dhyanfoundationguwahati@gmail.com"
    gmail_app_password: str = ""
    email_from_name: str = "Dhyan Foundation Guwahati"

    # Astrology
    prokerala_client_id: str = ""
    prokerala_client_secret: str = ""

    # NGO Details
    ngo_name: str = "Dhyan Foundation Guwahati"
    ngo_pan: str = "AAATD5390E"
    ngo_80g_reg: str = ""
    ngo_12a_reg: str = ""
    ngo_address: str = "Guwahati, Assam, India"
    ngo_phone: str = "+91-9999567895"
    ngo_email: str = "info@dhyanfoundation.com"
    ngo_website: str = "https://dhyanfoundationguwahati.org"

    # Admin
    admin_password: str = "change-this"
    admin_email: str = "admin@dhyanfoundationguwahati.org"

    # App
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8001"
    environment: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
