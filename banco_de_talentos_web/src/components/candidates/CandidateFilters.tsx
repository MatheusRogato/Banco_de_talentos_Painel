'use client'

import { Search, Filter, X } from 'lucide-react'
import { Sector } from '@/core/domain/entities/candidate'

interface CandidateFiltersProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedSector: string
  onSectorChange: (value: string) => void
  selectedCity: string
  onCityChange: (value: string) => void
  sectors: Sector[]
  cities: string[]
  totalResults: number
}

export function CandidateFilters({
  searchQuery,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedCity,
  onCityChange,
  sectors,
  cities,
  totalResults,
}: CandidateFiltersProps) {
  const hasActiveFilters = searchQuery || selectedSector || selectedCity

  const handleClear = () => {
    onSearchChange('')
    onSectorChange('')
    onCityChange('')
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg mb-6 space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nome, bio ou cargo..."
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="w-full md:w-56">
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
          >
            <option value="">Todos os Setores</option>
            {sectors.map((sector) => (
              <option key={sector.id} value={sector.id.toString()}>
                {sector.name}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-52">
          <div className="relative">
            <select
              value={selectedCity}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl py-2.5 px-3.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all cursor-pointer"
            >
              <option value="">Todas as Cidades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="w-full md:w-auto px-3.5 py-2.5 rounded-xl border border-slate-800 hover:bg-slate-800/80 text-xs font-medium text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-all shrink-0"
          >
            <X className="w-3.5 h-3.5" />
            Limpar
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          Encontrados: <strong className="text-slate-200">{totalResults}</strong> talentos disponíveis
        </span>
        {hasActiveFilters && (
          <span className="text-sky-400 font-medium">Filtro ativo</span>
        )}
      </div>
    </div>
  )
}
