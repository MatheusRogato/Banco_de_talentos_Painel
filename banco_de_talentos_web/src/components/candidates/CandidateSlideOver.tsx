'use client'

import { useEffect, useState } from 'react'
import { CandidateProfile, CandidateNote } from '@/core/domain/entities/candidate'
import {
  X,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Bookmark,
  Building2,
  ExternalLink,
  MessageCircle,
  FileText,
  ClipboardList,
  Save,
  CheckCircle2,
} from 'lucide-react'

interface CandidateSlideOverProps {
  candidate: CandidateProfile | null
  isSaved: boolean
  initialNote?: CandidateNote | null
  onClose: () => void
  onToggleSave: (candidateId: string) => void
  onSaveNote?: (
    candidateId: string,
    status: 'em_analise' | 'entrevista' | 'aprovado' | 'descartado',
    notes: string
  ) => Promise<void>
}

export function CandidateSlideOver({
  candidate,
  isSaved,
  initialNote,
  onClose,
  onToggleSave,
  onSaveNote,
}: CandidateSlideOverProps) {
  const [status, setStatus] = useState<'em_analise' | 'entrevista' | 'aprovado' | 'descartado'>(
    initialNote?.status || 'em_analise'
  )
  const [notes, setNotes] = useState(initialNote?.notes || '')
  const [isSavingNote, setIsSavingNote] = useState(false)
  const [noteSavedSuccess, setNoteSavedSuccess] = useState(false)

  useEffect(() => {
    if (initialNote) {
      setStatus(initialNote.status || 'em_analise')
      setNotes(initialNote.notes || '')
    } else {
      setStatus('em_analise')
      setNotes('')
    }
  }, [initialNote, candidate?.id])

  useEffect(() => {
    if (candidate) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [candidate])

  if (!candidate) return null

  const formatWhatsAppLink = () => {
    if (!candidate.phone) return null
    const cleanPhone = candidate.phone.replace(/\D/g, '')
    const phoneWithDDI = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`
    const text = encodeURIComponent(
      `Olá ${candidate.full_name}, encontrei seu perfil através do Banco de Talentos e gostaria de conversar sobre oportunidades!`
    )
    return `https://wa.me/${phoneWithDDI}?text=${text}`
  }

  const handleSaveNote = async () => {
    if (!onSaveNote) return
    setIsSavingNote(true)
    setNoteSavedSuccess(false)
    try {
      await onSaveNote(candidate.id, status, notes)
      setNoteSavedSuccess(true)
      setTimeout(() => setNoteSavedSuccess(false), 2500)
    } catch (err) {
      console.error('Erro ao salvar anotação:', err)
    } finally {
      setIsSavingNote(false)
    }
  }

  const whatsappUrl = formatWhatsAppLink()
  const initial = candidate.full_name ? candidate.full_name.charAt(0).toUpperCase() : 'T'

  const statusOptions = [
    { id: 'em_analise', label: 'Em Análise', color: 'border-amber-500/30 text-amber-400 bg-amber-500/10' },
    { id: 'entrevista', label: 'Entrevista', color: 'border-sky-500/30 text-sky-400 bg-sky-500/10' },
    { id: 'aprovado', label: 'Aprovado', color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' },
    { id: 'descartado', label: 'Descartado', color: 'border-rose-500/30 text-rose-400 bg-rose-500/10' },
  ] as const

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
          
          <div className="p-6 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Disponível para contratação
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleSave(candidate.id)}
                  className={`p-2 rounded-xl border transition-all ${
                    isSaved
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800'
                  }`}
                  title={isSaved ? 'Remover dos salvos' : 'Salvar candidato'}
                >
                  <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
                </button>

                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-slate-800 text-white font-bold flex items-center justify-center text-2xl shadow-lg border border-sky-400/20 shrink-0">
                {initial}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {candidate.full_name}
                </h2>
                {candidate.city && (
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {candidate.city}
                  </p>
                )}
                {candidate.phone && (
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    {candidate.phone}
                  </p>
                )}
              </div>
            </div>

            {candidate.sectors && candidate.sectors.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {candidate.sectors.map((ps, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20"
                  >
                    {ps.sector?.name || 'Setor'}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
            {onSaveNote && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ClipboardList className="w-4 h-4" /> Anotações do RH & Pipeline
                  </h3>
                  {noteSavedSuccess && (
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Salvo com sucesso!
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium mb-1.5 block">
                    Etapa no Processo Seletivo:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {statusOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setStatus(opt.id)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          status === opt.id
                            ? opt.color + ' ring-1 ring-amber-500/50 font-bold'
                            : 'border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 font-medium mb-1 block">
                    Anotação Privada da Empresa:
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ex: Bom perfil para recepção noturna, aguardando confirmação de salário..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500/50 resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNote}
                    disabled={isSavingNote}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5" />
                    {isSavingNote ? 'Salvando...' : 'Salvar Anotação'}
                  </button>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Sobre o Candidato
              </h3>
              <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 text-sm text-slate-300 leading-relaxed">
                {candidate.bio || 'Nenhuma biografia informada.'}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-sky-400" />
                Experiências Profissionais
              </h3>

              {candidate.work_experiences && candidate.work_experiences.length > 0 ? (
                <div className="relative pl-6 border-l-2 border-slate-800 space-y-6">
                  {candidate.work_experiences.map((exp) => (
                    <div key={exp.id} className="relative">
                      <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-sky-500 border-4 border-slate-900" />
                      
                      <div className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-bold text-white text-sm">
                              {exp.job_title}
                            </h4>
                            <p className="text-xs text-sky-400 font-medium flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3" /> {exp.company}
                            </p>
                          </div>
                          {exp.is_current && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/20 text-sky-300">
                              Atual
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-2">
                          <Calendar className="w-3 h-3" />
                          {exp.start_date} — {exp.is_current ? 'Presente' : exp.end_date || 'N/I'}
                        </p>

                        {exp.description && (
                          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-950/30 border border-slate-800/60 rounded-xl p-4 text-xs text-slate-500 text-center">
                  Nenhuma experiência profissional cadastrada.
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Cursos & Formação
              </h3>

              {candidate.courses && candidate.courses.length > 0 ? (
                <div className="space-y-3">
                  {candidate.courses.map((course) => (
                    <div
                      key={course.id}
                      className="bg-slate-950/40 border border-slate-800/60 rounded-xl p-3.5 flex items-start justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          {course.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {course.institution}
                        </p>
                      </div>

                      {course.certificate_url && (
                        <a
                          href={course.certificate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 flex items-center gap-1 shrink-0"
                        >
                          <ExternalLink className="w-3 h-3" /> Certificado
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-950/30 border border-slate-800/60 rounded-xl p-4 text-xs text-slate-500 text-center">
                  Nenhum curso cadastrado.
                </div>
              )}
            </div>

          </div>

          <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Contatar via WhatsApp
              </a>
            ) : (
              <button
                disabled
                className="w-full bg-slate-800 text-slate-500 font-semibold py-3 px-4 rounded-xl text-sm opacity-60 cursor-not-allowed flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Telefone para WhatsApp não cadastrado
              </button>
            )}

            {candidate.resume_url ? (
              <a
                href={candidate.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold py-2.5 px-4 rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-xs"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                Baixar Currículo (PDF)
              </a>
            ) : (
              <div className="text-[11px] text-slate-500 text-center py-1">
                Currículo PDF não anexado pelo candidato
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
