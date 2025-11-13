import { createFileRoute } from '@tanstack/react-router'
import LessonsPage from '@/features/lessons/index.tsx'

export const Route = createFileRoute('/dashboard/lessons')({
  component: () => <LessonsPage />,
})
