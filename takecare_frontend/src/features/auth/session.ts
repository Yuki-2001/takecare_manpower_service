const TOKEN_KEY = 'takecare.accessToken';
const USER_NAME_KEY = 'takecare.userName';

export interface AuthSession {
  accessToken: string;
  userName: string;
}

export function getAuthSession(): AuthSession | null {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  if (!accessToken) return null;

  return {
    accessToken,
    userName: localStorage.getItem(USER_NAME_KEY) ?? 'TakeCare user',
  };
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(TOKEN_KEY, session.accessToken);
  localStorage.setItem(USER_NAME_KEY, session.userName);
}

export function clearAuthSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}
