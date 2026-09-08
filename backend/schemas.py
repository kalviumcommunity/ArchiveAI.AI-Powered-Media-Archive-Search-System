from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- Auth Schemas ---
class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str
    role: Optional[str] = "Investigative Journalist"

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- Document Schemas ---
class DocumentBase(BaseModel):
    archive_id: str
    title: str
    content_type: str
    author: Optional[str] = None
    interviewee: Optional[str] = None
    location: Optional[str] = None
    source: Optional[str] = "Archive Collection"
    publication_date: Optional[str] = None
    summary: str
    media_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    language: Optional[str] = "en"
    tags: List[str] = []

class DocumentCreate(DocumentBase):
    content: str

class DocumentResponse(DocumentBase):
    id: int
    type_label: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

class DocumentDetailResponse(DocumentResponse):
    content: str


# --- Search Schemas ---
class SearchResultItem(DocumentResponse):
    relevance_score: float = 1.0
    snippet: Optional[str] = None
    highlight_terms: List[str] = []

class AISummary(BaseModel):
    headline: str
    summary_text: str
    key_points: List[str]
    citations: List[Dict[str, Any]]

class SearchResponse(BaseModel):
    query: str
    total_results: int
    content_type_filter: Optional[str] = None
    tag_filter: Optional[str] = None
    results: List[SearchResultItem]
    ai_summary: Optional[AISummary] = None
    search_duration_ms: float = 0.0

class SearchHistoryResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    query: str
    filters: Optional[str] = None
    results_count: int
    created_at: Optional[str] = None


# --- Stats Schemas ---
class StatsResponse(BaseModel):
    total_documents: int
    total_articles: int
    total_interviews: int
    total_footage_notes: int
    total_footage_hours: float
    total_tags: int
    total_searches: int
    recent_searches: List[str]


# --- Saved Item Schemas ---
class SavedItemCreate(BaseModel):
    document_id: int
    notes: Optional[str] = None

class SavedItemResponse(BaseModel):
    id: int
    document_id: int
    document: Optional[DocumentResponse] = None
    notes: Optional[str] = None
    created_at: Optional[str] = None
