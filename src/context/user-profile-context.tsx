'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type GlucoseUnit = 'mmol/L' | 'mg/dL'

export interface UserProfile {
  name: string
  email: string
  avatarUrl: string
  medicalCondition: string
  baselineWeightKg: number
  targetWeightKg: number
  glucoseUnit: GlucoseUnit
  targetGlucoseRange: {
    min: number
    max: number
  }
  targetBPRange: {
    systolic: number
    diastolic: number
  }
  scaleComposition: {
    weightKg: number
    bmi: number
    bodyFatPercent: number
    subcutaneousFatPercent: number
    skeletalMusclesPercent: number
    fatFreeBodyWeightKg: number
    visceralFat: number
    bodyWaterPercent: number
    muscleMassKg: number
    boneMassKg: number
    proteinPercent: number
    bmrKcal: number
    metabolicAge: number
    recordedDate: string
  }
}

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Sami Suliman',
  email: 'sami.suliman@gmail.com',
  avatarUrl: '/brand/owner.png',
  medicalCondition: 'Diabetic Type 2 Protocol',
  baselineWeightKg: 82.70,
  targetWeightKg: 75.00,
  glucoseUnit: 'mmol/L',
  targetGlucoseRange: {
    min: 4.4,
    max: 7.2,
  },
  targetBPRange: {
    systolic: 120,
    diastolic: 80,
  },
  scaleComposition: {
    weightKg: 82.70,
    bmi: 28.0,
    bodyFatPercent: 24.3,
    subcutaneousFatPercent: 21.2,
    skeletalMusclesPercent: 48.8,
    fatFreeBodyWeightKg: 62.55,
    visceralFat: 10,
    bodyWaterPercent: 54.5,
    muscleMassKg: 59.37,
    boneMassKg: 3.12,
    proteinPercent: 17.2,
    bmrKcal: 1750,
    metabolicAge: 50,
    recordedDate: '2026-08-17',
  },
}

interface UserProfileContextType {
  profile: UserProfile
  updateProfile: (updates: Partial<UserProfile>) => void
  updateWeight: (weightKg: number) => void
  toggleGlucoseUnit: () => void
  convertGlucose: (val: number, fromUnit: GlucoseUnit, toUnit: GlucoseUnit) => number
  formatGlucose: (valInMmol: number) => { value: string; unit: string }
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

const STORAGE_KEY = 'samfit_user_profile_v2'

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setProfile(prev => ({
          ...prev,
          ...parsed,
          scaleComposition: {
            ...prev.scaleComposition,
            ...(parsed.scaleComposition || {}),
          },
        }))
      }
    } catch (e) {
      console.warn('Failed to load user profile from storage', e)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Save to local storage
  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.warn('Failed to persist user profile', e)
      }
      return next
    })
  }, [])

  const updateWeight = useCallback((weightKg: number) => {
    setProfile(prev => {
      const next = {
        ...prev,
        baselineWeightKg: weightKg,
        scaleComposition: {
          ...prev.scaleComposition,
          weightKg,
        }
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.warn('Failed to persist weight update', e)
      }
      return next
    })
  }, [])

  // 1 mmol/L = 18.018 mg/dL
  const convertGlucose = useCallback((val: number, fromUnit: GlucoseUnit, toUnit: GlucoseUnit): number => {
    if (fromUnit === toUnit) return val
    if (fromUnit === 'mmol/L' && toUnit === 'mg/dL') {
      return Number((val * 18.018).toFixed(0))
    }
    if (fromUnit === 'mg/dL' && toUnit === 'mmol/L') {
      return Number((val / 18.018).toFixed(1))
    }
    return val
  }, [])

  const toggleGlucoseUnit = useCallback(() => {
    setProfile(prev => {
      const nextUnit: GlucoseUnit = prev.glucoseUnit === 'mmol/L' ? 'mg/dL' : 'mmol/L'
      const nextTargetMin = convertGlucose(prev.targetGlucoseRange.min, prev.glucoseUnit, nextUnit)
      const nextTargetMax = convertGlucose(prev.targetGlucoseRange.max, prev.glucoseUnit, nextUnit)
      const updated: UserProfile = {
        ...prev,
        glucoseUnit: nextUnit,
        targetGlucoseRange: {
          min: nextTargetMin,
          max: nextTargetMax,
        },
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save glucose unit', e)
      }
      return updated
    })
  }, [convertGlucose])

  const formatGlucose = useCallback((valInMmol: number) => {
    if (profile.glucoseUnit === 'mmol/L') {
      return { value: valInMmol.toFixed(1), unit: 'mmol/L' }
    }
    return { value: (valInMmol * 18.018).toFixed(0), unit: 'mg/dL' }
  }, [profile.glucoseUnit])

  return (
    <UserProfileContext.Provider value={{ profile, updateProfile, updateWeight, toggleGlucoseUnit, convertGlucose, formatGlucose }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (!context) {
    // Fallback if rendered outside provider
    return {
      profile: DEFAULT_USER_PROFILE,
      updateProfile: () => {},
      updateWeight: () => {},
      toggleGlucoseUnit: () => {},
      convertGlucose: (v: number) => v,
      formatGlucose: (v: number) => ({ value: v.toFixed(1), unit: 'mmol/L' }),
    }
  }
  return context
}

