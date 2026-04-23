import { http } from '@/api/http'
import type {
  ActivityLogResponse,
  CompanyTrackingSettingsResponse,
  CompanyTrackingSettingsUpdateRequest,
  ListFilters,
  ScreenshotResponse,
} from './tracking.type'

function buildParams(filters: ListFilters) {
  const params: Record<string, string> = {}
  if (filters.user_id) params.user_id = filters.user_id
  if (filters.date_from) params.date_from = filters.date_from
  if (filters.date_to) params.date_to = filters.date_to
  return params
}

export const trackingApi = {
  getSettings: () =>
    http
      .get<CompanyTrackingSettingsResponse>('/tracking/settings')
      .then((r) => r.data),

  updateSettings: (body: CompanyTrackingSettingsUpdateRequest) =>
    http
      .put<CompanyTrackingSettingsResponse>('/tracking/settings', body)
      .then((r) => r.data),

  listActivity: (filters: ListFilters) =>
    http
      .get<ActivityLogResponse[]>('/tracking/activity', {
        params: buildParams(filters),
      })
      .then((r) => r.data),

  listScreenshots: (filters: ListFilters) =>
    http
      .get<ScreenshotResponse[]>('/tracking/screenshots', {
        params: buildParams(filters),
      })
      .then((r) => r.data),
}
