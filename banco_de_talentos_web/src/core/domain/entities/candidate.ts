export interface Sector {
  id: number
  name: string
}

export interface ProfileSector {
  sector_id: number
  sector: Sector
}

export interface WorkExperience {
  id: string
  profile_id: string
  job_title: string
  company: string
  start_date: string
  end_date?: string | null
  is_current: boolean
  description?: string | null
}

export interface Course {
  id: string
  profile_id: string
  name: string
  institution: string
  status?: string | null
  certificate_url?: string | null
}

export interface CandidateProfile {
  id: string
  role?: 'candidate' | 'company' | 'admin' | string
  full_name: string
  document_id?: string
  phone?: string | null
  city?: string | null
  is_available: boolean
  is_blocked?: boolean
  bio?: string | null
  resume_url?: string | null
  created_at?: string
  sectors?: ProfileSector[]
  work_experiences?: WorkExperience[]
  courses?: Course[]
  email?: string
}

export interface SavedCandidate {
  id: string
  company_profile_id: string
  candidate_profile_id: string
  created_at: string
}

export interface CandidateNote {
  id?: string
  company_profile_id: string
  candidate_profile_id: string
  status: 'em_analise' | 'entrevista' | 'aprovado' | 'descartado'
  notes?: string | null
  updated_at?: string
}

export interface SupportMessage {
  id: string
  user_id: string
  subject: string
  message: string
  status: 'aberto' | 'em_atendimento' | 'resolvido'
  created_at: string
  user_name?: string
  user_role?: string
}
