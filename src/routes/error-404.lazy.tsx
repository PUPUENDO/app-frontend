import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { FileQuestion } from 'lucide-react'

export const Route = createLazyFileRoute('/error-404')({
  component: Error404,
})

function Error404() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <FileQuestion className="mx-auto h-24 w-24 text-gray-400 mb-4" />
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página No Encontrada
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Volver al Dashboard
        </Link>
      </div>
    </div>
  )
}
