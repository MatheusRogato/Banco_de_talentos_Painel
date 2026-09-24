'use client'

import { useState } from 'react'
import { CandidateProfile, SupportMessage } from '@/core/domain/entities/candidate'
import { updateUserRoleAction, toggleBlockUserAction, updateSupportStatusAction } from '@/app/(dashboard)/actions'
import {
  Users,
  ShieldCheck,
  Ban,
  CheckCircle2,
  MessageSquare,
  CreditCard,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Sparkles,
  Building2,
  Bookmark,
  ClipboardList,
  Check,
  Zap,
} from 'lucide-react'

interface AdminMetrics {
  totalUsers: number
  candidatesCount: number
  companiesCount: number
  adminsCount: number
  blockedCount: number
  activeRecruitersCount: number
  planInterestCount: number
  openSupportCount: number
  topRecruiters: Array<{
    id: string
    name: string
    role: string
    savedCount: number
    notesCount: number
    totalActions: number
  }>
  pipelineStats: {
    em_analise: number
    entrevista: number
    aprovado: number
    descartado: number
  }
}

interface AdminViewProps {
  users: CandidateProfile[]
  supportMessages: SupportMessage[]
  metrics?: AdminMetrics
}

export function AdminView({
  users: initialUsers,
  supportMessages: initialMessages,
  metrics,
}: AdminViewProps) {
  const [users, setUsers] = useState<CandidateProfile[]>(initialUsers)
  const [messages, setMessages] = useState<SupportMessage[]>(initialMessages)
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'support' | 'plans'>('analytics')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [searchUser, setSearchUser] = useState('')

  const candidatesCount = users.filter((u) => u.role === 'candidate').length
  const companiesCount = users.filter((u) => u.role === 'company').length
  const adminsCount = users.filter((u) => u.role === 'admin').length
  const blockedCount = users.filter((u) => u.is_blocked).length

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false
    if (searchUser.trim() !== '') {
      const q = searchUser.toLowerCase()
      const matchesName = u.full_name?.toLowerCase().includes(q) || false
      const matchesDoc = u.document_id?.toLowerCase().includes(q) || false
      if (!matchesName && !matchesDoc) return false
    }
    return true
  })

  const handleRoleChange = async (userId: string, newRole: 'candidate' | 'company' | 'admin') => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    )
    try {
      await updateUserRoleAction(userId, newRole)
    } catch (err) {
      console.error('Erro ao atualizar papel do usuário:', err)
    }
  }

  const handleToggleBlock = async (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_blocked: !u.is_blocked } : u))
    )
    try {
      await toggleBlockUserAction(userId)
    } catch (err) {
      console.error('Erro ao alterar bloqueio:', err)
    }
  }

  const handleSupportStatus = async (id: string, status: 'aberto' | 'em_atendimento' | 'resolvido') => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    )
    try {
      await updateSupportStatusAction(id, status)
    } catch (err) {
      console.error('Erro ao atualizar chamado:', err)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Abas de Navegação Admin */}
      <div className="flex flex-wrap border-b border-slate-800 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'analytics'
              ? 'border-sky-400 text-sky-400 font-bold scale-[1.02]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-sky-400" />
          Dashboard & Métricas Inteligentes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'border-sky-400 text-sky-400 font-bold scale-[1.02]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Gestão de Usuários ({users.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('support')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'support'
              ? 'border-purple-400 text-purple-400 font-bold scale-[1.02]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-purple-400" />
          Suporte & Chamados ({messages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`pb-3 px-4 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'plans'
              ? 'border-amber-400 text-amber-400 font-bold scale-[1.02]'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <CreditCard className="w-4 h-4 text-amber-400" />
          Planos & Assinaturas
        </button>
      </div>

      {/* ABA 1: DASHBOARD & MÉTRICAS INTELIGENTES */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Base Total de Usuários</p>
                  <h3 className="text-2xl font-black text-white mt-1">{users.length}</h3>
                  <p className="text-[11px] text-sky-400 font-medium mt-1">
                    {companiesCount} Empresas • {candidatesCount} Candidatos
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-inner">
                  <Users className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Recrutadores Ativos</p>
                  <h3 className="text-2xl font-black text-emerald-400 mt-1">
                    {metrics?.activeRecruitersCount || companiesCount}
                  </h3>
                  <p className="text-[11px] text-emerald-400/80 font-medium mt-1">
                    Movimentando processos seletivos
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interesse Plano Plus</p>
                  <h3 className="text-2xl font-black text-amber-400 mt-1">
                    {metrics?.planInterestCount || 1}
                  </h3>
                  <p className="text-[11px] text-amber-400/80 font-medium mt-1">
                    Empresas prontas para upgrade
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                  <Zap className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Contas Bloqueadas</p>
                  <h3 className="text-2xl font-black text-rose-400 mt-1">{blockedCount}</h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-1">
                    Contas suspensas por segurança
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-inner">
                  <Ban className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Recrutadores Mais Ativos & Funil Corporativo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recrutadores mais Ativos */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-sky-400" />
                  Recrutadores / RHs Mais Ativos
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-0.5 rounded-full">
                  Engajamento
                </span>
              </div>

              {metrics?.topRecruiters && metrics.topRecruiters.length > 0 ? (
                <div className="space-y-3 pt-1">
                  {metrics.topRecruiters.map((recruiter, idx) => (
                    <div
                      key={recruiter.id}
                      className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 text-sky-400 font-extrabold flex items-center justify-center text-xs">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{recruiter.name}</p>
                          <p className="text-xs text-slate-400 font-normal">Recrutador Corporativo</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-300 flex items-center gap-1">
                          <Bookmark className="w-3.5 h-3.5 text-amber-400" /> {recruiter.savedCount} salvos
                        </span>
                        <span className="text-slate-300 flex items-center gap-1">
                          <ClipboardList className="w-3.5 h-3.5 text-emerald-400" /> {recruiter.notesCount} anotações
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 text-xs text-slate-400 text-center">
                  Base de engajamento de recrutadores sendo monitorada em tempo real.
                </div>
              )}
            </div>

            {/* Funil de Seleção Globais */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Métricas Globais do Funil de Seleção
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">
                  Status Talentos
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Em Análise</span>
                  <p className="text-2xl font-black text-white">{metrics?.pipelineStats.em_analise || 0}</p>
                  <p className="text-[11px] text-slate-400">Triagem Inicial RH</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Em Entrevista</span>
                  <p className="text-2xl font-black text-white">{metrics?.pipelineStats.entrevista || 0}</p>
                  <p className="text-[11px] text-slate-400">Convocação Agendada</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Aprovados</span>
                  <p className="text-2xl font-black text-white">{metrics?.pipelineStats.aprovado || 0}</p>
                  <p className="text-[11px] text-slate-400">Contratação Concluída</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Descartados</span>
                  <p className="text-2xl font-black text-white">{metrics?.pipelineStats.descartado || 0}</p>
                  <p className="text-[11px] text-slate-400">Banco Futuro</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA 2: GESTÃO DE USUÁRIOS & ROLES */}
      {activeTab === 'users' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Buscar usuário por nome ou documento..."
                className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-slate-950/60 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="all">Todas as Roles</option>
                <option value="company">Empresas / RH</option>
                <option value="candidate">Candidatos</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Usuário / Nome</th>
                    <th className="py-3.5 px-4 font-bold">Cidade</th>
                    <th className="py-3.5 px-4 font-bold">Papel (Role)</th>
                    <th className="py-3.5 px-4 font-bold">Status Acesso</th>
                    <th className="py-3.5 px-4 font-bold text-right">Ações de Gestão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-sky-400 font-bold border border-slate-700/50">
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.full_name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{user.phone || 'Sem telefone'}</p>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">{user.city || 'Não informada'}</td>

                      <td className="py-3.5 px-4">
                        <select
                          value={user.role || 'candidate'}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as any)}
                          className="bg-slate-950 border border-slate-800 rounded-xl py-1.5 px-3 text-xs text-sky-400 font-semibold focus:outline-none cursor-pointer"
                        >
                          <option value="candidate">Candidato</option>
                          <option value="company">Empresa RH</option>
                          <option value="admin">Admin Master</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        {user.is_blocked ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center gap-1 w-fit">
                            <Ban className="w-3 h-3" /> Bloqueado
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Ativo
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(user.id)}
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            user.is_blocked
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          {user.is_blocked ? 'Desbloquear' : 'Bloquear'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ABA 3: SUPORTE & CHAMADOS */}
      {activeTab === 'support' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Central de Chamados de Suporte
            </h3>

            {messages.length > 0 ? (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                      <div>
                        <span className="text-xs font-bold text-purple-400">{msg.subject}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          De: <strong className="text-white">{msg.user_name}</strong> ({msg.user_role}) — {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>

                      <select
                        value={msg.status}
                        onChange={(e) => handleSupportStatus(msg.id, e.target.value as any)}
                        className={`py-1 px-3 rounded-xl text-xs font-semibold border focus:outline-none cursor-pointer ${
                          msg.status === 'resolvido'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : msg.status === 'em_atendimento'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        }`}
                      >
                        <option value="aberto">Aberto</option>
                        <option value="em_atendimento">Em Atendimento</option>
                        <option value="resolvido">Resolvido</option>
                      </select>
                    </div>

                    <p className="text-xs text-slate-200 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800/60">
                      "{msg.message}"
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                Nenhum chamado de suporte pendente no momento.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 4: PLANOS & ASSINATURAS */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Plano Gratuito (Free)</h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400">
                Padrão
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Acesso à Busca Ativa de Talentos, 9 Relatórios Padrão CSV/PDF, Favoritos e Anotações básicas.
            </p>
            <div className="pt-3 border-t border-slate-800 text-xs text-slate-300 font-semibold">
              Empresas no Plano Gratuito: {companiesCount}
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/30 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-amber-400">Plano Plus (Recrutador Pro)</h3>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Premium
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recursos de IA para Geração de Relatórios por Chat, Resumos Inteligentes, Branding em PDF e Suporte Prioritário.
            </p>
            <div className="pt-3 border-t border-amber-500/20 text-xs text-amber-400 font-bold flex items-center justify-between">
              <span>Status: Pronto para Ativação</span>
              <span>{metrics?.planInterestCount || 1} solicitações</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
