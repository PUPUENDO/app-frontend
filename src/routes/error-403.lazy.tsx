import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { ShieldX } from 'lucide-react'

export const Route = createLazyFileRoute('/error-403')({
  component: Error403,
})

function Error403() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <ShieldX className="mx-auto h-24 w-24 text-red-500 mb-4" />
        <h1 className="text-6xl font-bold text-gray-900 mb-2">403</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Acceso Prohibido
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          No tienes los permisos necesarios para acceder a esta página.
        </p>
        <Link
          to="/login"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Login
        </Link>
      </div>
    </div>
  )
}
