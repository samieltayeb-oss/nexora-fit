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
    } catch (err) {
      setError('An unexpected error occurred.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center p-4">
      <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
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
            <h2 className="text-2xl font-bold text-white tracking-tight">Medical Safety</h2>
            <p className="text-slate-400 leading-relaxed">
              Before we begin, your safety is our top priority. Please read and confirm the following statement carefully.
            </p>
            
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
              <p className="text-slate-300 text-sm leading-relaxed italic">
                "I understand that this application provides general fitness planning and does not replace my physician, cardiologist, diabetes team or pharmacist. Because of my cardiovascular and diabetes history, I will confirm that my clinician has cleared me to begin or progress resistance and cardiovascular training."
              </p>
            </div>

            <label className="flex items-start gap-4 p-4 border border-slate-800 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
              <input 
                type="checkbox" 
                checked={medicalCleared}
                onChange={(e) => setMedicalCleared(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-slate-700 bg-slate-900 text-teal-500 focus:ring-teal-500/50 focus:ring-offset-slate-900" 
              />
              <span className="text-sm text-slate-300">I have read, understood, and agree to the medical safety statement above.</span>
            </label>

            <button
              onClick={handleNext}
              disabled={!medicalCleared}
              className="w-full mt-6 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 disabled:hover:bg-teal-500 text-slate-950 font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              Continue <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex items-center justify-center w-12 h-12 bg-teal-500/10 rounded-full mb-6">
              <Activity className="text-teal-400 w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Profile</h2>
            <p className="text-slate-400">Let's set up your starting metrics for SAM FIT.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500/50 outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Date of Birth</label>
                  <input required type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Height (cm)</label>
                  <input required type="number" step="0.1" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Current Weight (kg)</label>
                  <input required type="number" step="0.01" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Goal Weight (kg)</label>
                  <input required type="number" step="0.1" value={goalWeight} onChange={e => setGoalWeight(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-teal-500/50 outline-none" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handlePrev} className="px-6 py-4 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                Back
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)] hover:shadow-[0_0_30px_rgba(20,184,166,0.4)] flex items-center justify-center gap-2">
                {loading ? 'Saving...' : 'Complete Setup'} <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
