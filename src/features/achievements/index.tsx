import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Trophy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'

import { AchievementApiService } from './AchievementApiService'
import {
  type Achievement,
  type CreateAchievementForm,
  createAchievementSchema,
  achievementRarityEnum,
  conditionTypeEnum
} from './types'

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-300',
  special: 'bg-blue-100 text-blue-800 border-blue-300',
  epic: 'bg-purple-100 text-purple-800 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}

const rarityLabels = {
  common: 'Común',
  special: 'Especial',
  epic: 'Épico',
  legendary: 'Legendario',
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<CreateAchievementForm>({
    resolver: zodResolver(createAchievementSchema)
  })

  useEffect(() => {
    fetchAchievements()
  }, [])

  useEffect(() => {
    if (editingAchievement) {
      setValue('title', editingAchievement.title)
      setValue('description', editingAchievement.description)
      setValue('rarity', editingAchievement.rarity)
      setValue('icon', editingAchievement.icon)
      setValue('condition.type', editingAchievement.condition.type)
      setValue('condition.value', editingAchievement.condition.value)
    } else {
      reset()
    }
  }, [editingAchievement, setValue, reset])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const data = await AchievementApiService.findAll()
      setAchievements(data)
    } catch (error) {
      console.error('Error fetching achievements:', error)
      toast.error('Error al cargar logros')
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: CreateAchievementForm) => {
    try {
      if (editingAchievement) {
        await AchievementApiService.update(editingAchievement.id, data)
        toast.success('Logro actualizado correctamente')
      } else {
        await AchievementApiService.create(data)
        toast.success('Logro creado correctamente')
      }
      setIsModalOpen(false)
      setEditingAchievement(null)
      fetchAchievements()
    } catch (error) {
      console.error('Error saving achievement:', error)
      toast.error('Error al guardar el logro')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este logro?')) return

    try {
      await AchievementApiService.delete(id)
      toast.success('Logro eliminado correctamente')
      fetchAchievements()
    } catch (error) {
      console.error('Error deleting achievement:', error)
      toast.error('Error al eliminar el logro')
    }
  }

  const openCreateModal = () => {
    setEditingAchievement(null)
    reset()
    setIsModalOpen(true)
  }

  const openEditModal = (achievement: Achievement) => {
    setEditingAchievement(achievement)
    setIsModalOpen(true)
  }

  const filteredAchievements = achievements.filter(a =>
    a.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    a.description?.toLowerCase().includes(searchValue.toLowerCase())
  )

  const columns = [
    {
      key: 'icon',
      label: 'Icono',
      width: '60px',
      render: (item: Achievement) => <span className="text-2xl">{item.icon || '🏆'}</span>
    },
    {
      key: 'title',
      label: 'Título',
      render: (item: Achievement) => (
        <div>
          <div className="font-medium">{item.title}</div>
          <div className="text-xs text-gray-500">{item.description}</div>
        </div>
      )
    },
    {
      key: 'rarity',
      label: 'Rareza',
      render: (item: Achievement) => (
        <Badge variant="outline" className={rarityColors[item.rarity]}>
          {rarityLabels[item.rarity]}
        </Badge>
      )
    },
    {
      key: 'points',
      label: 'Puntos',
      render: (item: Achievement) => <span className="font-medium text-yellow-600">{item.points} XP</span>
    },
    {
      key: 'condition',
      label: 'Condición',
      render: (item: Achievement) => (
        <div className="text-xs">
          <span className="font-semibold">{item.condition.type}</span>: {item.condition.value}
        </div>
      )
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Logros</h1>
          <p className="text-gray-500">Administra los logros disponibles para los estudiantes</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Logro
        </Button>
      </div>

      <DataTable
        data={filteredAchievements}
        columns={columns}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        loading={loading}
        emptyIcon={<Trophy className="h-12 w-12 text-gray-300" />}
        emptyMessage="No hay logros registrados"
        actions={(item) => (
          <>
            <Button variant="ghost" size="icon" onClick={() => openEditModal(item)}>
              <Pencil className="h-4 w-4 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </>
        )}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAchievement ? 'Editar Logro' : 'Crear Nuevo Logro'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input {...register('title')} placeholder="Ej: Primeros Pasos" />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Icono (Emoji)</label>
              <Input {...register('icon')} placeholder="Ej: 🚀" />
              {errors.icon && <p className="text-red-500 text-xs">{errors.icon.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <Input {...register('description')} placeholder="Descripción del logro..." />
            {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Rareza</label>
              <select
                {...register('rarity')}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {achievementRarityEnum.options.map(option => (
                  <option key={option} value={option}>{rarityLabels[option as keyof typeof rarityLabels]}</option>
                ))}
              </select>
              {errors.rarity && <p className="text-red-500 text-xs">{errors.rarity.message}</p>}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold mb-3">Condición de Desbloqueo</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Condición</label>
                <select
                  {...register('condition.type')}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {conditionTypeEnum.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.condition?.type && <p className="text-red-500 text-xs">{errors.condition.type.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Valor Objetivo</label>
                <Input
                  {...register('condition.value', {
                    setValueAs: v => !isNaN(Number(v)) ? Number(v) : v
                  })}
                  placeholder="Ej: 10, course_id, etc."
                />
                {errors.condition?.value && <p className="text-red-500 text-xs">{errors.condition.value.message}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
