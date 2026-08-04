'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Dumbbell, ShieldCheck, ChevronRight, Layers, Heart, Activity } from 'lucide-react'
import { BENCHMARK_EXERCISES, ADDITIONAL_EXERCISES_SUMMARY } from '@/lib/exercise-data'

export default function ExerciseLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'strength' | 'warm_up' | 'cardio' | 'mobility'>('all')

  const filteredExercises = BENCHMARK_EXERCISES.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.primaryMuscles.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || ex.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-4xl mx-auto text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Exercise Library</h1>
          <p className="text-slate-400 text-sm mt-1">Form guides, photorealistic position visuals, and safe alternatives</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search exercises by name or muscle (e.g. Leg Press, Chest, Lats)..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors shadow-lg"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'all', label: 'All Exercises' },
            { id: 'strength', label: 'Strength Machines' },
            { id: 'warm_up', label: 'Warm-Up & Mobility' },
            { id: 'cardio', label: 'Cardio Equipment' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20' 
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Benchmark Exercises Section */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Benchmark Verified Exercises</h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {filteredExercises.map((ex) => (
            <Link key={ex.id} href={`/workout/library/${ex.slug}`}>
              <div className="bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-3xl p-5 shadow-xl transition-all group hover:scale-[1.01]">
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                    {/* eslint-disable-next-next/no-img-element */}
                    <img 
                      src={ex.media[0]?.url} 
                      alt={ex.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-1 right-1 bg-teal-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      4 Views
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-white group-hover:text-teal-400 transition-colors">{ex.name}</h3>
                      <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-teal-400 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{ex.shortDescription}</p>
                    
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">
                        {ex.equipment}
                      </span>
                      <span className="text-teal-400 font-semibold">
                        {ex.primaryMuscles[0]}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Additional Program Coverage Catalog */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Complete Program Catalog</h3>
            <p className="text-xs text-slate-400">All 45+ exercises documented across Full Body A, B, C, warm-ups, and cardio</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 pt-2">
          {ADDITIONAL_EXERCISES_SUMMARY.map((item, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 flex items-center justify-between">
              <span>{item}</span>
              <Activity className="w-3.5 h-3.5 text-teal-500/60" />
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
