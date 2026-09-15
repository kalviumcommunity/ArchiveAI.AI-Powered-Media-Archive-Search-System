import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  ChevronDown,
  Bookmark,
  MoreVertical,
  FileText,
  Calendar,
  Hash,
  Trash2,
  ExternalLink,
  Tag,
  AlertCircle
} from 'lucide-react'
import { api } from '../api/client'

const initialSaved = [
  {
    id: 1,
    document_id: 1,
    notes: 'Key analysis on EU directive subsidy shifts and timeline acceleration.',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    document: {
      archive_id: 'ARCH-8821',
      title: 'EU Renewable Energy Directive 2023 Revisions and Grid Modernization',
      content_type: 'article',
      author: 'Dr. Elena Rostova',
      source: 'European Energy Policy Journal',
      publication_date: '2023-10-12',
      summary: 'Comprehensive breakdown of the new subsidy structures for decentralized grids and statutory requirements for cross-border solar transmission across member states.',
      tags: ['Renewable Energy', 'Policy', 'EU Directive', 'Solar Grid']
    }
  },
  {
    id: 2,
    document_id: 2,
    notes: 'Interviews with Commissioner Vance regarding cross-border high voltage lines.',
    created_at: new Date(Date.now() - 604800000).toISOString(),
    document: {
      archive_id: 'ARCH-9104',
      title: 'Transcript: Ministry of Energy Policy Summit & Infrastructure Roundtable',
      content_type: 'interview',
      author: 'James Cole (Interviewer)',
      interviewee: 'Commissioner Marcus Vance',
      source: 'Continental Broadcasting Newsroom',
      publication_date: '2023-11-04',
      summary: 'High-level interview detailing friction points in cross-border high-voltage direct current (HVDC) transmission lines and municipal battery storage subsidies.',
      tags: ['Interview', 'Energy Summit', 'Transmission', 'Policy']
    }
  },
  {
    id: 3,
    document_id: 4,
    notes: 'Urban redevelopment longitudinal study and civic dashboard case study.',
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    document: {
      archive_id: 'ARCH-78412',
      title: 'Urban Renewal and Municipal Housing Reform Archive Notes',
      content_type: 'article',
      author: 'Mara Chen',
      source: 'Urban Policy Institute & Media Archive',
      publication_date: '2023-09-12',
      summary: 'Emergency operations teams coordinated rapid response with local agencies, prioritizing housing support, transportation recovery, and public communication.',
      tags: ['Urban Planning', 'Housing Reform', 'Crisis Response']
    }
  }
]

export default function SavedPage() {
  const navigate = useNavigate()
  const [savedList, setSavedList] = useState(initialSaved)
  const [filterText, setFilterText] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadSaved() {
      try {
        setLoading(true)
        const items = await api.saved.getAll()
        if (items && items.length > 0) {
          setSavedList(items)
        }
      } catch (err) {
        console.warn('Loading saved items from API failed, using cached list:', err)
      } finally {
        setLoading(false)
      }
    }
    loadSaved()
  }, [])

  const handleRemove = async (savedId) => {
    setSavedList(prev => prev.filter(item => item.id !== savedId))
    try {
      await api.saved.remove(savedId)
    } catch (err) {
      console.warn('Could not delete from backend:', err)
    }
  }

  const filteredItems = savedList.filter(item => {
    const doc = item.document || {}
    const matchesText =
      !filterText ||
      (doc.title && doc.title.toLowerCase().includes(filterText.toLowerCase())) ||
      (doc.summary && doc.summary.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(filterText.toLowerCase())) ||
      (doc.archive_id && doc.archive_id.toLowerCase().includes(filterText.toLowerCase()))

    const matchesType =
      typeFilter === 'all' ||
      (doc.content_type && doc.content_type.toLowerCase() === typeFilter.toLowerCase())

    return matchesText && matchesType
  })

  return (
    <div className="flex h-full w-full flex-col bg-slate-50/50 p-6 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Saved Archival Items</h1>
        <p className="mt-1 text-sm text-slate-600">
          Curated collection of saved articles, interview transcripts, and media records.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
          <input
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs md:text-sm outline-none transition focus:border-[#3b2ceb] focus:ring-2 focus:ring-indigo-100"
            placeholder="Search saved records, notes, or archive IDs..."
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:border-slate-300 transition"
          >
            <option value="all">All Content Types</option>
            <option value="article">Articles</option>
            <option value="interview">Interviews</option>
            <option value="footage_notes">Footage Notes</option>
          </select>
        </div>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <AlertCircle className="mx-auto text-slate-400 mb-2" size={32} />
            <h3 className="text-sm font-bold text-slate-800">No saved items found</h3>
            <p className="text-xs text-slate-500 mt-1">Bookmark documents from search results to review them here.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const doc = item.document || {}
            return (
              <div
                key={item.id}
                className="flex flex-col md:flex-row items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#3b2ceb]">
                    <Bookmark size={20} className="fill-current" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 uppercase">
                        {doc.content_type || 'Article'}
                      </span>
                      <span className="font-mono text-xs text-slate-400">
                        {doc.archive_id || `ID: ${item.document_id}`}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {doc.title || 'Archived Record'}
                    </h2>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {doc.summary || doc.content || item.notes}
                    </p>

                    {item.notes && (
                      <div className="mt-2.5 rounded-lg bg-indigo-50/60 px-3 py-1.5 text-xs text-[#3b2ceb] font-medium inline-block border border-indigo-100">
                        Note: {item.notes}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-[11px] font-semibold text-slate-400 mt-3 flex-wrap">
                      {doc.author && <span>Author: {doc.author}</span>}
                      {doc.publication_date && <span>Published: {doc.publication_date}</span>}
                      <span>Saved: {new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => navigate(`/search?q=${encodeURIComponent(doc.archive_id || doc.title || '')}`)}
                    className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-3.5 py-2 text-xs font-bold text-[#3b2ceb] hover:bg-indigo-100 transition flex items-center gap-1.5"
                  >
                    <ExternalLink size={14} /> Open in Search
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    title="Delete from saved"
                    className="rounded-xl p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
