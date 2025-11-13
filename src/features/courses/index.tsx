import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit3, Trash2, BookOpen, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { CourseApiService } from './CourseApiService'
import { CreateCourseModal, EditCourseModal, DeleteCourseModal } from './components'
import type { Course } from './types'
import { usePermissions } from '@/hooks/use-permissions'
import { useNavigate } from '@tanstack/react-router'
import { TopicApiService } from '@/features/topics/TopicApiService'
import { LessonApiService } from '@/features/lessons/LessonApiService'

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = usePermissions()

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)

  useEffect(() => {
    console.log('🚀 CoursesPage montado, iniciando carga de cursos...')
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('📡 Llamando a CourseApiService.findAll()...')
      
      const data = await CourseApiService.findAll()
      
      console.log('✅ Cursos recibidos en el componente:', data)
      console.log(`✅ Total de cursos: ${data?.length || 0}`)
      
      // Calcular totales para cada curso
      if (data && data.length > 0) {
        const coursesWithTotals = await Promise.all(
          data.map(async (course) => {
            try {
              // Obtener temas del curso
              const topics = await TopicApiService.findByCourseId(course.id)
              const totalTopics = topics?.length || 0
              
              // Obtener lecciones del curso (por topicId)
              let totalLessons = 0
              if (topics && topics.length > 0) {
                const lessonsPromises = topics.map(topic => 
                  LessonApiService.findByTopicId(topic.id).catch(() => [])
                )
                const lessonsArrays = await Promise.all(lessonsPromises)
                totalLessons = lessonsArrays.reduce((sum, lessons) => sum + (lessons?.length || 0), 0)
              }
              
              return {
                ...course,
                totalTopics,
                totalLessons
              }
            } catch (error) {
              console.error(`Error calculando totales para curso ${course.id}:`, error)
              return course
            }
          })
        )
        setCourses(coursesWithTotals)
      } else {
        setCourses(data || [])
        console.warn('⚠️ No se recibieron cursos del servidor')
      }
    } catch (error: any) {
      console.error('❌ Error fetching courses:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar cursos'
      setError(errorMessage)
      toast.error('Error al cargar cursos', {
        description: errorMessage
      })
      setCourses([])
    } finally {
      setLoading(false)
      console.log('✅ Carga de cursos finalizada')
    }
  }

  const handleCourseCreated = (newCourse: Course) => {
    console.log('✅ Nuevo curso creado:', newCourse)
    toast.success('Curso creado exitosamente')
    // Refetch para recalcular totales
    fetchCourses()
  }

  const handleCourseUpdated = (updatedCourse: Course) => {
    console.log('✅ Curso actualizado:', updatedCourse)
    toast.success('Curso actualizado exitosamente')
    // Refetch para recalcular totales
    fetchCourses()
  }

  const handleCourseDeleted = (courseId: string) => {
    console.log('✅ Curso eliminado:', courseId)
    toast.success('Curso eliminado exitosamente')
    // Refetch para recalcular totales
    fetchCourses()
  }

  const openEditModal = (course: Course) => {
    setSelectedCourse(course)
    setShowEditModal(true)
  }

  const openDeleteModal = (course: Course) => {
    setSelectedCourse(course)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedCourse(null)
  }

  // Filtrar cursos con validación de datos
  const filteredCourses = courses.filter(course => {
    if (!course) return false
    const courseName = course.name || ''
    const courseDescription = course.description || ''
    const search = searchTerm || ''
    
    return courseName.toLowerCase().includes(search.toLowerCase()) ||
           courseDescription.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando cursos...</p>
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
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-600 mt-2">
            Administra los cursos disponibles en la plataforma
          </p>
          {courses.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Total: {courses.length} curso{courses.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {isAdmin() && (
          <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Nuevo Curso
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron cursos' : 'No hay cursos'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No hay cursos que coincidan con "${searchTerm}"` 
                : 'Comienza agregando el primer curso'
              }
            </p>
            {!searchTerm && isAdmin() && (
              <Button className="flex items-center gap-2 mx-auto" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                Agregar Primer Curso
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              {course.imageUrl && (
                <div className="h-48 overflow-hidden rounded-t-lg">
                  <img 
                    src={course.imageUrl} 
                    alt={course.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              {!course.imageUrl && (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded-t-lg">
                  <BookOpen className="w-20 h-20 text-white opacity-80" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                  <Badge variant="secondary">Activo</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Mostrar estadísticas del curso */}
                <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">Temas</p>
                    <p className="font-semibold text-gray-900">{course.totalTopics || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">Lecciones</p>
                    <p className="font-semibold text-gray-900">{course.totalLessons || 0}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* View Topics Button */}
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    size="sm"
                    onClick={() => navigate({ to: `/dashboard/topics/${course.id}` })}
                  >
                    <BookOpen size={14} className="mr-2" />
                    Ver Temas ({course.totalTopics || 0})
                  </Button>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {course.createdAt ? new Date(course.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                    {isAdmin() && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(course)}>
                          <Edit3 size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDeleteModal(course)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateCourseModal
        isOpen={showCreateModal}
        onClose={closeModals}
        onCourseCreated={handleCourseCreated}
      />

      <EditCourseModal
        isOpen={showEditModal}
        onClose={closeModals}
        onCourseUpdated={handleCourseUpdated}
        course={selectedCourse}
      />

      <DeleteCourseModal
        isOpen={showDeleteModal}
        onClose={closeModals}
        onCourseDeleted={handleCourseDeleted}
        course={selectedCourse}
      />
    </div>
  )
}

export default CoursesPage
