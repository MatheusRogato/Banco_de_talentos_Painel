import { redirect } from 'next/navigation'
import { createClient } from '@/core/infrastructure/supabase/server'
import { SupabaseCandidateRepository } from '@/core/infrastructure/repositories/SupabaseCandidateRepository'
import { SupabaseAdminRepository } from '@/core/infrastructure/repositories/SupabaseAdminRepository'
import { CandidateGrid } from '@/components/candidates/CandidateGrid'
import { StatsHeader } from '@/components/dashboard/StatsHeader'
import { Sparkles } from 'lucide-react'

export const revalidate = 0

export default async function DashboardPage() {
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

  const [candidates, sectors, savedIds, notesMap, stats] = await Promise.all([
    SupabaseCandidateRepository.getAvailableCandidates(),
    SupabaseCandidateRepository.getAllSectors(),
    SupabaseCandidateRepository.getSavedCandidateIds(companyId),
    SupabaseCandidateRepository.getAllCandidateNotes(companyId),
    SupabaseCandidateRepository.getDashboardStats(companyId),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Painel Administrativo
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Banco de Talentos Disponíveis
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore perfis qualificados, filtre por setor/cidade e entre em contato direto via WhatsApp.
          </p>
        </div>
      </div>

      <StatsHeader stats={stats} />

      <CandidateGrid
        initialCandidates={candidates}
        sectors={sectors}
        initialSavedIds={savedIds}
        initialNotesMap={notesMap}
      />
    </div>
  )
}
