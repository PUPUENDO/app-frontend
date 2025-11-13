import React from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import {
  BookOpen,
  Trophy,
  Users,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  List,
  Layers,
  ChevronDown,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/store/auth'
import { authService } from '@/features/auth/AuthService'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

interface SubMenuItem {
  id: string
  label: string
  path: string
  icon?: React.ElementType
}

interface MenuItem {
  id: string
  label: string
  icon: React.ElementType
  path?: string
  roles?: string[]
  badge?: string
  subItems?: SubMenuItem[]
}

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['content'])
  const location = useLocation()
  const { user } = useAuthStore()
  const { theme, toggleTheme } = useTheme()

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const isGroupExpanded = (groupId: string) => expandedGroups.includes(groupId)

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard',
      roles: ['admin']
    },
    {
      id: 'content',
      label: 'Gestión de Contenido',
      icon: BookOpen,
      roles: ['admin'],
      subItems: [
        {
          id: 'courses',
          label: 'Cursos',
          path: '/dashboard/courses',
          icon: BookOpen
        },
        {
          id: 'topics',
          label: 'Temas',
          path: '/dashboard/topics',
          icon: List
        },
        {
          id: 'subtopics',
          label: 'Subtemas',
          path: '/dashboard/subtopics',
          icon: Layers
        },
        {
          id: 'lessons',
          label: 'Lecciones',
          path: '/dashboard/lessons',
          icon: FileText
        }
      ]
    },
    {
      id: 'achievements',
      label: 'Logros',
      icon: Trophy,
      path: '/dashboard/achievements',
      roles: ['admin']
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
            📚 Admin Panel
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
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const hasSubItems = item.subItems && item.subItems.length > 0
          const isGroupOpen = isGroupExpanded(item.id)
          
          // Si el item tiene subitems, es un grupo expandible
          if (hasSubItems) {
            return (
              <div key={item.id} className="space-y-1">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(item.id)}
                  className={cn(
                    'flex items-center w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-blue-100 hover:bg-blue-700 hover:text-white',
                    !isExpanded && 'justify-center'
                  )}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {isExpanded && (
                    <>
                      <span className="ml-3 font-medium text-sm flex-1 text-left whitespace-nowrap">
                        {item.label}
                      </span>
                      {isGroupOpen ? (
                        <ChevronDown size={16} className="flex-shrink-0" />
                      ) : (
                        <ChevronRight size={16} className="flex-shrink-0" />
                      )}
                    </>
                  )}
                </button>

                {/* Subitems */}
                {isExpanded && isGroupOpen && (
                  <div className="ml-4 space-y-1 border-l-2 border-blue-700 pl-2">
                    {item.subItems?.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isActive = location.pathname === subItem.path
                      
                      return (
                        <Link
                          key={subItem.id}
                          to={subItem.path}
                          className={cn(
                            'flex items-center px-3 py-2 rounded-lg transition-all duration-200 text-sm',
                            isActive 
                              ? 'bg-white text-blue-600 shadow-md font-medium' 
                              : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                          )}
                        >
                          {SubIcon && <SubIcon size={16} className="flex-shrink-0 mr-2" />}
                          <span className="whitespace-nowrap">{subItem.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          // Item regular sin subitems
          const isActive = item.path ? location.pathname === item.path : false
          
          return (
            <Link
              key={item.id}
              to={item.path || '/dashboard'}
              className={cn(
                'flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group min-w-[40px]',
                isActive 
                  ? 'bg-white text-blue-600 shadow-lg' 
                  : 'text-blue-100 hover:bg-blue-700 hover:text-white',
                !isExpanded && 'justify-center'
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className={cn(
                'ml-3 font-medium text-sm transition-all duration-300 whitespace-nowrap',
                isExpanded 
                  ? 'opacity-100 translate-x-0' 
                  : 'opacity-0 -translate-x-2 w-0 overflow-hidden'
              )}>
                {item.label}
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="p-4 border-t border-blue-700 space-y-2">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className={cn(
            'flex items-center w-full px-3 py-3 rounded-lg transition-all duration-200 text-blue-100 hover:bg-blue-700 hover:text-white',
            !isExpanded && 'justify-center'
          )}
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? (
            <Moon size={20} className="flex-shrink-0" />
          ) : (
            <Sun size={20} className="flex-shrink-0" />
          )}
          <span className={cn(
            'ml-3 font-medium transition-all duration-300 whitespace-nowrap',
            isExpanded
              ? 'opacity-100 translate-x-0'
              : 'opacity-0 -translate-x-2 w-0 overflow-hidden'
          )}>
            {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
          </span>
        </button>

        {/* Logout Button */}
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
