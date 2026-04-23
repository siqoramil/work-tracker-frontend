import { Navigate, Route, Routes } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import AuthLayout from '@/pages/auth/AuthLayout'
import SignInPage from '@/pages/auth/SignInPage'
import SignUpPage from '@/pages/auth/SignUpPage'
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage'
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage'
import AppLayout from '@/pages/app/AppLayout'
import DashboardPage from '@/pages/app/DashboardPage'
import DownloadPage from '@/pages/app/DownloadPage'
import TeamPage from '@/pages/app/TeamPage'
import SettingsPage from '@/pages/app/SettingsPage'
import ActivityPage from '@/pages/app/ActivityPage'
import ScreenshotsPage from '@/pages/app/ScreenshotsPage'
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
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="screenshots" element={<ScreenshotsPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="download" element={<DownloadPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
