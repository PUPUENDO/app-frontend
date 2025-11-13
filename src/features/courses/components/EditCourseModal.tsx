import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { CourseApiService } from '../CourseApiService'
import { updateCourseSchema, type UpdateCourseForm, type Course } from '../types'

interface EditCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onCourseUpdated: (course: Course) => void
  course: Course | null
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  onCourseUpdated,
  course,
}) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateCourseForm>({
    resolver: zodResolver(updateCourseSchema),
  })

  useEffect(() => {
    if (course) {
      reset({
        name: course.name,
        description: course.description,
        imageUrl: course.imageUrl || '',
      })
    }
  }, [course, reset])

  const onSubmit = async (data: UpdateCourseForm) => {
    if (!course) return

    try {
      setLoading(true)
      const updatedCourse = await CourseApiService.update(course.id, data)
      toast.success('Curso actualizado exitosamente')
      onCourseUpdated(updatedCourse)
      onClose()
    } catch (error: any) {
      console.error('Error updating course:', error)
      toast.error(error.response?.data?.message || 'Error al actualizar el curso')
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Editar Curso">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Nombre del Curso
          </label>
          <Input
            id="name"
            placeholder="Ej: Programación en Python"
            {...register('name')}
            disabled={loading}
          />
          {errors.name && (
            <p className="text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-700">
            Descripción
          </label>
          <Textarea
            id="description"
            placeholder="Describe el contenido del curso..."
            rows={4}
            {...register('description')}
            disabled={loading}
          />
          {errors.description && (
            <p className="text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="imageUrl" className="text-sm font-medium text-gray-700">
            URL de Imagen
          </label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://ejemplo.com/imagen.jpg"
            {...register('imageUrl')}
            disabled={loading}
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
          )}
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
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
