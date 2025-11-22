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
    setValue
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
  })

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('role', user.role)
      setValue('profilePicture', user.profilePicture)
      setValue('currentCourseId', user.currentCourseId)
    }
  }, [user, setValue])

  const onSubmit = async (data: UpdateUserForm) => {
    if (!user) return

    try {
      setLoading(true)
      const updated = await UserApiService.update(user.__id, data)
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
          <Input {...register('name')} disabled={loading} />
          {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
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
          <label className="text-sm font-medium text-gray-700">URL de Foto de Perfil</label>
          <Input {...register('profilePicture')} disabled={loading} placeholder="https://..." />
          {errors.profilePicture && <p className="text-sm text-red-600">{errors.profilePicture.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">ID Curso Actual</label>
          <Input {...register('currentCourseId')} disabled={loading} placeholder="Opcional" />
          {errors.currentCourseId && <p className="text-sm text-red-600">{errors.currentCourseId.message}</p>}
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
