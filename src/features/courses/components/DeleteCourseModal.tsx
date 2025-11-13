import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { CourseApiService } from '../CourseApiService'
import type { Course } from '../types'

interface DeleteCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onCourseDeleted: (courseId: string) => void
  course: Course | null
}

export const DeleteCourseModal: React.FC<DeleteCourseModalProps> = ({
  isOpen,
  onClose,
  onCourseDeleted,
  course,
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!course) return

    try {
      setLoading(true)
      await CourseApiService.delete(course.id)
      toast.success('Curso eliminado exitosamente')
      onCourseDeleted(course.id)
      onClose()
    } catch (error: any) {
      console.error('Error deleting course:', error)
      toast.error(error.response?.data?.message || 'Error al eliminar el curso')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Curso" size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">
              ¿Estás seguro que deseas eliminar este curso?
            </p>
            <p className="text-sm text-red-700 mt-1">
              Esta acción no se puede deshacer. Se eliminarán todos los tópicos, subtópicos y lecciones asociadas.
            </p>
          </div>
        </div>

        {course && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{course.name}</p>
            <p className="text-sm text-gray-600 mt-1">{course.description}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Eliminando...
              </>
            ) : (
              'Eliminar Curso'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
