import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { user, isAuthenticated } = useAuthStore()

  // Si está autenticado, redirigir según el rol
  if (isAuthenticated()) {
    if (user?.role === 'admin') {
      return <Navigate to="/dashboard/courses" />
    }
    return <Navigate to="/dashboard/learn" />
  }

  // Si no está autenticado, ir al login
  return <Navigate to="/login" />
}
