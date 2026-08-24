import { useState } from 'react'
import { Sparkles, FileText, Mic, X, Copy, ExternalLink, Pencil } from 'lucide-react'

export default function SearchPage() {
  const [selectedSource, setSelectedSource] = useState(null)

  const sources = [
    {
      id: 'AR-8821',
      type: 'Article',
      date: 'Oct 12, 2023',
      title: 'EU Renewable Energy Directive 2023 Revisions',
      author: 'Dr. Elena Rostova',
      snippet: 'Comprehensive breakdown of the new subsidy structures for decentralized grids.',
      icon: FileText
    },
    {
      id: 'AR-9104',
      type: 'Interview',
      date: 'Nov 04, 2023',
      title: 'Transcript: Ministry of Energy Policy Summit',
      author: 'Interviewer: James Cole',
      snippet: 'Discussion on the friction points of cross-border solar energy transmission.',
      icon: Mic
    },
    {
      id: 'AR-8755',
      type: 'Article',
      date: 'Sep 28, 2023',
      title: 'Legislative Proposals for Decentralized Wind Subsidies',
      author: 'Policy Institute Brussels',
      snippet: 'Analysis of the 15% increase in funding requests from Baltic states.',
      icon: FileText
    }
  ]

  return (
    <div className="flex h-full w-full bg-white relative">
      {/* Main Content */}
      <div className={`flex-1 overflow-y-auto p-8 transition-all ${selectedSource ? 'mr-96' : ''}`}>
        
        <div className="flex items-center gap-3 border-b border-slate-100 pb-6 mb-6">
          <h1 className="text-[22px] font-semibold text-slate-900">
            Searching for: "Renewable energy policy interview"
          </h1>
          <button className="text-slate-400 hover:text-slate-600 transition">
            <Pencil size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-8 text-sm">
          <span className="font-medium text-slate-500">Sources:</span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-[#3b2ceb]">Articles</span>
          <span className="rounded-full bg-indigo-50 px-3 py-1 font-semibold text-[#3b2ceb]">Interviews</span>
          <button className="rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-500 hover:bg-slate-50 transition">
            + Add Filter
          </button>
        </div>

        {/* AI Summary Card */}
        <div className="rounded-2xl border border-slate-200 border-l-4 border-l-[#3b2ceb] bg-white p-6 shadow-sm mb-10">
          <div className="flex items-center gap-2 text-xl font-bold text-slate-900 mb-4">
            <Sparkles className="text-[#3b2ceb]" size={24} />
            AI Summary
          </div>
          <div className="space-y-4 text-[15px] leading-relaxed text-slate-600">
            <p>
              Based on the selected sources, recent interviews emphasize a pivotal shift in EU renewable energy directives,
              focusing heavily on reducing bureaucratic friction for solar grid integration. Key policymakers note that while
              targets for 2030 are ambitious, structural bottlenecks in cross-border energy sharing remain a primary concern.
            </p>
            <p>
              Articles published within the last quarter corroborate this, highlighting a 15% increase in legislative proposals
              aimed at subsidizing decentralized wind energy projects. Interview transcripts with industry leaders suggest a
              cautious optimism, provided that regulatory frameworks stabilize by Q3 2024.
            </p>
          </div>
          <div className="mt-6 border-t border-slate-100 pt-4 flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            <FileText size={14} />
            Sources found: 12
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-900 mb-4">Referenced Sources</h2>
        
        <div className="flex flex-col gap-4">
          {sources.map(source => {
            const Icon = source.icon;
            return (
              <div key={source.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                    <Icon size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 font-bold text-slate-600">{source.type}</span>
                      <span>{source.date}</span>
                      <span>• {source.id}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{source.title}</h3>
                    <p className="text-sm text-slate-600 mt-0.5">
                      <span className="font-semibold">Author: {source.author}</span> — {source.snippet}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedSource(source)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 shrink-0 ml-4"
                >
                  View Source
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Slide-out Panel */}
      {selectedSource && (
        <div className="absolute top-0 right-0 h-full w-[400px] border-l border-slate-200 bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between border-b border-slate-200 p-6">
            <div>
              <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600 uppercase tracking-wider">{selectedSource.type}</span>
              <h2 className="mt-3 text-lg font-bold leading-tight text-slate-900">{selectedSource.title}</h2>
            </div>
            <button 
              onClick={() => setSelectedSource(null)}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-slate-200 p-6 text-sm">
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Author</span>
              <span className="mt-1 block font-medium text-slate-900">{selectedSource.author.replace('Interviewer: ', '').replace('Author: ', '')}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Published</span>
              <span className="mt-1 block font-medium text-slate-900">{selectedSource.date}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Archive ID</span>
              <span className="mt-1 block font-medium text-slate-900">{selectedSource.id}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Source Type</span>
              <span className="mt-1 block font-medium text-slate-900">Regulatory Document</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="rounded-xl border border-indigo-100 border-l-4 border-l-[#3b2ceb] bg-indigo-50/50 p-4 mb-6">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#3b2ceb] mb-2">
                <Sparkles size={14} /> Referenced in AI Summary
              </div>
              <p className="text-sm italic text-slate-700 leading-relaxed">
                "...focusing heavily on reducing bureaucratic friction for solar grid integration... structural bottlenecks in cross-border energy sharing remain a primary concern."
              </p>
            </div>

            <div className="text-sm leading-relaxed text-slate-700 space-y-4">
              <p>
                The revised directive establishes a new framework for renewable energy deployment across member states. While targets for 2030 
                <mark className="bg-yellow-200/60 px-1 py-0.5 rounded">structural bottlenecks in cross-border energy sharing remain a primary concern</mark>. 
                Regional integration has been hampered by inconsistent regulatory interpretations.
              </p>
              <p>
                <mark className="bg-yellow-200/60 px-1 py-0.5 rounded">reducing bureaucratic friction for solar grid integration</mark>, specifically by expediting permitting processes for installations exceeding 50 MW capacity. Historically, these projects faced delays averaging 18 to 24 months.
              </p>
              <p>
                Local municipalities are now required to designate 'go-to' areas where environmental assessments are streamlined. The success of these zones relies heavily on modernized grid infrastructure capable of handling variable loads from decentralized sources.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-200 p-4 flex items-center gap-3 bg-white">
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
              <Copy size={16} />
              Copy Archive ID
            </button>
            <button className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#3b2ceb] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3224c2]">
              <ExternalLink size={16} />
              Open Full Document
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
