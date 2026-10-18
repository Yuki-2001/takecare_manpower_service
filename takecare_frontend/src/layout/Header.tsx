import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Icon } from '../components/Icon';
import { menuSections } from '../config/menuConfig';
import { authApi } from '../features/auth/api/authApi';
import { clearAuthSession, type AuthSession } from '../features/auth/session';

interface HeaderProps {
  onMenuClick: () => void;
  session: AuthSession;
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

export function Header({ onMenuClick, session }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const currentPage = pageDetails[location.pathname] ?? { section: 'Workspace', page: 'Overview' };
  const accountRole = session.user?.roles?.[0]?.roleName ?? 'Workspace account';

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
    <header className="sticky top-0 z-20 flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-white/95 px-7 py-3 backdrop-blur-xl max-[900px]:px-4 max-[620px]:min-h-[68px] max-[620px]:gap-2.5 max-[620px]:px-3">
      <div className="flex min-w-0 items-center gap-5 max-[900px]:gap-3 max-[620px]:gap-2.5">
        <button
          className="hidden size-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm max-[900px]:grid"
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          aria-expanded={undefined}
        >
          <Icon name="menu" size={18} />
        </button>
        <Link className="flex w-[126px] flex-none items-center max-[620px]:w-[98px]" to="/app" aria-label="TakeCare workspace">
          <img className="block h-auto w-full" src={logo} alt="TakeCare Manpower Services" />
        </Link>
        <div className="h-10 w-px flex-none bg-slate-200 max-[620px]:h-8" />
        <div className="min-w-0">
          <p className="mb-1 flex items-center gap-1.5 text-[.68rem] text-slate-400 max-[620px]:hidden">
            <Link className="inline-flex items-center gap-1.5 text-slate-500 no-underline transition hover:text-[#334995]" to="/app">
              <Icon name="home" size={13} />
              Workspace
            </Link>
            <Icon name="chevron" size={12} />
            {currentPage.section !== 'Workspace' && (
              <>
                <span>{currentPage.section}</span>
                <Icon name="chevron" size={12} />
              </>
            )}
            <span className="font-medium text-slate-700" aria-current="page">{currentPage.page}</span>
          </p>
          <h1 className="m-0 max-w-[260px] overflow-hidden text-ellipsis whitespace-nowrap text-[1.02rem] font-semibold tracking-[-.025em] text-slate-900 max-[620px]:max-w-[115px] max-[620px]:text-[.88rem]">
            {currentPage.page}
          </h1>
        </div>
      </div>

      <div className="flex flex-none items-center gap-4 max-[620px]:gap-2.5">
        <span className="inline-flex items-center gap-2 whitespace-nowrap text-[.72rem] font-medium text-slate-500 max-[900px]:hidden">
          <i className="size-2 rounded-full bg-emerald-500 shadow-[0_0_0_3px_#e8f6ef]" aria-hidden="true" />
          Workspace online
        </span>
        <span className="h-8 w-px bg-slate-200 max-[900px]:hidden" />
        <details className="group relative">
          <summary className="flex cursor-pointer list-none items-center gap-2.5 rounded-xl py-1 pl-1 pr-2 transition hover:bg-slate-50 marker:hidden max-[620px]:pr-0">
            <UserAvatar session={session} size="size-[38px] max-[620px]:size-9" />
            <span className="max-w-[145px] text-left max-[620px]:hidden">
              <strong className="block overflow-hidden text-ellipsis whitespace-nowrap text-[.75rem] font-semibold text-slate-800">
                {session.userName}
              </strong>
              <small className="mt-0.5 block overflow-hidden text-ellipsis whitespace-nowrap text-[.65rem] text-slate-500">
                {accountRole}
              </small>
            </span>
            <span className="ml-0.5 text-xs text-slate-400 transition group-open:rotate-180 max-[620px]:hidden" aria-hidden="true">⌄</span>
          </summary>
          <div className="absolute top-[calc(100%+12px)] right-0 w-[280px] rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.16)]">
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
            <Link className="my-1 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[.78rem] font-medium text-slate-600 no-underline transition hover:bg-slate-50 hover:text-[#293e91]" to="/app/profile">
              <Icon name="user" size={17} />
              My profile
            </Link>
            <button
              className="flex w-full items-center gap-2.5 rounded-xl border-0 bg-transparent px-3 py-2.5 text-left text-[.78rem] font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 disabled:cursor-wait disabled:opacity-60"
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <Icon name="logout" size={17} />
              {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
