import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  SquareTerminal,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react'

export default function AuthPage({ mode = 'signin' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isSignUp = mode === 'signup' || location.pathname === '/signup'

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('journalist@archiveai.org')
  const [password, setPassword] = useState('archive2024')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // Feedback states
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)

  const handleFillDemo = (type = 'journalist') => {
    setErrorMsg('')
    if (type === 'journalist') {
      setEmail('journalist@archiveai.org')
      setPassword('archive2024')
    } else {
      setEmail('researcher@archiveai.org')
      setPassword('researcher2024')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')
    setSuccessMsg('')

    // Basic Validations
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    if (!password || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.')
      return
    }

    if (isSignUp) {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.')
        return
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.')
        return
      }
    }

    setIsLoading(true)

    // Simulate authentication process
    setTimeout(() => {
      setIsLoading(false)
      const userObj = {
        name: isSignUp ? name : (email.includes('journalist') ? 'Alex Morgan' : 'Elena Rostova'),
        email: email,
        role: isSignUp ? 'Research Analyst' : 'Senior Investigative Journalist',
        avatarInitial: isSignUp ? name.charAt(0).toUpperCase() : 'A'
      }
      localStorage.setItem('archiveai_user', JSON.stringify(userObj))
      setSuccessMsg(isSignUp ? 'Account created successfully! Redirecting...' : 'Sign in successful! Redirecting...')

      setTimeout(() => {
        navigate('/')
      }, 700)
    }, 800)
  }

  const handleForgotSubmit = (e) => {
    e.preventDefault()
    if (!forgotEmail || !forgotEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.')
      return
    }
    setForgotSent(true)
    setTimeout(() => {
      setShowForgotModal(false)
      setForgotSent(false)
      setSuccessMsg(`Password reset instructions sent to ${forgotEmail}`)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Left Hero / Brand Showcase (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-r border-slate-800 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25">
            <SquareTerminal size={24} />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">ArchiveAI</span>
            <span className="block text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
              Media Intelligence System
            </span>
          </div>
        </div>

        {/* Center Marketing Copy */}
        <div className="relative z-10 max-w-lg my-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
            <Sparkles size={14} className="text-indigo-400" />
            AI-Powered Research Workspace for Journalists
          </div>
          
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Discover historic truths with verified source attribution.
          </h2>
          
          <p className="text-slate-400 text-base leading-relaxed">
            Search thousands of archived articles, interview transcripts, and footage notes with intelligent natural-language retrieval and instant fact verification.
          </p>

          <div className="pt-4 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <Search className="text-indigo-400 mb-2" size={20} />
              <h3 className="text-sm font-semibold text-white">Semantic Search</h3>
              <p className="text-xs text-slate-400 mt-1">Natural-language archive discovery & deep filtering.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-sm">
              <ShieldCheck className="text-indigo-400 mb-2" size={20} />
              <h3 className="text-sm font-semibold text-white">100% Attribution</h3>
              <p className="text-xs text-slate-400 mt-1">Direct citations to source documents and interview IDs.</p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-6">
          <span>Trusted by investigative newsrooms & research teams</span>
          <span className="font-mono text-slate-400">v1.0.0</span>
        </div>
      </div>

      {/* Right Auth Form Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-slate-900 overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8">
          
          {/* Mobile Logo Header */}
          <div className="lg:hidden flex flex-col items-center text-center mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/25 mb-4">
              <SquareTerminal size={26} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">ArchiveAI</h1>
            <p className="text-xs text-slate-400 mt-1">AI-Powered Media Archive Search System</p>
          </div>

          {/* Form Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-6 sm:p-8">
            
            {/* Header / Tabs */}
            <div className="flex flex-col mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isSignUp ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isSignUp 
                  ? 'Join ArchiveAI to access archived transcripts and articles.' 
                  : 'Enter your credentials to access your research workspace.'}
              </p>
            </div>

            {/* Switch Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('')
                  navigate('/signin')
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  !isSignUp
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrorMsg('')
                  navigate('/signup')
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  isSignUp
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Demo Quick Fill Helper (for evaluation & fast testing) */}
            {!isSignUp && (
              <div className="mb-6 p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-indigo-300 font-medium">Quick Demo Access:</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleFillDemo('journalist')}
                      className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-[11px] font-medium transition"
                    >
                      Journalist
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFillDemo('researcher')}
                      className="px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-[11px] font-medium transition"
                    >
                      Researcher
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error & Success Feedback Alerts */}
            {errorMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-950/50 border border-red-500/30 text-red-300 text-xs animate-fadeIn">
                <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 text-slate-500" size={16} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      required={isSignUp}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email Address <span className="text-indigo-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-slate-500" size={16} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@newsroom.org"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Password <span className="text-indigo-400">*</span>
                  </label>
                  {!isSignUp && (
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-[11px] font-medium text-indigo-400 hover:text-indigo-300 transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-500" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={isSignUp ? 'Create a secure password (min 6 chars)' : 'Enter your password'}
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Confirm Password <span className="text-indigo-400">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 text-slate-500" size={16} />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      required={isSignUp}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2.5 pl-10 pr-10 text-sm text-slate-100 placeholder-slate-500 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 text-slate-500 hover:text-slate-300 focus:outline-none"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              )}

              {!isSignUp && (
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    Keep me signed in for 30 days
                  </label>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 active:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </div>
                ) : isSignUp ? (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight size={16} />
                  </>
                ) : (
                  <>
                    <span>Sign In to ArchiveAI</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg('')
                    navigate(isSignUp ? '/signin' : '/signup')
                  }}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 transition"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up for Access'}
                </button>
              </p>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-500">
            Secure Newsroom Authentication &bull; AES-256 Encrypted Sessions
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-indigo-400">
              <div className="p-2 rounded-lg bg-indigo-950 border border-indigo-800">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-bold text-white">Reset Password</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your registered newsroom email address and we'll send you instructions to reset your archive access password.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@archiveai.org"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50"
                >
                  {forgotSent ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
