import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Lock, CheckCircle2, Play, FileText, GraduationCap, AlertCircle } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import { CourseApiService } from '@/features/courses/CourseApiService'
import type { Course } from '@/features/courses/types'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

const LearnPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { user } = useAuthStore()

  useEffect(() => {
    console.log('📚 LearnPage: Montando componente...')
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📡 LearnPage: Obteniendo cursos...')
      
      const data = await CourseApiService.findAll()
      console.log('✅ LearnPage: Cursos recibidos:', data)
      
      setCourses(data || [])
      
      if (!data || data.length === 0) {
        console.warn('⚠️ LearnPage: No hay cursos disponibles')
      }
    } catch (error: any) {
      console.error('❌ LearnPage: Error fetching courses:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar cursos'
      setError(errorMessage)
      setCourses([])
      
      toast.error('Error al cargar cursos', {
        description: errorMessage
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartCourse = (courseId: string) => {
    console.log('🎯 LearnPage: Iniciando curso:', courseId)
    navigate({ to: `/dashboard/topics/${courseId}` })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus cursos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <Card className="max-w-md">
          <CardContent className="py-12 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error al cargar cursos
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchCourses}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Comienza tu aprendizaje, {user?.displayName || 'Estudiante'}! 🚀
        </h1>
        <p className="text-gray-600">
          Selecciona un curso y avanza lección por lección
        </p>
      </div>

      {/* Cursos Disponibles */}
      {courses.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <BookOpen className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay cursos disponibles
            </h3>
            <p className="text-gray-500 mb-6">
              Contacta al administrador para inscribirte en un curso
            </p>
            <Button variant="outline" onClick={fetchCourses}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Recargar cursos
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {courses.map((course) => (
            <Card 
              key={course.id} 
              className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
              onClick={() => handleStartCourse(course.id)}
            >
              {/* Imagen o gradiente del curso */}
              {course.imageUrl ? (
                <div className="h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  <img 
                    src={course.imageUrl} 
                    alt={course.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:from-blue-600 group-hover:to-purple-700 transition-all duration-300">
                  <BookOpen className="w-20 h-20 text-white opacity-80 group-hover:scale-110 transition-transform duration-300" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {course.name}
                  </CardTitle>
                  <Badge variant="secondary" className="shrink-0">Disponible</Badge>
                </div>
                
                {/* Estadísticas del curso */}
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>{course.totalTopics || 0} temas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{course.totalLessons || 0} lecciones</span>
                  </div>
                </div>
                
                <CardDescription className="line-clamp-2">
                  {course.description || 'Comienza tu aprendizaje con este curso'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button 
                  className="w-full group-hover:bg-blue-700 transition-colors" 
                  variant="default"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleStartCourse(course.id)
                  }}
                >
                  <Play size={16} className="mr-2" />
                  Comenzar Curso
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sección de progreso */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <GraduationCap className="w-7 h-7 text-blue-600" />
          Tu Progreso
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription className="text-sm">Lecciones Completadas</CardDescription>
              <CardTitle className="text-4xl font-bold text-blue-600">
                {user?.xp ? Math.floor(user.xp / 10) : 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span>Sigue así! 💪</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription className="text-sm">Racha Actual</CardDescription>
              <CardTitle className="text-4xl font-bold text-orange-600">
                0 días
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-2xl">🔥</span>
                <span>Completa una lección hoy</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardDescription className="text-sm">XP Total</CardDescription>
              <CardTitle className="text-4xl font-bold text-purple-600">
                {user?.xp || 0}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-2xl">⭐</span>
                <span>Nivel {user?.level || 1}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mensaje motivacional */}
      {courses.length > 0 && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                ¡Consejo del día!
              </h3>
              <p className="text-gray-600">
                La consistencia es clave. Intenta completar al menos una lección cada día para mantener tu racha activa y maximizar tu aprendizaje.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LearnPage
