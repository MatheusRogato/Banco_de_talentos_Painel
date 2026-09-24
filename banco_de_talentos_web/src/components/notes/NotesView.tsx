'use client'

import { useState, useMemo } from 'react'
import { CandidateProfile, CandidateNote } from '@/core/domain/entities/candidate'
import { CandidateModal } from '@/components/candidates/CandidateModal'
import { toggleFavoriteAction, saveCandidateNoteAction } from '@/app/(dashboard)/actions'
import {
  ClipboardList,
  User,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
} from 'lucide-react'

interface NotesViewProps {
  candidates: CandidateProfile[]
  savedIds?: string[]
  notesMap?: Record<string, CandidateNote>
}

export function NotesView({
  candidates,
  savedIds = [],
  notesMap: initialNotesMap = {},
}: NotesViewProps) {
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>(savedIds)
  const [notesMap, setNotesMap] = useState<Record<string, CandidateNote>>(initialNotesMap)
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all')
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null)

  const statusConfig = {
    em_analise: {
      label: 'Em Análise',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    entrevista: {
      label: 'Entrevista',
      icon: Calendar,
      color: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    },
    aprovado: {
      label: 'Aprovado',
      icon: UserCheck,
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    descartado: {
      label: 'Descartado',
      icon: UserX,
      color: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
  } as const

  const annotatedCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const note = notesMap[c.id]
      if (!note) return false
      if (selectedStatusFilter === 'all') return true
      return note.status === selectedStatusFilter
    })
  }, [candidates, notesMap, selectedStatusFilter])

  const toggleSave = async (candidateId: string) => {
    const isCurrentlySaved = savedCandidateIds.includes(candidateId)
    if (isCurrentlySaved) {
      setSavedCandidateIds((prev) => prev.filter((id) => id !== candidateId))
    } else {
      setSavedCandidateIds((prev) => [...prev, candidateId])
    }

    try {
      await toggleFavoriteAction(candidateId)
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error)
    }
  }

  const handleSaveNote = async (
    candidateId: string,
    status: 'em_analise' | 'entrevista' | 'aprovado' | 'descartado',
    notes: string
  ) => {
    await saveCandidateNoteAction(candidateId, status, notes)
    setNotesMap((prev) => ({
      ...prev,
      [candidateId]: {
        company_profile_id: '',
        candidate_profile_id: candidateId,
        status,
        notes,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filtrar Etapa:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              selectedStatusFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm font-bold'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todas as Anotações ({Object.keys(notesMap).length})
          </button>
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = Object.values(notesMap).filter((n) => n.status === key).length
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedStatusFilter(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  selectedStatusFilter === key
                    ? cfg.color + ' font-bold ring-1 ring-amber-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cfg.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {annotatedCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {annotatedCandidates.map((candidate) => {
            const note = notesMap[candidate.id]
            const cfg = note?.status ? statusConfig[note.status] : statusConfig.em_analise
            const StatusIcon = cfg.icon

            return (
              <div
                key={candidate.id}
                onClick={() => setSelectedCandidate(candidate)}
                className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 shadow-lg hover:shadow-amber-500/5 transition-all duration-200 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-inner shrink-0 border border-amber-400/20">
                        {candidate.full_name ? candidate.full_name.charAt(0).toUpperCase() : 'T'}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                          {candidate.full_name}
                        </h3>
                        {candidate.city && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            {candidate.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 shrink-0 ${cfg.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>

                  <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 mb-4 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <ClipboardList className="w-3 h-3 text-amber-400" /> Anotações
                    </span>
                    <p className="text-xs text-slate-300 italic line-clamp-3 leading-relaxed">
                      "{note?.notes || 'Sem anotações de texto informadas.'}"
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-amber-300 font-semibold transition-colors">
                  <span>Ver / Editar Anotação</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
            <ClipboardList className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Nenhuma anotação encontrada</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nenhum candidato possui anotações registradas nesta etapa. Acesse a busca de talentos e abra o perfil de um candidato para adicionar notas e acompanhar o funil de seleção.
          </p>
        </div>
      )}

      <CandidateModal
        candidate={selectedCandidate}
        isSaved={selectedCandidate ? savedCandidateIds.includes(selectedCandidate.id) : false}
        initialNote={selectedCandidate ? notesMap[selectedCandidate.id] : null}
        onClose={() => setSelectedCandidate(null)}
        onToggleSave={toggleSave}
        onSaveNote={handleSaveNote}
      />
    </div>
  )
}
