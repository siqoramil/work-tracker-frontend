import { http } from '@/shared/api/http'
import type { ActivityFilters, ActivityLog, Screenshot } from '../model/types'

function buildParams(filters: ActivityFilters) {
  const params: Record<string, string> = {}
  if (filters.user_id) params.user_id = filters.user_id
  if (filters.date_from) params.date_from = filters.date_from
  if (filters.date_to) params.date_to = filters.date_to
  return params
}

export const activityApi = {
  listActivity: (filters: ActivityFilters) =>
    http
      .get<
        ActivityLog[]
      >('/tracking/activity', { params: buildParams(filters) })
      .then((r) => r.data),

  listScreenshots: (filters: ActivityFilters) =>
    http
      .get<Screenshot[]>('/tracking/screenshots', {
        params: buildParams(filters),
      })
      .then((r) => r.data),
}
