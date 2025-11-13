import { createFileRoute } from '@tanstack/react-router'
import ExercisePage from '@/features/exercises/index.tsx'

export const Route = createFileRoute('/dashboard/lesson/$lessonId/exercise')({
  component: ExercisePage,
})
