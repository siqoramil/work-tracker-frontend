export type User = {
  id: string
  email: string
  full_name: string
  is_active: boolean
  role: string
  company_id?: string | null
  created_at: string
}
