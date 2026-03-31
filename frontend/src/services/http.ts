const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3333';

type RequestOptions = {
  method?: string;
  token?: string;
  body?: unknown;
};

export async function request<T>(path: string, options: RequestOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message ?? 'Request failed.');
  }

  if (response.status === 204) {
    return null as T;
  }

  return (await response.json()) as T;
}
