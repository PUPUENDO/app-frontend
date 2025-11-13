import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { UserApiService } from '../UserApiService'
import { updateUserSchema, type UpdateUserForm, type User } from '../types'

interface EditUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserUpdated: (user: User) => void
  user: User | null
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onUserUpdated,
  user,
}) => {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  })

  useEffect(() => {
    if (user) {
      reset({
        displayName: user.displayName || '',
        role: user.role,
        xp: user.xp,
        level: user.level,
      })
    }
  }, [user, reset])

  const onSubmit = async (data: UpdateUserForm) => {
    if (!user) return

    try {
      setLoading(true)
      const updated = await UserApiService.update(user.id, data)
      toast.success('Usuario actualizado exitosamente')
      onUserUpdated(updated)
      onClose()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al actualizar el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nombre</label>
          <Input {...register('displayName')} disabled={loading} />
          {errors.displayName && <p className="text-sm text-red-600">{errors.displayName.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Rol</label>
          <Select {...register('role')} disabled={loading}>
            <option value="student">Estudiante</option>
            <option value="admin">Administrador</option>
          </Select>
          {errors.role && <p className="text-sm text-red-600">{errors.role.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">XP</label>
          <Input type="number" {...register('xp', { valueAsNumber: true })} disabled={loading} />
          {errors.xp && <p className="text-sm text-red-600">{errors.xp.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Nivel</label>
          <Input type="number" {...register('level', { valueAsNumber: true })} disabled={loading} />
          {errors.level && <p className="text-sm text-red-600">{errors.level.message}</p>}
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
