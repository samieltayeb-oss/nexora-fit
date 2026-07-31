import { login, signup } from './actions'
import { Activity } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-teal-500/10 p-4 rounded-full border border-teal-500/20">
            <Activity className="w-10 h-10 text-teal-400" />
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">SAM FIT</h1>
            <p className="text-slate-400 text-sm">Stronger Heart. Better Health. Sustainable Progress.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
                placeholder="sam@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {resolvedSearchParams?.error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg text-center">
                {resolvedSearchParams.error}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                formAction={login}
                className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] active:scale-[0.98]"
              >
                Sign In
              </button>
              <button
                formAction={signup}
                className="w-full bg-transparent border border-slate-700 hover:bg-slate-800 text-white font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
