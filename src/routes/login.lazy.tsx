import { createLazyFileRoute } from '@tanstack/react-router'
import LoginForm from '@/features/auth/login/LoginForm'

export const Route = createLazyFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🎓 LearnApp
          </h1>
          <p className="text-gray-600">
            Aprende a tu ritmo, avanza con confianza
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
