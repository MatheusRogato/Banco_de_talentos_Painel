'use client'

import { useState } from 'react'
import { CandidateProfile, CandidateNote } from '@/core/domain/entities/candidate'
import { downloadCSV, triggerPrint } from '@/lib/exportUtils'
import { PrintTable } from './PrintTable'
import {
  FileSpreadsheet,
  Printer,
  Users,
  Briefcase,
  PhoneCall,
  CheckCircle2,
  Calendar,
  Clock,
  UserX,
  Bookmark,
  GraduationCap,
  ClipboardList,
  Zap,
} from 'lucide-react'

const mockCandidates: CandidateProfile[] = [
  {
    id: 'mock-1',
    full_name: 'Carlos Eduardo Silva',
    city: 'Maceió, AL',
    phone: '(82) 98765-4321',
    is_available: true,
    bio: 'Profissional especialista em recepção hospitalar e governança hoteleira com 6 anos de atuação.',
    role: 'Recepcionista Sênior',
    work_experiences: [
      {
        id: 'exp-1',
 profile_id: 'mock-1',
        job_title: 'Chefe de Recepção',
        company: 'Hotel Ponta Verde',
        start_date: '2021-03',
        is_current: true,
        description: 'Gestão de atendimento a hóspedes e equipe de 12 colaboradores.',
      },
    ],
    courses: [
      {
        id: 'c-1',
        profile_id: 'mock-1',
        name: 'Gestão Hoteleira Executiva',
        institution: 'Senac AL',
      },
    ],
    sectors: [{ sector_id: 1, sector: { id: 1, name: 'Hospitalidade' } }],
  },
]

interface ReportsViewProps {
  realCandidates?: CandidateProfile[]
  savedIds?: string[]
  notesMap?: Record<string, CandidateNote>
}

export function ReportsView({
  realCandidates = [],
  savedIds = [],
  notesMap = {},
}: ReportsViewProps) {
  const candidateData = realCandidates.length > 0 ? realCandidates : mockCandidates
  const [activeReportTitle, setActiveReportTitle] = useState('Disponibilidade Imediata')
  const [activeReportData, setActiveReportData] = useState<CandidateProfile[]>(candidateData)

  const handleExportCSV = (reportName: string, filteredCandidates: CandidateProfile[]) => {
    const filename = `relatorio-${reportName.toLowerCase().replace(/\s+/g, '-')}.csv`
    downloadCSV(filteredCandidates, filename, notesMap)
  }

  const handlePrintPDF = (reportName: string, filteredCandidates: CandidateProfile[]) => {
    setActiveReportTitle(reportName)
    setActiveReportData(filteredCandidates)
    setTimeout(() => {
      triggerPrint()
    }, 100)
  }

  const approvedCandidates = candidateData.filter((c) => notesMap[c.id]?.status === 'aprovado')
  const interviewCandidates = candidateData.filter((c) => notesMap[c.id]?.status === 'entrevista')
  const inAnalysisCandidates = candidateData.filter((c) => notesMap[c.id]?.status === 'em_analise')
  const discardedCandidates = candidateData.filter((c) => notesMap[c.id]?.status === 'descartado')
  const annotatedCandidates = candidateData.filter((c) => !!notesMap[c.id])
  const favoritedCandidates = candidateData.filter((c) => savedIds.includes(c.id))
  const availableCandidates = candidateData.filter((c) => c.is_available)
  const qualifiedCandidates = candidateData.filter((c) => c.courses && c.courses.length > 0)
  const contactableCandidates = candidateData.filter((c) => c.phone && c.phone.trim() !== '')

  const reportCards = [
    {
      id: 'aprovados',
      title: 'Candidatos Aprovados',
      subtitle: 'Contratação Efetiva',
      description:
        'Profissionais validados no processo seletivo e prontos para envio ao departamento pessoal.',
      icon: CheckCircle2,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'from-emerald-600 to-slate-800 text-emerald-400',
      data: approvedCandidates,
    },
    {
      id: 'entrevistas',
      title: 'Entrevistas Agendadas',
      subtitle: 'Convocação Ativa',
      description:
        'Candidatos em fase de entrevista presencial/online aguardando parecer final do recrutador.',
      icon: Calendar,
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      iconBg: 'from-sky-600 to-slate-800 text-sky-400',
      data: interviewCandidates,
    },
    {
      id: 'analise',
      title: 'Talentos em Análise',
      subtitle: 'Triagem Inicial',
      description:
        'Profissionais sob avaliação preliminar da equipe de Recursos Humanos.',
      icon: Clock,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconBg: 'from-amber-600 to-slate-800 text-amber-400',
      data: inAnalysisCandidates,
    },
    {
      id: 'anotacoes',
      title: 'Anotações Privadas do RH',
      subtitle: 'Pareceres e Notas',
      description:
        'Relatório gerado com os comentários internos e observações anotadas para cada candidato.',
      icon: ClipboardList,
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      iconBg: 'from-purple-600 to-slate-800 text-purple-400',
      data: annotatedCandidates,
    },
    {
      id: 'favoritos',
      title: 'Talentos Salvos / Favoritos',
      subtitle: 'Acompanhamento VIP',
      description:
        'Lista dos profissionais marcados como favoritos pela sua equipe recrutadora.',
      icon: Bookmark,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      iconBg: 'from-amber-600 to-slate-800 text-amber-400',
      data: favoritedCandidates,
    },
    {
      id: 'disponibilidade',
      title: 'Disponibilidade Imediata',
      subtitle: 'Base Ativa na Região',
      description:
        'Relatório geral de todos os profissionais cadastrados que marcaram status ativo no sistema.',
      icon: Zap,
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      iconBg: 'from-emerald-600 to-slate-800 text-emerald-400',
      data: availableCandidates,
    },
    {
      id: 'qualificados',
      title: 'Profissionais Certificados',
      subtitle: 'Cursos & Formação',
      description:
        'Candidatos com cursos registrados de especialização hoteleira, gastronomia e atendimento.',
      icon: GraduationCap,
      badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      iconBg: 'from-indigo-600 to-slate-800 text-indigo-400',
      data: qualifiedCandidates,
    },
    {
      id: 'whatsapp',
      title: 'Contatos & Prospecção Rápida',
      subtitle: 'Acionamento via WhatsApp',
      description:
        'Planilha com telefones validados para mensagens e agendamentos em lote.',
      icon: PhoneCall,
      badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      iconBg: 'from-sky-600 to-slate-800 text-sky-400',
      data: contactableCandidates,
    },
    {
      id: 'descartados',
      title: 'Processos Descartados',
      subtitle: 'Governança & Controle',
      description:
        'Registro de candidatos não selecionados para histórico e governança de processos anteriores.',
      icon: UserX,
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      iconBg: 'from-rose-600 to-slate-800 text-rose-400',
      data: discardedCandidates,
    },
  ]

  return (
    <div className="space-y-8">
      <PrintTable
        candidates={activeReportData}
        reportTitle={activeReportTitle}
        notesMap={notesMap}
      />

      <div className="print:hidden space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Central de Relatórios Corporativos B2B
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300">
                  Exportação Instantânea
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Selecione abaixo o relatório desejado para baixar planilhas em formato Excel (CSV) ou imprimir relatórios formatados em PDF em tempo real.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCards.map((card) => {
            const Icon = card.icon

            return (
              <div
                key={card.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center shadow-lg border border-slate-700/50 shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${card.badgeColor}`}>
                      {card.data.length} Candidatos
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {card.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-sky-400 transition-colors mt-0.5 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => handleExportCSV(card.title, card.data)}
                    className="w-full bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 hover:border-transparent font-semibold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 group/btn shadow-sm"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 group-hover/btn:text-white" />
                    <span>Exportar para Excel (CSV)</span>
                  </button>

                  <button
                    onClick={() => handlePrintPDF(card.title, card.data)}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-2 group/btn"
                  >
                    <Printer className="w-4 h-4 text-sky-400 group-hover/btn:text-white" />
                    <span>Imprimir Lista (PDF)</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-slate-950/60 border border-slate-800/60 rounded-2xl p-4 text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Users className="w-4 h-4 text-sky-400" />
            Total de talentos cadastrados no banco de dados: <strong className="text-white">{candidateData.length}</strong>
          </span>
          <span className="text-[11px] text-slate-500">
            Formato CSV compatível com Excel, Google Sheets e ERPs
          </span>
        </div>
      </div>
    </div>
  )
}
