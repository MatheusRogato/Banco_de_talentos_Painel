'use client'

import { Users, Zap, BookmarkCheck, GraduationCap } from 'lucide-react'

interface StatsHeaderProps {
  stats: {
    totalActive: number
    immediateAvailable: number
    savedCount: number
    withCourses: number
  }
}

export function StatsHeader({ stats }: StatsHeaderProps) {
  const cards = [
    {
      title: 'Talentos Ativos',
      value: stats.totalActive,
      description: 'Profissionais cadastrados no banco',
      icon: Users,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    },
    {
      title: 'Disponibilidade Imediata',
      value: stats.immediateAvailable,
      description: 'Prontos para início imediato',
      icon: Zap,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Talentos Salvos (RH)',
      value: stats.savedCount,
      description: 'Favoritados pela sua equipe',
      icon: BookmarkCheck,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Com Cursos/Certificados',
      value: stats.withCourses,
      description: 'Com formação em hotelaria/turismo',
      icon: GraduationCap,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400 font-medium">{card.title}</p>
              <h4 className="text-2xl font-extrabold text-white mt-1">
                {card.value}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {card.description}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        )
      })}
    </div>
  )
}
