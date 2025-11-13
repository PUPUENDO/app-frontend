import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, Lock, Star } from 'lucide-react'
import { toast } from 'sonner'
import { AchievementApiService } from './AchievementApiService'
import type { Achievement } from './types'

const rarityColors = {
  common: 'bg-gray-100 text-gray-800 border-gray-300',
  rare: 'bg-blue-100 text-blue-800 border-blue-300',
  epic: 'bg-purple-100 text-purple-800 border-purple-300',
  legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
}

const rarityLabels = {
  common: 'Común',
  rare: 'Raro',
  epic: 'Épico',
  legendary: 'Legendario',
}

const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    fetchAchievements()
  }, [])

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

  const filteredAchievements = filter === 'all' 
    ? achievements 
    : achievements.filter(a => a.rarity === filter)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando logros...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🏆 Tus Logros
        </h1>
        <p className="text-gray-600">
          Desbloquea logros mientras aprendes y gana recompensas
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        <Badge
          variant={filter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('all')}
        >
          Todos
        </Badge>
        <Badge
          variant={filter === 'common' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('common')}
        >
          Común
        </Badge>
        <Badge
          variant={filter === 'rare' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('rare')}
        >
          Raro
        </Badge>
        <Badge
          variant={filter === 'epic' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('epic')}
        >
          Épico
        </Badge>
        <Badge
          variant={filter === 'legendary' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setFilter('legendary')}
        >
          Legendario
        </Badge>
      </div>

      {/* Achievements Grid */}
      {filteredAchievements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay logros disponibles
            </h3>
            <p className="text-gray-500">
              Los logros aparecerán a medida que completes lecciones
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => {
            const isUnlocked = false // TODO: Implementar lógica de logros desbloqueados

            return (
              <Card
                key={achievement.id}
                className={`relative overflow-hidden transition-all ${
                  isUnlocked ? 'hover:shadow-lg' : 'opacity-60'
                } border-2 ${rarityColors[achievement.rarity]}`}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="text-gray-400" size={20} />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-4xl">{achievement.icon}</div>
                    <Badge variant="outline" className={rarityColors[achievement.rarity]}>
                      {rarityLabels[achievement.rarity]}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{achievement.name}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star className="text-yellow-500" size={16} />
                    <span>{achievement.xpReward} XP</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default AchievementsPage
