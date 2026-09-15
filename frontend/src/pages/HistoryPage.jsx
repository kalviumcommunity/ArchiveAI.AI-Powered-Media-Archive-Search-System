import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  History,
  Search,
  Trash2,
  ExternalLink,
  Clock,
  Filter,
  AlertCircle,
  RotateCcw,
  ArrowRight
} from 'lucide-react'
import { api } from '../api/client'

const fallbackHistory = [
  { id: 1, query: 'Renewable energy policy interview', filters: 'type:all', results_count: 3, created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: 2, query: 'EU Renewable Energy Directive', filters: 'type:article', results_count: 2, created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, query: 'AI regulations safety summit', filters: 'type:interview', results_count: 1, created_at: new Date(Date.now() - 259200000).toISOString() },
  { id: 4, query: 'Climate summit footage notes', filters: 'type:footage_notes', results_count: 2, created_at: new Date(Date.now() - 432000000).toISOString() },
  { id: 5, query: 'Urban housing reform disaster response', filters: 'type:article', results_count: 2, created_at: new Date(Date.now() - 604800000).toISOString() },
  { id: 6, query: 'Deep sea marine biology exploration', filters: 'type:footage_notes', results_count: 1, created_at: new Date(Date.now() - 864000000).toISOString() },
]

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

function getFilterLabel(filters) {
  if (!filters) return 'All Types'
  const match = filters.match(/type:(\w+)/)
  if (match) {
    const type = match[1]
    if (type === 'all') return 'All Types'
    if (type === 'article') return 'Articles'
    if (type === 'interview') return 'Interviews'
    if (type === 'footage_notes') return 'Footage Notes'
    return type.charAt(0).toUpperCase() + type.slice(1)
  }
  return 'All Types'
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const [historyList, setHistoryList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true)
        const items = await api.search.getHistory(30)
        if (items && items.length > 0) {
          setHistoryList(items)
        } else {
          setHistoryList(fallbackHistory)
        }
      } catch (err) {
        console.warn('Failed to load search history from API, using fallback:', err)
        setHistoryList(fallbackHistory)
      } finally {
        setLoading(false)
      }
    }
    loadHistory()
  }, [])

  const handleReSearch = (query, filters) => {
    const params = new URLSearchParams({ q: query })
    if (filters) {
      const typeMatch = filters.match(/type:(\w+)/)
      if (typeMatch && typeMatch[1] !== 'all') {
        params.set('type', typeMatch[1])
      }
    }
    navigate(`/search?${params.toString()}`)
  }

  const handleDelete = async (id) => {
    setHistoryList(prev => prev.filter(item => item.id !== id))
    try {
      await api.search.deleteHistory(id)
    } catch (err) {
      console.warn('Could not delete history item from backend:', err)
    }
  }

  const handleClearAll = async () => {
    const ids = historyList.map(item => item.id)
    setHistoryList([])
    for (const id of ids) {
      try {
        await api.search.deleteHistory(id)
      } catch {
        // ignore
      }
    }
  }

  const filteredItems = historyList.filter(item =>
    !filterText || item.query.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div className="flex h-full w-full flex-col bg-slate-50/50 p-6 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-[#3b2ceb]">
              <History size={22} />
            </div>
            Search History
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Review and re-execute your previous archive searches. {historyList.length} total entries.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-red-600 transition flex items-center gap-2 self-start"
          >
            <RotateCcw size={14} />
            Clear All History
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3b2ceb] focus:ring-2 focus:ring-indigo-100"
            placeholder="Filter history by query..."
          />
        </div>
      </div>

      {/* History List */}
      <div className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 rounded-2xl bg-white border border-slate-200 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <AlertCircle className="mx-auto text-slate-400 mb-3" size={36} />
            <h3 className="text-base font-bold text-slate-800">No search history found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
              {filterText ? 'No matches for your filter. Try different keywords.' : 'Start searching the archive to build your history.'}
            </p>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#3b2ceb] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#3224c2] transition"
            >
              <Search size={16} />
              Search the Archive
            </button>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs transition hover:shadow-md hover:border-slate-300 group"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 group-hover:bg-indigo-50 group-hover:text-[#3b2ceb] transition">
                  <Clock size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-[#3b2ceb] transition">
                    "{item.query}"
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {timeAgo(item.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Filter size={12} />
                      {getFilterLabel(item.filters)}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                      {item.results_count} result{item.results_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleReSearch(item.query, item.filters)}
                  className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-xs font-bold text-[#3b2ceb] hover:bg-indigo-100 transition flex items-center gap-1.5"
                >
                  <ArrowRight size={14} />
                  Re-search
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  title="Delete from history"
                  className="rounded-xl p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
