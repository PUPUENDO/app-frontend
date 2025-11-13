import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Send, Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { ExerciseApiService } from './ExerciseApiService'
import { LessonApiService } from '@/features/lessons/LessonApiService'
import type { Exercise, Attempt } from './types'
import type { Lesson } from '@/features/lessons/types'

const ExercisePage: React.FC = () => {
  const { lessonId } = useParams({ from: '/dashboard/lesson/$lessonId/exercise' })
  const navigate = useNavigate()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [validating, setValidating] = useState(false)

  useEffect(() => {
    fetchData()
  }, [lessonId])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [lessonData, exerciseData, attemptData] = await Promise.all([
        LessonApiService.findById(lessonId),
        ExerciseApiService.generateExercise(lessonId),
        ExerciseApiService.getAttemptStatus(lessonId)
      ])
      setLesson(lessonData)
      setExercise(exerciseData)
      setAttempt(attemptData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Error al cargar el ejercicio')
    } finally {
      setLoading(false)
    }
  }

  const handleValidate = async () => {
    if (!answer.trim()) {
      toast.error('Por favor escribe una respuesta')
      return
    }

    try {
      setValidating(true)
      const result = await ExerciseApiService.validateAnswer(lessonId, answer)
      
      if (result.isCorrect) {
        toast.success('¡Respuesta correcta!', {
          description: result.feedback
        })
      } else {
        toast.warning('Intenta nuevamente', {
          description: result.feedback
        })
      }
    } catch (error) {
      console.error('Error validating:', error)
      toast.error('Error al validar la respuesta')
    } finally {
      setValidating(false)
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error('Por favor escribe una respuesta')
      return
    }

    try {
      setSubmitting(true)
      const newAttempt = await ExerciseApiService.submitAnswer(lessonId, { answer })
      setAttempt(newAttempt)
      toast.success('Respuesta enviada', {
        description: 'Tu respuesta está siendo evaluada por IA'
      })
      
      // Poll for result
      pollAttemptStatus()
    } catch (error) {
      console.error('Error submitting:', error)
      toast.error('Error al enviar la respuesta')
    } finally {
      setSubmitting(false)
    }
  }

  const pollAttemptStatus = async () => {
    const maxAttempts = 30 // 30 segundos máximo
    let attempts = 0

    const interval = setInterval(async () => {
      attempts++
      
      try {
        const updatedAttempt = await ExerciseApiService.getAttemptStatus(lessonId)
        
        if (updatedAttempt && updatedAttempt.status !== 'pending') {
          setAttempt(updatedAttempt)
          clearInterval(interval)
          
          if (updatedAttempt.status === 'correct') {
            toast.success('¡Ejercicio completado!', {
              description: `Puntuación: ${updatedAttempt.score}/100`
            })
          } else {
            toast.error('Respuesta incorrecta', {
              description: updatedAttempt.feedback
            })
          }
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(interval)
          toast.info('La evaluación está tomando más tiempo del esperado')
        }
      } catch (error) {
        console.error('Error polling:', error)
        clearInterval(interval)
      }
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando ejercicio...</p>
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
        onClick={() => navigate({ to: `/dashboard/lessons/${lesson?.subtopicId}` })}
      >
        <ArrowLeft size={16} className="mr-2" />
        Volver a lecciones
      </Button>

      {/* Lesson Content */}
      {lesson && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise */}
      {exercise && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Ejercicio Práctico</CardTitle>
              {attempt && (
                <Badge variant={
                  attempt.status === 'correct' ? 'success' : 
                  attempt.status === 'incorrect' ? 'destructive' : 
                  'secondary'
                }>
                  {attempt.status === 'pending' && (
                    <>
                      <Clock size={14} className="mr-1" />
                      Evaluando...
                    </>
                  )}
                  {attempt.status === 'correct' && (
                    <>
                      <CheckCircle2 size={14} className="mr-1" />
                      Correcto
                    </>
                  )}
                  {attempt.status === 'incorrect' && (
                    <>
                      <XCircle size={14} className="mr-1" />
                      Incorrecto
                    </>
                  )}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{exercise.question}</h3>
            </div>

            <Textarea
              placeholder="Escribe tu respuesta aquí..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={6}
              disabled={attempt?.status === 'correct'}
            />

            {attempt?.feedback && attempt.status !== 'pending' && (
              <div className={`p-4 rounded-lg ${
                attempt.status === 'correct' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                <p className="font-medium mb-1">Retroalimentación:</p>
                <p>{attempt.feedback}</p>
                {attempt.score && (
                  <p className="mt-2 font-semibold">Puntuación: {attempt.score}/100</p>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={handleValidate}
                variant="outline"
                disabled={validating || submitting || attempt?.status === 'correct'}
              >
                {validating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Validando...
                  </>
                ) : (
                  'Validar Respuesta'
                )}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={submitting || validating || attempt?.status === 'correct'}
              >
                {submitting || attempt?.status === 'pending' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {submitting ? 'Enviando...' : 'Evaluando...'}
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Enviar Respuesta Final
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default ExercisePage
