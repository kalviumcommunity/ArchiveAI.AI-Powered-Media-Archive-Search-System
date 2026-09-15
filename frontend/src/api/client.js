const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Helper to get auth token
function getAuthHeader() {
  const token = localStorage.getItem('archiveai_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ detail: response.statusText }));
      const errorMsg = errorBody.detail || errorBody.message || 'Request failed';
      throw new Error(errorMsg);
    }
    return await response.json();
  } catch (err) {
    console.warn(`API request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  auth: {
    async login(email, password) {
      const data = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data.access_token) {
        localStorage.setItem('archiveai_token', data.access_token);
        localStorage.setItem('archiveai_user', JSON.stringify(data.user));
      }
      return data;
    },

    async register(fullName, email, password, role = 'Investigative Journalist') {
      const data = await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ full_name: fullName, email, password, role }),
      });
      if (data.access_token) {
        localStorage.setItem('archiveai_token', data.access_token);
        localStorage.setItem('archiveai_user', JSON.stringify(data.user));
      }
      return data;
    },

    async getMe() {
      return await request('/auth/me');
    },

    logout() {
      localStorage.removeItem('archiveai_token');
      localStorage.removeItem('archiveai_user');
    },

    getCurrentUser() {
      try {
        const u = localStorage.getItem('archiveai_user');
        return u ? JSON.parse(u) : null;
      } catch {
        return null;
      }
    }
  },

  documents: {
    async getAll({ type = '', tag = '', sort = 'newest', limit = 50, offset = 0 } = {}) {
      const params = new URLSearchParams();
      if (type && type !== 'all') params.append('type', type);
      if (tag) params.append('tag', tag);
      if (sort) params.append('sort', sort);
      params.append('limit', limit);
      params.append('offset', offset);

      return await request(`/documents?${params.toString()}`);
    },

    async getById(id) {
      return await request(`/documents/${id}`);
    },

    async getStats() {
      return await request('/stats');
    },

    async getTags() {
      return await request('/tags');
    }
  },

  search: {
    async query({ q = '', type = '', tag = '', sort = 'relevance' } = {}) {
      const params = new URLSearchParams();
      if (q) params.append('q', q);
      if (type && type !== 'all') params.append('type', type);
      if (tag) params.append('tag', tag);
      if (sort) params.append('sort', sort);

      return await request(`/search?${params.toString()}`);
    },

    async getHistory(limit = 10) {
      return await request(`/history?limit=${limit}`);
    },

    async saveHistory(queryStr, filters = '', resultsCount = 0) {
      const params = new URLSearchParams({
        query_str: queryStr,
        filters: filters || '',
        results_count: resultsCount.toString(),
      });
      return await request(`/history?${params.toString()}`, { method: 'POST' });
    },

    async deleteHistory(id) {
      return await request(`/history/${id}`, { method: 'DELETE' });
    }
  },

  saved: {
    async getAll() {
      return await request('/saved');
    },

    async save(documentId, notes = '') {
      return await request('/saved', {
        method: 'POST',
        body: JSON.stringify({ document_id: documentId, notes }),
      });
    },

    async remove(savedId) {
      return await request(`/saved/${savedId}`, { method: 'DELETE' });
    }
  }
};
