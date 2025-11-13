import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { LessonApiService } from '../LessonApiService'
import { createLessonSchema, type CreateLessonForm, type Lesson } from '../types'

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
      const newLesson = await LessonApiService.create({ ...data, topicId, subtopicId })
      toast.success('Lección creada exitosamente')
      onLessonCreated(newLesson)
      reset()
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear la lección')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Lección" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Título de la Lección *</label>
          <Input placeholder="Ej: Introducción a Variables" {...register('title')} disabled={loading} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Contenido *</label>
          <Textarea placeholder="Contenido de la lección..." rows={10} {...register('content')} disabled={loading} />
          {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Orden *</label>
          <Input type="number" placeholder="0" {...register('order', { valueAsNumber: true })} disabled={loading} />
          {errors.order && <p className="text-sm text-red-600">{errors.order.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</> : 'Crear Lección'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export { EditLessonModal } from './EditLessonModal'
export { DeleteLessonModal } from './DeleteLessonModal'
