import { createFileRoute } from '@tanstack/react-router'
import DashboardOverview from '@/features/dashboard'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverviewPage,
})

function DashboardOverviewPage() {
  return <DashboardOverview />
}
