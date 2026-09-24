import { createClient } from '@/core/infrastructure/supabase/server'
import { SupabaseCandidateRepository } from '@/core/infrastructure/repositories/SupabaseCandidateRepository'
import { ReportsView } from '@/components/reports/ReportsView'
import { Sparkles } from 'lucide-react'

export const revalidate = 0

export default async function RelatoriosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const companyId = user?.id || ''

  const [candidates, savedIds, notesMap] = await Promise.all([
    SupabaseCandidateRepository.getAvailableCandidates(),
    SupabaseCandidateRepository.getSavedCandidateIds(companyId),
    SupabaseCandidateRepository.getAllCandidateNotes(companyId),
  ])

  return (
    <div className="space-y-6">
      <div className="print:hidden flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Central de Relatórios
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Relatórios e Exportações em Tempo Real
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gere planilhas em Excel (CSV) ou imprima relatórios PDF com Formatação Corporativa.
          </p>
        </div>
      </div>

      <ReportsView
        realCandidates={candidates}
        savedIds={savedIds}
        notesMap={notesMap}
      />
    </div>
  )
}
