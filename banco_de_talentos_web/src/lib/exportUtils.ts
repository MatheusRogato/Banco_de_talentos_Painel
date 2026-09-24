import { CandidateProfile, CandidateNote } from '@/core/domain/entities/candidate'

export function downloadCSV(
  candidates: CandidateProfile[],
  filename = 'relatorio-candidatos.csv',
  notesMap: Record<string, CandidateNote> = {}
) {
  if (!candidates || candidates.length === 0) {
    alert('Nenhum dado disponível para exportação.')
    return
  }

  const statusLabels: Record<string, string> = {
    em_analise: 'Em Análise',
    entrevista: 'Entrevista',
    aprovado: 'Aprovado',
    descartado: 'Descartado',
  }

  const headers = [
    'Nome',
    'Cargo Principal',
    'Telefone',
    'Cidade',
    'Status Disponibilidade',
    'Etapa RH',
    'Anotação Privada RH',
    'Setores',
  ]

  const rows = candidates.map((candidate) => {
    const primaryJob = candidate.work_experiences && candidate.work_experiences.length > 0
      ? candidate.work_experiences[0].job_title
      : candidate.role || 'Não informado'

    const sectorsStr = candidate.sectors && candidate.sectors.length > 0
      ? candidate.sectors.map((s) => s.sector?.name || '').filter(Boolean).join('; ')
      : 'Geral'

    const isAvailableStr = candidate.is_available ? 'Disponível' : 'Inativo'

    const candidateNote = notesMap[candidate.id]
    const rhStatusStr = candidateNote?.status ? (statusLabels[candidateNote.status] || candidateNote.status) : 'Sem Etapa'
    const rhNoteStr = candidateNote?.notes || 'Nenhuma anotação'

    const sanitize = (val: string | null | undefined) => {
      if (!val) return '""'
      return `"${val.replace(/"/g, '""')}"`
    }

    return [
      sanitize(candidate.full_name),
      sanitize(primaryJob),
      sanitize(candidate.phone || 'Não informado'),
      sanitize(candidate.city || 'Não informada'),
      sanitize(isAvailableStr),
      sanitize(rhStatusStr),
      sanitize(rhNoteStr),
      sanitize(sectorsStr),
    ].join(',')
  })

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function triggerPrint() {
  window.print()
}
