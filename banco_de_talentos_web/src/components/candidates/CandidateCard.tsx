'use client'

import { CandidateProfile } from '@/core/domain/entities/candidate'
import { MapPin, Briefcase, ChevronRight, Bookmark } from 'lucide-react'

interface CandidateCardProps {
  candidate: CandidateProfile
  isSaved: boolean
  onSelect: (candidate: CandidateProfile) => void
  onToggleSave: (candidateId: string) => void
}

export function CandidateCard({
  candidate,
  isSaved,
  onSelect,
  onToggleSave,
}: CandidateCardProps) {
  const initial = candidate.full_name ? candidate.full_name.charAt(0).toUpperCase() : 'T'

  const latestExperience = candidate.work_experiences && candidate.work_experiences.length > 0
    ? candidate.work_experiences[0]
    : null

  return (
    <div className="bg-slate-900/90 border border-slate-800 hover:border-sky-500/40 rounded-2xl p-5 shadow-lg hover:shadow-sky-500/5 transition-all duration-200 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-slate-800 text-white font-bold flex items-center justify-center text-lg shadow-inner shrink-0 border border-sky-400/20">
              {initial}
            </div>
            <div>
              <h3 className="font-bold text-white text-base group-hover:text-sky-400 transition-colors leading-snug">
                {candidate.full_name}
              </h3>
              {candidate.city && (
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                  {candidate.city}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave(candidate.id)
            }}
            className={`p-2 rounded-xl transition-all ${
              isSaved
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
            title={isSaved ? 'Remover dos salvos' : 'Salvar candidato'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
          </button>
        </div>

        <div className="mb-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Disponível
          </span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {candidate.bio || 'Profissional em busca ativa de novas oportunidades no mercado.'}
        </p>

        {latestExperience && (
          <div className="mb-4 text-xs text-slate-300 bg-slate-950/40 rounded-xl p-2.5 border border-slate-800/50 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="truncate">
              <strong>{latestExperience.job_title}</strong> na {latestExperience.company}
            </span>
          </div>
        )}

        {candidate.sectors && candidate.sectors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {candidate.sectors.slice(0, 3).map((ps, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20"
              >
                {ps.sector?.name || 'Setor'}
              </span>
            ))}
            {candidate.sectors.length > 3 && (
              <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400">
                +{candidate.sectors.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-slate-800/80">
        <button
          onClick={() => onSelect(candidate)}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-sky-600 text-slate-200 hover:text-white text-xs font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 group/btn"
        >
          <span>Ver Perfil Completo</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-white group-hover/btn:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  )
}
