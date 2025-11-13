import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AchievementApiService } from '@/features/achievements/AchievementApiService'
import { CourseApiService } from '@/features/courses/CourseApiService'
import { LessonApiService } from '@/features/lessons/LessonApiService'
import { UserApiService } from '@/features/users/UserApiService'
import { usePermissions } from '@/hooks/use-permissions'
import { Link } from '@tanstack/react-router'
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  FileText,
  Trophy,
  Users
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

interface Stats {
  totalCourses: number
  totalUsers: number
  totalAchievements: number
  totalLessons: number
}

const DashboardOverview: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalUsers: 0,
    totalAchievements: 0,
    totalLessons: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = usePermissions()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // Usar Promise.allSettled para que un error no afecte las demás llamadas
      const results = await Promise.allSettled([
        CourseApiService.findAll(),
        isAdmin() ? UserApiService.findAll() : Promise.resolve([]),
        AchievementApiService.findAll(),
        LessonApiService.findAll()
      ])

      // Extraer los datos exitosos, usar array vacío si falla
      const courses = results[0].status === 'fulfilled' ? results[0].value : []
      const users = results[1].status === 'fulfilled' ? results[1].value : []
      const achievements = results[2].status === 'fulfilled' ? results[2].value : []
      const lessons = results[3].status === 'fulfilled' ? results[3].value : []

      const newStats = {
        totalCourses: courses.length,
        totalUsers: users.length,
        totalAchievements: achievements.length,
        totalLessons: lessons.length
      }
      setStats(newStats)

      // Verificar si hubo errores y mostrar advertencia (sin bloquear la UI)
      const failedRequests = results.filter(r => r.status === 'rejected')
      if (failedRequests.length > 0) {
        console.warn('⚠️ Algunas estadísticas no se pudieron cargar:', failedRequests)
      }
    } catch (error: any) {
      console.error('❌ Error fetching stats:', error)
      setError(error?.message || 'Error al cargar las estadísticas')
      // Mostrar valores en 0 si hay error
      setStats({
        totalCourses: 0,
        totalUsers: 0,
        totalAchievements: 0,
        totalLessons: 0
      })
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Cursos',
      value: stats.totalCourses,
      icon: BookOpen,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      changeType: 'positive' as const,
      link: '/dashboard/courses'
    },
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      changeType: 'positive' as const,
      link: '/dashboard/users'
    },
    {
      title: 'Total Lecciones',
      value: stats.totalLessons,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      changeType: 'positive' as const,
      link: '/dashboard/lessons'
    },
    {
      title: 'Total Logros',
      value: stats.totalAchievements,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      changeType: 'positive' as const,
      link: '/dashboard/achievements'
    }
  ]

  const quickActions = [
    {
      title: 'Crear Curso',
      description: 'Agrega un nuevo curso a la plataforma',
      icon: BookOpen,
      link: '/dashboard/courses',
      color: 'bg-blue-500'
    },
    {
      title: 'Agregar Lección',
      description: 'Crea contenido educativo nuevo',
      icon: FileText,
      link: '/dashboard/lessons',
      color: 'bg-purple-500'
    },
    {
      title: 'Gestionar Usuarios',
      description: 'Administra estudiantes y permisos',
      icon: Users,
      link: '/dashboard/users',
      color: 'bg-green-500'
    },
    {
      title: 'Ver Logros',
      description: 'Configura achievements del sistema',
      icon: Trophy,
      link: '/dashboard/achievements',
      color: 'bg-yellow-500'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Resumen general de la plataforma educativa
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Activity className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Recargar
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error al cargar estadísticas</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} dark:bg-opacity-20 p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color} dark:brightness-125`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-sm mt-2">
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Acciones 
            </CardTitle>
            <CardDescription>
              Accede a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} to={action.link}>
                  <div className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                    <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity / Charts Placeholder */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              Actividad Reciente
            </CardTitle>
            <CardDescription>
              Últimas acciones en la plataforma
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nuevo curso creado
                  </p>
                  <p className="text-xs text-gray-500">Hace 2 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div className="bg-green-50 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    3 nuevos usuarios registrados
                  </p>
                  <p className="text-xs text-gray-500">Hace 5 horas</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <FileText className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    5 lecciones actualizadas
                  </p>
                  <p className="text-xs text-gray-500">Hace 1 día</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-yellow-50 p-2 rounded-lg">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Nuevo logro desbloqueado por usuarios
                  </p>
                  <p className="text-xs text-gray-500">Hace 2 días</p>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-4">
              Ver toda la actividad
            </Button>
          </CardContent>
        </Card> */}
      </div>
    </div>
  )
}

export default DashboardOverview
