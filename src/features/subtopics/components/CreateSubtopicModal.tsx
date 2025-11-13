import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SubtopicApiService } from '../SubtopicApiService'
import { createSubtopicSchema, type CreateSubtopicForm, type Subtopic } from '../types'

interface CreateSubtopicModalProps {
  isOpen: boolean
  onClose: () => void
  onSubtopicCreated: (subtopic: Subtopic) => void
  topicId: string
}

export const CreateSubtopicModal: React.FC<CreateSubtopicModalProps> = ({
  isOpen,
  onClose,
  onSubtopicCreated,
  topicId,
}) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSubtopicForm>({
    resolver: zodResolver(createSubtopicSchema),
    defaultValues: {
      topicId,
      order: 0,
    },
  })

  const onSubmit = async (data: CreateSubtopicForm) => {
    try {
      setLoading(true)
      const newSubtopic = await SubtopicApiService.create({ ...data, topicId })
      toast.success('Subtópico creado exitosamente')
      onSubtopicCreated(newSubtopic)
      reset()
      onClose()
    } catch (error: any) {
      console.error('Error creating subtopic:', error)
      toast.error(error.response?.data?.message || 'Error al crear el subtópico')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Subtópico">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nombre del Subtópico *</label>
          <Input placeholder="Ej: Variables y Tipos de Datos" {...register('name')} disabled={loading} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Descripción *</label>
          <Textarea placeholder="Describe el contenido..." rows={4} {...register('description')} disabled={loading} />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Orden *</label>
          <Input type="number" placeholder="0" {...register('order', { valueAsNumber: true })} disabled={loading} />
          {errors.order && <p className="text-sm text-red-600">{errors.order.message}</p>}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creando...</> : 'Crear Subtópico'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
