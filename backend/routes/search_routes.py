import re
import time
import os
import google.generativeai as genai
from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Document, SearchHistory, SavedItem, User
from schemas import (
    SearchResponse, SearchResultItem, AISummary,
    SearchHistoryResponse, SavedItemCreate, SavedItemResponse
)
from auth import get_optional_user

router = APIRouter(prefix="/api", tags=["Search & History"])

# Configure Gemini AI
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def extract_snippet(text: str, query_words: List[str], max_len: int = 220) -> str:
    if not text:
        return ""
    
    text_clean = re.sub(r'\s+', ' ', text).strip()
    if not query_words:
        return text_clean[:max_len] + ("..." if len(text_clean) > max_len else "")

    # Look for first occurrence of any keyword
    best_pos = -1
    for w in query_words:
        pos = text_clean.lower().find(w.lower())
        if pos != -1 and (best_pos == -1 or pos < best_pos):
            best_pos = pos
            
    if best_pos == -1:
        return text_clean[:max_len] + ("..." if len(text_clean) > max_len else "")
        
    start = max(0, best_pos - 40)
    end = min(len(text_clean), start + max_len)
    snippet = text_clean[start:end].strip()
    
    if start > 0:
        snippet = "..." + snippet
    if end < len(text_clean):
        snippet = snippet + "..."
    return snippet


def generate_ai_summary_for_results(query: str, matched_docs: List[Document]) -> AISummary:
    if not matched_docs:
        return AISummary(
            headline="No records matched your search parameters",
            summary_text=f"No archive records directly matching '{query}' were found. Try adjusting keyword parameters or broadening category filters.",
            key_points=[],
            citations=[]
        )
    
    # Extract top 3 docs for synthesized analysis
    top_docs = matched_docs[:3]
    citations = []
    for doc in top_docs:
        citations.append({
            "archive_id": doc.archive_id,
            "title": doc.title,
            "author": doc.author or "Archive Collection",
            "date": doc.publication_date or "Archived Record",
            "type": doc.content_type.replace('_', ' ').capitalize()
        })
    
    headline = f"Analysis of {len(matched_docs)} Archive Records on '{query}'"
    
    # Prepare context for Gemini
    context = ""
    for doc in top_docs:
        context += f"Document ID: {doc.archive_id}\nTitle: {doc.title}\nContent Snippet: {doc.summary}\n\n"
        
    prompt = f"""
    Act as a media archive intelligence assistant.
    You are given a user query and the top matching document snippets from an archive.
    
    User Query: "{query}"
    
    Top Documents:
    {context}
    
    Write a concise summary paragraph (approx. 3-4 sentences) synthesizing how these documents relate to the user query.
    Also, generate exactly 3 key bullet points summarizing the most important takeaways from these documents.
    
    Respond STRICTLY in the following format:
    SUMMARY_TEXT
    <paragraph goes here>
    KEY_POINTS
    - <point 1>
    - <point 2>
    - <point 3>
    """
    
    summary_text = f"Based on {len(matched_docs)} retrieved archival records, documentation highlights key developments regarding {query.lower()}."
    key_points = []
    
    if os.environ.get("GEMINI_API_KEY"):
        try:
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            text = response.text
            
            if "SUMMARY_TEXT" in text and "KEY_POINTS" in text:
                parts = text.split("KEY_POINTS")
                summary_text = parts[0].replace("SUMMARY_TEXT", "").strip()
                kp_text = parts[1].strip()
                key_points = [line.lstrip("- ").strip() for line in kp_text.split("\n") if line.strip().startswith("-")]
            else:
                summary_text = text.strip()
        except Exception as e:
            print(f"Gemini API error: {e}")
            # Fallback if Gemini fails
            pass
            
    if not key_points:
        for i, doc in enumerate(top_docs):
            if doc.summary:
                key_points.append(f"[{doc.archive_id}] {doc.summary}")
            else:
                key_points.append(f"[{doc.archive_id}] {doc.title} ({doc.publication_date})")

    return AISummary(
        headline=headline,
        summary_text=summary_text,
        key_points=key_points,
        citations=citations
    )


@router.get("/search", response_model=SearchResponse)
def search_documents(
    q: Optional[str] = Query("", description="Keyword search query"),
    type: Optional[str] = Query(None, description="Filter: article, interview, footage_notes, all"),
    tag: Optional[str] = Query(None, description="Tag filter"),
    sort: Optional[str] = Query("relevance", description="Sort: relevance, newest, oldest"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    start_time = time.time()
    query_str = (q or "").strip()
    query_words = [w.lower() for w in re.findall(r'\w+', query_str) if len(w) > 1]
    
    # Base query
    db_query = db.query(Document)
    
    # Filter by type
    if type and type.lower() != "all":
        t = type.lower().strip()
        if t in ["footage", "footage_notes", "footage note", "footage notes"]:
            db_query = db_query.filter(Document.content_type.in_(["footage_notes", "footage"]))
        else:
            db_query = db_query.filter(Document.content_type == t)
            
    # Filter by tag
    if tag and tag.strip():
        tag_clean = tag.strip().lower()
        db_query = db_query.filter(func.lower(Document.tags_string).contains(tag_clean))
        
    all_candidates = db_query.all()
    scored_results = []
    
    for doc in all_candidates:
        score = 0.0
        matched_terms = []
        
        # Exact archive_id match
        if query_str and query_str.lower() in doc.archive_id.lower():
            score += 10.0
            matched_terms.append(doc.archive_id)
            
        # Keyword matching
        for word in query_words:
            word_matched = False
            # Title matches (Weight: 5.0)
            if word in doc.title.lower():
                score += 5.0
                word_matched = True
            # Author matches (Weight: 3.0)
            if doc.author and word in doc.author.lower():
                score += 3.0
                word_matched = True
            # Interviewee / location matches (Weight: 3.0)
            if doc.interviewee and word in doc.interviewee.lower():
                score += 3.0
                word_matched = True
            if doc.location and word in doc.location.lower():
                score += 3.0
                word_matched = True
            # Tags match (Weight: 4.0)
            if doc.tags_string and word in doc.tags_string.lower():
                score += 4.0
                word_matched = True
            # Summary match (Weight: 2.5)
            if doc.summary and word in doc.summary.lower():
                score += 2.5
                word_matched = True
            # Content / Transcript match (Weight: 1.0)
            if doc.content and word in doc.content.lower():
                score += 1.0
                word_matched = True
                
            if word_matched:
                matched_terms.append(word)

        # If no query words provided, score evenly by recency
        if not query_words:
            score = 1.0
            
        if score > 0:
            snippet = extract_snippet(doc.content or doc.summary, query_words)
            item = SearchResultItem(
                **doc.to_dict(include_content=False),
                relevance_score=round(score, 2),
                snippet=snippet,
                highlight_terms=list(set(matched_terms))
            )
            scored_results.append((score, doc, item))
            
    # Sort results
    if sort == "relevance" and query_words:
        scored_results.sort(key=lambda x: x[0], reverse=True)
    elif sort == "oldest":
        scored_results.sort(key=lambda x: (x[1].publication_date or "", x[1].id), reverse=False)
    else: # newest default
        scored_results.sort(key=lambda x: (x[1].publication_date or "", x[1].id), reverse=True)
        
    final_items = [x[2] for x in scored_results]
    matched_doc_objects = [x[1] for x in scored_results]
    
    # Save search history if query was provided
    if query_str:
        try:
            history_entry = SearchHistory(
                user_id=current_user.id if current_user else None,
                query=query_str,
                filters=f"type:{type or 'all'}" + (f",tag:{tag}" if tag else ""),
                results_count=len(final_items)
            )
            db.add(history_entry)
            db.commit()
        except Exception:
            db.rollback()
            
    ai_summary = generate_ai_summary_for_results(query_str or "All Documents", matched_doc_objects)
    duration = round((time.time() - start_time) * 1000, 2)
    
    return SearchResponse(
        query=query_str,
        total_results=len(final_items),
        content_type_filter=type,
        tag_filter=tag,
        results=final_items,
        ai_summary=ai_summary,
        search_duration_ms=duration
    )


@router.get("/history", response_model=List[SearchHistoryResponse])
def get_search_history(
    limit: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(SearchHistory)
    if current_user:
        query = query.filter(SearchHistory.user_id == current_user.id)
    records = query.order_by(SearchHistory.created_at.desc()).limit(limit).all()
    return [SearchHistoryResponse(**r.to_dict()) for r in records]


@router.post("/history", response_model=SearchHistoryResponse)
def add_search_history(
    query_str: str = Query(..., description="Query string to record"),
    filters: Optional[str] = Query(None),
    results_count: int = Query(0),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    entry = SearchHistory(
        user_id=current_user.id if current_user else None,
        query=query_str.strip(),
        filters=filters,
        results_count=results_count
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return SearchHistoryResponse(**entry.to_dict())


@router.delete("/history/{history_id}")
def delete_search_history(history_id: int, db: Session = Depends(get_db)):
    entry = db.query(SearchHistory).filter(SearchHistory.id == history_id).first()
    if entry:
        db.delete(entry)
        db.commit()
    return {"message": "Search history item removed successfully"}


@router.get("/saved", response_model=List[SavedItemResponse])
def get_saved_items(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    query = db.query(SavedItem)
    if current_user:
        query = query.filter(SavedItem.user_id == current_user.id)
    items = query.order_by(SavedItem.created_at.desc()).all()
    return [SavedItemResponse(**item.to_dict()) for item in items]


@router.post("/saved", response_model=SavedItemResponse)
def save_item(
    item_in: SavedItemCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user)
):
    # Check if document exists
    doc = db.query(Document).filter(Document.id == item_in.document_id).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
        
    existing = db.query(SavedItem).filter(
        SavedItem.document_id == item_in.document_id,
        SavedItem.user_id == (current_user.id if current_user else None)
    ).first()
    if existing:
        return SavedItemResponse(**existing.to_dict())
        
    saved = SavedItem(
        user_id=current_user.id if current_user else None,
        document_id=item_in.document_id,
        notes=item_in.notes
    )
    db.add(saved)
    db.commit()
    db.refresh(saved)
    return SavedItemResponse(**saved.to_dict())


@router.delete("/saved/{saved_id}")
def remove_saved_item(saved_id: int, db: Session = Depends(get_db)):
    item = db.query(SavedItem).filter(SavedItem.id == saved_id).first()
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Item removed from saved collection"}
