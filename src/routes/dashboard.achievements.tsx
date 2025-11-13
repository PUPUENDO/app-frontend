import { createFileRoute } from '@tanstack/react-router'
import AchievementsPage from '@/features/achievements/index.tsx'

export const Route = createFileRoute('/dashboard/achievements')({
  component: AchievementsPage,
})
