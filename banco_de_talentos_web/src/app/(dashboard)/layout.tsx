import { createClient } from '@/core/infrastructure/supabase/server'
import { SupabaseAdminRepository } from '@/core/infrastructure/repositories/SupabaseAdminRepository'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const profile = user ? await SupabaseAdminRepository.getCurrentUserProfile(user.id) : null

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans antialiased print:bg-white print:text-black">
      <Sidebar
        userRole={profile?.role || 'company'}
        userName={profile?.full_name || user?.email || 'Empresa Recrutadora'}
      />
      <main className="flex-1 min-w-0 p-6 md:p-8 overflow-y-auto print:p-0 print:overflow-visible">
        <div className="max-w-7xl mx-auto print:max-w-full">
          {children}
        </div>
      </main>
    </div>
  )
}
