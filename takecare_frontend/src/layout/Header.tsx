import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronRight, Home, LogOut, Menu, UserRound, X } from 'lucide-react';
import logo from '../assets/logo.png';
import { menuSections } from '../config/menuConfig';
import { authApi } from '../features/auth/api/authApi';
import { clearAuthSession, type AuthSession } from '../features/auth/session';

interface HeaderProps {
  onMenuClick: () => void;
  session: AuthSession;
  sidebarOpen: boolean;
}

interface PageDetails {
  section: string;
  page: string;
}

const pageDetails: Record<string, PageDetails> = Object.fromEntries(
  menuSections.flatMap((section) =>
    section.links.map((link) => [link.to, { section: section.title, page: link.label }]),
  ),
);
pageDetails['/app/profile'] = { section: 'Account', page: 'My profile' };

function UserAvatar({ session, size = 'size-10' }: { session: AuthSession; size?: string }) {
  const initials = session.userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  if (session.user?.profileImg) {
    return <img className={`${size} rounded-full object-cover ring-1 ring-slate-200`} src={session.user.profileImg} alt="" />;
  }

  return (
    <span className={`grid ${size} flex-none place-items-center rounded-full bg-gradient-to-br from-[#e9edff] to-[#f4f6ff] text-[.76rem] font-bold text-[#304593] ring-1 ring-[#dce3fb]`}>
      {initials || 'TC'}
    </span>
  );
}

function formatDate(value?: string | null): string {
  if (!value) return '—';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date);
}

export function Header({ onMenuClick, session, sidebarOpen }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const currentPage = pageDetails[location.pathname] ?? { section: 'Workspace', page: 'Overview' };
  const accountRole = session.user?.roles?.[0]?.roleName ?? 'Workspace account';

  useEffect(() => {
    const dismissMenu = (event: PointerEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    const dismissDialog = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileMenuOpen(false);
        setProfileDialogOpen(false);
      }
    };

    document.addEventListener('pointerdown', dismissMenu);
    document.addEventListener('keydown', dismissDialog);
    return () => {
      document.removeEventListener('pointerdown', dismissMenu);
      document.removeEventListener('keydown', dismissDialog);
    };
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    let logoutMessage: string | undefined;
    try {
      await authApi.logout();
    } catch {
      logoutMessage = 'Signed out on this device; the server could not be reached to confirm logout.';
    } finally {
      clearAuthSession();
      navigate('/login', { replace: true, state: { logoutMessage } });
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-7 py-3 backdrop-blur-xl max-[900px]:px-4 max-[620px]:min-h-[68px] max-[620px]:gap-2.5 max-[620px]:px-3">
        <div className="flex min-w-0 items-center gap-5 max-[900px]:gap-3 max-[620px]:gap-2.5">
          <button
            className="hidden size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm max-[900px]:grid"
            type="button"
            onClick={onMenuClick}
            aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
            aria-expanded={sidebarOpen}
          >
            <Menu size={18} />
          </button>
          <Link className="flex w-[126px] flex-none items-center max-[620px]:w-[98px]" to="/app" aria-label="TakeCare workspace">
            <img className="block h-auto w-full" src={logo} alt="TakeCare Manpower Services" />
          </Link>
          <div className="h-10 w-px flex-none bg-slate-200 max-[620px]:h-8" />
          <div className="min-w-0">
            <nav className="mb-1 flex items-center gap-1.5 text-[.68rem] text-slate-400 max-[620px]:hidden" aria-label="Breadcrumb">
              <Link className="inline-flex items-center gap-1.5 text-slate-500 no-underline transition hover:text-[#334995]" to="/app">
                <Home size={13} />
                Workspace
              </Link>
              <ChevronRight size={12} />
              {currentPage.section !== 'Workspace' && (
                <>
                  <span>{currentPage.section}</span>
                  <ChevronRight size={12} />
                </>
              )}
              <span className="font-medium text-slate-700" aria-current="page">{currentPage.page}</span>
            </nav>
            <h1 className="m-0 max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap text-[1.02rem] font-semibold tracking-[-.025em] text-slate-900 max-[620px]:max-w-[115px] max-[620px]:text-[.88rem]">
              {currentPage.page}
            </h1>
          </div>
        </div>

        <div className="flex flex-none items-center">
          <div className="relative" ref={profileMenuRef}>
            <button
              className="flex cursor-pointer items-center gap-2.5 rounded-xl border-0 bg-transparent py-1 pl-1 pr-2 text-left transition hover:bg-slate-50 max-[620px]:pr-0"
              type="button"
              onClick={() => setProfileMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
              aria-label="Open profile menu"
            >
              <UserAvatar session={session} size="size-[38px] max-[620px]:size-9" />
              <span className="max-w-[145px] text-left max-[620px]:hidden">
                <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[.75rem] font-semibold text-slate-800">
                  {session.userName}
                </strong>
                <small className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[.65rem] text-slate-500">
                  {accountRole}
                </small>
              </span>
            </button>
            {profileMenuOpen && (
              <div className="absolute top-[calc(100%+12px)] right-0 w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.16)]" role="menu">
                <div className="flex items-center gap-3 border-b border-slate-100 px-2.5 py-3">
                  <UserAvatar session={session} size="size-10" />
                  <div className="min-w-0">
                    <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[.78rem] font-semibold text-slate-800">
                      {session.userName}
                    </strong>
                    <span className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[.69rem] text-slate-500">
                      {session.user?.userEmail ?? accountRole}
                    </span>
                  </div>
                </div>
                <button
                  className="my-1 flex w-full items-center gap-2.5 rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-[.78rem] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-[#293e91]"
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setProfileDialogOpen(true);
                  }}
                >
                  <UserRound size={17} />
                  My profile
                </button>
                <button
                  className="flex w-full items-center gap-2.5 rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-[.78rem] font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-wait disabled:opacity-60"
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  disabled={loggingOut}
                >
                  <LogOut size={17} />
                  {loggingOut ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {profileDialogOpen && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-[3px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setProfileDialogOpen(false);
          }}
        >
          <section
            className="max-h-[min(760px,calc(100vh-32px))] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/70 bg-white shadow-[0_28px_90px_rgba(15,23,42,0.3)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-dialog-title"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-gradient-to-br from-[#f1f4ff] via-white to-white px-6 py-6 max-[620px]:px-4">
              <div className="flex min-w-0 items-center gap-4">
                <UserAvatar session={session} size="size-[58px]" />
                <div className="min-w-0">
                  <p className="mb-1 text-[.65rem] font-bold tracking-[.13em] text-[#6b78a8] uppercase">Account profile</p>
                  <h2 id="profile-dialog-title" className="m-0 overflow-hidden text-ellipsis whitespace-nowrap text-lg font-semibold text-slate-900">
                    {session.user?.userName ?? session.userName}
                  </h2>
                  <p className="mt-1 mb-0 overflow-hidden text-ellipsis whitespace-nowrap text-sm text-slate-500">
                    {session.user?.userEmail ?? 'Email not available'}
                  </p>
                </div>
              </div>
              <button
                className="grid size-9 flex-none place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
                type="button"
                onClick={() => setProfileDialogOpen(false)}
                aria-label="Close profile"
              >
                <X size={17} />
              </button>
            </div>
            <div className="grid gap-x-8 gap-y-5 px-6 py-6 sm:grid-cols-2 max-[620px]:px-4">
              <ProfileValue label="User ID" value={session.user?.userIdPk} />
              <ProfileValue label="Status" value={session.user?.status} />
              <ProfileValue label="Designation" value={session.user?.designationName} />
              <ProfileValue label="Designation ID" value={session.user?.designationIdPk} />
              <ProfileValue label="Date of birth" value={formatDate(session.user?.userDob)} />
              <ProfileValue label="Date joined" value={formatDate(session.user?.userDoj)} />
              <ProfileValue label="Date of release" value={formatDate(session.user?.userDor)} />
              <ProfileValue label="Daily hours" value={session.user?.dailyHours?.toString()} />
              <ProfileValue label="Search preference" value={session.user?.search} />
            </div>
            <div className="border-t border-slate-100 px-6 py-5 max-[620px]:px-4">
              <h3 className="mb-3 mt-0 text-sm font-semibold text-slate-800">Roles</h3>
              <div className="flex flex-wrap gap-2">
                {session.user?.roles?.length ? session.user.roles.map((role, index) => (
                  <span className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2" key={role.roleIdPk ?? role.roleCode ?? role.roleName ?? index}>
                    <span className="block text-xs font-semibold text-indigo-900">{role.roleName ?? role.roleCode}</span>
                    {role.roleDescription && <span className="mt-1 block max-w-xs text-[.68rem] leading-relaxed text-indigo-700">{role.roleDescription}</span>}
                  </span>
                )) : <span className="text-sm text-slate-500">No roles assigned.</span>}
              </div>
            </div>
            <div className="border-t border-slate-100 px-6 py-5 max-[620px]:px-4">
              <h3 className="mb-3 mt-0 text-sm font-semibold text-slate-800">Access</h3>
              <div className="flex flex-wrap gap-2">
                {session.access.length ? session.access.map((access) => (
                  <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600" key={access}>{access}</span>
                )) : <span className="text-sm text-slate-500">No access codes assigned.</span>}
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

function ProfileValue({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <p className="m-0 text-xs font-medium text-slate-400">{label}</p>
      <p className="mt-1.5 mb-0 break-words text-sm font-medium text-slate-700">{value || '—'}</p>
    </div>
  );
}
