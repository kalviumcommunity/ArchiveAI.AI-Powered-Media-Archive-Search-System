import { Search, ChevronDown, Bookmark, MoreVertical, FileText, Calendar, Hash } from 'lucide-react'

export default function SavedPage() {
  const savedItems = [
    {
      id: 'ARCH-8472',
      title: 'Renewable Energy Policy 2010-2020',
      tags: ['Article', 'Report'],
      desc: 'Comprehensive overview of global renewable energy policy shifts, legislative frameworks, and investment trends during the 2010-2020 decade. Includes analysis of key government initiatives across North America.',
      sources: 142,
      savedAt: 'Saved 2 days ago'
    },
    {
      id: 'ARCH-9104',
      title: 'Tech IPOs Q3 2023 Performance',
      tags: ['Interview', 'Data'],
      desc: 'Financial transcripts, executive interviews, and market data tracking the performance of major technology initial public offerings during the third quarter of 2023. Focuses on valuation trends and post-launch volatility.',
      sources: 89,
      savedAt: 'Saved 1 week ago'
    },
    {
      id: 'ARCH-3321',
      title: 'Architectural Brutalism 1950s',
      tags: ['Image', 'Article'],
      desc: 'A curated visual and textual archive focusing on the origins of the Brutalist architectural movement in the 1950s. Includes original blueprints, historical photographs, and critical essays from era-specific publications.',
      sources: 304,
      savedAt: 'Saved 2 weeks ago'
    }
  ]

  return (
    <div className="flex h-full w-full flex-col bg-white p-8 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Saved Searches</h1>
        <p className="mt-2 text-[15px] text-slate-600">View and manage your saved archive searches for quick access.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3b2ceb] focus:ring-1 focus:ring-[#3b2ceb]"
            placeholder="Search saved items..."
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button className="flex items-center justify-between w-full sm:w-40 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            Recently Saved
            <ChevronDown size={16} className="text-slate-400" />
          </button>
          <button className="flex items-center justify-between w-full sm:w-32 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
            All Types
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {savedItems.map(item => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[#3b2ceb]">
              <Bookmark size={20} className="fill-current" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900 truncate">{item.title}</h2>
                {item.tags.map(tag => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
              
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {item.desc}
              </p>
              
              <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Hash size={14} /> ID: {item.id}
                </div>
                <div className="flex items-center gap-1.5">
                  <FileText size={14} /> {item.sources} Sources
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} /> {item.savedAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 mt-4 sm:mt-0 w-full sm:w-auto justify-end">
              <button className="rounded-lg border border-indigo-200 bg-white px-4 py-2 text-sm font-semibold text-[#3b2ceb] transition hover:bg-indigo-50">
                Open
              </button>
              <button className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
