import { createFileRoute } from '@tanstack/react-router'
import UsersPage from '@/features/users/index.tsx'

export const Route = createFileRoute('/dashboard/users')({
  component: UsersPage,
})
