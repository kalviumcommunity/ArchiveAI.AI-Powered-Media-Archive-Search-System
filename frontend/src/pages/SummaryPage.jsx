import { sourceDetails } from '../data/mockData'

export default function SummaryPage() {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            ArchiveAI
          </p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">Summary</h2>
        </div>
        <button className="rounded-xl bg-[#4d46ff] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#4138f4]">
          Export summary
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            AI summary
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900">{sourceDetails.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Recovery efforts were coordinated across local agencies over several months, with
            emphasis on public communication, long-term housing guidance, and transparent reporting
            during the community response period. The supporting records show that cross-agency
            alignment improved trust and response times for residents.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Related sources
          </p>

          <div className="mt-4 space-y-3">
            {['Article', 'Interview', 'Footage Notes'].map((type) => (
              <div key={type} className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-900">{type}</span>
                  <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-indigo-700">
                    Verified
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">Document ID: ARCH-78412</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
