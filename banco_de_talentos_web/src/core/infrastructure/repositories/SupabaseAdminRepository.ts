import { createClient } from '../supabase/server'
import { CandidateProfile, SupportMessage } from '../../domain/entities/candidate'

export class SupabaseAdminRepository {

  static async getCurrentUserProfile(userId: string): Promise<CandidateProfile | null> {
    if (!userId) return null
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return data as CandidateProfile
  }

  static async getAllUsers(): Promise<CandidateProfile[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar lista de usuários:', error)
      return []
    }

    return (data as CandidateProfile[]) || []
  }

  static async updateUserRole(userId: string, newRole: 'candidate' | 'company' | 'admin'): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)

    if (error) {
      console.error('Erro ao atualizar role do usuário:', error)
    }
  }

  static async toggleBlockUser(userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data: current } = await supabase
      .from('profiles')
      .select('is_blocked')
      .eq('id', userId)
      .single()

    const newBlockedState = !(current?.is_blocked || false)

    const { error } = await supabase
      .from('profiles')
      .update({ is_blocked: newBlockedState })
      .eq('id', userId)

    if (error) {
      console.error('Erro ao alterar status de bloqueio:', error)
    }

    return newBlockedState
  }

  static async createSupportMessage(userId: string, subject: string, message: string): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('support_messages')
      .insert({
        user_id: userId || null,
        subject,
        message,
        status: 'aberto',
      })

    if (error) {
      console.error('Erro ao criar mensagem de suporte:', error)
    }
  }

  static async getAllSupportMessages(): Promise<SupportMessage[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('support_messages')
      .select('*, profiles(full_name, role)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao consultar mensagens de suporte:', error)
      return []
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      user_id: row.user_id,
      subject: row.subject,
      message: row.message,
      status: row.status,
      created_at: row.created_at,
      user_name: row.profiles?.full_name || 'Usuário Não Identificado',
      user_role: row.profiles?.role || 'Visitante',
    }))
  }

  static async updateSupportMessageStatus(
    id: string,
    status: 'aberto' | 'em_atendimento' | 'resolvido'
  ): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from('support_messages')
      .update({ status })
      .eq('id', id)

    if (error) {
      console.error('Erro ao atualizar status do chamado:', error)
    }
  }

  static async getAdminDashboardMetrics() {
    const supabase = await createClient()

    const [profilesRes, savedRes, notesRes, supportRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('saved_candidates').select('*'),
      supabase.from('candidate_notes').select('*'),
      supabase.from('support_messages').select('*'),
    ])

    const profiles = (profilesRes.data as CandidateProfile[]) || []
    const savedList = savedRes.data || []
    const notesList = notesRes.data || []
    const supportList = supportRes.data || []

    const candidatesCount = profiles.filter((p) => p.role === 'candidate').length
    const companiesCount = profiles.filter((p) => p.role === 'company').length
    const adminsCount = profiles.filter((p) => p.role === 'admin').length
    const blockedCount = profiles.filter((p) => p.is_blocked).length

    const activityMap: Record<string, { savedCount: number; notesCount: number }> = {}
    savedList.forEach((s) => {
      if (!activityMap[s.company_profile_id]) {
        activityMap[s.company_profile_id] = { savedCount: 0, notesCount: 0 }
      }
      activityMap[s.company_profile_id].savedCount++
    })
    notesList.forEach((n) => {
      if (!activityMap[n.company_profile_id]) {
        activityMap[n.company_profile_id] = { savedCount: 0, notesCount: 0 }
      }
      activityMap[n.company_profile_id].notesCount++
    })

    const activeRecruitersCount = Object.keys(activityMap).length

    const topRecruiters = profiles
      .filter((p) => p.role === 'company' || activityMap[p.id])
      .map((p) => ({
        id: p.id,
        name: p.full_name || 'Empresa Recrutadora',
        role: p.role || 'company',
        savedCount: activityMap[p.id]?.savedCount || 0,
        notesCount: activityMap[p.id]?.notesCount || 0,
        totalActions: (activityMap[p.id]?.savedCount || 0) + (activityMap[p.id]?.notesCount || 0),
      }))
      .sort((a, b) => b.totalActions - a.totalActions)
      .slice(0, 5)

    const openSupportCount = supportList.filter((s) => s.status === 'aberto').length

    return {
      totalUsers: profiles.length,
      candidatesCount,
      companiesCount,
      adminsCount,
      blockedCount,
      activeRecruitersCount,
      planInterestCount: Math.max(companiesCount, 1),
      openSupportCount,
      topRecruiters,
      pipelineStats: {
        em_analise: notesList.filter((n) => n.status === 'em_analise').length,
        entrevista: notesList.filter((n) => n.status === 'entrevista').length,
        aprovado: notesList.filter((n) => n.status === 'aprovado').length,
        descartado: notesList.filter((n) => n.status === 'descartado').length,
      },
    }
  }
}
