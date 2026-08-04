'use client'

import { Suspense } from 'react'
import ActiveWorkoutContent from './active-content'

export default function ActiveWorkoutPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-primary font-black text-sm uppercase tracking-widest">Loading Workout...</div>
        </div>
      </div>
    }>
      <ActiveWorkoutContent />
    </Suspense>
  )
}
