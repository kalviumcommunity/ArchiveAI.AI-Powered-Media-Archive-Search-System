import { useNavigate } from 'react-router-dom'
import { SquareTerminal, User, Mail, Lock, Eye, ArrowRight } from 'lucide-react'

export default function AuthPage({ mode = 'signin' }) {
  const isSignUp = mode === 'signup'
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans text-slate-900">
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#3b2ceb] text-[#3b2ceb] mb-6">
          <SquareTerminal size={24} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Welcome to ArchiveAI</h1>
        <p className="mt-2 text-sm text-slate-500">Sign in to access the media archive</p>
      </div>

      <div className="w-full max-w-[440px] rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex w-full border-b border-slate-100">
          <button
            onClick={() => navigate('/signin')}
            className={`flex-1 py-4 text-sm font-semibold transition ${!isSignUp ? 'text-[#3b2ceb] border-b-2 border-[#3b2ceb]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/signup')}
            className={`flex-1 py-4 text-sm font-semibold transition ${isSignUp ? 'text-[#3b2ceb] border-b-2 border-[#3b2ceb]' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Sign Up
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Full Name</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 text-slate-400" size={16} />
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3b2ceb] focus:ring-1 focus:ring-[#3b2ceb]"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 text-slate-400" size={16} />
                <input
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#3b2ceb] focus:ring-1 focus:ring-[#3b2ceb]"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Password</label>
                {!isSignUp && (
                  <a href="#" className="text-xs font-semibold text-[#3b2ceb] hover:underline">Forgot password?</a>
                )}
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-slate-400" size={16} />
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#3b2ceb] focus:ring-1 focus:ring-[#3b2ceb]"
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                />
                <Eye className="absolute right-3 text-slate-400 cursor-pointer hover:text-slate-600" size={16} />
              </div>
            </div>

            {isSignUp && (
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700">Confirm Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 text-slate-400" size={16} />
                  <input
                    type="password"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-[#3b2ceb] focus:ring-1 focus:ring-[#3b2ceb]"
                    placeholder="Confirm your password"
                  />
                  <Eye className="absolute right-3 text-slate-400 cursor-pointer hover:text-slate-600" size={16} />
                </div>
              </div>
            )}

            <button 
              onClick={() => navigate('/')}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#3b2ceb] py-3 text-sm font-semibold text-white transition hover:bg-[#3224c2]"
            >
              {isSignUp ? 'Create Account' : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            {isSignUp ? 'Create an account to access ArchiveAI.' : 'Access your archived media workspace.'}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center text-xs font-medium text-slate-400">
        ArchiveAI v1.0 | AI-Powered Media Archive Search System
      </div>
    </div>
  )
}
