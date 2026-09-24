'use client'

import { useState, useMemo } from 'react'
import { CandidateProfile, Sector, CandidateNote } from '@/core/domain/entities/candidate'
import { CandidateFilters } from './CandidateFilters'
import { CandidateCard } from './CandidateCard'
import { CandidateModal } from './CandidateModal'
import { EmptyState } from './EmptyState'
import { toggleFavoriteAction, saveCandidateNoteAction } from '@/app/(dashboard)/actions'

interface CandidateGridProps {
  initialCandidates: CandidateProfile[]
  sectors: Sector[]
  initialSavedIds?: string[]
  initialNotesMap?: Record<string, CandidateNote>
  onlyFavorites?: boolean
}

export function CandidateGrid({
  initialCandidates,
  sectors,
  initialSavedIds = [],
  initialNotesMap = {},
  onlyFavorites = false,
}: CandidateGridProps) {
  const [candidates] = useState<CandidateProfile[]>(initialCandidates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateProfile | null>(null)
  const [savedCandidateIds, setSavedCandidateIds] = useState<string[]>(initialSavedIds)
  const [notesMap, setNotesMap] = useState<Record<string, CandidateNote>>(initialNotesMap)

  const cities = useMemo(() => {
    const set = new Set<string>()
    candidates.forEach((c) => {
      if (c.city) set.add(c.city)
    })
    return Array.from(set).sort()
  }, [candidates])

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (onlyFavorites && !savedCandidateIds.includes(c.id)) {
        return false
      }

      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesName = c.full_name.toLowerCase().includes(query)
        const matchesBio = c.bio?.toLowerCase().includes(query) || false
        const matchesExp = c.work_experiences?.some(
          (e) =>
            e.job_title.toLowerCase().includes(query) ||
            e.company.toLowerCase().includes(query)
        ) || false

        if (!matchesName && !matchesBio && !matchesExp) return false
      }

      if (selectedSector !== '') {
        const sectorIdNum = parseInt(selectedSector, 10)
        const hasSector = c.sectors?.some((ps) => ps.sector_id === sectorIdNum)
        if (!hasSector) return false
      }

      if (selectedCity !== '') {
        if (c.city !== selectedCity) return false
      }

      return true
    })
  }, [candidates, searchQuery, selectedSector, selectedCity, savedCandidateIds, onlyFavorites])

  const toggleSave = async (candidateId: string) => {
    const isCurrentlySaved = savedCandidateIds.includes(candidateId)
    if (isCurrentlySaved) {
      setSavedCandidateIds((prev) => prev.filter((id) => id !== candidateId))
    } else {
      setSavedCandidateIds((prev) => [...prev, candidateId])
    }

    try {
      await toggleFavoriteAction(candidateId)
    } catch (error) {
      console.error('Erro ao atualizar favorito no servidor:', error)
      if (isCurrentlySaved) {
        setSavedCandidateIds((prev) => [...prev, candidateId])
      } else {
        setSavedCandidateIds((prev) => prev.filter((id) => id !== candidateId))
      }
    }
  }

  const handleSaveNote = async (
    candidateId: string,
    status: 'em_analise' | 'entrevista' | 'aprovado' | 'descartado',
    notes: string
  ) => {
    await saveCandidateNoteAction(candidateId, status, notes)
    setNotesMap((prev) => ({
      ...prev,
      [candidateId]: {
        company_profile_id: '',
        candidate_profile_id: candidateId,
        status,
        notes,
      },
    }))
  }

  return (
    <div>
      <CandidateFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        sectors={sectors}
        cities={cities}
        totalResults={filteredCandidates.length}
      />

      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isSaved={savedCandidateIds.includes(candidate.id)}
              onSelect={setSelectedCandidate}
              onToggleSave={toggleSave}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      <CandidateModal
        candidate={selectedCandidate}
        isSaved={selectedCandidate ? savedCandidateIds.includes(selectedCandidate.id) : false}
        initialNote={selectedCandidate ? notesMap[selectedCandidate.id] : null}
        onClose={() => setSelectedCandidate(null)}
        onToggleSave={toggleSave}
        onSaveNote={handleSaveNote}
      />
    </div>
  )
}
