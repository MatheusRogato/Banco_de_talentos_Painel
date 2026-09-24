import { SettingsView } from '@/components/settings/SettingsView'
import { Settings } from 'lucide-react'

export const revalidate = 0

export default async function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center gap-1">
              <Settings className="w-3.5 h-3.5" /> Preferências do Sistema
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configurações & Suporte
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Personalize a aparência do painel (Dark/Light mode), gerencie notificações e envie mensagens diretas para a equipe de suporte.
          </p>
        </div>
      </div>

      <SettingsView />
    </div>
  )
}
