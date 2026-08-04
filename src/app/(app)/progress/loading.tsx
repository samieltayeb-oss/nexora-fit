import { Skeleton } from "@/design/components/skeleton"

export default function ProgressLoading() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* ── TOP HEADER ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-24 rounded-full mb-3" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-28 rounded-2xl" />
      </header>

      {/* ── HERO: WEIGHT JOURNEY ─────────────────────────────────────────────── */}
      <section className="glass-panel rounded-3xl p-6 md:p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Skeleton className="h-4 w-32 mb-2" />
            <div className="flex items-baseline gap-2">
              <Skeleton className="h-16 w-40" />
            </div>
          </div>
          <Skeleton className="h-8 w-36 rounded-2xl" />
        </div>
        
        {/* Chart Skeleton */}
        <div className="w-full h-64 mt-8 flex items-end gap-2 px-4 pb-4">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="flex-1 rounded-t-sm" style={{ height: `${30 + Math.random() * 60}%` }} />
          ))}
        </div>
      </section>

      {/* ── THE METRICS STORY ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Health Indicators */}
        <section className="glass-panel rounded-3xl p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Composition Breakdown */}
        <section className="glass-panel rounded-3xl p-6">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
