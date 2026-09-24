'use client'

import { useState } from 'react'
import { useTheme } from '@/providers/ThemeProvider'
import { submitSupportMessageAction } from '@/app/(dashboard)/actions'
import { Moon, Sun, Bell, Mail, Shield, MessageSquare, Send, CheckCircle2, Check } from 'lucide-react'

export function SettingsView() {
  const { theme, setTheme } = useTheme()
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyDigest, setNotifyDigest] = useState(true)
  const [notifyPanel, setNotifyPanel] = useState(true)

  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [supportSuccess, setSupportSuccess] = useState(false)

  const handleSubmitSupport = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return

    setIsSubmitting(true)
    setSupportSuccess(false)
    try {
      await submitSupportMessageAction(subject, message)
      setSupportSuccess(true)
      setSubject('')
      setMessage('')
      setTimeout(() => setSupportSuccess(false), 3000)
    } catch (error) {
      console.error('Erro ao enviar mensagem de suporte:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Tema da Aplicação */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Moon className="w-5 h-5 text-sky-400" />
          Aparência & Tema da Aplicação
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Opção Dark Mode */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
              theme === 'dark'
                ? 'bg-sky-500/15 border-sky-500/60 text-white ring-2 ring-sky-500/40 shadow-lg shadow-sky-500/10 font-bold scale-[1.01]'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-sky-400 shadow-inner">
                <Moon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Dark Mode (Escuro)</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">Padrão corporativo noturno</p>
              </div>
            </div>
            {theme === 'dark' && (
              <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>

          {/* Opção Light Mode */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-5 rounded-2xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-500/15 border-amber-500/60 text-white ring-2 ring-amber-500/40 shadow-lg shadow-amber-500/10 font-bold scale-[1.01]'
                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
                <Sun className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold">Light Mode (Claro)</p>
                <p className="text-xs text-slate-400 font-normal mt-0.5">Visual claro diurno de alta nitidez</p>
              </div>
            </div>
            {theme === 'light' && (
              <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Preferências de Notificação com Modern Switch Toggles */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Bell className="w-5 h-5 text-emerald-400" />
          Preferências de Notificação
        </h2>

        <div className="space-y-4 pt-2">
          {/* Toggle Alertas */}
          <div 
            onClick={() => setNotifyEmail(!notifyEmail)}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Alertas de Novos Candidatos</p>
                <p className="text-xs text-slate-400 mt-0.5">Receber e-mail quando novos profissionais se cadastrarem</p>
              </div>
            </div>

            {/* Custom Toggle Switch */}
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${notifyEmail ? 'bg-emerald-500' : 'bg-slate-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${notifyEmail ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Toggle Resumo Semanal */}
          <div 
            onClick={() => setNotifyDigest(!notifyDigest)}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Resumo Semanal de Talentos</p>
                <p className="text-xs text-slate-400 mt-0.5">Digest semanal automatizado dos melhores perfis ativos</p>
              </div>
            </div>

            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${notifyDigest ? 'bg-emerald-500' : 'bg-slate-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${notifyDigest ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>

          {/* Toggle Notificações no Painel */}
          <div 
            onClick={() => setNotifyPanel(!notifyPanel)}
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-950/40 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-400 group-hover:text-emerald-400 transition-colors">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Notificações no Painel</p>
                <p className="text-xs text-slate-400 mt-0.5">Avisos do sistema e respostas do suporte master</p>
              </div>
            </div>

            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out flex items-center ${notifyPanel ? 'bg-emerald-500' : 'bg-slate-800'}`}>
              <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${notifyPanel ? 'translate-x-6' : 'translate-x-0'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* Central de Suporte */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-purple-400" />
            Central de Suporte & Fale Conosco
          </h2>
          {supportSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Chamado enviado com sucesso!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmitSupport} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Assunto / Categoria:
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Dúvida sobre plano, sugestão de melhoria ou problema técnico"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Mensagem Detalhada:
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva detalhadamente sua dúvida ou solicitação para a administração..."
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? 'Enviando...' : 'Enviar Chamado para Suporte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

