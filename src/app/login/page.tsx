import { login, signup } from './actions'
import { Activity } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const resolvedSearchParams = await searchParams
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
            <Activity className="w-10 h-10 text-primary" />
          </div>
        </div>
        
        <div className="bg-background border border-border rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2 tracking-tight">NEXORA FIT</h1>
            <p className="text-foreground/70 text-sm">Stronger Heart. Better Health. Sustainable Progress.</p>
          </div>

          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="sam@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/90 mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                placeholder="••••••••"
              />
            </div>

            {resolvedSearchParams?.error && (
              <div className="bg-error/10 border border-error/20 text-error text-sm p-3 rounded-lg text-center">
                {resolvedSearchParams.error}
              </div>
            )}

            <div className="flex flex-col gap-3 pt-2">
              <button
                formAction={login}
                className="w-full bg-primary hover:bg-primary-hover text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_var(--color-primary)] hover:shadow-[0_0_30px_var(--color-primary)] active:scale-[0.98]"
              >
                Sign In
              </button>
              <button
                formAction={signup}
                className="w-full bg-transparent border border-border-subtle hover:bg-surface text-foreground font-medium py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
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
