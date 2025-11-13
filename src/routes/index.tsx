import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { isAuthenticated } = useAuthStore()

  // Si está autenticado, redirigir al dashboard administrativo
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" />
  }

  // Si no está autenticado, ir al login
  return <Navigate to="/login" />
}
