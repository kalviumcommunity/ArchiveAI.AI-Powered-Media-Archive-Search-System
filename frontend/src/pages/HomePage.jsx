import { Search, ArrowRight, FileText, Mic, Video, SquareTerminal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center bg-white overflow-y-auto pb-20">
      <h1 className="mt-8 text-3xl font-bold tracking-tight text-slate-900">Archive Search</h1>
      <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-slate-600">
        Search archived articles, interviews, and footage notes using natural language.
      </p>

      <div className="mx-auto mt-10 flex w-full max-w-2xl items-center rounded-2xl border border-slate-200 bg-white p-2 pl-4 pr-2 shadow-sm focus-within:border-[#3b2ceb] focus-within:ring-1 focus-within:ring-[#3b2ceb] transition">
        <Search className="text-slate-400" size={20} />
        <input
          className="w-full bg-transparent px-4 py-3 text-[15px] outline-none placeholder:text-slate-400 text-slate-700"
          placeholder="Ask a question or search using keywords..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigate('/search');
          }}
        />
        <button 
          onClick={() => navigate('/search')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#3b2ceb] text-white transition hover:bg-[#3224c2]"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <FileText size={16} className="text-slate-400" />
          Articles
        </button>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Mic size={16} className="text-slate-400" />
          Interviews
        </button>
        <button className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
          <Video size={16} className="text-slate-400" />
          Footage Notes
        </button>
      </div>

      <div className="mt-20 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-300">
          <SquareTerminal size={32} />
        </div>
        <h2 className="mt-6 text-xl font-semibold text-slate-900">Start searching the archive</h2>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Ask questions about archived media or search using keywords to discover relevant documents and insights.
        </p>
      </div>
    </div>
  )
}
