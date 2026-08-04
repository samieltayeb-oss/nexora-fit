export interface ExercisePromptConfig {
  exerciseName: string
  position: 'START' | 'FINISH' | 'FORM_VIEW' | 'MISTAKE'
  cameraAngle: string
  bodyPositionDetails: string
  handPosition: string
  footPosition: string
  spinePosition: string
  equipmentDescription: string
  mistakeDescription?: string
}

export function buildExercisePrompt(config: ExercisePromptConfig): string {
  const baseModel = 'an adult male beginner (30s, healthy, approachable, athletic build without exaggerated bodybuilding muscles) wearing a plain dark athletic fitted shirt, dark training pants, and clean gym shoes'
  const gymEnvironment = 'a modern, clean commercial gym with neutral black and stainless steel equipment, soft studio lighting, and no background distractions or people'

  if (config.position === 'MISTAKE') {
    return `Photorealistic fitness instructional photo illustrating a COMMON FORM MISTAKE during ${config.exerciseName}. Model is ${baseModel} in ${gymEnvironment}. Camera angle: ${config.cameraAngle}. Demonstration shows ${config.mistakeDescription || 'incorrect body positioning'}. Clean visual framing, no embedded text, no watermarks, no distorted limbs.`
  }

  return `Photorealistic fitness instructional photograph showing ${config.exerciseName} in the ${config.position} position. Model is ${baseModel} inside ${gymEnvironment}. Camera angle: ${config.cameraAngle}. Body details: ${config.bodyPositionDetails}. Hands: ${config.handPosition}. Feet: ${config.footPosition}. Spine: ${config.spinePosition}. Equipment: ${config.equipmentDescription}. Safe, controlled form suitable for a beginner fitness app. No brand logos, no text embedded, no watermarks, realistic anatomy.`
}
