import { API_BASE_URL } from '../config/env';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions extends Omit<RequestInit, 'body'> {
  method?: HttpMethod;
  body?: unknown;
}

export async function http<TResponse>(path: string, options: HttpRequestOptions = {}): Promise<TResponse> {
  const { method = 'GET', body, headers, ...rest } = options;
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

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    let message = 'Request failed';
    if (typeof payload === 'string' && payload.trim()) {
      message = payload;
    } else if (typeof payload === 'object' && payload !== null) {
      const bodyPayload = payload as Record<string, unknown>;
      const details = Object.values(bodyPayload).find((value) => typeof value === 'string' && value.trim());
      const preferred = bodyPayload.message ?? bodyPayload.errorMessage ?? details;
      if (typeof preferred === 'string' && preferred.trim()) {
        message = preferred;
      }
    }
    throw new Error(message || 'Request failed');
  }

  return payload as TResponse;
}
