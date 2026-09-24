import { redirect } from 'next/navigation'
import { createClient } from '@/core/infrastructure/supabase/server'
import { SupabaseAdminRepository } from '@/core/infrastructure/repositories/SupabaseAdminRepository'
import { AdminView } from '@/components/admin/AdminView'
import { ShieldCheck } from 'lucide-react'

export const revalidate = 0

export default async function AdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profile = await SupabaseAdminRepository.getCurrentUserProfile(user.id)
  if (profile?.role !== 'admin') {
    redirect('/')
  }

  const [allUsers, supportMessages, metrics] = await Promise.all([
    SupabaseAdminRepository.getAllUsers(),
    SupabaseAdminRepository.getAllSupportMessages(),
    SupabaseAdminRepository.getAdminDashboardMetrics(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Controle Super Admin Master
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Painel de Administração Master
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Gerencie todas as contas de usuários, acompanhe métricas de uso inteligente, chamados de suporte e controle assinaturas.
          </p>
        </div>
      </div>

      <AdminView users={allUsers} supportMessages={supportMessages} metrics={metrics} />
    </div>
  )
}
