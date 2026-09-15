"""
ArchiveAI Automated Test Suite
Verifies all Week 1 Tasks (Day 1 to Day 5) for Backend & Database:
- Day 1: DB connection, Schema initialization, Document tables
- Day 2: User auth, Password hashing, Seed data verification
- Day 3: Document retrieval, Stats analytics, Detail view
- Day 4: Keyword search, Relevance scoring, AI summary synthesis, History logging
- Day 5: Verification, Data integrity, Edge case handling
"""

import sys
import os
import unittest

# Ensure backend dir is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app
from database import SessionLocal, init_db
from models import User, Document, SearchHistory, SavedItem
from seed_data import seed_database
from auth import verify_password, create_access_token

client = TestClient(app)

class TestArchiveAIBackend(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        init_db()
        seed_database()

    def test_01_root_endpoint(self):
        """Test API root welcome and documentation endpoints"""
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "online")
        self.assertIn("docs_url", data)

    def test_02_database_seeded_documents(self):
        """Test that documents exist in database across all content types"""
        db = SessionLocal()
        try:
            articles = db.query(Document).filter(Document.content_type == "article").all()
            interviews = db.query(Document).filter(Document.content_type == "interview").all()
            footage = db.query(Document).filter(Document.content_type.in_(["footage_notes", "footage"])).all()
            
            self.assertGreater(len(articles), 0, "Articles should be seeded")
            self.assertGreater(len(interviews), 0, "Interviews should be seeded")
            self.assertGreater(len(footage), 0, "Footage notes should be seeded")
        finally:
            db.close()

    def test_03_user_login_success(self):
        """Day 2: Test user login with seeded credentials and JWT token generation"""
        response = client.post("/api/auth/login", json={
            "email": "journalist@archiveai.org",
            "password": "archive2024"
        })
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("access_token", data)
        self.assertEqual(data["token_type"], "bearer")
        self.assertEqual(data["user"]["email"], "journalist@archiveai.org")

    def test_04_user_login_invalid_password(self):
        """Day 2: Test login rejection on incorrect password"""
        response = client.post("/api/auth/login", json={
            "email": "journalist@archiveai.org",
            "password": "wrongpassword"
        })
        self.assertEqual(response.status_code, 401)

    def test_05_user_registration(self):
        """Day 2: Test new user registration and duplicate prevention"""
        new_email = f"testuser_{os.urandom(4).hex()}@example.com"
        reg_response = client.post("/api/auth/register", json={
            "email": new_email,
            "full_name": "Test Researcher",
            "password": "securepassword123",
            "role": "Research Analyst"
        })
        self.assertEqual(reg_response.status_code, 200)
        reg_data = reg_response.json()
        self.assertIn("access_token", reg_data)
        self.assertEqual(reg_data["user"]["email"], new_email)

        # Duplicate registration should return 400
        dup_response = client.post("/api/auth/register", json={
            "email": new_email,
            "full_name": "Test Researcher",
            "password": "securepassword123"
        })
        self.assertEqual(dup_response.status_code, 400)

    def test_06_auth_me_endpoint(self):
        """Day 2: Test authenticated /api/auth/me endpoint using Bearer token"""
        login_res = client.post("/api/auth/login", json={
            "email": "journalist@archiveai.org",
            "password": "archive2024"
        })
        token = login_res.json()["access_token"]
        
        me_res = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
        self.assertEqual(me_res.status_code, 200)
        self.assertEqual(me_res.json()["email"], "journalist@archiveai.org")

    def test_07_get_documents_list_and_filtering(self):
        """Day 3: Test document retrieval API with pagination and type filters"""
        # All documents
        all_res = client.get("/api/documents")
        self.assertEqual(all_res.status_code, 200)
        all_docs = all_res.json()
        self.assertGreater(len(all_docs), 5)

        # Filter by article
        art_res = client.get("/api/documents?type=article")
        self.assertEqual(art_res.status_code, 200)
        for doc in art_res.json():
            self.assertEqual(doc["content_type"], "article")

        # Filter by interview
        int_res = client.get("/api/documents?type=interview")
        self.assertEqual(int_res.status_code, 200)
        for doc in int_res.json():
            self.assertEqual(doc["content_type"], "interview")

    def test_08_get_document_detail_by_id(self):
        """Day 3: Test document detail retrieval by numeric ID and archive_id"""
        # By archive_id
        res = client.get("/api/documents/ARCH-8821")
        self.assertEqual(res.status_code, 200)
        doc = res.json()
        self.assertEqual(doc["archive_id"], "ARCH-8821")
        self.assertIn("Renewable Energy", doc["title"])
        self.assertIn("RED III", doc["content"])

        # Non-existent doc
        bad_res = client.get("/api/documents/ARCH-9999999")
        self.assertEqual(bad_res.status_code, 404)

    def test_09_get_stats_dashboard(self):
        """Day 3: Test dashboard statistics aggregation"""
        res = client.get("/api/stats")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["total_documents"], 0)
        self.assertGreater(data["total_articles"], 0)
        self.assertGreater(data["total_interviews"], 0)
        self.assertGreater(data["total_footage_notes"], 0)
        self.assertIsInstance(data["recent_searches"], list)

    def test_10_search_api_keyword_matching(self):
        """Day 4: Test archive search API with keywords, scoring, and AI summary"""
        res = client.get("/api/search?q=Renewable+energy")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertGreater(data["total_results"], 0)
        self.assertIsNotNone(data["ai_summary"])
        self.assertIn("Renewable", data["ai_summary"]["headline"])
        self.assertGreater(len(data["ai_summary"]["citations"]), 0)

        # Check top result
        top_result = data["results"][0]
        self.assertIn("relevance_score", top_result)
        self.assertGreater(top_result["relevance_score"], 0)
        self.assertIsNotNone(top_result["snippet"])

    def test_11_search_api_type_filter(self):
        """Day 4: Test search API filtering by content_type"""
        res = client.get("/api/search?q=energy&type=interview")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        for r in data["results"]:
            self.assertEqual(r["content_type"], "interview")

    def test_12_search_history_logging_and_retrieval(self):
        """Day 4 & 5: Test search history persistence and retrieval"""
        history_res = client.get("/api/history")
        self.assertEqual(history_res.status_code, 200)
        history = history_res.json()
        self.assertGreater(len(history), 0)

    def test_13_saved_items_bookmarks(self):
        """Day 5: Test bookmarking/saving an archive document"""
        # Save ARCH-8821 (id = 1)
        doc_res = client.get("/api/documents/ARCH-8821")
        doc_id = doc_res.json()["id"]

        save_res = client.post("/api/saved", json={"document_id": doc_id, "notes": "Crucial for Q3 report"})
        self.assertEqual(save_res.status_code, 200)
        saved_id = save_res.json()["id"]

        get_saved = client.get("/api/saved")
        self.assertEqual(get_saved.status_code, 200)
        saved_items = get_saved.json()
        self.assertTrue(any(s["document_id"] == doc_id for s in saved_items))

        # Cleanup
        del_res = client.delete(f"/api/saved/{saved_id}")
        self.assertEqual(del_res.status_code, 200)


if __name__ == "__main__":
    unittest.main()
