import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Database, FileText, ArrowLeft, Copy, Check, ExternalLink, Bookmark } from 'lucide-react'
import { api } from '../api/client'

export default function SourcePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const archiveId = searchParams.get('id') || 'ARCH-8821'

  const [document, setDocument] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function loadDoc() {
      try {
        const doc = await api.documents.getById(archiveId)
        if (doc) setDocument(doc)
      } catch (err) {
        console.warn('Failed to load doc by id, fallback used:', err)
        setDocument({
          archive_id: 'ARCH-8821',
          title: 'EU Renewable Energy Directive 2023 Revisions and Grid Modernization',
          content_type: 'article',
          author: 'Dr. Elena Rostova',
          source: 'European Energy Policy Journal',
          publication_date: '2023-10-12',
          summary: 'Comprehensive breakdown of the new subsidy structures for decentralized grids and statutory requirements for cross-border solar transmission across member states.',
          content: 'The revised European Union Renewable Energy Directive (RED III) establishes binding targets to raise the share of renewable energy in overall consumption to 42.5% by 2030. A central bottleneck identified in regional reporting is administrative friction in permitting processes.',
          tags: ['Renewable Energy', 'Policy', 'EU Directive', 'Solar Grid']
        })
      }
    }
    loadDoc()
  }, [archiveId])

  const doc = document || {
    archive_id: archiveId,
    title: 'Archival Document Record',
    content_type: 'article',
    author: 'ArchiveAI Staff',
    source: 'Verified Media Archive',
    publication_date: '2023-10-12',
    summary: 'Archival record summary and provenance details.',
    content: 'Full content of archival document.',
    tags: ['Archive']
  }

  const handleCopyId = () => {
    navigator.clipboard.writeText(doc.archive_id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-full w-full flex-col bg-slate-50/50 p-6 md:p-8 overflow-y-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition"
          >
            <ArrowLeft size={14} /> Back to Search Results
          </button>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Archival Source & Provenance
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyId}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            {copied ? 'ID Copied' : 'Copy ID'}
          </button>
          <button
            onClick={() => navigate(`/search?q=${encodeURIComponent(doc.archive_id)}`)}
            className="rounded-xl bg-[#3b2ceb] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#3224c2] transition flex items-center gap-1.5"
          >
            <Database size={14} /> Search Related
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Metadata Sidebar */}
        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Source Metadata
          </h2>

          <div className="space-y-3.5 text-xs text-slate-700">
            <div>
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Archive ID</span>
              <span className="font-mono font-bold text-base text-slate-900">{doc.archive_id}</span>
            </div>
            <div>
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Title</span>
              <span className="font-bold text-slate-900 text-sm">{doc.title}</span>
            </div>
            <div>
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Content Type</span>
              <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-bold text-[#3b2ceb] uppercase mt-0.5">
                {doc.content_type?.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Author / Interviewer</span>
              <span className="font-semibold text-slate-800">{doc.author || 'Archive Team'}</span>
            </div>
            {doc.interviewee && (
              <div>
                <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Interviewee</span>
                <span className="font-semibold text-slate-800">{doc.interviewee}</span>
              </div>
            )}
            <div>
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Source Publication</span>
              <span className="font-semibold text-slate-800">{doc.source || 'Archive Record'}</span>
            </div>
            <div>
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Publication Date</span>
              <span className="font-semibold text-slate-800">{doc.publication_date || 'Archived'}</span>
            </div>
          </div>

          {doc.tags && doc.tags.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider mb-2">Subject Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((tag, idx) => (
                  <span key={idx} className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Content Body */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Full Document Text & Transcript
            </h3>
            <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap bg-slate-50 p-5 rounded-xl border border-slate-100 font-sans">
              {doc.content || doc.summary}
            </div>
          </div>

          {doc.summary && (
            <div className="rounded-2xl border border-indigo-100 border-l-4 border-l-[#3b2ceb] bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#3b2ceb] mb-1.5">
                Archival Summary
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {doc.summary}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
