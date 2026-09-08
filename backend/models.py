import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Table, UniqueConstraint
)
from sqlalchemy.orm import relationship
from database import Base

def utc_now():
    return datetime.datetime.now(datetime.timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(100), default="Investigative Journalist")
    created_at = Column(DateTime, default=utc_now)

    # Relationships
    search_history = relationship("SearchHistory", back_populates="user", cascade="all, delete-orphan")
    saved_items = relationship("SavedItem", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "full_name": self.full_name,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    archive_id = Column(String(100), unique=True, index=True, nullable=False)
    title = Column(String(500), nullable=False, index=True)
    content_type = Column(String(50), nullable=False, index=True) # 'article', 'interview', 'footage_notes'
    author = Column(String(255)) # Author / Interviewer / Creator
    interviewee = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    source = Column(String(255), default="Archive Collection")
    publication_date = Column(String(50), nullable=True) # ISO or formatted date string
    summary = Column(Text, nullable=False)
    content = Column(Text, nullable=False) # Full text, transcript, or footage notes
    media_url = Column(String(500), nullable=True)
    duration_seconds = Column(Integer, nullable=True)
    language = Column(String(10), default="en")
    tags_string = Column(String(500), default="") # Comma-separated tag list for fast filtering
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    tags = relationship("Tag", secondary="document_tags", back_populates="documents")
    saved_by = relationship("SavedItem", back_populates="document", cascade="all, delete-orphan")

    def to_dict(self, include_content=True):
        data = {
            "id": self.id,
            "archive_id": self.archive_id,
            "title": self.title,
            "content_type": self.content_type,
            "type_label": {
                "article": "Article",
                "interview": "Interview",
                "footage_notes": "Footage Notes",
                "footage": "Footage Notes"
            }.get(self.content_type, self.content_type.capitalize()),
            "author": self.author,
            "interviewee": self.interviewee,
            "location": self.location,
            "source": self.source,
            "publication_date": self.publication_date,
            "summary": self.summary,
            "media_url": self.media_url,
            "duration_seconds": self.duration_seconds,
            "language": self.language,
            "tags": [t.name for t in self.tags] if self.tags else ([t.strip() for t in self.tags_string.split(",") if t.strip()] if self.tags_string else []),
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }
        if include_content:
            data["content"] = self.content
        return data


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    documents = relationship("Document", secondary="document_tags", back_populates="tags")

    def to_dict(self):
        return {"id": self.id, "name": self.name}


class DocumentTag(Base):
    __tablename__ = "document_tags"

    id = Column(Integer, primary_key=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), nullable=False)

    __table_args__ = (UniqueConstraint("document_id", "tag_id", name="uix_doc_tag"),)


class SearchHistory(Base):
    __tablename__ = "search_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    query = Column(String(500), nullable=False)
    filters = Column(String(500), nullable=True) # JSON or string of applied filters
    results_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="search_history")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "query": self.query,
            "filters": self.filters,
            "results_count": self.results_count,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class SavedItem(Base):
    __tablename__ = "saved_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    document_id = Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utc_now)

    user = relationship("User", back_populates="saved_items")
    document = relationship("Document", back_populates="saved_by")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "document_id": self.document_id,
            "document": self.document.to_dict(include_content=False) if self.document else None,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }
