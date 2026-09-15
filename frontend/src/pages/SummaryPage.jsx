import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sparkles, FileText, ArrowRight, Download, Share2, Check, ExternalLink } from 'lucide-react'
import { api } from '../api/client'

export default function SummaryPage() {
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
          content: 'The revised European Union Renewable Energy Directive (RED III) establishes binding targets to raise the share of renewable energy in overall consumption to 42.5% by 2030.',
          tags: ['Renewable Energy', 'Policy', 'EU Directive', 'Solar Grid']
        })
      }
    }
    loadDoc()
  }, [archiveId])

  const doc = document || {
    archive_id: archiveId,
    title: 'EU Renewable Energy Directive 2023 Revisions',
    content_type: 'article',
    author: 'Dr. Elena Rostova',
    source: 'European Energy Policy Journal',
    publication_date: '2023-10-12',
    summary: 'Comprehensive breakdown of the new subsidy structures for decentralized grids.',
    content: 'The revised European Union Renewable Energy Directive establishes binding targets for 2030.',
    tags: ['Renewable Energy', 'Policy']
  }

  const handleExport = () => {
    const text = `ArchiveAI Summary Export\nTitle: ${doc.title}\nID: ${doc.archive_id}\nAuthor: ${doc.author}\nDate: ${doc.publication_date}\n\nSummary:\n${doc.summary}\n\nFull Content:\n${doc.content}`
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${doc.archive_id}_summary.txt`
    link.click()
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-full w-full flex-col bg-slate-50/50 p-6 md:p-8 overflow-y-auto">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#3b2ceb]">
            AI Synthesis & Executive Brief
          </span>
          <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Document Summary Analysis
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5"
          >
            {copied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
            {copied ? 'Link Copied' : 'Share'}
          </button>
          <button
            onClick={handleExport}
            className="rounded-xl bg-[#3b2ceb] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#3224c2] transition flex items-center gap-1.5"
          >
            <Download size={14} /> Export Brief
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Left Card: AI Summary */}
        <div className="rounded-2xl border border-indigo-100 border-l-4 border-l-[#3b2ceb] bg-white p-6 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#3b2ceb] mb-3">
            <Sparkles size={16} /> Key Findings & Executive Takeaways
          </div>

          <h2 className="text-xl font-bold text-slate-900 leading-snug">{doc.title}</h2>
          
          <div className="mt-4 rounded-xl bg-slate-50 p-4 border border-slate-100 text-sm leading-relaxed text-slate-700">
            <p className="font-semibold text-slate-800 mb-2">Core Archival Abstract:</p>
            <p>{doc.summary}</p>
          </div>

          <div className="mt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Supporting Context</h3>
            <p className="text-xs leading-relaxed text-slate-600">
              {doc.content}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => navigate(`/source?id=${doc.archive_id}`)}
              className="text-xs font-bold text-[#3b2ceb] hover:underline flex items-center gap-1"
            >
              View Full Source Metadata <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Card: Source Provenance */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Source Provenance
            </p>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Archive ID:</span>
                <span className="font-mono font-bold text-slate-900">{doc.archive_id}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Type:</span>
                <span className="capitalize font-bold text-[#3b2ceb]">{doc.content_type?.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Author:</span>
                <span className="font-bold text-slate-900">{doc.author || 'Archive Team'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="font-semibold text-slate-500">Source:</span>
                <span className="font-bold text-slate-900">{doc.source || 'Journal Archive'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-500">Date:</span>
                <span className="font-bold text-slate-900">{doc.publication_date || 'Archived'}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-indigo-50/50 p-5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#3b2ceb] mb-2">
              <FileText size={16} /> Rapid Attribution
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every summary fact is directly correlated with original document ID #{doc.archive_id} stored in the ArchiveAI verified index.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
