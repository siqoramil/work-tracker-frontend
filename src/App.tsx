import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '@/views/LandingPage'
import AuthLayout from '@/views/auth/AuthLayout'
import SignInPage from '@/views/auth/SignInPage'
import SignUpPage from '@/views/auth/SignUpPage'
import ResetPasswordPage from '@/views/auth/ResetPasswordPage'
import VerifyEmailPage from '@/views/auth/VerifyEmailPage'
import AppLayout from '@/views/app/AppLayout'
import TrackingPage from '@/views/app/TrackingPage'
import BoardPage from '@/views/app/BoardPage'
import DownloadPage from '@/views/app/DownloadPage'
import TeamPage from '@/views/app/TeamPage'
import SettingsPage from '@/views/app/SettingsPage'
import ProtectedRoute from '@/routes/ProtectedRoute'
import PublicOnlyRoute from '@/routes/PublicOnlyRoute'

function App() {
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

export default App
