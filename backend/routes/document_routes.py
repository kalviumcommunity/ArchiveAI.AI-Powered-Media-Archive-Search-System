from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Document, Tag, SearchHistory
from schemas import DocumentResponse, DocumentDetailResponse, StatsResponse

router = APIRouter(prefix="/api", tags=["Documents & Analytics"])

@router.get("/documents", response_model=List[DocumentResponse])
def get_documents(
    type: Optional[str] = Query(None, description="Filter by content_type: article, interview, footage_notes"),
    tag: Optional[str] = Query(None, description="Filter by tag name"),
    sort: Optional[str] = Query("newest", description="Sorting: newest, oldest, title"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    
    if type and type.lower() != "all":
        # Normalize type if necessary
        t = type.lower().strip()
        if t in ["footage", "footage_notes", "footage note", "footage notes"]:
            query = query.filter(Document.content_type.in_(["footage_notes", "footage"]))
        else:
            query = query.filter(Document.content_type == t)
            
    if tag and tag.strip():
        tag_clean = tag.strip().lower()
        query = query.filter(func.lower(Document.tags_string).contains(tag_clean))
        
    if sort == "oldest":
        query = query.order_by(Document.publication_date.asc(), Document.id.asc())
    elif sort == "title":
        query = query.order_by(Document.title.asc())
    else: # newest default
        query = query.order_by(Document.publication_date.desc(), Document.id.desc())
        
    docs = query.offset(offset).limit(limit).all()
    return [DocumentResponse(**d.to_dict(include_content=False)) for d in docs]


@router.get("/documents/{doc_id}", response_model=DocumentDetailResponse)
def get_document_by_id(doc_id: str, db: Session = Depends(get_db)):
    # Try finding by numeric ID first, then archive_id
    doc = None
    if doc_id.isdigit():
        doc = db.query(Document).filter(Document.id == int(doc_id)).first()
    
    if not doc:
        doc = db.query(Document).filter(Document.archive_id.ilike(doc_id.strip())).first()
        
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Archive document '{doc_id}' was not found."
        )
        
    return DocumentDetailResponse(**doc.to_dict(include_content=True))


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total_docs = db.query(Document).count()
    total_articles = db.query(Document).filter(Document.content_type == "article").count()
    total_interviews = db.query(Document).filter(Document.content_type == "interview").count()
    total_footage = db.query(Document).filter(Document.content_type.in_(["footage_notes", "footage"])).count()
    
    # Calculate footage duration sum
    total_seconds = db.query(func.sum(Document.duration_seconds)).scalar() or 0
    total_hours = round(total_seconds / 3600.0, 1)
    
    total_tags = db.query(Tag).count()
    total_searches = db.query(SearchHistory).count()
    
    # Recent search queries
    recent_records = (
        db.query(SearchHistory.query)
        .order_by(SearchHistory.created_at.desc())
        .limit(6)
        .all()
    )
    recent_searches = [r[0] for r in recent_records if r[0]]
    
    return StatsResponse(
        total_documents=total_docs,
        total_articles=total_articles,
        total_interviews=total_interviews,
        total_footage_notes=total_footage,
        total_footage_hours=total_hours,
        total_tags=total_tags,
        total_searches=total_searches,
        recent_searches=recent_searches
    )


@router.get("/tags", response_model=List[str])
def get_tags(db: Session = Depends(get_db)):
    tags = db.query(Tag.name).order_by(Tag.name.asc()).all()
    return [t[0] for t in tags]
