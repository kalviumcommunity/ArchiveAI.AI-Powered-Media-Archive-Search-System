import { useState, useEffect, useRef } from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Home,
  Database,
  Bookmark,
  Settings,
  Plus,
  SquareTerminal,
  Bell,
  User,
  History,
  RotateCcw,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Sparkles,
  Search,
  CheckCircle,
  ExternalLink,
  Shield,
  Clock
} from 'lucide-react'
import { api } from '../api/client'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Media Archive', icon: Database },
  { to: '/history', label: 'Search History', icon: Clock },
  { to: '/saved', label: 'Saved Items', icon: Bookmark },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const mockNotifications = [
  { id: 1, title: 'New Archive Indexed', desc: 'EU Renewable Energy Directive 2023 was added.', time: '10m ago', unread: true },
  { id: 2, title: 'Search Cache Updated', desc: 'Semantic vectors refreshed for 450 documents.', time: '1h ago', unread: true },
  { id: 3, title: 'System Notice', desc: 'PostgreSQL database connected & ready.', time: '3h ago', unread: false },
]

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

const fallbackRecentSearches = [
  { id: '1', text: 'AI regulations interview', time: '2 hours ago' },
  { id: '2', text: 'EU Renewable Energy Directive', time: 'Yesterday' },
  { id: '3', text: 'Climate summit footage notes', time: '3 days ago' },
  { id: '4', text: 'Election manifesto transcript', time: 'Last week' },
  { id: '5', text: 'Tech earnings report Q3', time: 'Last week' },
]

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [user, setUser] = useState({
    name: 'Alex Morgan',
    email: 'journalist@archiveai.org',
    role: 'Investigative Journalist',
    avatarInitial: 'A'
  })

  const userDropdownRef = useRef(null)
  const notifDropdownRef = useRef(null)

  // Load user from localStorage if present
  useEffect(() => {
    const savedUser = localStorage.getItem('archiveai_user')
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser)
        setUser({
          name: parsed.full_name || parsed.name || 'User',
          email: parsed.email || '',
          role: parsed.role || 'Journalist',
          avatarInitial: (parsed.full_name || parsed.name || 'U').charAt(0).toUpperCase()
        })
      } catch {
        // use default
      }
    }
  }, [])

  // Load real search history from API
  useEffect(() => {
    async function loadHistory() {
      try {
        const items = await api.search.getHistory(5)
        if (items && items.length > 0) {
          setRecentSearches(items.map(item => ({
            id: String(item.id),
            text: item.query,
            time: timeAgo(item.created_at),
          })))
        } else {
          setRecentSearches(fallbackRecentSearches)
        }
      } catch {
        setRecentSearches(fallbackRecentSearches)
      }
    }
    loadHistory()
  }, [location.pathname]) // re-fetch when navigating

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false)
      }
      if (notifDropdownRef.current && !notifDropdownRef.current.contains(e.target)) {
        setNotifDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('archiveai_token')
    localStorage.removeItem('archiveai_user')
    setUserDropdownOpen(false)
    navigate('/signin')
  }

  const handleClearHistory = async () => {
    // Delete each history item from the backend
    for (const search of recentSearches) {
      try {
        await api.search.deleteHistory(Number(search.id))
      } catch {
        // ignore
      }
    }
    setRecentSearches([])
  }

  const handleSearchItemClick = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`)
  }

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview'
      case '/search':
        return 'Media Archive Search'
      case '/saved':
        return 'Saved Items & Notes'
      case '/settings':
        return 'Account & Preferences'
      case '/summary':
        return 'AI Summarizer'
      case '/source':
        return 'Source Verification'
      case '/history':
        return 'Search History'
      default:
        return 'Archive Workspace'
    }
  }

  const unreadNotifCount = mockNotifications.filter(n => n.unread).length

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800 bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30">
                <SquareTerminal size={22} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white leading-none">
                  ArchiveAI
                </span>
                <span className="text-[11px] font-semibold text-indigo-400 mt-1 uppercase tracking-wider">
                  Media Archive
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* New Search CTA */}
          <button
            onClick={() => navigate('/search')}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500 active:bg-indigo-700 cursor-pointer"
          >
            <Plus size={18} />
            <span>New Archive Search</span>
          </button>
        </div>

        {/* Main Navigation Links */}
        <div className="px-4 py-4">
          <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Navigation
          </span>
          <nav className="mt-2 flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 font-semibold border-l-4 border-indigo-500 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border-l-4 border-transparent'
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Recent Searches Section */}
        <div className="flex-1 overflow-y-auto px-4 py-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between px-3 py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Recent Queries
            </span>
            {recentSearches.length > 0 && (
              <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded">
                {recentSearches.length}
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-col gap-1">
            {recentSearches.length > 0 ? (
              recentSearches.map((search) => (
                <button
                  key={search.id}
                  onClick={() => handleSearchItemClick(search.text)}
                  className="group flex items-start gap-2.5 rounded-xl px-3 py-2 text-left transition hover:bg-slate-800/60 cursor-pointer"
                >
                  <History size={15} className="text-slate-500 mt-0.5 shrink-0 group-hover:text-indigo-400 transition" />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate transition">
                      {search.text}
                    </span>
                    <span className="text-[10px] text-slate-500">{search.time}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No recent searches yet.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          {recentSearches.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer mb-2"
            >
              <RotateCcw size={14} />
              Clear History
            </button>
          )}

          {/* Database System Status Badge */}
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Archive Database</span>
            </div>
            <span className="font-mono text-emerald-400 text-[10px]">Connected</span>
          </div>
        </div>
      </aside>

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
        
        {/* Top Header Navbar */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex-shrink-0 z-30">
          
          {/* Left: Mobile Menu Toggle & Breadcrumbs */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-500 hidden sm:inline">ArchiveAI /</span>
              <h1 className="text-sm font-semibold text-white tracking-wide">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right: Quick Search + Notifications + Profile Menu */}
          <div className="flex items-center gap-3">
            
            {/* Quick Search Button / Shortcut */}
            <button
              onClick={() => navigate('/search')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-400 hover:text-slate-200 hover:border-slate-600 transition"
            >
              <Search size={14} />
              <span>Quick search...</span>
              <kbd className="text-[10px] font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-400">
                /
              </kbd>
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifDropdownRef}>
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                aria-label="View notifications"
              >
                <Bell size={19} />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-fadeIn">
                  <div className="flex items-center justify-between p-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Archive Notifications
                    </span>
                    <span className="text-[10px] text-indigo-400 font-medium">
                      {unreadNotifCount} unread
                    </span>
                  </div>
                  <div className="divide-y divide-slate-800/50 max-h-72 overflow-y-auto">
                    {mockNotifications.map((notif) => (
                      <div key={notif.id} className="p-3 hover:bg-slate-800/50 rounded-xl transition">
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-semibold text-white">{notif.title}</span>
                          <span className="text-[10px] text-slate-500">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-snug">{notif.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-800/80 transition cursor-pointer border border-transparent hover:border-slate-700/60"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-md shadow-indigo-600/30">
                  {user.avatarInitial || 'A'}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-white leading-tight">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-indigo-300 font-medium leading-tight">
                    {user.role}
                  </span>
                </div>
                <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50 animate-fadeIn">
                  {/* User details header */}
                  <div className="p-3 border-b border-slate-800/80">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-950/80 border border-indigo-500/20 text-[10px] font-semibold text-indigo-300">
                      <Shield size={11} />
                      {user.role}
                    </div>
                  </div>

                  {/* Dropdown Options */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        navigate('/settings')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Settings size={15} />
                      Account Settings
                    </button>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false)
                        navigate('/saved')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
                    >
                      <Bookmark size={15} />
                      Saved Articles & Transcripts
                    </button>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-1 border-t border-slate-800/80">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-950/40 hover:text-red-300 transition cursor-pointer"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-950 text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
