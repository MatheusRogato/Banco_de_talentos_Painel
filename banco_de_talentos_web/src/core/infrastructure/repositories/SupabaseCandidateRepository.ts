import { createClient } from '../supabase/server'
import { CandidateProfile, Sector, CandidateNote } from '../../domain/entities/candidate'

export class SupabaseCandidateRepository {

  static async getAvailableCandidates(): Promise<CandidateProfile[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*, sectors:profile_sectors(sector:sectors(*)), work_experiences(*), courses(*)')
      .eq('is_available', true)
      .eq('role', 'candidate')

    if (error) {
      console.error('Erro ao consultar candidatos disponíveis:', error)
      return []
    }

    return (data as unknown as CandidateProfile[]) || []
  }

  static async getAllSectors(): Promise<Sector[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('sectors')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Erro ao buscar lista de setores:', error)
      return []
    }

    return (data as Sector[]) || []
  }

  static async getSavedCandidateIds(companyId: string): Promise<string[]> {
    if (!companyId) return []
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('saved_candidates')
      .select('candidate_profile_id')
      .eq('company_profile_id', companyId)

    if (error) {
      console.error('Erro ao consultar favoritos:', error)
      return []
    }

    return (data || []).map((item) => item.candidate_profile_id)
  }

  static async getFavoritedCandidates(companyId: string): Promise<CandidateProfile[]> {
    if (!companyId) return []
    const savedIds = await this.getSavedCandidateIds(companyId)
    if (savedIds.length === 0) return []

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*, sectors:profile_sectors(sector:sectors(*)), work_experiences(*), courses(*)')
      .in('id', savedIds)

    if (error) {
      console.error('Erro ao consultar candidatos favoritados:', error)
      return []
    }

    return (data as unknown as CandidateProfile[]) || []
  }

  static async toggleSaveCandidate(companyId: string, candidateId: string): Promise<boolean> {
    if (!companyId || !candidateId) return false
    const supabase = await createClient()

    const { data: existing } = await supabase
      .from('saved_candidates')
      .select('id')
      .eq('company_profile_id', companyId)
      .eq('candidate_profile_id', candidateId)
      .maybeSingle()

    if (existing) {
      await supabase
        .from('saved_candidates')
        .delete()
        .eq('id', existing.id)
      return false
    } else {
      await supabase
        .from('saved_candidates')
        .insert({
          company_profile_id: companyId,
          candidate_profile_id: candidateId,
        })
      return true
    }
  }

  static async getAllCandidateNotes(companyId: string): Promise<Record<string, CandidateNote>> {
    if (!companyId) return {}
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('candidate_notes')
      .select('*')
      .eq('company_profile_id', companyId)

    if (error) {
      console.error('Erro ao buscar anotações de candidatos:', error)
      return {}
    }

    const notesMap: Record<string, CandidateNote> = {}
    ;(data || []).forEach((row) => {
      notesMap[row.candidate_profile_id] = row as CandidateNote
    })
    return notesMap
  }

  static async saveCandidateNote(
    companyId: string,
    candidateId: string,
    status: 'em_analise' | 'entrevista' | 'aprovado' | 'descartado',
    notes: string
  ): Promise<void> {
    if (!companyId || !candidateId) return
    const supabase = await createClient()

    const { error } = await supabase
      .from('candidate_notes')
      .upsert(
        {
          company_profile_id: companyId,
          candidate_profile_id: candidateId,
          status,
          notes,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'company_profile_id,candidate_profile_id' }
      )

    if (error) {
      console.error('Erro ao salvar anotação do candidato:', error)
    }
  }

  static async getDashboardStats(companyId: string): Promise<{
    totalActive: number
    immediateAvailable: number
    savedCount: number
    withCourses: number
  }> {
    const [allCandidates, savedIds] = await Promise.all([
      this.getAvailableCandidates(),
      this.getSavedCandidateIds(companyId),
    ])

    const totalActive = allCandidates.length
    const immediateAvailable = allCandidates.filter((c) => c.is_available).length
    const savedCount = savedIds.length
    const withCourses = allCandidates.filter(
      (c) => c.courses && c.courses.length > 0
    ).length

    return {
      totalActive,
      immediateAvailable,
      savedCount,
      withCourses,
    }
  }
}

