import { CandidateProfile, Sector } from '../entities/candidate'

export interface ICandidateRepository {
  getAvailableCandidates(filters?: { search?: string; sectorId?: number; city?: string }): Promise<CandidateProfile[]>
  getAllSectors(): Promise<Sector[]>
  getSavedCandidateIds(companyId: string): Promise<string[]>
  toggleSaveCandidate(companyId: string, candidateId: string): Promise<boolean>
}
