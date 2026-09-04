'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ArrowLeft, ChevronDown, Layers, ExternalLink, Globe, Dumbbell, Compass, Warehouse, Sparkles } from 'lucide-react'

const PRODUCTS = [
  {
    name: 'NEXORA Flagship',
    tagline: 'Home & Ecosystem',
    url: 'https://nexorayyc.io/',
    icon: Globe,
    current: false,
  },
  {
    name: 'NEXORA FIT',
    tagline: 'Executive Health & Conditioning',
    url: '/dashboard',
    icon: Dumbbell,
    current: true,
  },
  {
    name: 'Move To Canada',
    tagline: 'Immigration & Relocation Hub',
    url: 'https://nexorayyc.io/move-to-canada/',
    icon: Compass,
    current: false,
  },
  {
    name: 'NEXORA WMS',
    tagline: 'Enterprise Warehouse Management',
    url: 'https://nexorayyc.io/nexora-wms/',
    icon: Warehouse,
    current: false,
  },
  {
    name: 'NexoraGo AI',
    tagline: 'Banff National Park AI Concierge',
    url: 'https://nexorayyc.io/nexorago-ai/',
    icon: Sparkles,
    current: false,
  },
]

export function NexoraGlobalBar() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-xl border-b border-white/10 text-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 flex items-center justify-between gap-2">
        {/* Left: Return to NEXORA Flagship */}
        <a
          href="https://nexorayyc.io/"
          className="group flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors duration-200 py-1.5 px-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
          title="Return to NEXORA Flagship (nexorayyc.io)"
        >
          <ArrowLeft className="w-4 h-4 text-amber-400 group-hover:-translate-x-0.5 transition-transform duration-200" />
          <span className="hidden sm:inline text-slate-400">Return to</span>
          <span className="font-semibold text-amber-300">NEXORA Flagship</span>
          <span className="hidden md:inline text-slate-500 font-mono text-[11px]">(nexorayyc.io)</span>
        </a>

        {/* Right: Product Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm font-medium transition-all duration-200"
            aria-expanded={isOpen}
          >
            <Layers className="w-3.5 h-3.5 text-teal-400" />
            <span className="text-white font-semibold">NEXORA FIT</span>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono border border-teal-500/30">Active</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-white/15 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-[11px] font-mono uppercase tracking-widest text-slate-400">NEXORA Ecosystem</p>
                <p className="text-xs text-slate-300">Directly switch between connected products</p>
              </div>

              <div className="space-y-1">
                {PRODUCTS.map((product) => {
                  const Icon = product.icon
                  return (
                    <a
                      key={product.name}
                      href={product.url}
                      className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                        product.current
                          ? 'bg-teal-500/15 border border-teal-500/30 text-white'
                          : 'hover:bg-white/5 text-slate-300 hover:text-white'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            product.current
                              ? 'bg-teal-500/20 text-teal-300'
                              : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold flex items-center gap-1.5">
                            {product.name}
                            {product.current && (
                              <span className="text-[9px] font-mono px-1 rounded bg-teal-500/30 text-teal-200">ACTIVE</span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{product.tagline}</div>
                        </div>
                      </div>
                      {!product.current && (
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
