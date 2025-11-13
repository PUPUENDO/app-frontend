import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronRight, Lock, CheckCircle2, Circle, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { SubtopicApiService } from './SubtopicApiService'
import { TopicApiService } from '@/features/topics/TopicApiService'
import type { Subtopic } from './types'
import type { Topic } from '@/features/topics/types'

const SubtopicsPage: React.FC = () => {
  const { topicId } = useParams({ from: '/dashboard/subtopics/$topicId' })
  const navigate = useNavigate()
  const [subtopics, setSubtopics] = useState<Subtopic[]>([])
  const [topic, setTopic] = useState<Topic | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [topicId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [subtopicsData, topicData] = await Promise.all([
        SubtopicApiService.findByTopicId(topicId),
        TopicApiService.findById(topicId)
      ])
      setSubtopics(subtopicsData.sort((a, b) => a.order - b.order))
      setTopic(topicData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error al cargar los subtópicos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubtopicClick = (subtopicId: string) => {
    navigate({ to: `/dashboard/lessons/${subtopicId}` })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando subtópicos...</p>
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
        onClick={() => navigate({ to: `/dashboard/topics/${topic?.courseId}` })}
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver a tópicos
      </Button>

      {/* Topic Header */}
      {topic && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{topic.name}</h1>
          <p className="text-gray-600">{topic.description}</p>
        </div>
      )}

      {/* Subtopics Path */}
      <div className="space-y-4">
        {subtopics.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Circle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay subtópicos disponibles
              </h3>
              <p className="text-gray-500">
                Este tópico aún no tiene subtópicos configurados
              </p>
            </CardContent>
          </Card>
        ) : (
          subtopics.map((subtopic, index) => {
            const isFirst = index === 0
            const isLocked = !isFirst
            const isCompleted = false

            return (
              <Card
                key={subtopic.id}
                className={`transition-all ${
                  isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-lg cursor-pointer'
                }`}
                onClick={() => !isLocked && handleSubtopicClick(subtopic.id)}
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
                          <CardTitle className="text-xl">{subtopic.name}</CardTitle>
                          <Badge variant={isCompleted ? 'success' : isLocked ? 'outline' : 'default'}>
                            {isCompleted ? 'Completado' : isLocked ? 'Bloqueado' : 'Disponible'}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="ml-13">
                        {subtopic.description}
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

export default SubtopicsPage
