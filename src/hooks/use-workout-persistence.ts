'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'

export interface WorkoutSetState {
  reps: number
  load: number
  rpe?: number
}

export interface WorkoutPersistenceSchema {
  schema_version: number
  user_id: string
  session_id: string
  workout_version: string
  current_exercise_index: number
  completed_sets: WorkoutSetState[]
  start_timestamp: number
  last_updated_timestamp: number
  pause_state: {
    is_paused: boolean
    accumulated_pause_ms: number
    last_pause_timestamp: number | null
  }
  rest_timer: {
    is_resting: boolean
    rest_start_timestamp: number | null
    rest_duration_seconds: number
  }
}

const STORAGE_KEY = 'nexora_active_workout_state'
const SCHEMA_VERSION = 1

export function useWorkoutPersistence(sessionId: string, workoutVersion: string) {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  // Fetch user ID once
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id)
    })
  }, [supabase])

  // Core save function
  const saveState = useCallback((state: Omit<WorkoutPersistenceSchema, 'schema_version' | 'user_id' | 'session_id' | 'workout_version'>) => {
    if (!userId) return

    const fullState: WorkoutPersistenceSchema = {
      ...state,
      schema_version: SCHEMA_VERSION,
      user_id: userId,
      session_id: sessionId,
      workout_version: workoutVersion
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fullState))
    } catch (e) {
      console.error('Failed to persist workout state:', e)
    }
  }, [userId, sessionId, workoutVersion])

  // Load function
  const loadState = useCallback((): WorkoutPersistenceSchema | null => {
    if (!userId) return null
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      
      const parsed = JSON.parse(raw) as WorkoutPersistenceSchema
      
      // Validation
      if (parsed.schema_version !== SCHEMA_VERSION) return null
      if (parsed.user_id !== userId) return null // Prevent cross-user restore
      if (parsed.session_id !== sessionId) return null
      
      // Expiration check (e.g., discard if older than 12 hours)
      const twelveHoursMs = 12 * 60 * 60 * 1000
      if (Date.now() - parsed.last_updated_timestamp > twelveHoursMs) {
        localStorage.removeItem(STORAGE_KEY)
        return null
      }

      return parsed
    } catch {
      return null
    }
  }, [userId, sessionId])

  const clearState = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    saveState,
    loadState,
    clearState,
    isReady: !!userId
  }
}
