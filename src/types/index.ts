export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  notes?: string
}

export interface WorkoutSet {
  id: string
  weight: number
  reps: number
  done: boolean
}

export interface WorkoutExercise {
  exerciseId: string
  sets: WorkoutSet[]
}

export interface WorkoutTemplate {
  id: string
  name: string
  exercises: {
    exerciseId: string
    defaultSets: number
    defaultReps: number
    defaultWeight: number
  }[]
}

export interface WorkoutSession {
  id: string
  templateId: string
  templateName: string
  userId: string
  date: string
  exercises: WorkoutExercise[]
  durationMinutes?: number
  notes?: string
}

export interface User {
  id: string
  name: string
  color: string
}

export interface AppState {
  users: User[]
  currentUserId: string | null
  exercises: Exercise[]
  templates: WorkoutTemplate[]
  sessions: WorkoutSession[]
  activeSession: WorkoutSession | null

  setCurrentUser: (userId: string) => void
  addUser: (name: string, color: string) => void

  addExercise: (exercise: Omit<Exercise, 'id'>) => void
  updateExercise: (id: string, data: Partial<Exercise>) => void
  deleteExercise: (id: string) => void

  addTemplate: (template: Omit<WorkoutTemplate, 'id'>) => void
  updateTemplate: (id: string, data: Partial<WorkoutTemplate>) => void
  deleteTemplate: (id: string) => void

  startSession: (templateId: string) => void
  updateActiveSession: (session: WorkoutSession) => void
  finishSession: (durationMinutes: number, notes?: string) => void
  cancelSession: () => void

  deleteSession: (id: string) => void
}
