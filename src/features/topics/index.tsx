import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit3, Trash2, BookOpen, AlertCircle, ChevronDown, Check } from 'lucide-react'
import { toast } from 'sonner'
import { TopicApiService } from './TopicApiService'
import { CreateTopicModal, EditTopicModal, DeleteTopicModal } from './components'
import type { Topic } from './types'
import { usePermissions } from '@/hooks/use-permissions'
import { CourseApiService } from '@/features/courses/CourseApiService'
import type { Course } from '@/features/courses/types'
import { SubtopicApiService } from '@/features/subtopics/SubtopicApiService'
import { LessonApiService } from '@/features/lessons/LessonApiService'

interface TopicsPageProps {
  courseId?: string
}

const TopicsPage: React.FC<TopicsPageProps> = ({ courseId: propCourseId }) => {
  const [topics, setTopics] = useState<Topic[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(propCourseId || null)
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = usePermissions()

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)

  useEffect(() => {
    console.log('🚀 TopicsPage montado')
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      fetchTopics()
    }
  }, [selectedCourseId])

  const fetchCourses = async () => {
    try {
      const data = await CourseApiService.findAll()
      
      // Calcular totales para cada curso
      if (data && data.length > 0) {
        const coursesWithTotals = await Promise.all(
          data.map(async (course) => {
            try {
              // Obtener temas del curso
              const topics = await TopicApiService.findByCourseId(course.id)
              const totalTopics = topics?.length || 0
              
              // Obtener lecciones de todos los temas
              const lessonsPromises = (topics || []).map(topic => 
                LessonApiService.findByTopicId(topic.id).catch(() => [])
              )
              const lessonsArrays = await Promise.all(lessonsPromises)
              const totalLessons = lessonsArrays.reduce((sum, lessons) => sum + (lessons?.length || 0), 0)
              
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
      }
      
      // Si no hay curso seleccionado y hay cursos disponibles, seleccionar el primero
      if (!selectedCourseId && data && data.length > 0) {
        setSelectedCourseId(data[0].id)
      }
    } catch (error: any) {
      console.error('❌ Error fetching courses:', error)
      toast.error('Error al cargar cursos')
    }
  }

  const fetchTopics = async () => {
    if (!selectedCourseId) return
    
    try {
      setLoading(true)
      setError(null)
      console.log('📡 Llamando a TopicApiService para curso:', selectedCourseId)
      
      const data = await TopicApiService.findByCourseId(selectedCourseId)
      
      console.log('✅ Topics recibidos:', data)
      
      // Calcular totales para cada tema
      if (data && data.length > 0) {
        const topicsWithTotals = await Promise.all(
          data.map(async (topic) => {
            try {
              // Obtener subtemas del tema
              const subtopics = await SubtopicApiService.findByTopicId(topic.id)
              const totalSubtopics = subtopics?.length || 0
              
              // Obtener lecciones del tema
              const lessons = await LessonApiService.findByTopicId(topic.id)
              const totalLessons = lessons?.length || 0
              
              return {
                ...topic,
                totalSubtopics,
                totalLessons
              }
            } catch (error) {
              console.error(`Error calculando totales para tema ${topic.id}:`, error)
              return topic
            }
          })
        )
        setTopics(topicsWithTotals)
      } else {
        setTopics(data || [])
      }
    } catch (error: any) {
      console.error('❌ Error fetching topics:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar temas'
      setError(errorMessage)
      toast.error('Error al cargar temas', {
        description: errorMessage
      })
      setTopics([])
    } finally {
      setLoading(false)
    }
  }

  const handleTopicCreated = (newTopic: Topic) => {
    console.log('✅ Nuevo tema creado:', newTopic)
    toast.success('Tema creado exitosamente')
    // Refetch para recalcular totales
    fetchTopics()
    fetchCourses() // También actualizar los totales de cursos
  }

  const handleTopicUpdated = (updatedTopic: Topic) => {
    console.log('✅ Tema actualizado:', updatedTopic)
    toast.success('Tema actualizado exitosamente')
    // Refetch para recalcular totales
    fetchTopics()
    fetchCourses() // También actualizar los totales de cursos
  }

  const handleTopicDeleted = (topicId: string) => {
    console.log('✅ Tema eliminado:', topicId)
    toast.success('Tema eliminado exitosamente')
    // Refetch para recalcular totales
    fetchTopics()
    fetchCourses() // También actualizar los totales de cursos
  }

  const openEditModal = (topic: Topic) => {
    setSelectedTopic(topic)
    setShowEditModal(true)
  }

  const openDeleteModal = (topic: Topic) => {
    setSelectedTopic(topic)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedTopic(null)
  }

  const filteredTopics = topics.filter(topic => {
    if (!topic) return false
    const topicName = topic.name || ''
    const topicDescription = topic.description || ''
    const search = searchTerm || ''
    
    return topicName.toLowerCase().includes(search.toLowerCase()) ||
           topicDescription.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando temas...</p>
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
              Error al cargar temas
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchTopics}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Temas</h1>
        <p className="text-gray-600">
          Administra los temas de cada curso
        </p>
      </div>

      {/* Course Selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Selecciona un Curso
        </label>
        <div className="relative">
          <button
            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg hover:border-blue-300 transition-all"
          >
            {selectedCourse ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{selectedCourse.name}</p>
                  <p className="text-sm text-gray-500">{selectedCourse.totalTopics || 0} temas</p>
                </div>
              </div>
            ) : (
              <span className="text-gray-500">Selecciona un curso...</span>
            )}
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showCourseDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showCourseDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id)
                    setShowCourseDropdown(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0 ${
                    selectedCourseId === course.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-500 line-clamp-1">{course.description}</p>
                    <div className="flex gap-3 mt-1">
                      <span className="text-xs text-gray-500">
                        📚 {course.totalTopics || 0} temas
                      </span>
                      <span className="text-xs text-gray-500">
                        📝 {course.totalLessons || 0} lecciones
                      </span>
                    </div>
                  </div>
                  {selectedCourseId === course.id && (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      {selectedCourseId && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            {topics.length > 0 && `${topics.length} tema${topics.length !== 1 ? 's' : ''} encontrado${topics.length !== 1 ? 's' : ''}`}
          </p>
          {isAdmin() && (
            <Button className="flex items-center gap-2" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Nuevo Tema
            </Button>
          )}
        </div>
      )}

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar temas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron temas' : 'No hay temas'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No hay temas que coincidan con "${searchTerm}"` 
                : selectedCourseId ? 'Comienza agregando el primer tema a este curso' : 'Selecciona un curso para ver sus temas'
              }
            </p>
            {!searchTerm && isAdmin() && selectedCourseId && (
              <Button className="flex items-center gap-2 mx-auto" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                Agregar Primer Tema
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <Card key={topic.id} className="hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-t-lg">
                <BookOpen className="w-16 h-16 text-white opacity-80" />
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{topic.name}</CardTitle>
                  <Badge variant="secondary">#{topic.order}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {topic.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Mostrar estadísticas del tema */}
                <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">Subtemas</p>
                    <p className="font-semibold text-gray-900">{topic.totalSubtopics || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <p className="text-gray-500 text-xs">Lecciones</p>
                    <p className="font-semibold text-gray-900">{topic.totalLessons || 0}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* View Subtopics Button - Se maneja desde la página de subtopics */}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {topic.createdAt ? new Date(topic.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                    {isAdmin() && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(topic)}>
                          <Edit3 size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDeleteModal(topic)}
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
      {selectedCourseId && (
        <>
          <CreateTopicModal
            isOpen={showCreateModal}
            onClose={closeModals}
            onTopicCreated={handleTopicCreated}
            courseId={selectedCourseId}
          />

          <EditTopicModal
            isOpen={showEditModal}
            onClose={closeModals}
            onTopicUpdated={handleTopicUpdated}
            topic={selectedTopic}
          />

          <DeleteTopicModal
            isOpen={showDeleteModal}
            onClose={closeModals}
            onTopicDeleted={handleTopicDeleted}
            topic={selectedTopic}
          />
        </>
      )}
    </div>
  )
}

export default TopicsPage
