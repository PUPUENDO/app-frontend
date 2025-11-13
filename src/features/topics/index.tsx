import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Lock, CheckCircle2, Circle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { TopicApiService } from './TopicApiService'
import { CourseApiService } from '@/features/courses/CourseApiService'
import type { Topic } from './types'
import type { Course } from '@/features/courses/types'

const TopicsPage: React.FC = () => {
  const { courseId } = useParams({ from: '/dashboard/topics/$courseId' })
  const navigate = useNavigate()
  const [topics, setTopics] = useState<Topic[]>([])
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [courseId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [topicsData, courseData] = await Promise.all([
        TopicApiService.findByCourseId(courseId),
        CourseApiService.findById(courseId)
      ])
      setTopics(topicsData.sort((a, b) => a.order - b.order))
      setCourse(courseData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error al cargar los tópicos')
    } finally {
      setLoading(false)
    }
  }

  const handleTopicClick = (topicId: string) => {
    navigate({ to: `/dashboard/subtopics/${topicId}` })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tópicos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => navigate({ to: '/dashboard/learn' })}
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver a cursos
      </Button>

      {/* Course Header */}
      {course && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.name}</h1>
          <p className="text-gray-600">{course.description}</p>
        </div>
      )}

      {/* Topics Path */}
      <div className="space-y-4">
        {topics.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Circle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay tópicos disponibles
              </h3>
              <p className="text-gray-500">
                Este curso aún no tiene tópicos configurados
              </p>
            </CardContent>
          </Card>
        ) : (
          topics.map((topic, index) => {
            const isFirst = index === 0
            const isLocked = !isFirst // Por ahora, solo el primero está desbloqueado
            const isCompleted = false // TODO: Implementar lógica de progreso

            return (
              <Card
                key={topic.id}
                className={`transition-all ${
                  isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg cursor-pointer'
                }`}
                onClick={() => !isLocked && handleTopicClick(topic.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted 
                            ? 'bg-green-100' 
                            : isLocked 
                            ? 'bg-gray-200' 
                            : 'bg-blue-100'
                        }`}>
                          {isCompleted ? (
                            <CheckCircle2 className="text-green-600" size={20} />
                          ) : isLocked ? (
                            <Lock className="text-gray-400" size={20} />
                          ) : (
                            <Circle className="text-blue-600" size={20} />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{topic.name}</CardTitle>
                          <Badge variant={isCompleted ? 'success' : isLocked ? 'outline' : 'default'}>
                            {isCompleted ? 'Completado' : isLocked ? 'Bloqueado' : 'Disponible'}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="ml-13">
                        {topic.description}
                      </CardDescription>
                    </div>
                    {!isLocked && (
                      <ChevronRight className="text-gray-400 flex-shrink-0" size={24} />
                    )}
                  </div>
                </CardHeader>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

export default TopicsPage
