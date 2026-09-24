'use client'

import { CandidateProfile, CandidateNote } from '@/core/domain/entities/candidate'

interface PrintTableProps {
  candidates: CandidateProfile[]
  reportTitle?: string
  notesMap?: Record<string, CandidateNote>
}

export function PrintTable({
  candidates,
  reportTitle = 'Relatório Geral de Talentos',
  notesMap = {},
}: PrintTableProps) {
  const currentDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const statusLabels: Record<string, string> = {
    em_analise: 'Em Análise',
    entrevista: 'Entrevista',
    aprovado: 'Aprovado',
    descartado: 'Descartado',
  }

  return (
    <div className="hidden print:block print:w-full print:bg-white print:text-black print:p-6 text-black">
      <div className="border-b border-gray-400 pb-4 mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold uppercase text-gray-900 tracking-tight">
            Banco de Talentos — {reportTitle}
          </h1>
          <p className="text-xs text-gray-600 mt-1">
            Relatório corporativo gerado em tempo real
          </p>
        </div>
        <div className="text-right text-xs text-gray-500">
          <p>Data de Emissão: {currentDate}</p>
          <p>Total de Registros: {candidates.length}</p>
        </div>
      </div>

      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-gray-100 border-b-2 border-gray-400">
            <th className="py-2.5 px-3 font-bold text-gray-900 uppercase">#</th>
            <th className="py-2.5 px-3 font-bold text-gray-900 uppercase">Nome Completo</th>
            <th className="py-2.5 px-3 font-bold text-gray-900 uppercase">Cargo / Exp</th>
            <th className="py-2.5 px-3 font-bold text-gray-900 uppercase">Telefone</th>
            <th className="py-2.5 px-3 font-bold text-gray-900 uppercase">Cidade</th>
            <th className="py-2.5 px-3 font-bold text-gray-900 uppercase">Etapa RH</th>
            <th className="py-2.5 px-3 font-bold text-gray-900 uppercase">Anotação Privada</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {candidates.map((candidate, idx) => {
            const primaryJob = candidate.work_experiences && candidate.work_experiences.length > 0
              ? candidate.work_experiences[0].job_title
              : candidate.role || 'Não informado'

            const candidateNote = notesMap[candidate.id]
            const rhStatus = candidateNote?.status ? (statusLabels[candidateNote.status] || candidateNote.status) : '—'
            const rhNote = candidateNote?.notes || '—'

            return (
              <tr key={candidate.id || idx} className="hover:bg-gray-50">
                <td className="py-2 px-3 text-gray-500 font-mono">{idx + 1}</td>
                <td className="py-2 px-3 font-bold text-gray-900">{candidate.full_name}</td>
                <td className="py-2 px-3 text-gray-800">{primaryJob}</td>
                <td className="py-2 px-3 text-gray-800 font-mono">{candidate.phone || 'N/I'}</td>
                <td className="py-2 px-3 text-gray-800">{candidate.city || 'N/I'}</td>
                <td className="py-2 px-3 font-semibold text-gray-900">{rhStatus}</td>
                <td className="py-2 px-3 text-gray-700 italic max-w-xs text-[11px] truncate">{rhNote}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="mt-8 pt-4 border-t border-gray-300 text-[10px] text-gray-500 flex justify-between">
        <span>Banco de Talentos — Painel Corporativo B2B</span>
        <span>Documento sigiloso para uso exclusivo do RH</span>
      </div>
    </div>
  )
}
