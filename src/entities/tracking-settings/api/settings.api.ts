import { http } from '@/shared/api/http'
import type { TrackingSettings, TrackingSettingsUpdate } from '../model/types'

export const trackingSettingsApi = {
  get: () =>
    http.get<TrackingSettings>('/tracking/settings').then((r) => r.data),
  update: (body: TrackingSettingsUpdate) =>
    http.put<TrackingSettings>('/tracking/settings', body).then((r) => r.data),
}
