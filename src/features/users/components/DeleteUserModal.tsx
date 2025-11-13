import React, { useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { UserApiService } from '../UserApiService'
import type { User } from '../types'

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserDeleted: (userId: string) => void
  user: User | null
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onUserDeleted,
  user,
}) => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!user) return

    try {
      setLoading(true)
      await UserApiService.delete(user.id)
      toast.success('Usuario eliminado exitosamente')
      onUserDeleted(user.id)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Usuario" size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">¿Estás seguro que deseas eliminar este usuario?</p>
            <p className="text-sm text-red-700 mt-1">Esta acción no se puede deshacer.</p>
          </div>
        </div>

        {user && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900">{user.displayName || user.email}</p>
            <p className="text-sm text-gray-600 mt-1">{user.email}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Cancelar</Button>
          <Button type="button" variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Eliminando...</> : 'Eliminar Usuario'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
