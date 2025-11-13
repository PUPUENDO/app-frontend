import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { TopicApiService } from '../TopicApiService'
import { createTopicSchema, type CreateTopicForm, type Topic } from '../types'

interface CreateTopicModalProps {
  isOpen: boolean
  onClose: () => void
  onTopicCreated: (topic: Topic) => void
  courseId: string
}

export const CreateTopicModal: React.FC<CreateTopicModalProps> = ({
  isOpen,
  onClose,
  onTopicCreated,
  courseId,
}) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTopicForm>({
    resolver: zodResolver(createTopicSchema),
    defaultValues: {
      courseId,
      order: 0,
    },
  })

  const onSubmit = async (data: CreateTopicForm) => {
    try {
      setLoading(true)
      const newTopic = await TopicApiService.create({ ...data, courseId })
      toast.success('Tópico creado exitosamente')
      onTopicCreated(newTopic)
      reset()
      onClose()
    } catch (error: any) {
      console.error('Error creating topic:', error)
      toast.error(error.response?.data?.message || 'Error al crear el tópico')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      reset()
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Crear Nuevo Tópico">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre del Tópico *
          </label>
          <Input
            id="name"
            placeholder="Ej: Fundamentos de Python"
            {...register('name')}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Descripción *
          </label>
          <Textarea
            id="description"
            placeholder="Describe el contenido del tópico..."
            rows={4}
            {...register('description')}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="order" className="text-sm font-medium text-gray-700">
            Orden *
          </label>
          <Input
            id="order"
            type="number"
            placeholder="0"
            {...register('order', { valueAsNumber: true })}
            disabled={loading}
          />
          {errors.order && (
            <p className="text-sm text-red-600">{errors.order.message}</p>
          )}
          <p className="text-xs text-gray-500">
            Define el orden en que aparecerá este tópico (0, 1, 2, ...)
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando...
              </>
            ) : (
              'Crear Tópico'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
