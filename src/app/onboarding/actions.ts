'use server'

import { createClient } from '@/utils/supabase/server'

interface OnboardingData {
  name: string
  dob: string
  height: number
  weight: number
  goalWeight: number
  medicalCleared: boolean
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Insert Profile
  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    name: data.name,
    updated_at: new Date().toISOString(),
  })

  if (profileError) return { error: 'Failed to update profile' }

  // Insert Health Profile
  const { error: healthError } = await supabase.from('health_profiles').upsert({
    id: user.id,
    date_of_birth: data.dob,
    height_cm: data.height,
    starting_weight_kg: data.weight,
    goal_weight_kg: data.goalWeight,
    medical_clearance_status: data.medicalCleared ? 'User confirmed' : 'Not confirmed',
    medical_clearance_date: data.medicalCleared ? new Date().toISOString() : null,
    updated_at: new Date().toISOString(),
  })

  if (healthError) return { error: 'Failed to update health profile' }

  // Insert Baseline Body Measurement
  const { error: measurementError } = await supabase.from('body_measurements').insert({
    user_id: user.id,
    weight_kg: data.weight,
    notes: 'Starting weight from onboarding',
  })

  if (measurementError) return { error: 'Failed to record initial weight' }

  return { success: true }
}
