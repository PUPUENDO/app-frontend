import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { SubtopicApiService } from '../SubtopicApiService'
import { updateSubtopicSchema, type UpdateSubtopicForm, type Subtopic } from '../types'

interface EditSubtopicModalProps {
  isOpen: boolean
  onClose: () => void
  onSubtopicUpdated: (subtopic: Subtopic) => void
  subtopic: Subtopic | null
}

export const EditSubtopicModal: React.FC<EditSubtopicModalProps> = ({
  isOpen,
  onClose,
  onSubtopicUpdated,
  subtopic,
}) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateSubtopicForm>({
    resolver: zodResolver(updateSubtopicSchema),
  })

  useEffect(() => {
    if (subtopic) {
      reset({
        name: subtopic.name,
        description: subtopic.description,
        order: subtopic.order,
      })
    }
  }, [subtopic, reset])

  const onSubmit = async (data: UpdateSubtopicForm) => {
    if (!subtopic) return

    try {
      setLoading(true)
      const updated = await SubtopicApiService.update(subtopic.id, data)
      toast.success('Subtópico actualizado exitosamente')
      onSubtopicUpdated(updated)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el subtópico')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Subtópico">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nombre del Subtópico</label>
          <Input {...register('name')} disabled={loading} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Descripción</label>
          <Textarea rows={4} {...register('description')} disabled={loading} />
          {errors.description && <p className="text-sm text-red-600">{errors.description.message}</p>}
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
