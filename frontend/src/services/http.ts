import { clearSession, getStoredSession } from './session';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

type RequestOptions = Omit<RequestInit, 'body' | 'headers'> & {
  auth?: boolean;
  token?: string;
  headers?: HeadersInit;
  body?: unknown;
};

function isRawBody(body: unknown): body is BodyInit {
  return (
    typeof body === 'string' ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  );
}

export async function request<T>(path: string, options: RequestOptions = {}) {
  const session = getStoredSession();
  const token = options.token ?? (options.auth ? session?.token : undefined);
  const headers = new Headers(options.headers);

  let body: BodyInit | undefined;

  if (options.body !== undefined) {
    if (isRawBody(options.body)) {
      body = options.body;
    } else {
      body = JSON.stringify(options.body);

      if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body,
  });

  if (response.status === 401 && (options.auth || options.token)) {
    clearSession();
    throw new Error('Sua sessão expirou. Faça login novamente.');
  }

  if (!response.ok) {
    let message = 'Ocorreu um erro na requisição.';

    try {
      const errorData = await response.json();
      message = errorData.message ?? message;
    } catch {
      // ignora parse
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
