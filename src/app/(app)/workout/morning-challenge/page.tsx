import { Suspense } from 'react'
import MorningChallengeContent from './morning-challenge-content'

export default function MorningChallengePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <MorningChallengeContent />
    </Suspense>
  )
}
