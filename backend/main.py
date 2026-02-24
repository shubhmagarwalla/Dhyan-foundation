from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
from pathlib import Path

from database import init_db
from config import get_settings
from routers import auth, donations, astrology, admin

settings = get_settings()

# Rate limiter
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    # Ensure upload/cert dirs exist
    Path("certificates").mkdir(exist_ok=True)
    Path("uploads").mkdir(exist_ok=True)
    yield


app = FastAPI(
    title="Dhyan Foundation Guwahati API",
    description="Backend API for Dhyan Foundation Guwahati NGO website",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS
allowed_origins = [
    settings.frontend_url,
    "https://dhyanfoundationguwahati.org",
    "https://www.dhyanfoundationguwahati.org",
]
if settings.environment == "development":
    allowed_origins.append("http://localhost:3000")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files (uploaded logos, signatures)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
app.mount("/certificates", StaticFiles(directory="certificates"), name="certificates")

# Routers
app.include_router(auth.router, prefix="/api")
app.include_router(donations.router, prefix="/api")
app.include_router(astrology.router, prefix="/api")
app.include_router(admin.router, prefix="/api")


@app.get("/")
def root():
    return {"message": "Dhyan Foundation Guwahati API", "status": "running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
