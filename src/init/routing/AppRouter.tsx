import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '@/screens/landing'
import SignInPage from '@/screens/auth/sign-in'
import SignUpPage from '@/screens/auth/sign-up'
import ResetPasswordPage from '@/screens/auth/reset-password'
import VerifyEmailPage from '@/screens/auth/verify-email'
import TrackingPage from '@/screens/app/tracking'
import BoardPage from '@/screens/app/board'
import TeamPage from '@/screens/app/team'
import SettingsPage from '@/screens/app/settings'
import DownloadPage from '@/screens/app/download'
import { AuthLayout } from '@/widgets/auth-layout'
import { AppLayout } from '@/widgets/app-layout'
import { ProtectedRoute, PublicOnlyRoute } from '@/features/session-guards'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/auth" element={<AuthLayout />}>
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />

        <Route element={<PublicOnlyRoute />}>
          <Route index element={<Navigate to="signin" replace />} />
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="tracking" replace />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="board" element={<BoardPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="download" element={<DownloadPage />} />

          <Route
            path="dashboard"
            element={<Navigate to="/app/tracking" replace />}
          />
          <Route
            path="activity"
            element={<Navigate to="/app/tracking?tab=activity" replace />}
          />
          <Route
            path="screenshots"
            element={<Navigate to="/app/tracking?tab=screenshots" replace />}
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
