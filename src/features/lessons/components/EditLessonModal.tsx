import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { LessonApiService } from '../LessonApiService'
import { updateLessonSchema, type UpdateLessonForm, type Lesson } from '../types'

interface EditLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onLessonUpdated: (lesson: Lesson) => void
  lesson: Lesson | null
}

export const EditLessonModal: React.FC<EditLessonModalProps> = ({
  isOpen,
  onClose,
  onLessonUpdated,
  lesson,
}) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateLessonForm>({
    resolver: zodResolver(updateLessonSchema),
  })

  useEffect(() => {
    if (lesson) {
      reset({
        title: lesson.title,
        content: lesson.content,
        order: lesson.order,
      })
    }
  }, [lesson, reset])

  const onSubmit = async (data: UpdateLessonForm) => {
    if (!lesson) return

    try {
      setLoading(true)
      const updated = await LessonApiService.update(lesson.id, data)
      toast.success('Lección actualizada exitosamente')
      onLessonUpdated(updated)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar la lección')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Lección" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Título de la Lección</label>
          <Input {...register('title')} disabled={loading} />
          {errors.title && <p className="text-sm text-red-600">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Contenido</label>
          <Textarea rows={10} {...register('content')} disabled={loading} />
          {errors.content && <p className="text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Orden</label>
          <Input type="number" {...register('order', { valueAsNumber: true })} disabled={loading} />
          {errors.order && <p className="text-sm text-red-600">{errors.order.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</> : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
