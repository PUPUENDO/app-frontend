import { createFileRoute } from '@tanstack/react-router'
import TopicsPage from '@/features/topics/index.tsx'

export const Route = createFileRoute('/dashboard/topics/$courseId')({
  component: () => {
    const { courseId } = Route.useParams()
    return <TopicsPage courseId={courseId} />
  },
})
