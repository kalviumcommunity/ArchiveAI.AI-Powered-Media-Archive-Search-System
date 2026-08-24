import { sourceDetails } from '../data/mockData'

export default function SourcePage() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            ArchiveAI
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Source</h2>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Source metadata
          </p>

          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div><span className="font-medium text-slate-900">Title:</span> {sourceDetails.title}</div>
            <div><span className="font-medium text-slate-900">Source:</span> {sourceDetails.source}</div>
            <div><span className="font-medium text-slate-900">Date:</span> {sourceDetails.date}</div>
            <div><span className="font-medium text-slate-900">Author:</span> {sourceDetails.author}</div>
            <div><span className="font-medium text-slate-900">Archive ID:</span> {sourceDetails.documentId}</div>
          </div>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Supporting excerpt
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-700">“{sourceDetails.excerpt}”</p>

          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Context</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Corresponding archive data indicates a coordinated public information strategy and
              sustained local planning response, reinforcing the summary’s core findings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
