import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { Icon } from '../components/Icon';
import { authApi } from '../features/auth/api/authApi';
import { clearAuthSession, getAuthSession } from '../features/auth/session';

interface HeaderProps {
  onMenuClick: () => void;
}

const pageDetails: Record<string, { title: string; section: string; page: string }> = {
  '/app/candidates': { title: 'Candidate search', section: 'HR Control', page: 'Candidate search' },
  '/app/profile': { title: 'My profile', section: 'User', page: 'My profile' },
  '/app/admin': { title: 'Access management', section: 'Admin Control', page: 'Access management' },
};

export function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const session = getAuthSession();
  const currentPage = pageDetails[location.pathname] ?? pageDetails['/app/candidates'];
  const initials = (session?.userName ?? 'TC')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

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
    <header className="sticky top-0 z-[5] flex min-h-[91px] items-center justify-between gap-5 border-b border-[#e9ecf1] bg-white/[.94] px-8 py-[13px] backdrop-blur-[14px] max-[900px]:min-h-[91px] max-[900px]:gap-3 max-[900px]:px-[13px] max-[900px]:py-[10px] max-[620px]:min-h-[76px] max-[620px]:gap-[10px]">
      <div className="flex min-w-0 items-center gap-5 max-[900px]:gap-[13px] max-[620px]:gap-[9px]">
        <button className="hidden size-[38px] place-items-center rounded-[9px] border border-[#e5e8ef] bg-white text-[#39445d] min-[901px]:hidden max-[900px]:grid" type="button" onClick={onMenuClick} aria-label="Open navigation">
          <Icon name="menu" />
        </button>
        <Link className="flex w-36 flex-[0_0_144px] items-center max-[620px]:w-[108px] max-[620px]:flex-[0_0_108px]" to="/app" aria-label="TakeCare workspace">
          <img className="block h-auto w-full" src={logo} alt="TakeCare Manpower Services" />
        </Link>
        <div className="h-[43px] w-px bg-[#e7eaf0] max-[620px]:h-9" />
        <div className="min-w-[140px] max-[620px]:min-w-0">
          <span className="m-0 text-[.59rem] font-bold tracking-[.14em] text-[#9a6b19] uppercase max-[620px]:hidden">{currentPage.section}</span>
          <h1 className="mt-0.5 mb-0 text-base font-bold tracking-[-.02em] text-[#1c2743] max-[620px]:max-w-[120px] max-[620px]:text-[.82rem] max-[620px]:leading-tight">{currentPage.title}</h1>
          <nav className="mt-px flex items-center gap-[7px] text-[.67rem] text-[#9aa2b1] max-[620px]:hidden" aria-label="Breadcrumb">
            <Link className="no-underline hover:text-[#354a9a]" to="/app">Workspace</Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#677289]" aria-current="page">{currentPage.page}</span>
          </nav>
        </div>
      </div>

      <div className="flex min-w-0 items-center gap-[23px] max-[620px]:gap-[10px]">
        <span className="inline-flex items-center gap-[7px] whitespace-nowrap text-[.72rem] text-[#7e899b] max-[620px]:hidden"><i className="size-[7px] rounded-full bg-[#36a575] shadow-[0_0_0_3px_#e8f6ef]" aria-hidden="true" /> Workspace online</span>
        <details className="relative">
          <summary className="flex cursor-pointer list-none items-center gap-[10px] marker:hidden">
            <span className="grid size-[38px] flex-[0_0_38px] place-items-center rounded-full border border-[#dce2f1] bg-[#f0f2fa] text-[.76rem] font-bold text-[#344995] max-[620px]:size-[35px] max-[620px]:flex-[0_0_35px]">{initials}</span>
            <span className="max-[620px]:hidden">
              <strong className="block max-w-[145px] overflow-hidden text-[.76rem] font-semibold text-ellipsis whitespace-nowrap text-[#2c3650]">{session?.userName ?? 'TakeCare user'}</strong>
              <small className="mt-[3px] block max-w-[145px] overflow-hidden text-[.65rem] text-ellipsis whitespace-nowrap text-[#8992a3]">Workspace account</small>
            </span>
            <span className="ml-0.5 text-base text-[#7e8797] max-[620px]:hidden" aria-hidden="true">⌄</span>
          </summary>
          <div className="absolute top-[calc(100%+15px)] right-0 w-[237px] rounded-[13px] border border-[#e7eaf0] bg-white p-2 shadow-[0_18px_45px_rgba(25,36,62,0.16)]">
            <div className="mb-1 flex items-center gap-[10px] border-b border-[#eef0f4] px-[7px] pt-[9px] pb-3">
              <span className="grid size-[38px] flex-[0_0_38px] place-items-center rounded-full border border-[#dce2f1] bg-[#f0f2fa] text-[.76rem] font-bold text-[#344995]">{initials}</span>
              <div className="min-w-0">
                <strong className="block overflow-hidden text-[.76rem] text-ellipsis whitespace-nowrap text-[#303a52]">{session?.userName ?? 'TakeCare user'}</strong>
                <small className="mt-[3px] block text-[.67rem] text-[#8992a3]">Signed in</small>
              </div>
            </div>
            <Link className="flex w-full items-center gap-[10px] rounded-lg p-[10px] text-left text-[.78rem] text-[#525e75] no-underline hover:bg-[#f4f6fb] hover:text-[#293d91]" to="/app/profile"><Icon name="user" size={17} /> My profile</Link>
            <button className="flex w-full items-center gap-[10px] rounded-lg border-0 bg-transparent p-[10px] text-left text-[.78rem] text-[#525e75] hover:bg-[#f4f6fb] hover:text-[#293d91] disabled:cursor-wait disabled:opacity-60" type="button" onClick={handleLogout} disabled={loggingOut}>
              <Icon name="logout" size={17} /> {loggingOut ? 'Signing out…' : 'Sign out'}
            </button>
          </div>
        </details>
      </div>
    </header>
  );
}
