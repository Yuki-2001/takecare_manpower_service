const TOKEN_KEY = 'takecare.accessToken';
const USER_NAME_KEY = 'takecare.userName';
const USER_SESSION_KEY = 'takecare.userSession';

export const AUTH_SESSION_CHANGE_EVENT = 'takecare:session-changed';

export interface AuthenticatedUser {
  userIdPk?: string | null;
  userName: string;
  userEmail?: string | null;
  access?: string[] | null;
  profileImg?: string | null;
  designationName?: string | null;
  status?: string | null;
  roles?: {
    roleIdPk?: number | null;
    roleName?: string | null;
    roleCode?: string | null;
    roleDescription?: string | null;
  }[] | null;
}

export interface AuthSession {
  accessToken: string;
  userName: string;
  user: AuthenticatedUser | null;
  access: string[];
}

function notifySessionChange(): void {
  window.dispatchEvent(new Event(AUTH_SESSION_CHANGE_EVENT));
}

export function getAuthSession(): AuthSession | null {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  if (!accessToken) return null;

  let user: AuthenticatedUser | null = null;
  const userSession = localStorage.getItem(USER_SESSION_KEY);
  if (userSession) {
    try {
      user = JSON.parse(userSession) as AuthenticatedUser;
    } catch {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  }

  return {
    accessToken,
    userName: user?.userName ?? localStorage.getItem(USER_NAME_KEY) ?? 'TakeCare user',
    user,
    access: user?.access ?? [],
  };
}

export function saveAuthSession(session: Pick<AuthSession, 'accessToken' | 'userName'>): void {
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_NAME_KEY, session.userName);
  localStorage.removeItem(USER_SESSION_KEY);
  notifySessionChange();
}

export function updateAuthenticatedUser(user: AuthenticatedUser): void {
  localStorage.setItem(USER_NAME_KEY, user.userName);
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  notifySessionChange();
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(USER_SESSION_KEY);
  notifySessionChange();
}
