import { createFileRoute } from '@tanstack/react-router'
import LearnPage from '@/features/learn/index.tsx'

export const Route = createFileRoute('/dashboard/learn')({
  component: LearnPage,
})
