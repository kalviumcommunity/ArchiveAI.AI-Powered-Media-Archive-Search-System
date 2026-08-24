export default function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col bg-white overflow-y-auto">
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-[15px] text-slate-600">Manage your account settings.</p>
      </div>

      <div className="flex-1 p-8 pt-4 flex flex-col gap-6 max-w-4xl">
        {/* Account Information Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Account Information</h2>
          
          <div className="flex flex-col gap-6">
            <div className="border-b border-slate-100 pb-6">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</span>
              <span className="block text-[15px] font-medium text-slate-900">John Doe</span>
            </div>
            
            <div className="border-b border-slate-100 pb-6">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</span>
              <span className="block text-[15px] font-medium text-slate-900">john.doe@example.com</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Password</span>
                <span className="block text-[15px] font-medium text-slate-900 tracking-widest mt-1">••••••••••••</span>
              </div>
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Session Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Session</h2>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-5">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Last Login</span>
                <span className="block text-[15px] font-medium text-slate-900">Today, 10:24 AM</span>
              </div>
              
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Status</span>
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-[#3b2ceb]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3b2ceb]"></span>
                  Logged In
                </div>
              </div>
            </div>
            
            <button className="rounded-lg border border-red-200 bg-white px-6 py-2.5 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50 self-end">
              Log Out
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 p-6 text-center">
        <p className="text-xs font-medium text-slate-500">
          ArchiveAI v1.0 | Powered by AI Media Search System
        </p>
      </div>
    </div>
  )
}
