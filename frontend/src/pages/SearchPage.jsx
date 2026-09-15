import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import {
  Sparkles,
  FileText,
  Mic,
  Video,
  X,
  Copy,
  ExternalLink,
  Pencil,
  Search,
  Filter,
  Bookmark,
  Check,
  ChevronDown,
  Clock,
  ArrowUpDown,
  Share2,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { api } from '../api/client'

const TYPE_ICONS = {
  article: FileText,
  interview: Mic,
  footage_notes: Video,
  footage: Video,
}

const TYPE_LABELS = {
  article: 'Article',
  interview: 'Interview',
  footage_notes: 'Footage Notes',
  footage: 'Footage Notes',
}

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const initialQuery = searchParams.get('q') || 'Renewable energy policy interview'
  const initialType = searchParams.get('type') || 'all'

  const [query, setQuery] = useState(initialQuery)
  const [isEditingQuery, setIsEditingQuery] = useState(false)
  const [activeType, setActiveType] = useState(initialType)
  const [sortBy, setSortBy] = useState('relevance')
  const [results, setResults] = useState([])
  const [aiSummary, setAiSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [copiedId, setCopiedId] = useState(false)
  const [savedDocs, setSavedDocs] = useState(new Set())
  const [searchTimeMs, setSearchTimeMs] = useState(null)

  const performSearch = useCallback(async (searchQuery, typeFilter, sortOrder) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await api.search.query({
        q: searchQuery,
        type: typeFilter === 'all' ? undefined : typeFilter,
        sort: sortOrder,
      })
      setResults(resp.results || [])
      setAiSummary(resp.ai_summary || null)
      setSearchTimeMs(resp.search_duration_ms || null)
    } catch (err) {
      console.error('Search failed:', err)
      // Fallback data for offline/mock display
      setResults([
        {
          id: 1,
          archive_id: 'ARCH-8821',
          content_type: 'article',
          publication_date: '2023-10-12',
          title: 'EU Renewable Energy Directive 2023 Revisions and Grid Modernization',
          author: 'Dr. Elena Rostova',
          source: 'European Energy Policy Journal',
          summary: 'Comprehensive breakdown of the new subsidy structures for decentralized grids and statutory requirements for cross-border solar transmission across member states.',
          snippet: '...focusing heavily on reducing bureaucratic friction for solar grid integration... structural bottlenecks in cross-border energy sharing remain a primary concern...',
          content: 'The revised European Union Renewable Energy Directive (RED III) establishes binding targets to raise the share of renewable energy in overall consumption to 42.5% by 2030.',
          relevance_score: 9.8,
          tags: ['Renewable Energy', 'Policy', 'EU Directive', 'Solar Grid']
        },
        {
          id: 2,
          archive_id: 'ARCH-9104',
          content_type: 'interview',
          publication_date: '2023-11-04',
          title: 'Transcript: Ministry of Energy Policy Summit & Infrastructure Roundtable',
          author: 'James Cole (Interviewer)',
          interviewee: 'Commissioner Marcus Vance',
          location: 'Brussels Convention Center',
          source: 'Continental Broadcasting Newsroom',
          summary: 'High-level interview detailing friction points in cross-border high-voltage direct current (HVDC) transmission lines and municipal battery storage subsidies.',
          snippet: '...Discussion on the friction points of cross-border solar energy transmission and Baltic wind integration...',
          content: 'COLE: Commissioner Vance, thank you for joining ArchiveAI Broadcast. Let us address the persistent delays in connecting Baltic wind farms to central distribution grids.',
          relevance_score: 8.9,
          tags: ['Interview', 'Energy Summit', 'Transmission', 'Policy']
        },
        {
          id: 3,
          archive_id: 'ARCH-8755',
          content_type: 'article',
          publication_date: '2023-09-28',
          title: 'Legislative Proposals for Decentralized Wind Subsidies and Community Cooperatives',
          author: 'Policy Institute Brussels',
          source: 'Euro-Atlantic Economic Review',
          summary: 'Analysis of the 15% increase in municipal funding requests from Baltic states for community-owned micro-turbines and grid resilience.',
          snippet: '...Legislative proposals introduced in the European Parliament aim to allocate direct matching funds to citizen-led renewable initiatives...',
          content: 'Community energy cooperatives have emerged as a cornerstone of national energy independence strategies.',
          relevance_score: 7.5,
          tags: ['Wind Energy', 'Subsidies', 'Legislation', 'Community Grid']
        }
      ])
      setAiSummary({
        headline: `Analysis of Archival Records on '${searchQuery}'`,
        summary_text: `Based on retrieved archival records, documentation highlights key developments regarding ${searchQuery.toLowerCase()}. Primary source documents corroborate core timelines and regulatory directives across European and international jurisdictions.`,
        key_points: [
          `[ARCH-8821] Comprehensive breakdown of the new subsidy structures for decentralized grids.`,
          `[ARCH-9104] High-level interview detailing friction points in cross-border transmission.`,
          `[ARCH-8755] Analysis of the 15% increase in municipal funding requests for micro-turbines.`
        ],
        citations: [
          { archive_id: 'ARCH-8821', title: 'EU Renewable Energy Directive 2023 Revisions', author: 'Dr. Elena Rostova', date: '2023-10-12', type: 'Article' },
          { archive_id: 'ARCH-9104', title: 'Transcript: Ministry of Energy Policy Summit', author: 'James Cole', date: '2023-11-04', type: 'Interview' }
        ]
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    performSearch(query, activeType, sortBy)
  }, [query, activeType, sortBy, performSearch])

  const handleSearchSubmit = (e) => {
    e?.preventDefault()
    setIsEditingQuery(false)
    setSearchParams({ q: query, type: activeType })
    performSearch(query, activeType, sortBy)
  }

  const toggleSave = async (doc) => {
    const docId = doc.id
    if (savedDocs.has(docId)) {
      setSavedDocs(prev => {
        const next = new Set(prev)
        next.delete(docId)
        return next
      })
    } else {
      setSavedDocs(prev => new Set(prev).add(docId))
      try {
        await api.saved.save(docId, `Saved from search: ${query}`)
      } catch (err) {
        console.warn('Could not save item to backend:', err)
      }
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  return (
    <div className="flex h-full w-full bg-slate-50/50 relative overflow-hidden">
      {/* Main Search View */}
      <div className={`flex-1 overflow-y-auto p-6 md:p-8 transition-all duration-300 ${selectedSource ? 'lg:mr-[420px]' : ''}`}>
        
        {/* Search Query Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6 bg-white -mx-6 -mt-6 p-6 rounded-b-2xl shadow-xs">
          <div className="flex-1">
            {isEditingQuery ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                    className="w-full rounded-xl border border-[#3b2ceb] bg-white py-2 pl-10 pr-4 text-base font-semibold text-slate-900 outline-none ring-2 ring-indigo-100"
                    placeholder="Search keywords, topics, transcripts..."
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-[#3b2ceb] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#3224c2] transition"
                >
                  Search
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingQuery(false)}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                  Searching for: <span className="text-[#3b2ceb]">"{query || 'All Documents'}"</span>
                </h1>
                <button
                  onClick={() => setIsEditingQuery(true)}
                  title="Edit Search Query"
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                >
                  <Pencil size={18} />
                </button>
              </div>
            )}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
              <span>{results.length} results found</span>
              {searchTimeMs !== null && (
                <>
                  <span>•</span>
                  <span>{searchTimeMs}ms query time</span>
                </>
              )}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <ArrowUpDown size={14} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 transition"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Records' },
            { id: 'article', label: 'Articles' },
            { id: 'interview', label: 'Interviews' },
            { id: 'footage_notes', label: 'Footage Notes' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setActiveType(f.id)
                setSearchParams({ q: query, type: f.id })
              }}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                activeType === f.id
                  ? 'bg-[#3b2ceb] text-white shadow-sm shadow-indigo-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* AI Synthesis Summary Card */}
        {aiSummary && (
          <div className="rounded-2xl border border-indigo-100 border-l-4 border-l-[#3b2ceb] bg-white p-6 shadow-sm mb-8 transition hover:shadow-md">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-[#3b2ceb]">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{aiSummary.headline || 'AI Synthesis Summary'}</h2>
                  <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">Natural Language Archive Intelligence</span>
                </div>
              </div>
              <button
                onClick={() => performSearch(query, activeType, sortBy)}
                title="Regenerate Summary"
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>

            <div className="text-[14px] leading-relaxed text-slate-700 space-y-3 font-normal">
              <p>{aiSummary.summary_text}</p>
            </div>

            {aiSummary.citations && aiSummary.citations.length > 0 && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Referenced Citations ({aiSummary.citations.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiSummary.citations.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        const target = results.find(r => r.archive_id === c.archive_id)
                        if (target) setSelectedSource(target)
                      }}
                      className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-2.5 py-1 text-xs font-semibold text-[#3b2ceb] transition hover:bg-indigo-100 hover:border-indigo-300"
                    >
                      <span className="font-mono text-[11px] opacity-80">{c.archive_id}</span>
                      <span className="truncate max-w-[180px]">{c.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Archival Records</h2>
            <span className="text-xs text-slate-500 font-medium">Ranked by keyword & semantic relevance</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 rounded-2xl bg-white border border-slate-200 animate-pulse p-4" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <AlertCircle className="mx-auto text-slate-400 mb-3" size={36} />
              <h3 className="text-base font-bold text-slate-800">No matching archival documents found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Try searching with different terms, adjusting filter categories, or clearing active filters.
              </p>
            </div>
          ) : (
            results.map(item => {
              const Icon = TYPE_ICONS[item.content_type] || FileText
              const isSaved = savedDocs.has(item.id)
              const isSelected = selectedSource?.id === item.id

              return (
                <div
                  key={item.id || item.archive_id}
                  className={`flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border bg-white p-5 shadow-xs transition hover:shadow-md ${
                    isSelected ? 'border-[#3b2ceb] ring-2 ring-indigo-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50/70 text-[#3b2ceb]">
                      <Icon size={22} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1 flex-wrap">
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                          {TYPE_LABELS[item.content_type] || item.content_type}
                        </span>
                        <span>{item.publication_date || 'Date Undefined'}</span>
                        <span className="font-mono text-slate-400">• {item.archive_id}</span>
                        {item.relevance_score && (
                          <span className="rounded-md bg-emerald-50 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">
                            {item.relevance_score} Score
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-[#3b2ceb] transition cursor-pointer" onClick={() => setSelectedSource(item)}>
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        <span className="font-semibold text-slate-700">
                          {item.author ? `${item.author} — ` : ''}
                        </span>
                        {item.snippet || item.summary || item.content}
                      </p>

                      {item.tags && item.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                          {item.tags.slice(0, 4).map((tag, tIdx) => (
                            <span key={tIdx} className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => toggleSave(item)}
                      title={isSaved ? 'Remove from Saved' : 'Save to Library'}
                      className={`rounded-xl p-2.5 border transition ${
                        isSaved
                          ? 'border-indigo-200 bg-indigo-50 text-[#3b2ceb]'
                          : 'border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <Bookmark size={18} className={isSaved ? 'fill-current' : ''} />
                    </button>

                    <button
                      onClick={() => setSelectedSource(item)}
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition"
                    >
                      View Source
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Slide-out Source Details Drawer */}
      {selectedSource && (
        <div className="fixed lg:absolute top-0 right-0 h-full w-full sm:w-[420px] border-l border-slate-200 bg-white shadow-2xl flex flex-col z-50 animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-slate-200 p-6 bg-slate-50/50">
            <div>
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-[#3b2ceb] uppercase tracking-wider">
                {TYPE_LABELS[selectedSource.content_type] || selectedSource.content_type}
              </span>
              <h2 className="mt-2 text-lg font-bold leading-tight text-slate-900 line-clamp-2">
                {selectedSource.title}
              </h2>
            </div>
            <button
              onClick={() => setSelectedSource(null)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 p-6 text-xs bg-white">
            <div>
              <span className="block font-bold uppercase tracking-wider text-slate-400 text-[10px]">Author / Creator</span>
              <span className="mt-1 block font-semibold text-slate-900 truncate">
                {selectedSource.author || selectedSource.interviewee || 'ArchiveAI Collection'}
              </span>
            </div>
            <div>
              <span className="block font-bold uppercase tracking-wider text-slate-400 text-[10px]">Publication Date</span>
              <span className="mt-1 block font-semibold text-slate-900">
                {selectedSource.publication_date || 'Archived'}
              </span>
            </div>
            <div>
              <span className="block font-bold uppercase tracking-wider text-slate-400 text-[10px]">Archive ID</span>
              <span className="mt-1 block font-mono font-semibold text-slate-900">
                {selectedSource.archive_id}
              </span>
            </div>
            <div>
              <span className="block font-bold uppercase tracking-wider text-slate-400 text-[10px]">Source Outlet</span>
              <span className="mt-1 block font-semibold text-slate-900 truncate">
                {selectedSource.source || 'Institutional Archive'}
              </span>
            </div>
          </div>

          {/* Full Text / Excerpt Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {selectedSource.summary && (
              <div className="rounded-xl border border-indigo-100 border-l-4 border-l-[#3b2ceb] bg-indigo-50/50 p-4">
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3b2ceb] mb-1.5">
                  <Sparkles size={14} /> Archival Abstract
                </div>
                <p className="text-xs italic text-slate-700 leading-relaxed">
                  "{selectedSource.summary}"
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Full Archive Transcript & Text</h4>
              <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-[340px] overflow-y-auto font-sans">
                {selectedSource.content || selectedSource.summary || 'Full document text archived in primary storage.'}
              </div>
            </div>

            {selectedSource.tags && selectedSource.tags.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Subject Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSource.tags.map((t, idx) => (
                    <span key={idx} className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Actions */}
          <div className="border-t border-slate-200 p-4 flex items-center gap-3 bg-white">
            <button
              onClick={() => copyToClipboard(selectedSource.archive_id)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
            >
              {copiedId ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
              {copiedId ? 'Copied ID' : 'Copy ID'}
            </button>
            <button
              onClick={() => toggleSave(selectedSource)}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#3b2ceb] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#3224c2] shadow-sm transition"
            >
              <Bookmark size={16} className={savedDocs.has(selectedSource.id) ? 'fill-current' : ''} />
              {savedDocs.has(selectedSource.id) ? 'Saved' : 'Save Item'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
