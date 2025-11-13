import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { authService } from '@/features/auth/AuthService'
import api from '@/lib/api'
import { useEffect } from 'react'
import Sidebar from '@/components/layout/Sidebar'

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    // Verificar que el usuario esté autenticado
    const isAuthenticated = await authService.checkAuthStatus()

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
      })
    }

    // Verificar con el backend que el usuario tenga rol de admin
    try {
      const response = await api.get('/auth/validate-admin')

      if (!response.data.success || !response.data.data.hasAccess) {
        console.warn('⛔ Acceso denegado por el backend:', response.data.data.message)
        throw redirect({
          to: '/error-403',
        })
      }
    } catch (error: any) {
      console.error('❌ Error validando acceso administrativo:', error)
      // Si hay error en la validación, denegar acceso por seguridad
      throw redirect({
        to: '/error-403',
      })
    }
  },
  component: DashboardLayout,
})

function DashboardLayout() {
  useEffect(() => {
    // Verificación periódica de autenticación
    const interval = setInterval(async () => {
      const isAuth = await authService.isAuthenticated()
      if (!isAuth) {
        authService.logout()
        window.location.href = '/login'
      }
    }, 5 * 60 * 1000) // cada 5 minutos

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
