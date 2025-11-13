import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit3, Trash2, List, AlertCircle, ChevronDown, Check, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { SubtopicApiService } from './SubtopicApiService'
import { CreateSubtopicModal, EditSubtopicModal, DeleteSubtopicModal } from './components'
import type { Subtopic } from './types'
import { usePermissions } from '@/hooks/use-permissions'
import { TopicApiService } from '@/features/topics/TopicApiService'
import type { Topic } from '@/features/topics/types'
import { CourseApiService } from '@/features/courses/CourseApiService'
import type { Course } from '@/features/courses/types'
import { LessonApiService } from '@/features/lessons/LessonApiService'

interface SubtopicsPageProps {
  topicId?: string
}

const SubtopicsPage: React.FC<SubtopicsPageProps> = ({ topicId: propTopicId }) => {
  const [subtopics, setSubtopics] = useState<Subtopic[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(propTopicId || null)
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const [showTopicDropdown, setShowTopicDropdown] = useState(false)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { isAdmin } = usePermissions()

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(null)

  useEffect(() => {
    console.log('🚀 SubtopicsPage montado')
    fetchCourses()
  }, [])

  useEffect(() => {
    if (selectedCourseId) {
      fetchTopics()
    }
  }, [selectedCourseId])

  useEffect(() => {
    if (selectedTopicId) {
      fetchSubtopics()
    }
  }, [selectedTopicId])

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
      const data = await TopicApiService.findByCourseId(selectedCourseId)
      
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
      
      // Auto-select first topic if available and none is selected
      if (!selectedTopicId && data && data.length > 0) {
        setSelectedTopicId(data[0].id)
      }
    } catch (error: any) {
      console.error('❌ Error fetching topics:', error)
      toast.error('Error al cargar temas')
    }
  }

  const fetchSubtopics = async () => {
    if (!selectedTopicId) return
    
    try {
      setLoading(true)
      setError(null)
      console.log('📡 Llamando a SubtopicApiService para tema:', selectedTopicId)
      
      const data = await SubtopicApiService.findByTopicId(selectedTopicId)
      
      console.log('✅ Subtopics recibidos:', data)
      
      // Calcular totalLessons para cada subtema
      if (data && data.length > 0) {
        const subtopicsWithTotals = await Promise.all(
          data.map(async (subtopic) => {
            try {
              // Obtener lecciones del subtema
              const lessons = await LessonApiService.findBySubtopicId(subtopic.id, selectedTopicId)
              const totalLessons = lessons?.length || 0
              
              return {
                ...subtopic,
                totalLessons
              }
            } catch (error) {
              console.error(`Error calculando totales para subtema ${subtopic.id}:`, error)
              return subtopic
            }
          })
        )
        setSubtopics(subtopicsWithTotals)
      } else {
        setSubtopics(data || [])
      }
    } catch (error: any) {
      console.error('❌ Error fetching subtopics:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar subtemas'
      setError(errorMessage)
      toast.error('Error al cargar subtemas', {
        description: errorMessage
      })
      setSubtopics([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubtopicCreated = (newSubtopic: Subtopic) => {
    console.log('✅ Nuevo subtema creado:', newSubtopic)
    toast.success('Subtema creado exitosamente')
    // Refetch para recalcular totales
    fetchSubtopics()
    fetchTopics() // También actualizar los totales de temas
    fetchCourses() // También actualizar los totales de cursos
  }

  const handleSubtopicUpdated = (updatedSubtopic: Subtopic) => {
    console.log('✅ Subtema actualizado:', updatedSubtopic)
    toast.success('Subtema actualizado exitosamente')
    // Refetch para recalcular totales
    fetchSubtopics()
    fetchTopics() // También actualizar los totales de temas
    fetchCourses() // También actualizar los totales de cursos
  }

  const handleSubtopicDeleted = (subtopicId: string) => {
    console.log('✅ Subtema eliminado:', subtopicId)
    toast.success('Subtema eliminado exitosamente')
    // Refetch para recalcular totales
    fetchSubtopics()
    fetchTopics() // También actualizar los totales de temas
    fetchCourses() // También actualizar los totales de cursos
  }

  const openEditModal = (subtopic: Subtopic) => {
    setSelectedSubtopic(subtopic)
    setShowEditModal(true)
  }

  const openDeleteModal = (subtopic: Subtopic) => {
    setSelectedSubtopic(subtopic)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedSubtopic(null)
  }

  const filteredSubtopics = subtopics.filter(subtopic => {
    if (!subtopic) return false
    const subtopicName = subtopic.name || ''
    const subtopicDescription = subtopic.description || ''
    const search = searchTerm || ''
    
    return subtopicName.toLowerCase().includes(search.toLowerCase()) ||
           subtopicDescription.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando subtemas...</p>
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
              Error al cargar subtemas
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <Button onClick={fetchSubtopics}>
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedCourse = courses.find(c => c.id === selectedCourseId)
  const selectedTopic = topics.find(t => t.id === selectedTopicId)
  const courseTopics = topics.filter(t => t.courseId === selectedCourseId)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Subtemas</h1>
        <p className="text-gray-600">
          Administra los subtemas de cada tema
        </p>
      </div>

      {/* Course Selector */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          1️⃣ Selecciona un Curso
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

          {showCourseDropdown && (
            <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => {
                    setSelectedCourseId(course.id)
                    setSelectedTopicId(null) // Reset topic when course changes
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

      {/* Topic Selector - Only show when course is selected */}
      {selectedCourseId && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            2️⃣ Selecciona un Tema del Curso
          </label>
          <div className="relative">
            <button
              onClick={() => setShowTopicDropdown(!showTopicDropdown)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg hover:border-purple-300 transition-all"
            >
              {selectedTopic ? (
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <List className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{selectedTopic.name}</p>
                    <p className="text-sm text-gray-500">{selectedTopic.totalSubtopics || 0} subtemas</p>
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">Selecciona un tema...</span>
              )}
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showTopicDropdown && (
              <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                {courseTopics.length > 0 ? (
                  courseTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopicId(topic.id)
                        setShowTopicDropdown(false)
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-0 ${
                        selectedTopicId === topic.id ? 'bg-purple-50 border-l-4 border-l-purple-600' : ''
                      }`}
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <List className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-gray-900">{topic.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">{topic.description}</p>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-gray-500">
                            📑 {topic.totalSubtopics || 0} subtemas
                          </span>
                        </div>
                      </div>
                      {selectedTopicId === topic.id && (
                        <Check className="w-5 h-5 text-purple-600 flex-shrink-0" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <List className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay temas en este curso</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Button */}
      {selectedTopicId && (
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm text-gray-600">
            {subtopics.length > 0 && `${subtopics.length} subtema${subtopics.length !== 1 ? 's' : ''} encontrado${subtopics.length !== 1 ? 's' : ''}`}
          </p>
          {isAdmin() && (
            <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Nuevo Subtema
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
            placeholder="Buscar subtemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Subtopics Grid */}
      {filteredSubtopics.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <List className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron subtemas' : 'No hay subtemas'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No hay subtemas que coincidan con "${searchTerm}"` 
                : selectedTopicId ? 'Comienza agregando el primer subtema a este tema' : 'Selecciona un tema para ver sus subtemas'
              }
            </p>
            {!searchTerm && isAdmin() && selectedTopicId && (
              <Button className="flex items-center gap-2 mx-auto bg-purple-600 hover:bg-purple-700" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                Agregar Primer Subtema
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubtopics.map((subtopic) => (
            <Card key={subtopic.id} className="hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center rounded-t-lg">
                <List className="w-16 h-16 text-white opacity-80" />
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{subtopic.name}</CardTitle>
                  <Badge variant="secondary">#{subtopic.order}</Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {subtopic.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Mostrar estadísticas del subtema */}
                <div className="mb-4 bg-gray-50 p-3 rounded text-center">
                  <p className="text-gray-500 text-xs">Lecciones</p>
                  <p className="font-semibold text-gray-900 text-lg">{subtopic.totalLessons || 0}</p>
                </div>

                <div className="space-y-3">
                  {/* View Lessons Button - Se maneja desde la página de lecciones */}

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {subtopic.createdAt ? new Date(subtopic.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </span>
                    {isAdmin() && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(subtopic)}>
                          <Edit3 size={14} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => openDeleteModal(subtopic)}
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
      {selectedTopicId && (
        <>
          <CreateSubtopicModal
            isOpen={showCreateModal}
            onClose={closeModals}
            onSubtopicCreated={handleSubtopicCreated}
            topicId={selectedTopicId}
          />

          <EditSubtopicModal
            isOpen={showEditModal}
            onClose={closeModals}
            onSubtopicUpdated={handleSubtopicUpdated}
            subtopic={selectedSubtopic}
          />

          <DeleteSubtopicModal
            isOpen={showDeleteModal}
            onClose={closeModals}
            onSubtopicDeleted={handleSubtopicDeleted}
            subtopic={selectedSubtopic}
          />
        </>
      )}
    </div>
  )
}

export default SubtopicsPage
