import { createFileRoute } from '@tanstack/react-router'
import SubtopicsPage from '@/features/subtopics/index.tsx'

export const Route = createFileRoute('/dashboard/subtopics')({
  component: () => <SubtopicsPage />,
})
