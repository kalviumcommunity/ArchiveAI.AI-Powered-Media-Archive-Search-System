import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("archiveai_db")

# Read DB Configuration from environment variables
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "postgres")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")
POSTGRES_DB = os.getenv("POSTGRES_DB", "archive_ai_db")

DEFAULT_PG_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_PG_URL)

SQLITE_FALLBACK_URL = "sqlite:///./archive_ai.db"

# Attempt PostgreSQL connection, fallback to SQLite if PostgreSQL is unavailable
def get_engine():
    if os.getenv("FORCE_SQLITE", "false").lower() == "true":
        logger.info("Using SQLite database (FORCE_SQLITE is set)")
        return create_engine(SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})
    
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        # Test connection quickly
        with engine.connect() as conn:
            pass
        logger.info(f"Connected to PostgreSQL database at {POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}")
        return engine
    except Exception as e:
        logger.warning(f"Could not connect to PostgreSQL ({e}). Falling back to local SQLite database: {SQLITE_FALLBACK_URL}")
        return create_engine(SQLITE_FALLBACK_URL, connect_args={"check_same_thread": False})

engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables initialized successfully.")
