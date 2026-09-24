'use client'

import { SearchX } from 'lucide-react'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Nenhum candidato encontrado',
  description = 'Tente ajustar os termos da busca ou os filtros de setor e cidade para encontrar mais profissionais.',
}: EmptyStateProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center max-w-md mx-auto my-12 shadow-xl">
      <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
        <SearchX className="w-8 h-8 text-sky-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-400 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
