'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  CheckCircle2, AlertCircle, Clock, Image as ImageIcon, 
  Edit3, RefreshCw, Eye, Filter, Search, Sparkles, ShieldCheck, ChevronRight
} from 'lucide-react'
import { BENCHMARK_EXERCISES, ExerciseRecord } from '@/lib/exercise-data'

export default function AdminExerciseReviewPage() {
  const [exercises, setExercises] = useState<ExerciseRecord[]>(BENCHMARK_EXERCISES)
  const [filterStatus, setFilterStatus] = useState<'all' | 'needs_review' | 'approved'>('all')
  const [selectedExercise, setSelectedExercise] = useState<ExerciseRecord>(BENCHMARK_EXERCISES[0])

  // Stats calculation
  const totalCount = 45 // 45+ total planned exercises
  const benchmarkCount = exercises.length
  const approvedCount = exercises.filter(e => e.reviewStatus === 'approved').length
  const needsReviewCount = exercises.filter(e => e.reviewStatus === 'needs_review').length

  const handleApproveExercise = (id: string) => {
    setExercises(prev => prev.map(e => e.id === id ? { ...e, reviewStatus: 'approved' } : e))
    if (selectedExercise.id === id) {
      setSelectedExercise(prev => ({ ...prev, reviewStatus: 'approved' }))
    }
  }

  const handleApproveMedia = (mediaId: string) => {
    const updatedMedia = selectedExercise.media.map(m => m.id === mediaId ? { ...m, reviewStatus: 'approved' as const } : m)
    const updatedEx = { ...selectedExercise, media: updatedMedia }
    setSelectedExercise(updatedEx)
    setExercises(prev => prev.map(e => e.id === updatedEx.id ? updatedEx : e))
  }

  return (
    <div className="min-h-screen bg-background text-slate-100 font-sans p-4 md:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-5 max-w-6xl mx-auto">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Admin & Trainer Review
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight mt-1">Exercise Content & Visual Audit</h1>
        </div>
        <Link href="/dashboard" className="px-4 py-2 bg-background border border-border rounded-xl text-xs font-semibold hover:text-foreground text-foreground/90">
          Back to App
        </Link>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Coverage Audit Dashboard Widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-background border border-border rounded-2xl p-4 space-y-1">
            <span className="text-slate-500 text-xs uppercase font-semibold">Total Library</span>
            <div className="text-2xl font-bold text-foreground">{totalCount} <span className="text-xs text-foreground/70 font-normal">Exercises</span></div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-4 space-y-1">
            <span className="text-slate-500 text-xs uppercase font-semibold">Documented Benchmark</span>
            <div className="text-2xl font-bold text-primary">{benchmarkCount} <span className="text-xs text-foreground/70 font-normal">Active</span></div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-4 space-y-1">
            <span className="text-slate-500 text-xs uppercase font-semibold">Media Approved</span>
            <div className="text-2xl font-bold text-emerald-400">{approvedCount} <span className="text-xs text-foreground/70 font-normal">Ready</span></div>
          </div>
          <div className="bg-background border border-border rounded-2xl p-4 space-y-1">
            <span className="text-slate-500 text-xs uppercase font-semibold">Pending Review</span>
            <div className="text-2xl font-bold text-amber-400">{needsReviewCount} <span className="text-xs text-foreground/70 font-normal">Review</span></div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Exercise List Column */}
          <div className="bg-background border border-border rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold text-foreground text-sm">Exercises ({exercises.length})</h3>
              
              <div className="flex gap-1 bg-background p-1 rounded-xl border border-border text-[10px]">
                <button 
                  onClick={() => setFilterStatus('all')}
                  className={`px-2 py-1 rounded-lg font-semibold ${filterStatus === 'all' ? 'bg-surface text-primary' : 'text-slate-500'}`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterStatus('approved')}
                  className={`px-2 py-1 rounded-lg font-semibold ${filterStatus === 'approved' ? 'bg-surface text-primary' : 'text-slate-500'}`}
                >
                  Approved
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setSelectedExercise(ex)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                    selectedExercise.id === ex.id 
                      ? 'bg-surface border-primary/50 shadow-md' 
                      : 'bg-background border-border/80 hover:border-border-subtle'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-foreground text-xs">{ex.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      ex.reviewStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ex.reviewStatus}
                    </span>
                  </div>
                  <span className="text-[11px] text-foreground/70 block mt-1">{ex.equipment}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Review & Image Inspection Detail Column */}
          <div className="md:col-span-2 bg-background border border-border rounded-3xl p-6 space-y-6">
            
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">{selectedExercise.name}</h2>
                <p className="text-xs text-foreground/70 mt-0.5">{selectedExercise.equipment} • {selectedExercise.primaryMuscles.join(', ')}</p>
              </div>

              <div className="flex gap-2">
                {selectedExercise.reviewStatus !== 'approved' && (
                  <button
                    onClick={() => handleApproveExercise(selectedExercise.id)}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Exercise Record
                  </button>
                )}
              </div>
            </div>

            {/* Generated Media Audit Sets */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground/90 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" /> Generated Media Sets ({selectedExercise.media.length} Views)
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                {selectedExercise.media.map((media) => (
                  <div key={media.id} className="bg-background border border-border rounded-2xl overflow-hidden p-3 space-y-2">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-background border border-border relative">
                      {/* eslint-disable-next-next/no-img-element */}
                      <img src={media.url} alt={media.altText} className="w-full h-full object-cover" />
                      
                      <span className="absolute top-2 left-2 bg-background/90 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-border-subtle">
                        {media.viewType.replace('_', ' ')}
                      </span>

                      <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        media.reviewStatus === 'approved' ? 'bg-emerald-500/90 text-slate-950' : 'bg-amber-500/90 text-slate-950'
                      }`}>
                        {media.reviewStatus}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-foreground">{media.caption}</p>
                      {media.prompt && (
                        <p className="text-[10px] font-mono text-slate-500 truncate" title={media.prompt}>
                          Prompt: {media.prompt}
                        </p>
                      )}
                    </div>

                    {media.reviewStatus !== 'approved' && (
                      <button
                        onClick={() => handleApproveMedia(media.id)}
                        className="w-full py-1.5 bg-surface hover:bg-slate-750 text-primary text-xs font-bold rounded-lg transition-colors border border-border-subtle"
                      >
                        Approve Image
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Structured Content Inspection */}
            <div className="space-y-4 border-t border-border pt-4 text-xs">
              <h3 className="font-bold text-foreground/90 uppercase tracking-wider">Instructional Quality Audit</h3>
              
              <div className="space-y-2 bg-background p-4 rounded-2xl border border-border">
                <span className="font-bold text-primary block">Breathing Cue</span>
                <p className="text-foreground/90">{selectedExercise.breathingInstructions}</p>
              </div>

              <div className="space-y-2 bg-background p-4 rounded-2xl border border-border">
                <span className="font-bold text-amber-400 block">Safety Notes</span>
                <ul className="list-disc list-inside text-foreground/90 space-y-1">
                  {selectedExercise.safetyNotes.map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}
