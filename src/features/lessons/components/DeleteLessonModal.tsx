import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { LessonApiService } from '../LessonApiService'
import type { Lesson } from '../types'

interface DeleteLessonModalProps {
  isOpen: boolean
  onClose: () => void
  onLessonDeleted: (lessonId: string) => void
  lesson: Lesson | null
}

export const DeleteLessonModal: React.FC<DeleteLessonModalProps> = ({
  isOpen,
  onClose,
  onLessonDeleted,
  lesson,
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!lesson) return

    try {
      setLoading(true)
      await LessonApiService.delete(lesson.id)
      toast.success('Lección eliminada exitosamente')
      onLessonDeleted(lesson.id)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar la lección')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Lección" size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">¿Estás seguro que deseas eliminar esta lección?</p>
            <p className="text-sm text-red-700 mt-1">Se eliminarán todos los ejercicios asociados.</p>
          </div>
        </div>

        {lesson && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{lesson.content}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Eliminando...</> : 'Eliminar Lección'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
