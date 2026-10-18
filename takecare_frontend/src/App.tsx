import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from './features/auth/components/AuthLayout';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';
import { VerifyOtpPage } from './features/auth/pages/VerifyOtpPage';
import { AppLayout } from './layout/AppLayout';
import { CandidateSearchPage } from './features/candidates/pages/CandidateSearchPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { getAuthSession } from './features/auth/session';

function ProtectedApp() {
  return getAuthSession() ? <AppLayout /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        <Route path="/app" element={<ProtectedApp />}>
          <Route index element={<Navigate to="candidates" replace />} />
          <Route path="candidates" element={<CandidateSearchPage />} />
          <Route path="profile" element={<WorkspacePage section="User profile" />} />
          <Route path="admin" element={<WorkspacePage section="Admin control" />} />
        </Route>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
