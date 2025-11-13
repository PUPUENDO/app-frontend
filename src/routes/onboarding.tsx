import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Loader2, BookOpen, CheckCircle2, GraduationCap, FileText } from 'lucide-react'
import { authService } from '@/features/auth/AuthService'
import api from '@/lib/api'

interface Course {
  id: string
  title: string
  description?: string
  totalTopics?: number
  totalLessons?: number
  createdAt?: string
}

export const Route = createFileRoute('/onboarding')({
  component: OnboardingPage,
})

function OnboardingPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    try {
      setLoading(true)
      console.log('📡 Onboarding: Cargando cursos...')
      
      const response = await api.get('/courses')
      console.log('📦 Onboarding: Respuesta recibida:', response.data)
      
      // El backend devuelve directamente un array de cursos
      const coursesData = Array.isArray(response.data) ? response.data : []
      console.log('✅ Onboarding: Cursos procesados:', coursesData)
      
      setCourses(coursesData)
      
      if (coursesData.length === 0) {
        toast.warning('No hay cursos disponibles', {
          description: 'Contacta al administrador para agregar cursos'
        })
      } else {
        console.log(`✅ ${coursesData.length} curso(s) cargado(s) exitosamente`)
      }
    } catch (error: any) {
      console.error('❌ Onboarding: Error loading courses:', error)
      toast.error('Error al cargar los cursos', {
        description: error.response?.data?.message || error.message
      })
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!selectedCourse) {
      toast.error('Selecciona un curso para comenzar')
      return
    }

    try {
      setSubmitting(true)
      console.log('📤 Onboarding: Completando con curso:', selectedCourse)
      
      // Llamar al servicio de autenticación
      await authService.completeOnboarding(selectedCourse)
      
      toast.success('¡Bienvenido!', {
        description: 'Tu cuenta ha sido configurada correctamente',
      })
      
      console.log('✅ Onboarding completado, redirigiendo a /dashboard/learn')
      
      // Redirigir al dashboard de aprendizaje
      navigate({ to: '/dashboard/learn' })
    } catch (error: any) {
      console.error('❌ Onboarding: Error completing onboarding:', error)
      
      // Extraer el mensaje de error
      let errorMessage = 'Error al completar la configuración'
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error('Error al completar la configuración', {
        description: errorMessage,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Cargando cursos disponibles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Bienvenido! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Selecciona un curso para comenzar tu viaje de aprendizaje
          </p>
        </div>

        {/* Card Principal */}
        <Card className="shadow-xl border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Elige tu primer curso
            </CardTitle>
            <CardDescription className="text-base">
              Puedes cambiar de curso en cualquier momento desde tu dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {courses.length > 0 ? (
              <>
                {/* Grid de Cursos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      onClick={() => setSelectedCourse(course.id)}
                      className={`relative p-6 rounded-xl border-2 transition-all text-left group hover:shadow-md ${
                        selectedCourse === course.id
                          ? 'border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-blue-300 bg-white'
                      }`}
                    >
                      {/* Indicador de selección */}
                      {selectedCourse === course.id && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-blue-600 rounded-full p-1">
                            <CheckCircle2 className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* Icono del curso */}
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-3 rounded-lg transition-colors ${
                          selectedCourse === course.id 
                            ? 'bg-blue-600' 
                            : 'bg-blue-100 group-hover:bg-blue-200'
                        }`}>
                          <BookOpen className={`h-6 w-6 ${
                            selectedCourse === course.id 
                              ? 'text-white' 
                              : 'text-blue-600'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          
                          {/* Estadísticas del curso */}
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{course.totalTopics || 0} temas</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              <span>{course.totalLessons || 0} lecciones</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Descripción */}
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {course.description || 'Aprende los fundamentos y domina nuevas habilidades'}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Botón de acción */}
                <div className="pt-4 border-t border-gray-200">
                  <Button
                    onClick={handleComplete}
                    disabled={!selectedCourse || submitting}
                    className="w-full h-12 text-base font-semibold"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Configurando tu cuenta...
                      </>
                    ) : (
                      <>
                        <GraduationCap className="mr-2 h-5 w-5" />
                        Comenzar mi aprendizaje
                      </>
                    )}
                  </Button>
                  
                  {selectedCourse && (
                    <p className="text-center text-sm text-gray-500 mt-3">
                      Has seleccionado: <span className="font-semibold text-gray-700">
                        {courses.find(c => c.id === selectedCourse)?.title}
                      </span>
                    </p>
                  )}
                </div>
              </>
            ) : (
              /* Estado vacío */
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
                  <BookOpen className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay cursos disponibles
                </h3>
                <p className="text-gray-600 mb-6">
                  Contacta al administrador para agregar cursos a la plataforma
                </p>
                <Button
                  variant="outline"
                  onClick={loadCourses}
                  className="gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reintentar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nota informativa */}
        {courses.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              💡 <span className="font-medium">Consejo:</span> Puedes cambiar de curso o inscribirte en más cursos después desde tu perfil
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
