import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { SubtopicApiService } from '../SubtopicApiService'
import type { Subtopic } from '../types'

interface DeleteSubtopicModalProps {
  isOpen: boolean
  onClose: () => void
  onSubtopicDeleted: (subtopicId: string) => void
  subtopic: Subtopic | null
}

export const DeleteSubtopicModal: React.FC<DeleteSubtopicModalProps> = ({
  isOpen,
  onClose,
  onSubtopicDeleted,
  subtopic,
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!subtopic) return

    try {
      setLoading(true)
      await SubtopicApiService.delete(subtopic.id)
      toast.success('Subtópico eliminado exitosamente')
      onSubtopicDeleted(subtopic.id)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar el subtópico')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Subtópico" size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">¿Estás seguro que deseas eliminar este subtópico?</p>
            <p className="text-sm text-red-700 mt-1">Se eliminarán todas las lecciones asociadas.</p>
          </div>
        </div>

        {subtopic && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{subtopic.name}</p>
            <p className="text-sm text-gray-600 mt-1">{subtopic.description}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Eliminando...</> : 'Eliminar Subtópico'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
