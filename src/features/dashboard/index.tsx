import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  BookOpen, 
  Users, 
  Trophy, 
  FileText, 
  TrendingUp,
  Activity,
  ArrowUpRight,
  BarChart3
} from 'lucide-react'
import { CourseApiService } from '@/features/courses/CourseApiService'
import { UserApiService } from '@/features/users/UserApiService'
import { AchievementApiService } from '@/features/achievements/AchievementApiService'
import { LessonApiService } from '@/features/lessons/LessonApiService'
import { usePermissions } from '@/hooks/use-permissions'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

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
  const { isAdmin } = usePermissions()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [courses, users, achievements, lessons] = await Promise.all([
        CourseApiService.findAll(),
        isAdmin() ? UserApiService.findAll() : Promise.resolve([]),
        AchievementApiService.findAll(),
        LessonApiService.findAll()
      ])

      setStats({
        totalCourses: courses.length,
        totalUsers: users.length,
        totalAchievements: achievements.length,
        totalLessons: lessons.length
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
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
      change: '+12%',
      changeType: 'positive' as const,
      link: '/dashboard/courses'
    },
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      changeType: 'positive' as const,
      link: '/dashboard/users'
    },
    {
      title: 'Total Lecciones',
      value: stats.totalLessons,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      changeType: 'positive' as const,
      link: '/dashboard/lessons'
    },
    {
      title: 'Total Logros',
      value: stats.totalAchievements,
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: '+5%',
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
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Resumen general de la plataforma educativa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-sm mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-green-600 font-medium">{stat.change}</span>
                    <span className="text-gray-500 ml-1">vs. mes anterior</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones principales
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.title} to={action.link}>
                  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
                    <div className={`${action.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {action.title}
                      </h4>
                      <p className="text-sm text-gray-500">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity / Charts Placeholder */}
        <Card>
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
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Sistema</CardTitle>
          <CardDescription>Información general de la plataforma</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Sistema Operativo</p>
                <p className="text-xs text-gray-500">Todos los servicios funcionando</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Última Actualización</p>
                <p className="text-xs text-gray-500">Hace 5 minutos</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Rendimiento</p>
                <p className="text-xs text-gray-500">Óptimo (98%)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardOverview
