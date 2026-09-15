import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User, Mail, Shield, Clock, KeyRound } from 'lucide-react'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    name: 'User',
    email: 'user@archiveai.org',
    role: 'Investigative Journalist',
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('archiveai_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        setUser({
          name: parsed.full_name || parsed.name || 'User',
          email: parsed.email || 'user@archiveai.org',
          role: parsed.role || 'Investigative Journalist',
        })
      }
    } catch {
      // use default
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('archiveai_token')
    localStorage.removeItem('archiveai_user')
    navigate('/signin')
  }

  const loginTime = new Date().toLocaleString('en-US', {
    weekday: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="flex h-full w-full flex-col bg-white overflow-y-auto">
      <div className="p-8 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-[15px] text-slate-600">Manage your account settings and session.</p>
      </div>

      <div className="flex-1 p-8 pt-4 flex flex-col gap-6 max-w-4xl">
        {/* Account Information Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <User size={20} className="text-indigo-600" />
            Account Information
          </h2>
          
          <div className="flex flex-col gap-6">
            <div className="border-b border-slate-100 pb-6">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Full Name</span>
              <span className="block text-[15px] font-medium text-slate-900">{user.name}</span>
            </div>
            
            <div className="border-b border-slate-100 pb-6">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</span>
              <div className="flex items-center gap-2">
                <Mail size={15} className="text-slate-400" />
                <span className="block text-[15px] font-medium text-slate-900">{user.email}</span>
              </div>
            </div>

            <div className="border-b border-slate-100 pb-6">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Role</span>
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                <Shield size={14} />
                {user.role}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Password</span>
                <span className="block text-[15px] font-medium text-slate-900 tracking-widest mt-1">••••••••••••</span>
              </div>
              <button className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 flex items-center gap-2">
                <KeyRound size={15} />
                Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Session Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-indigo-600" />
            Session
          </h2>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-5">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Last Login</span>
                <span className="block text-[15px] font-medium text-slate-900">{loginTime}</span>
              </div>
              
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">Status</span>
                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-bold text-[#3b2ceb]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3b2ceb]"></span>
                  </span>
                  Active Session
                </div>
              </div>
            </div>
            
            <button
              onClick={handleLogout}
              className="rounded-lg border border-red-200 bg-white px-6 py-2.5 text-sm font-bold text-red-600 shadow-sm transition hover:bg-red-50 self-end flex items-center gap-2 cursor-pointer"
            >
              <LogOut size={16} />
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
