import { API_BASE_URL } from '../config/env';
import { clearAuthSession, updateAuthenticatedUser, type AuthenticatedUser } from '../features/auth/session';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions extends Omit<RequestInit, 'body'> {
  method?: HttpMethod;
  body?: unknown;
  skipForbiddenRecovery?: boolean;
}

export class HttpError extends Error {
  readonly status: number;

  constructor(
    message: string,
    status: number,
  ) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

let sessionRefreshRequest: Promise<void> | null = null;

async function refreshSession(): Promise<void> {
  if (!sessionRefreshRequest) {
    sessionRefreshRequest = http<AuthenticatedUser>('/user/session', {
      skipForbiddenRecovery: true,
    })
      .then(updateAuthenticatedUser)
      .catch((error: unknown) => {
        if (error instanceof HttpError && error.status === 403) {
          clearAuthSession();
          if (window.location.pathname !== '/login') {
            window.location.replace('/login');
          }
        }
        throw error;
      })
      .finally(() => {
        sessionRefreshRequest = null;
      });
  }

  return sessionRefreshRequest;
}

async function readPayload(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

function getErrorMessage(payload: unknown): string {
  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }
  if (typeof payload === 'object' && payload !== null) {
    const bodyPayload = payload as Record<string, unknown>;
    const details = Object.values(bodyPayload).find((value) => typeof value === 'string' && value.trim());
    const preferred = bodyPayload.message ?? bodyPayload.errorMessage ?? details;
    if (typeof preferred === 'string' && preferred.trim()) {
      return preferred;
    }
  }
  return 'Request failed';
}

export async function http<TResponse>(path: string, options: HttpRequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, headers, skipForbiddenRecovery = false, ...rest } = options;
  const requestHeaders = new Headers(headers);
  if (!requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  const accessToken = !path.startsWith('/auth/') ? localStorage.getItem('takecare.accessToken') : null;
  if (accessToken && !requestHeaders.has('Authorization')) {
    requestHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    credentials: 'include',
    ...rest,
  });

  const payload = await readPayload(response);

  if (!response.ok) {
    const error = new HttpError(getErrorMessage(payload), response.status);
    const isAuthApi = path.startsWith('/auth/');

    if (response.status === 403 && !isAuthApi) {
      if (path === '/user/session' || skipForbiddenRecovery) {
        clearAuthSession();
        if (window.location.pathname !== '/login') {
          window.location.replace('/login');
        }
      } else {
        await refreshSession();
      }
    }

    throw error;
  }

  return payload as TResponse;
}
