import { createFileRoute } from '@tanstack/react-router'
import CoursesPage from '@/features/courses/index.tsx'

export const Route = createFileRoute('/dashboard/courses')({
  component: CoursesPage,
})
