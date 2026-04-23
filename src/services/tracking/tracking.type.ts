export type CompanyTrackingSettingsResponse = {
  company_id: string
  activity_interval_minutes: number
}

export type CompanyTrackingSettingsUpdateRequest = {
  activity_interval_minutes: number
}

export type ActivityLogResponse = {
  id: string
  user_id: string
  interval_start: string
  keyboard_count: number
  mouse_count: number
  activity_percent: number
  created_at: string
}

export type ScreenshotResponse = {
  id: string
  user_id: string
  file_path: string
  captured_at: string
  created_at: string
}

export type ListFilters = {
  user_id?: string
  date_from?: string
  date_to?: string
}
