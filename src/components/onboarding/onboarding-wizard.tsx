'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, CheckCircle, Activity, ChevronRight } from 'lucide-react'
import { completeOnboarding } from '@/app/onboarding/actions'

export default function OnboardingWizard() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // State
  const [medicalCleared, setMedicalCleared] = useState(false)
  const [name, setName] = useState('Sam')
  const [dob, setDob] = useState('1980-05-02')
  const [height, setHeight] = useState('172')
  const [weight, setWeight] = useState('81.05')
  const [goalWeight, setGoalWeight] = useState('75')

  const handleNext = () => setStep(s => s + 1)
  const handlePrev = () => setStep(s => s - 1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await completeOnboarding({
        name,
        dob,
        height: parseFloat(height),
        weight: parseFloat(weight),
        goalWeight: parseFloat(goalWeight),
        medicalCleared
      })
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      console.error(err)
      setError('Failed to update profile. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-background border border-border rounded-3xl p-6 md:p-10 shadow-2xl">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-500/10 rounded-full mb-6">
              <AlertTriangle className="text-amber-500 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Medical Safety</h2>
            <p className="text-foreground/70 leading-relaxed">
              Before we begin, your safety is our top priority. Please read and confirm the following statement carefully.
            </p>
            
            <div className="bg-background p-5 rounded-2xl border border-border space-y-4">
              <p className="text-foreground/90 text-sm leading-relaxed italic">
                &quot;I understand that this application provides general fitness planning and does not replace my physician, cardiologist, diabetes team or pharmacist. Because of my cardiovascular and diabetes history, I will confirm that my clinician has cleared me to begin or progress resistance and cardiovascular training.&quot;
              </p>
            </div>

            <label className="flex items-start gap-4 p-4 border border-border rounded-xl cursor-pointer hover:bg-surface/50 transition-colors">
              <input 
                type="checkbox" 
                checked={medicalCleared}
                onChange={(e) => setMedicalCleared(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-border-subtle bg-background text-primary focus:ring-teal-500/50 focus:ring-offset-slate-900" 
              />
              <span className="text-sm text-foreground/90">I have read, understood, and agree to the medical safety statement above.</span>
            </label>

            <button
              onClick={handleNext}
              disabled={!medicalCleared}
              className="w-full mt-6 bg-primary hover:bg-primary disabled:opacity-50 disabled:hover:bg-primary text-slate-950 font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-6">
              <Activity className="text-primary w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Your Profile</h2>
            <p className="text-foreground/70">Let&apos;s set up your starting metrics for NEXORA FIT.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/70 mb-2">Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Date of Birth</label>
                  <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Height (cm)</label>
                  <input required type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Current Weight (kg)</label>
                  <input required type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground/70 mb-2">Goal Weight (kg)</label>
                  <input required type="number" step="0.1" value={goalWeight} onChange={e => setGoalWeight(e.target.value)} className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-4 rounded-xl border border-border-subtle text-foreground/90 hover:bg-surface transition-colors">
                Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary text-slate-950 font-semibold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] flex items-center justify-center gap-2">
                {loading ? 'Saving...' : 'Complete Setup'} <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
