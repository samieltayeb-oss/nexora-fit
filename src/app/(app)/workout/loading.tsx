import { Skeleton } from "@/design/components/skeleton"

export default function WorkoutHubLoading() {
  return (
    <div className="min-h-screen bg-[var(--background)] pb-32 animate-in fade-in duration-500">
      {/* Header */}
      <div className="px-5 pt-10 pb-6">
        <Skeleton className="h-3 w-20 mb-1" />
        <Skeleton className="h-10 w-48 mb-1" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      {/* Program Cards */}
      <div className="px-5 space-y-4">
        {/* Gym Machine Workout Skeleton */}
        <div className="relative rounded-3xl overflow-hidden glass-card p-6" style={{ minHeight: 200 }}>
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-64 mb-1" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-3 w-3/4 mb-4" />
          
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Skeleton className="h-1.5 flex-1 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-1">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Calisthenics Workout Skeleton */}
        <div className="relative rounded-3xl overflow-hidden glass-card p-6" style={{ minHeight: 200 }}>
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-64 mb-1" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-3 w-3/4 mb-4" />
          
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Skeleton className="h-1.5 flex-1 rounded-full" />
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-1">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>

        {/* Exercise Library Link Skeleton */}
        <Skeleton className="h-16 w-full rounded-2xl mt-4" />
      </div>
    </div>
  )
}
