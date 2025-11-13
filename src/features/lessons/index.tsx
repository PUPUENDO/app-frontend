import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Edit3, Trash2, FileText, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { LessonApiService } from './LessonApiService'
import { CreateLessonModal, EditLessonModal, DeleteLessonModal } from './components'
import type { Lesson } from './types'
import { usePermissions } from '@/hooks/use-permissions'
import { CourseApiService } from '@/features/courses/CourseApiService'
import { TopicApiService } from '@/features/topics/TopicApiService'
import { SubtopicApiService } from '@/features/subtopics/SubtopicApiService'
import type { Course } from '@/features/courses/types'
import type { Topic } from '@/features/topics/types'
import type { Subtopic } from '@/features/subtopics/types'

interface LessonsPageProps {
  subtopicId?: string
  topicId?: string
}

const LessonsPage: React.FC<LessonsPageProps> = ({ subtopicId: propsSubtopicId, topicId: propsTopicId }) => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const { isAdmin } = usePermissions()

  // Selectores jerárquicos
  const [courses, setCourses] = useState<Course[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [subtopics, setSubtopics] = useState<Subtopic[]>([])
  
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(propsTopicId || null)
  const [selectedSubtopicId, setSelectedSubtopicId] = useState<string | null>(propsSubtopicId || null)
  
  const [showCourseDropdown, setShowCourseDropdown] = useState(false)
  const [showTopicDropdown, setShowTopicDropdown] = useState(false)
  const [showSubtopicDropdown, setShowSubtopicDropdown] = useState(false)

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    console.log('🚀 LessonsPage montado')
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

  useEffect(() => {
    if (selectedSubtopicId && selectedTopicId) {
      fetchLessons()
    }
  }, [selectedSubtopicId, selectedTopicId])

  const fetchCourses = async () => {
    try {
      const data = await CourseApiService.findAll()
      
      // Calcular totales para cada curso
      if (data && data.length > 0) {
        const coursesWithTotals = await Promise.all(
          data.map(async (course) => {
            try {
              const topics = await TopicApiService.findByCourseId(course.id)
              const totalTopics = topics?.length || 0
              
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
              const subtopics = await SubtopicApiService.findByTopicId(topic.id)
              const totalSubtopics = subtopics?.length || 0
              
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
      const data = await SubtopicApiService.findByTopicId(selectedTopicId)
      
      // Calcular totalLessons para cada subtema
      if (data && data.length > 0) {
        const subtopicsWithTotals = await Promise.all(
          data.map(async (subtopic) => {
            try {
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
      
      if (!selectedSubtopicId && data && data.length > 0) {
        setSelectedSubtopicId(data[0].id)
      }
    } catch (error: any) {
      console.error('❌ Error fetching subtopics:', error)
      toast.error('Error al cargar subtemas')
    }
  }

  const fetchLessons = async () => {
    if (!selectedSubtopicId || !selectedTopicId) {
      console.log('⚠️ No se pueden cargar lecciones: falta subtopicId o topicId')
      console.log('  selectedSubtopicId:', selectedSubtopicId)
      console.log('  selectedTopicId:', selectedTopicId)
      return
    }
    
    try {
      setLoading(true)
      console.log('📡 Llamando a LessonApiService.findBySubtopicId')
      console.log('  subtopicId:', selectedSubtopicId)
      console.log('  topicId:', selectedTopicId)
      
      const data = await LessonApiService.findBySubtopicId(selectedSubtopicId, selectedTopicId)
      
      console.log('✅ Lessons recibidos del backend:', data)
      console.log('  Total de lecciones:', data?.length || 0)
      
      if (data && data.length > 0) {
        console.log('  Primera lección:', data[0])
      }
      
      setLessons(data || [])
    } catch (error: any) {
      console.error('❌ Error fetching lessons:', error)
      console.error('  Error completo:', error.response || error)
      const errorMessage = error.response?.data?.message || error.message || 'Error al cargar lecciones'
      toast.error('Error al cargar lecciones', {
        description: errorMessage
      })
      setLessons([])
    } finally {
      setLoading(false)
    }
  }

  const handleLessonCreated = (newLesson: Lesson) => {
    console.log('✅ Nueva lección creada:', newLesson)
    toast.success('Lección creada exitosamente')
    // Refetch para recalcular totales
    fetchLessons()
    fetchSubtopics() // También actualizar los totales de subtemas
    fetchTopics() // También actualizar los totales de temas
    fetchCourses() // También actualizar los totales de cursos
  }

  const handleLessonUpdated = (updatedLesson: Lesson) => {
    console.log('✅ Lección actualizada:', updatedLesson)
    toast.success('Lección actualizada exitosamente')
    // Refetch para recalcular totales
    fetchLessons()
  }

  const handleLessonDeleted = (lessonId: string) => {
    console.log('✅ Lección eliminada:', lessonId)
    toast.success('Lección eliminada exitosamente')
    // Refetch para recalcular totales
    fetchLessons()
    fetchSubtopics() // También actualizar los totales de subtemas
    fetchTopics() // También actualizar los totales de temas
    fetchCourses() // También actualizar los totales de cursos
  }

  const openEditModal = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setShowEditModal(true)
  }

  const openDeleteModal = (lesson: Lesson) => {
    setSelectedLesson(lesson)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedLesson(null)
  }

  const filteredLessons = lessons.filter(lesson => {
    if (!lesson) return false
    const lessonTitle = lesson.title || ''
    const lessonContent = lesson.content || ''
    const search = searchTerm || ''
    
    return lessonTitle.toLowerCase().includes(search.toLowerCase()) ||
           lessonContent.toLowerCase().includes(search.toLowerCase())
  })

  const selectedCourse = courses.find(c => c.id === selectedCourseId)
  const selectedTopic = topics.find(t => t.id === selectedTopicId)
  const selectedSubtopic = subtopics.find(s => s.id === selectedSubtopicId)
  const courseTopics = topics.filter(t => t.courseId === selectedCourseId)
  const topicSubtopics = subtopics.filter(s => s.topicId === selectedTopicId)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando lecciones...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Lecciones</h1>
          <p className="text-gray-600 mt-2">
            Selecciona un curso, tema y subtema para administrar sus lecciones
          </p>
          {lessons.length > 0 && (
            <p className="text-sm text-gray-500 mt-1">
              Total: {lessons.length} lección{lessons.length !== 1 ? 'es' : ''}
            </p>
          )}
        </div>
        {isAdmin() && selectedSubtopicId && selectedTopicId && (
          <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700" onClick={() => setShowCreateModal(true)}>
            <Plus size={16} />
            Nueva Lección
          </Button>
        )}
      </div>

      {/* Selectores Jerárquicos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* 1️⃣ Selector de Curso */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            1️⃣ Selecciona un Curso
          </label>
          <button
            onClick={() => setShowCourseDropdown(!showCourseDropdown)}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg hover:border-blue-400 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📚</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">
                  {selectedCourse ? selectedCourse.name : 'Seleccionar curso'}
                </div>
                {selectedCourse && (
                  <div className="text-xs text-gray-600">
                    {selectedCourse.totalTopics || 0} temas · {selectedCourse.totalLessons || 0} lecciones
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className={`transform transition-transform ${showCourseDropdown ? 'rotate-180' : ''}`} size={20} />
          </button>

          {showCourseDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
              {courses.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No hay cursos disponibles</div>
              ) : (
                courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => {
                      setSelectedCourseId(course.id)
                      setSelectedTopicId(null)
                      setSelectedSubtopicId(null)
                      setShowCourseDropdown(false)
                    }}
                    className={`w-full p-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 ${
                      selectedCourseId === course.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📚</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{course.name}</h3>
                          {selectedCourseId === course.id && (
                            <Badge className="bg-blue-100 text-blue-700">✓ Seleccionado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{course.description}</p>
                        <div className="flex gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            📑 {course.totalTopics || 0} temas
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            📄 {course.totalLessons || 0} lecciones
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* 2️⃣ Selector de Tema */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2️⃣ Selecciona un Tema
          </label>
          <button
            onClick={() => selectedCourseId && setShowTopicDropdown(!showTopicDropdown)}
            disabled={!selectedCourseId}
            className={`w-full px-4 py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg hover:border-purple-400 transition-all flex items-center justify-between ${
              !selectedCourseId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">
                  {selectedTopic ? selectedTopic.name : selectedCourseId ? 'Seleccionar tema' : 'Primero selecciona un curso'}
                </div>
                {selectedTopic && (
                  <div className="text-xs text-gray-600">
                    {selectedTopic.totalSubtopics || 0} subtemas · {selectedTopic.totalLessons || 0} lecciones
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className={`transform transition-transform ${showTopicDropdown ? 'rotate-180' : ''}`} size={20} />
          </button>

          {showTopicDropdown && selectedCourseId && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
              {courseTopics.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Este curso no tiene temas</div>
              ) : (
                courseTopics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopicId(topic.id)
                      setSelectedSubtopicId(null)
                      setShowTopicDropdown(false)
                    }}
                    className={`w-full p-4 text-left hover:bg-purple-50 transition-colors border-b border-gray-100 ${
                      selectedTopicId === topic.id ? 'bg-purple-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📖</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{topic.name}</h3>
                          {selectedTopicId === topic.id && (
                            <Badge className="bg-purple-100 text-purple-700">✓ Seleccionado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                        <div className="flex gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            📝 {topic.totalSubtopics || 0} subtemas
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            📄 {topic.totalLessons || 0} lecciones
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* 3️⃣ Selector de Subtema */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            3️⃣ Selecciona un Subtema
          </label>
          <button
            onClick={() => selectedTopicId && setShowSubtopicDropdown(!showSubtopicDropdown)}
            disabled={!selectedTopicId}
            className={`w-full px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg hover:border-green-400 transition-all flex items-center justify-between ${
              !selectedTopicId ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">
                  {selectedSubtopic ? selectedSubtopic.name : selectedTopicId ? 'Seleccionar subtema' : 'Primero selecciona un tema'}
                </div>
                {selectedSubtopic && (
                  <div className="text-xs text-gray-600">
                    {selectedSubtopic.totalLessons || 0} lecciones
                  </div>
                )}
              </div>
            </div>
            <ChevronDown className={`transform transition-transform ${showSubtopicDropdown ? 'rotate-180' : ''}`} size={20} />
          </button>

          {showSubtopicDropdown && selectedTopicId && (
            <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
              {topicSubtopics.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Este tema no tiene subtemas</div>
              ) : (
                topicSubtopics.map((subtopic) => (
                  <button
                    key={subtopic.id}
                    onClick={() => {
                      setSelectedSubtopicId(subtopic.id)
                      setShowSubtopicDropdown(false)
                    }}
                    className={`w-full p-4 text-left hover:bg-green-50 transition-colors border-b border-gray-100 ${
                      selectedSubtopicId === subtopic.id ? 'bg-green-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">📝</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{subtopic.name}</h3>
                          {selectedSubtopicId === subtopic.id && (
                            <Badge className="bg-green-100 text-green-700">✓ Seleccionado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{subtopic.description}</p>
                        <div className="flex gap-3 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            📄 {subtopic.totalLessons || 0} lecciones
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar lecciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Lessons Grid */}
      {!selectedSubtopicId || !selectedTopicId ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Selecciona un subtema
            </h3>
            <p className="text-gray-500 mb-4">
              Para ver las lecciones, primero selecciona un curso, un tema y un subtema
            </p>
          </CardContent>
        </Card>
      ) : filteredLessons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron lecciones' : 'No hay lecciones'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? `No hay lecciones que coincidan con "${searchTerm}"` 
                : 'Comienza agregando la primera lección'
              }
            </p>
            {!searchTerm && isAdmin() && (
              <Button className="flex items-center gap-2 mx-auto bg-green-600 hover:bg-green-700" onClick={() => setShowCreateModal(true)}>
                <Plus size={16} />
                Agregar Primera Lección
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <div className="h-32 bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center rounded-t-lg">
                <FileText className="w-16 h-16 text-white opacity-80" />
              </div>
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl line-clamp-1">{lesson.title}</CardTitle>
                  <Badge variant="secondary">#{lesson.order}</Badge>
                </div>
                <CardDescription className="line-clamp-3">
                  {lesson.content ? lesson.content.substring(0, 120) + '...' : 'Sin contenido'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Información adicional */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {lesson.createdAt ? new Date(lesson.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </span>
                  {isAdmin() && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(lesson)}>
                        <Edit3 size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => openDeleteModal(lesson)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modals */}
      {selectedSubtopicId && selectedTopicId && (
        <>
          <CreateLessonModal
            isOpen={showCreateModal}
            onClose={closeModals}
            onLessonCreated={handleLessonCreated}
            topicId={selectedTopicId}
            subtopicId={selectedSubtopicId}
          />

          <EditLessonModal
            isOpen={showEditModal}
            onClose={closeModals}
            onLessonUpdated={handleLessonUpdated}
            lesson={selectedLesson}
          />

          <DeleteLessonModal
            isOpen={showDeleteModal}
            onClose={closeModals}
            onLessonDeleted={handleLessonDeleted}
            lesson={selectedLesson}
          />
        </>
      )}
    </div>
  )
}

export default LessonsPage
