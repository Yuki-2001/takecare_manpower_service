import { useEffect, useState, type ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useOutletContext } from 'react-router-dom';
import { canAccess, getVisibleMenuSections } from './config/menuConfig';
import { AuthLayout } from './features/auth/components/AuthLayout';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { LoginPage } from './features/auth/pages/LoginPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';
import { VerifyOtpPage } from './features/auth/pages/VerifyOtpPage';
import { AUTH_SESSION_CHANGE_EVENT, getAuthSession, type AuthSession } from './features/auth/session';
import { CandidateSearchPage } from './features/candidates/pages/CandidateSearchPage';
import { AppLayout } from './layout/AppLayout';
import { WorkspacePage } from './pages/WorkspacePage';

function ProtectedApp() {
  const [session, setSession] = useState(getAuthSession);

  useEffect(() => {
    const syncSession = () => setSession(getAuthSession());
    window.addEventListener(AUTH_SESSION_CHANGE_EVENT, syncSession);
    return () => window.removeEventListener(AUTH_SESSION_CHANGE_EVENT, syncSession);
  }, []);

  return session ? <AppLayout session={session} /> : <Navigate to="/login" replace />;
}

function WorkspaceHome() {
  const session = useOutletContext<AuthSession>();
  if (!session.user) {
    return <div className="min-h-48" aria-label="Loading workspace" />;
  }

  const firstLink = getVisibleMenuSections(session.access)[0]?.links[0];
  return firstLink
    ? <Navigate to={firstLink.to} replace />
    : <WorkspacePage section="No workspace modules available" />;
}

function AccessControlledPage({
  requiredAccess,
  children,
}: {
  requiredAccess: string[];
  children: ReactNode;
}) {
  const session = useOutletContext<AuthSession>();
  if (!session.user) return <div className="min-h-48" aria-label="Loading workspace" />;
  if (!canAccess(session.access, requiredAccess)) {
    return <WorkspacePage section="Access unavailable" />;
  }
  return children;
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
          <Route index element={<WorkspaceHome />} />
          <Route
            path="users"
            element={
              <AccessControlledPage requiredAccess={['USER', 'ADMIN']}>
                <WorkspacePage section="User management" />
              </AccessControlledPage>
            }
          />
          <Route
            path="candidate-upload"
            element={
              <AccessControlledPage requiredAccess={['CANDIDATE_UPLOAD', 'ADMIN']}>
                <WorkspacePage section="Candidate upload" />
              </AccessControlledPage>
            }
          />
          <Route
            path="candidates"
            element={
              <AccessControlledPage requiredAccess={['CANDIDATE_VIEW', 'CANDIDATE', 'ADMIN']}>
                <CandidateSearchPage />
              </AccessControlledPage>
            }
          />
          <Route path="profile" element={<WorkspacePage section="My profile" />} />
        </Route>
        <Route path="/" element={<Navigate to="/app" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
