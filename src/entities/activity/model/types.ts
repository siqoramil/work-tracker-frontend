export type ActivityLog = {
  id: string
  user_id: string
  interval_start: string
  keyboard_count: number
  mouse_count: number
  activity_percent: number
  created_at: string
}

export type Screenshot = {
  id: string
  user_id: string
  file_path: string
  captured_at: string
  created_at: string
}

export type ActivityFilters = {
  user_id?: string
  date_from?: string
  date_to?: string
}
