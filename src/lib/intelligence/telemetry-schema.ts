import { z } from 'zod'

/**
 * Zod schemas for raw Supabase DB telemetry rows.
 * These provide runtime validation AND compile-time types —
 * eliminating all `any` usage in TelemetryData.
 */

// ----- workout_sessions row -----
export const WorkoutRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime({ offset: true }),
  duration_seconds: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
})
export type WorkoutRow = z.infer<typeof WorkoutRowSchema>

// ----- body_measurements row -----
export const BodyMeasurementRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime({ offset: true }),
  weight_kg: z.number(),
  waist_cm: z.number().nullable().optional(),
})
export type BodyMeasurementRow = z.infer<typeof BodyMeasurementRowSchema>

// ----- health_logs row -----
export const HealthLogRowSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  created_at: z.string().datetime({ offset: true }),
  sleep_hours: z.number().nullable().optional(),
  steps: z.number().nullable().optional(),
})
export type HealthLogRow = z.infer<typeof HealthLogRowSchema>

// ----- Arrays -----
export const WorkoutRowArraySchema = z.array(WorkoutRowSchema)
export const BodyMeasurementRowArraySchema = z.array(BodyMeasurementRowSchema)
export const HealthLogRowArraySchema = z.array(HealthLogRowSchema)

/**
 * Runtime-validates raw DB rows and strips unknown keys.
 * Returns empty array on validation failure to prevent engine crashes.
 */
export function parseWorkouts(raw: unknown): WorkoutRow[] {
  const result = WorkoutRowArraySchema.safeParse(raw)
  return result.success ? result.data : []
}

export function parseBodyMeasurements(raw: unknown): BodyMeasurementRow[] {
  const result = BodyMeasurementRowArraySchema.safeParse(raw)
  return result.success ? result.data : []
}

export function parseHealthLogs(raw: unknown): HealthLogRow[] {
  const result = HealthLogRowArraySchema.safeParse(raw)
  return result.success ? result.data : []
}
