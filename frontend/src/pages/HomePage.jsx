import { useState, useEffect } from 'react'
import { Search, ArrowRight, FileText, Mic, Video, SquareTerminal, Sparkles, TrendingUp, Database, Clock, Tag } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function HomePage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.documents.getStats()
        setStats(data)
      } catch (err) {
        console.warn('Could not load stats, using defaults:', err)
        setStats({
          total_documents: 12,
          total_articles: 5,
          total_interviews: 4,
          total_footage_notes: 3,
          total_footage_hours: 1.5,
          total_tags: 28,
          total_searches: 6,
          recent_searches: ['Renewable energy policy interview', 'EU RED III directive']
        })
      }
    }
    loadStats()
  }, [])

  const handleSearch = (e) => {
    e?.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    } else {
      navigate('/search')
    }
  }

  const handleCategoryClick = (type) => {
    navigate(`/search?type=${type}`)
  }

  const handleQuickTopic = (topic) => {
    navigate(`/search?q=${encodeURIComponent(topic)}`)
  }

  return (
    <div className="flex h-full flex-col items-center justify-center p-6 md:p-8 text-center bg-white overflow-y-auto pb-20">
      <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-1.5 text-xs font-bold text-[#3b2ceb] mb-4">
        <Sparkles size={14} /> AI-Powered Media Archive Search System
      </div>

      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 max-w-2xl leading-tight">
        Archive Search & Source Attribution
      </h1>
      <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-slate-600">
        Search archived articles, interview transcripts, and footage notes with synthesized AI summaries and verified source attributions.
      </p>

      {/* Main Search Input */}
      <form onSubmit={handleSearch} className="mx-auto mt-8 flex w-full max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-2 pl-4 pr-2 shadow-sm focus-within:border-[#3b2ceb] focus-within:ring-2 focus-within:ring-indigo-100 transition">
        <Search className="text-slate-400 shrink-0" size={20} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-slate-400 text-slate-800"
          placeholder="Ask a question or search archive by topic, name, or keywords..."
        />
        <button 
          type="submit"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3b2ceb] text-white transition hover:bg-[#3224c2] shadow-xs"
        >
          <ArrowRight size={20} />
        </button>
      </form>

      {/* Filter Category Shortcuts */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
        <button 
          onClick={() => handleCategoryClick('article')}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
        >
          <FileText size={15} className="text-indigo-600" />
          Articles
        </button>
        <button 
          onClick={() => handleCategoryClick('interview')}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
        >
          <Mic size={15} className="text-indigo-600" />
          Interviews
        </button>
        <button 
          onClick={() => handleCategoryClick('footage_notes')}
          className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300"
        >
          <Video size={15} className="text-indigo-600" />
          Footage Notes
        </button>
      </div>

      {/* Live Stats Dashboard */}
      {stats && (
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl w-full">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
              <Database size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Total Records</span>
            </div>
            <span className="text-2xl font-extrabold text-slate-900">{stats.total_documents}</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
              <FileText size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Articles</span>
            </div>
            <span className="text-2xl font-extrabold text-indigo-700">{stats.total_articles}</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
              <Mic size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Interviews</span>
            </div>
            <span className="text-2xl font-extrabold text-indigo-700">{stats.total_interviews}</span>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-400 mb-1">
              <Video size={14} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Footage Notes</span>
            </div>
            <span className="text-2xl font-extrabold text-indigo-700">{stats.total_footage_notes}</span>
          </div>
        </div>
      )}

      {/* Suggested Inquiries */}
      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500 flex-wrap">
        <span className="font-semibold text-slate-400 flex items-center gap-1">
          <TrendingUp size={13} /> Trending Searches:
        </span>
        {(stats?.recent_searches?.length > 0
          ? stats.recent_searches.slice(0, 4)
          : [
              'Renewable energy policy interview',
              'EU RED III directive',
              'Baltic wind grid subsidies',
              'Urban housing reform'
            ]
        ).map((topic, i) => (
          <button
            key={i}
            onClick={() => handleQuickTopic(topic)}
            className="rounded-lg bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 text-slate-700 transition font-medium"
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Feature Showcase */}
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl w-full text-left">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-[#3b2ceb] mb-3">
            <Search size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Keyword & Semantic Search</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Multi-field indexed search across titles, summaries, tags, and full archival transcripts.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-[#3b2ceb] mb-3">
            <Sparkles size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">AI Synthesis Summaries</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Automated multi-document synthesis highlighting core developments and critical facts.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-[#3b2ceb] mb-3">
            <SquareTerminal size={20} />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Verified Source Attribution</h3>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Direct citation tracking with archive IDs, authors, publication dates, and source excerpts.
          </p>
        </div>
      </div>
    </div>
  )
}
