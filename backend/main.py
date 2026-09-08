import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import init_db
from seed_data import seed_database
from routes.auth_routes import router as auth_router
from routes.document_routes import router as document_router
from routes.search_routes import router as search_router

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("archiveai_api")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables and auto-seed if empty
    logger.info("Initializing ArchiveAI database...")
    init_db()
    try:
        seed_database()
    except Exception as e:
        logger.warning(f"Seed check: {e}")
    logger.info("ArchiveAI Backend initialized successfully.")
    yield
    # Shutdown
    logger.info("ArchiveAI Backend shutting down.")

app = FastAPI(
    title="ArchiveAI – Media Archive Search API",
    description="AI-powered media archive search system for journalists, researchers, and editors.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all local origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(search_router)

@app.get("/")
def root():
    return {
        "name": "ArchiveAI Media Archive Search System",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "endpoints": {
            "auth": ["/api/auth/register", "/api/auth/login", "/api/auth/me"],
            "documents": ["/api/documents", "/api/documents/{id}", "/api/stats", "/api/tags"],
            "search": ["/api/search", "/api/history", "/api/saved"]
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
