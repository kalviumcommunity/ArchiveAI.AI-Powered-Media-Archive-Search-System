import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Home, Database, Bookmark, Settings, Plus, SquareTerminal, Bell, User, History, RotateCcw } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Media Archive', icon: Database },
  { to: '/saved', label: 'Saved Items', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const recentSearches = [
  { text: 'AI regulations interview', time: '2 hours ago' },
  { text: 'Budget speech 2024', time: 'Yesterday' },
  { text: 'Climate summit footage', time: '3 days ago' },
  { text: 'Election manifesto article', time: 'Last week' },
  { text: 'Tech earnings report Q3', time: 'Last week' },
  { text: 'Global trade policies', time: '2 weeks ago' },
]

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-[#f9fafb] text-slate-800 font-sans">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-slate-200 bg-white shadow-sm flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 text-[#3b2ceb]">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-[#3b2ceb]">
              <SquareTerminal size={22} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#3b2ceb] leading-none">ArchiveAI</span>
              <span className="text-[10px] text-slate-500 mt-1 font-medium">Media Archive Search</span>
            </div>
          </div>

          <button 
            onClick={() => navigate('/')}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3b2ceb] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#3224c2]"
          >
            <Plus size={18} />
            New Search
          </button>
        </div>

        <nav className="flex flex-col px-4 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-[#3b2ceb] border-l-4 border-[#3b2ceb]'
                      : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                  }`
                }
              >
                <Icon size={18} className="opacity-80" />
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="mt-8 flex-1 overflow-y-auto px-4 pb-4">
          <h3 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
            Recent searches
          </h3>
          <div className="mt-2 flex flex-col gap-1">
            {recentSearches.map((search, i) => (
              <button key={i} className="flex items-start gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-50">
                <History size={16} className="text-slate-400 mt-0.5 shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium text-slate-700 truncate">{search.text}</span>
                  <span className="text-[10px] text-slate-400">{search.time}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50">
            <RotateCcw size={16} />
            Clear History
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 px-8 flex-shrink-0">
          <div className="text-sm font-medium text-slate-500">
            {location.pathname === '/' ? '' : 'Archive Workspace'}
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button className="hover:text-slate-700 transition">
              <Bell size={20} />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition">
              <User size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-hidden relative">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
