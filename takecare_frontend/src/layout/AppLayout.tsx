import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { userApi } from '../features/auth/api/userApi';
import { updateAuthenticatedUser, type AuthSession } from '../features/auth/session';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  session: AuthSession;
}

export function AppLayout({ session }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(!session.user);
  const [sessionError, setSessionError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (session.user) return;

    let active = true;

    userApi.getSession()
      .then(updateAuthenticatedUser)
      .catch((error: unknown) => {
        if (active) {
          setSessionError(error instanceof Error ? error.message : 'Unable to load your workspace profile.');
        }
      })
      .finally(() => {
        if (active) setSessionLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryCount, session.user]);

  return (
    <div className="flex min-h-screen bg-[#f5f7fb]">
      <Sidebar access={session.access} open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header session={session} onMenuClick={() => setSidebarOpen((current) => !current)} />
        <main className="w-full flex-1 px-7 py-7 max-[900px]:px-5 max-[900px]:py-6 max-[620px]:px-3.5 max-[620px]:py-4">
          <div className="mx-auto w-full max-w-[1480px]">
            {!session.user && sessionLoading ? (
              <div className="grid min-h-[320px] place-items-center rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
                  <span className="size-5 animate-spin rounded-full border-2 border-slate-200 border-t-[#344a9a]" />
                  Loading your workspace…
                </div>
              </div>
            ) : !session.user && sessionError ? (
              <section className="mx-auto grid min-h-[320px] max-w-xl content-center justify-items-center rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-700">
                  <Icon name="user" size={21} />
                </span>
                <h2 className="m-0 text-lg font-semibold text-slate-900">Workspace profile unavailable</h2>
                <p className="mt-2 mb-5 text-sm leading-relaxed text-slate-500">{sessionError}</p>
                <button
                  className="rounded-xl bg-[#293e91] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1f317b]"
                  type="button"
                  onClick={() => {
                    setSessionLoading(true);
                    setSessionError('');
                    setRetryCount((count) => count + 1);
                  }}
                >
                  Retry
                </button>
              </section>
            ) : (
              <Outlet context={session} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
