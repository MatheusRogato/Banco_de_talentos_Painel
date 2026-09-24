'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/providers/ThemeProvider'
import { logoutAction } from '@/app/(auth)/login/actions'
import { Users, Bookmark, LogOut, Building2, Sparkles, FileSpreadsheet, ClipboardList, Settings, ShieldCheck, Sun, Moon } from 'lucide-react'

interface SidebarProps {
  userRole?: string
  userName?: string
}

export function Sidebar({ userRole = 'company', userName = 'Empresa Recrutadora' }: SidebarProps) {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const navItems = userRole === 'admin'
    ? [
        {
          name: 'Painel Admin Master',
          href: '/admin',
          icon: ShieldCheck,
        },
        {
          name: 'Relatórios Corporativos',
          href: '/relatorios',
          icon: FileSpreadsheet,
        },
        {
          name: 'Configurações',
          href: '/configuracoes',
          icon: Settings,
        },
      ]
    : [
        {
          name: 'Buscar Talentos',
          href: '/',
          icon: Users,
        },
        {
          name: 'Favoritos',
          href: '/favoritos',
          icon: Bookmark,
        },
        {
          name: 'Anotações & Gestão',
          href: '/anotacoes',
          icon: ClipboardList,
        },
        {
          name: 'Relatórios',
          href: '/relatorios',
          icon: FileSpreadsheet,
        },
        {
          name: 'Configurações',
          href: '/configuracoes',
          icon: Settings,
        },
      ]

  return (
    <aside className="print:hidden w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div>
        <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight">
                Banco de Talentos
              </h2>
              <span className="text-[11px] text-sky-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Painel Administrativo
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Mudar para Light Mode' : 'Mudar para Dark Mode'}
            className="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
          </button>
        </div>

        <nav className="p-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Navegação Principal
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="px-3 py-2 rounded-xl bg-slate-950/50 border border-slate-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-xs">
            {userRole === 'admin' ? 'ADM' : 'RH'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {userName}
            </p>
            <p className="text-[11px] text-sky-400 font-medium truncate">
              {userRole === 'admin' ? 'Super Admin Master' : 'Plano Corporativo'}
            </p>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all group"
          >
            <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" />
            <span>Sair da Conta</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
