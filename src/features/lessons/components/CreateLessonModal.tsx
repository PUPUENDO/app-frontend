import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { LessonApiService } from '../LessonApiService'
import { createLessonSchema, type CreateLessonForm, type Lesson, exerciseTypeLabels } from '../types'

interface CreateLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onLessonCreated: (lesson: Lesson) => void
  topicId: string
  subtopicId: string
}

export const CreateLessonModal: React.FC<CreateLessonModalProps> = ({
  isOpen,
  onClose,
  onLessonCreated,
  topicId,
  subtopicId,
}) => {
  const [loading, setLoading] = useState(false)
  const [hasExercise, setHasExercise] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLessonForm>({
    resolver: zodResolver(createLessonSchema),
    defaultValues: {
      topicId,
      subtopicId,
      order: 0,
    },
  })

  const onSubmit = async (data: CreateLessonForm) => {
    try {
      setLoading(true)
      
      // Construir el objeto exerciseConfig si está habilitado
      const lessonData: CreateLessonForm = {
        ...data,
        topicId,
        subtopicId,
      }

      // Solo agregar exerciseConfig si hasExercise está activado
      if (!hasExercise) {
        delete lessonData.exerciseConfig
      }

      const newLesson = await LessonApiService.create(lessonData)
      toast.success('Lección creada exitosamente')
      onLessonCreated(newLesson)
      reset()
      setHasExercise(false)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la lección')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Lección" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Título de la Lección *</label>
          <Input placeholder="Ej: Introducción a Variables en Python" {...register('title')} disabled={loading} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Contenido (Teoría) *</label>
          <Textarea 
            placeholder="Escribe aquí todo el contenido teórico de la lección:&#10;&#10;Incluye:&#10;- Definiciones y conceptos clave&#10;- Explicaciones detalladas&#10;- Ejemplos prácticos&#10;- Procedimientos paso a paso&#10;&#10;Ejemplo:&#10;Una variable es un espacio de memoria donde se almacena un valor. En Python se declaran sin especificar el tipo: edad = 25" 
            rows={8} 
            {...register('content')} 
            disabled={loading} 
          />
          <p className="text-xs text-gray-500">Escribe el contenido completo en texto plano (el formato se aplicará automáticamente)</p>
          {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Resumen/Descripción Breve (opcional)</label>
          <Textarea 
            placeholder="Ej: Esta lección introduce los conceptos básicos de variables, incluyendo declaración, asignación y tipos de datos." 
            rows={2} 
            {...register('description')} 
            disabled={loading} 
          />
          <p className="text-xs text-gray-500">Breve resumen que aparecerá en las tarjetas de lección</p>
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        {/* Checkbox para agregar ejercicio */}
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="hasExercise"
              checked={hasExercise}
              onChange={(e) => setHasExercise(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="hasExercise" className="text-sm font-medium text-gray-700">
              Agregar ejercicio a esta lección
            </label>
          </div>
        </div>

        {/* Campos de ejercicio (solo si hasExercise es true) */}
        {hasExercise && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900">Configuración del Ejercicio</h3>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tipo de Ejercicio *</label>
              <Select {...register('exerciseConfig.type')} disabled={loading}>
                <option value="">Selecciona un tipo...</option>
                {Object.entries(exerciseTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
              {errors.exerciseConfig?.type && <p className="text-sm text-red-600">{errors.exerciseConfig.type.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Instrucciones del Ejercicio *</label>
              <Textarea 
                placeholder="Describe la tarea específica para el estudiante:&#10;&#10;Ejemplos:&#10;- 'Selecciona la respuesta correcta sobre el concepto de variable'&#10;- 'Completa el código para declarar una variable'&#10;- 'Escribe un pseudocódigo que calcule el promedio de 3 números'&#10;- 'Relaciona cada término con su definición correcta'" 
                rows={4} 
                {...register('exerciseConfig.instructions')} 
                disabled={loading} 
              />
              <p className="text-xs text-gray-500">La IA usará estas instrucciones para generar el ejercicio específico</p>
              {errors.exerciseConfig?.instructions && <p className="text-sm text-red-600">{errors.exerciseConfig.instructions.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Puntos Máximos *</label>
              <Input 
                type="number" 
                placeholder="30" 
                {...register('exerciseConfig.maxPoints', { valueAsNumber: true })} 
                disabled={loading}
                min="1"
                max="100"
              />
              {errors.exerciseConfig?.maxPoints && <p className="text-sm text-red-600">{errors.exerciseConfig.maxPoints.message}</p>}
            </div>

            {/* Nota informativa sobre generación automática */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <strong>✨ Generación Automática:</strong> La inteligencia artificial generará automáticamente las opciones, respuestas correctas y configuraciones específicas del ejercicio basándose en el contenido de la lección y las instrucciones proporcionadas.
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</> : 'Crear Lección'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { EditLessonModal } from './EditLessonModal'
export { DeleteLessonModal } from './DeleteLessonModal'