import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Edit3, Trash2, User as UserIcon, Shield, GraduationCap } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { UserApiService } from './UserApiService'
import type { User } from './types'
import { EditUserModal } from './components/EditUserModal'
import { DeleteUserModal } from './components/DeleteUserModal'

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')

  // Modal states
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await UserApiService.findAll()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Error al cargar usuarios')
    } finally {
      setLoading(false)
    }
  }

  const handleUserUpdated = (updatedUser: User) => {
    setUsers(users.map(u => u.__id === updatedUser.__id ? updatedUser : u))
  }

  const handleUserDeleted = (userId: string) => {
    setUsers(users.filter(u => u.__id !== userId))
  }

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    user.name.toLowerCase().includes(searchValue.toLowerCase())
  )

  const columns = [
    {
      key: 'avatar',
      label: 'Usuario',
      render: (user: User) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={user.profilePicture} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      label: 'Rol',
      render: (user: User) => (
        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="flex w-fit items-center gap-1">
          {user.role === 'admin' ? <Shield size={12} /> : <GraduationCap size={12} />}
          {user.role === 'admin' ? 'Admin' : 'Estudiante'}
        </Badge>
      )
    },
    {
      key: 'xp',
      label: 'Progreso',
      render: (user: User) => (
        <div className="text-sm">
          <div className="font-medium text-yellow-600">{user.xp || 0} XP</div>
          <div className="text-xs text-gray-500">
            {user.stats?.totalLessonsCompleted || 0} lecciones
          </div>
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Registrado',
      render: (user: User) => (
        <span className="text-sm text-gray-500">
          {new Date(user.createdAt).toLocaleDateString()}
        </span>
      )
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administra los usuarios registrados en la plataforma</p>
        </div>
      </div>

      <DataTable
        data={filteredUsers.map(u => ({ ...u, id: u.__id }))}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        loading={loading}
        emptyIcon={<UserIcon className="h-12 w-12 text-gray-300" />}
        emptyMessage="No hay usuarios registrados"
        actions={(user) => (
          <>
            <Button variant="ghost" size="icon" onClick={() => setEditingUser(users.find(u => u.__id === user.id) || null)}>
              <Edit3 className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setDeletingUser(users.find(u => u.__id === user.id) || null)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      />

      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {deletingUser && (
        <DeleteUserModal
          isOpen={!!deletingUser}
          onClose={() => setDeletingUser(null)}
          user={deletingUser}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  )
}
