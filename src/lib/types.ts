export interface VvE {
  id: string
  name: string
  address: string
  city: string
  postal_code: string
  type: 'garage' | 'storage' | 'apartment' | 'mixed'
  total_units: number
  kvk_number?: string
  iban?: string
  created_at: string
  created_by: string
}

export interface Unit {
  id: string
  vve_id: string
  unit_number: string
  type: 'garage' | 'storage' | 'apartment' | 'commercial'
  breukdeel_numerator: number
  breukdeel_denominator: number
  floor_area_m2?: number
  description?: string
  owner?: Member
}

export interface Member {
  id: string
  user_id?: string
  vve_id: string
  full_name: string
  email: string
  phone?: string
  role: 'owner' | 'board_chair' | 'board_secretary' | 'board_treasurer' | 'board_member'
  unit_id?: string
  is_active: boolean
  joined_at: string
}

export interface Document {
  id: string
  vve_id: string
  title: string
  type: 'splitsingsakte' | 'huishoudelijk_reglement' | 'insurance' | 'minutes' | 'financial' | 'jaarverslag' | 'mjop' | 'maintenance' | 'other'
  file_path: string
  file_size: number
  ai_summary?: string
  ai_extracted_data?: Record<string, unknown>
  uploaded_by: string
  uploaded_at: string
}

export interface Transaction {
  id: string
  vve_id: string
  type: 'contribution' | 'expense' | 'income' | 'reserve_deposit'
  amount: number
  description: string
  category: string
  date: string
  member_id?: string
  ai_category?: string
  receipt_path?: string
  created_by: string
  created_at: string
}

export interface Meeting {
  id: string
  vve_id: string
  title: string
  type: 'alv' | 'extraordinary' | 'board'
  date: string
  location?: string
  agenda: AgendaItem[]
  minutes_text?: string
  ai_minutes?: string
  status: 'planned' | 'in_progress' | 'completed'
  created_by: string
}

export interface AgendaItem {
  id: string
  title: string
  description?: string
  type: 'discussion' | 'vote' | 'information'
  duration_minutes?: number
}

export interface Vote {
  id: string
  meeting_id?: string
  vve_id: string
  subject: string
  description: string
  type: 'simple_majority' | 'qualified_majority' | 'unanimous'
  status: 'open' | 'closed'
  result?: 'approved' | 'rejected' | 'no_quorum'
  deadline?: string
  responses: VoteResponse[]
}

export interface VoteResponse {
  id: string
  vote_id: string
  member_id: string
  member_name?: string
  response: 'for' | 'against' | 'abstain'
  voted_at: string
}

export interface MaintenanceRequest {
  id: string
  vve_id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'reported' | 'assessed' | 'approved' | 'in_progress' | 'completed'
  reported_by: string
  reporter_name?: string
  photos: string[]
  estimated_cost?: number
  actual_cost?: number
  ai_category?: string
  ai_priority_reason?: string
  created_at: string
  resolved_at?: string
}

export interface ChatMessage {
  id: string
  vve_id: string
  user_id: string
  role: 'user' | 'assistant'
  content: string
  created_at: string
}

export interface Announcement {
  id: string
  vve_id: string
  title: string
  content: string
  author_name: string
  is_pinned: boolean
  created_at: string
}

export interface MJOPItem {
  id: string
  vve_id: string
  component: string
  description: string
  estimated_cost: number
  planned_year: number
  priority: 'low' | 'medium' | 'high'
  status: 'planned' | 'in_progress' | 'completed' | 'deferred'
  notes?: string
}

export interface AnnualReport {
  id: string
  vve_id: string
  year: number
  total_income: number
  total_expenses: number
  reserve_balance: number
  key_decisions: string[]
  maintenance_completed: string[]
  ai_summary?: string
  status: 'draft' | 'approved'
  created_at: string
}
