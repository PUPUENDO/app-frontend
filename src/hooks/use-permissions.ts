import { useAuthStore } from '@/store/auth'

export const usePermissions = () => {
  const { user } = useAuthStore()

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isStudent = () => {
    return user?.role === 'student'
  }

  const canAccess = (requiredRole: 'admin' | 'student' | 'both') => {
    if (!user) return false
    
    if (requiredRole === 'both') return true
    if (requiredRole === 'admin') return user.role === 'admin'
    if (requiredRole === 'student') return user.role === 'student'
    
    return false
  }

  const checkPermission = (action: string) => {
    if (!user) return false
    
    // Los admins tienen todos los permisos
    if (user.role === 'admin') return true
    
    // Aquí puedes agregar lógica específica de permisos si es necesario
    return false
  }

  return {
    isAdmin,
    isStudent,
    canAccess,
    checkPermission,
    user
  }
}
