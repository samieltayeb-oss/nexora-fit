'use client'

import { Suspense } from 'react'
import WorkoutProgramContent from './program-content'

export default function WorkoutProgramPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"><div className="text-primary font-black">Loading...</div></div>}>
      <WorkoutProgramContent />
    </Suspense>
  )
}
