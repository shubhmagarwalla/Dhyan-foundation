from sqlalchemy import create_engine, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import get_settings
import logging

logger = logging.getLogger(__name__)
settings = get_settings()

# connect_args: 10-second connect timeout so DB issues don't block startup
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args={"connect_timeout": 10},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Enable pgcrypto extension and create tables. Fails gracefully."""
    try:
        with engine.connect() as conn:
            conn.execute(text("CREATE EXTENSION IF NOT EXISTS pgcrypto"))
            conn.commit()
        Base.metadata.create_all(bind=engine)
        logger.info("Database initialised successfully.")
    except Exception as e:
        logger.warning(f"Database init failed (will retry on first request): {e}")
