'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'

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
  baselineWeightKg: 81.60,
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
    weightKg: 81.60,
    bmi: 27.5,
    bodyFatPercent: 23.6,
    subcutaneousFatPercent: 20.5,
    skeletalMusclesPercent: 49.3,
    fatFreeBodyWeightKg: 62.23,
    visceralFat: 10,
    bodyWaterPercent: 55.1,
    muscleMassKg: 59.06,
    boneMassKg: 3.11,
    proteinPercent: 17.2,
    bmrKcal: 1750,
    metabolicAge: 49,
    recordedDate: '2026-08-18',
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

const STORAGE_KEY = 'samfit_user_profile_v3'

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE)
  const [isLoaded, setIsLoaded] = useState(false)
  const supabase = createClient()

  // Load from local storage and Supabase
  useEffect(() => {
    async function loadData() {
      let currentProf = { ...DEFAULT_USER_PROFILE }
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          currentProf = {
            ...currentProf,
            ...parsed,
            scaleComposition: {
              ...currentProf.scaleComposition,
              ...(parsed.scaleComposition || {}),
            },
          }
        }
      } catch (e) {
        console.warn('Failed to load user profile from storage', e)
      }

      // Fetch latest live weight from Supabase body_measurements
      try {
        const { data: latestMeasurement } = await supabase
          .from('body_measurements')
          .select('weight_kg, date, body_fat_percentage, muscle_mass_kg')
          .order('date', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (latestMeasurement && latestMeasurement.weight_kg) {
          const liveWeight = Number(latestMeasurement.weight_kg)
          currentProf.baselineWeightKg = liveWeight
          currentProf.scaleComposition.weightKg = liveWeight
          if (latestMeasurement.body_fat_percentage) {
            currentProf.scaleComposition.bodyFatPercent = Number(latestMeasurement.body_fat_percentage)
          }
          if (latestMeasurement.muscle_mass_kg) {
            currentProf.scaleComposition.muscleMassKg = Number(latestMeasurement.muscle_mass_kg)
          }
          if (latestMeasurement.date) {
            currentProf.scaleComposition.recordedDate = latestMeasurement.date
          }
        }
      } catch (err) {
        console.warn('Could not fetch latest live weight from Supabase', err)
      }

      setProfile(currentProf)
      setIsLoaded(true)
    }

    loadData()
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
      const next = { ...prev, glucoseUnit: nextUnit }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.warn('Failed to persist glucose unit toggle', e)
      }
      return next
    })
  }, [])

  const formatGlucose = useCallback((valInMmol: number): { value: string; unit: string } => {
    if (profile.glucoseUnit === 'mg/dL') {
      return {
        value: (valInMmol * 18.018).toFixed(0),
        unit: 'mg/dL'
      }
    }
    return {
      value: valInMmol.toFixed(1),
      unit: 'mmol/L'
    }
  }, [profile.glucoseUnit])

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateProfile,
        updateWeight,
        toggleGlucoseUnit,
        convertGlucose,
        formatGlucose,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  )
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider')
  }
  return context
}
