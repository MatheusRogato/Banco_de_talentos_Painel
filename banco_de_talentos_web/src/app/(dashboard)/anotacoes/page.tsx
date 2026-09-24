import { redirect } from 'next/navigation'
import { createClient } from '@/core/infrastructure/supabase/server'
import { SupabaseCandidateRepository } from '@/core/infrastructure/repositories/SupabaseCandidateRepository'
import { SupabaseAdminRepository } from '@/core/infrastructure/repositories/SupabaseAdminRepository'
import { NotesView } from '@/components/notes/NotesView'
import { ClipboardList } from 'lucide-react'

export const revalidate = 0

export default async function AnotacoesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const profile = await SupabaseAdminRepository.getCurrentUserProfile(user.id)
    if (profile?.role === 'admin') {
      redirect('/admin')
    }
  }

  const companyId = user?.id || ''

  const [candidates, savedIds, notesMap] = await Promise.all([
    SupabaseCandidateRepository.getAvailableCandidates(),
    SupabaseCandidateRepository.getSavedCandidateIds(companyId),
    SupabaseCandidateRepository.getAllCandidateNotes(companyId),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center gap-1">
              <ClipboardList className="w-3.5 h-3.5" /> Gestão de Seleção
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Anotações e Gestão de Seleção
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gerencie o histórico de observações privadas, comentários de entrevistas e acompanhe as etapas dos candidatos no seu funil de recrutamento.
          </p>
        </div>
      </div>

      <NotesView
        candidates={candidates}
        savedIds={savedIds}
        notesMap={notesMap}
      />
    </div>
  )
}
