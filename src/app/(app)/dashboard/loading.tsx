import { Skeleton } from "@/design/components/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      
      {/* ── TOP HEADER ────────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        
        <Skeleton className="w-12 h-12 rounded-full" />
      </header>

      {/* ── FLAGSHIP HERO: GOAL PROGRESS & READINESS ───────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Goal Card */}
        <div className="lg:col-span-2 glass-panel rounded-3xl p-6 md:p-8 min-h-[280px] flex flex-col md:flex-row justify-between gap-8">
          <div className="flex flex-col justify-between h-full w-full">
            <div>
              <Skeleton className="h-6 w-32 rounded-full mb-4" />
              <Skeleton className="h-16 w-48" />
              <Skeleton className="h-5 w-36 mt-2" />
            </div>

            <div className="mt-8 pt-4 w-full">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          </div>

          <div className="flex items-center justify-center relative w-40 h-40 self-center shrink-0">
            <Skeleton className="w-full h-full rounded-full" />
          </div>
        </div>

        {/* Readiness/Recovery Card */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <Skeleton className="h-6 w-28 rounded-full mb-4" />
            <Skeleton className="h-10 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5 mt-2" />
          </div>

          <div className="mt-6 flex gap-2">
            <Skeleton className="h-1.5 flex-1 rounded-full" />
            <Skeleton className="h-1.5 flex-1 rounded-full" />
            <Skeleton className="h-1.5 flex-1 rounded-full" />
          </div>
        </div>
      </section>

      {/* ── TODAY'S WORKOUT FEATURE ───────────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>
        
        <Skeleton className="h-[320px] w-full rounded-3xl" />
      </section>

      {/* ── TODAY'S SIGNALS (Health Sync) ────────────────────────────────────── */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-28 w-full rounded-2xl" />
          <Skeleton className="h-28 w-full rounded-2xl" />
        </div>
      </section>
      
    </div>
  )
}
