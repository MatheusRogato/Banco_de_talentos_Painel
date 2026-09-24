'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/core/infrastructure/supabase/server'
import { SupabaseCandidateRepository } from '@/core/infrastructure/repositories/SupabaseCandidateRepository'
import { SupabaseAdminRepository } from '@/core/infrastructure/repositories/SupabaseAdminRepository'

export async function toggleFavoriteAction(candidateId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  const isSaved = await SupabaseCandidateRepository.toggleSaveCandidate(
    user.id,
    candidateId
  )

  revalidatePath('/', 'layout')
  revalidatePath('/favoritos')
  return isSaved
}

export async function saveCandidateNoteAction(
  candidateId: string,
  status: 'em_analise' | 'entrevista' | 'aprovado' | 'descartado',
  notes: string
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Usuário não autenticado')
  }

  await SupabaseCandidateRepository.saveCandidateNote(
    user.id,
    candidateId,
    status,
    notes
  )

  revalidatePath('/', 'layout')
  revalidatePath('/favoritos')
}

export async function updateUserRoleAction(userId: string, newRole: 'candidate' | 'company' | 'admin') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const currentProfile = await SupabaseAdminRepository.getCurrentUserProfile(user.id)
  if (currentProfile?.role !== 'admin') {
    throw new Error('Acesso negado. Apenas administradores podem alterar papéis.')
  }

  await SupabaseAdminRepository.updateUserRole(userId, newRole)
  revalidatePath('/admin')
}

export async function toggleBlockUserAction(userId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const currentProfile = await SupabaseAdminRepository.getCurrentUserProfile(user.id)
  if (currentProfile?.role !== 'admin') {
    throw new Error('Acesso negado.')
  }

  const isBlocked = await SupabaseAdminRepository.toggleBlockUser(userId)
  revalidatePath('/admin')
  return isBlocked
}

export async function submitSupportMessageAction(subject: string, message: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  await SupabaseAdminRepository.createSupportMessage(user?.id || '', subject, message)
  revalidatePath('/configuracoes')
}

export async function updateSupportStatusAction(id: string, status: 'aberto' | 'em_atendimento' | 'resolvido') {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Não autenticado')

  const currentProfile = await SupabaseAdminRepository.getCurrentUserProfile(user.id)
  if (currentProfile?.role !== 'admin') {
    throw new Error('Acesso negado.')
  }

  await SupabaseAdminRepository.updateSupportMessageStatus(id, status)
  revalidatePath('/admin')
}
