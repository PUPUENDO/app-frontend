import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { 
  BookOpen,
  Trophy,
  Users,
  LogOut,
  GraduationCap,
  Menu,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { authService } from '@/features/auth/AuthService'
import { useState } from 'react'

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  path: string
  roles?: string[]
}

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const location = useLocation()
  const { user } = useAuthStore()

  const menuItems: MenuItem[] = [
    {
      id: 'learn',
      label: 'Aprender',
      icon: GraduationCap,
      path: '/dashboard/learn',
      roles: ['student', 'admin']
    },
    {
      id: 'courses',
      label: 'Cursos',
      icon: BookOpen,
      path: '/dashboard/courses',
      roles: ['admin']
    },
    {
      id: 'achievements',
      label: 'Logros',
      icon: Trophy,
      path: '/dashboard/achievements',
      roles: ['student', 'admin']
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: Users,
      path: '/dashboard/users',
      roles: ['admin']
    }
  ]

  const handleLogout = async () => {
    await authService.logout()
    window.location.href = '/login'
  }

  const toggleSidebar = () => setIsExpanded(!isExpanded)

  // Filtrar items según el rol del usuario
  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || item.roles.includes(user?.role || '')
  )

  return (
    <div className={cn(
      'flex flex-col h-screen bg-gradient-to-b from-blue-600 to-blue-800 text-white transition-all duration-300 ease-in-out',
      isExpanded ? 'w-64' : 'w-16'
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        <div className={cn(
          'transition-opacity duration-300',
          isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
        )}>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🎓 LearnApp
          </h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-white hover:bg-blue-700 flex-shrink-0"
        >
          {isExpanded ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* User Info */}
      {isExpanded && user && (
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">
                {user.email?.[0].toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user.email}</p>
              <p className="text-xs text-blue-200 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                'flex items-center px-3 py-3 rounded-lg transition-all duration-200 group min-w-[40px]',
                isActive 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white',
                !isExpanded && 'justify-center'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className={cn(
                'ml-3 font-medium transition-all duration-300 whitespace-nowrap',
                isExpanded 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-2 w-0 overflow-hidden'
              )}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-blue-700">
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 text-blue-100 hover:bg-red-600 hover:text-white',
            !isExpanded && 'justify-center'
          )}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className={cn(
            'ml-3 font-medium transition-all duration-300 whitespace-nowrap',
            isExpanded 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-2 w-0 overflow-hidden'
          )}>
            Cerrar Sesión
          </span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar
