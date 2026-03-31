import type {
  AuthResponse,
  Category,
  Place,
  Profile,
  SignupResponse,
  Suggestion,
  SuggestionPayload,
  SuggestionStatusResponse,
} from '../types/api';
import { request } from './http';

export function getCategories() {
  return request<Category[]>('/categories');
}

export function getPlaces(params?: { search?: string; category?: string; neighborhood?: string }) {
  const query = new URLSearchParams();

  if (params?.search) {
    query.set('search', params.search);
  }

  if (params?.category) {
    query.set('category', params.category);
  }

  if (params?.neighborhood) {
    query.set('neighborhood', params.neighborhood);
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';

  return request<Place[]>(`/places${suffix}`);
}

export function getPlaceById(id: string) {
  return request<Place>(`/places/${id}`);
}

export function login(payload: { email: string; password: string }) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
  receiveUpdates: boolean;
}) {
  const response = await request<SignupResponse>('/auth/cadastro', {
    method: 'POST',
    body: payload,
  });

  const auth = await login({
    email: payload.email,
    password: payload.password,
  });

  return {
    response,
    auth,
  };
}

export function forgotPassword(payload: { email: string }) {
  return request<{ message: string }>('/auth/esqueci-senha', {
    method: 'POST',
    body: payload,
  });
}

export function resetPassword(payload: { token: string; password: string }) {
  return request<{ message: string }>('/auth/redefinir-senha', {
    method: 'POST',
    body: payload,
  });
}

export function createSuggestion(payload: SuggestionPayload) {
  return request('/suggestions', {
    method: 'POST',
    body: payload,
  });
}

export function getAdminSuggestions(token: string) {
  return request<Suggestion[]>('/suggestions/admin', { token });
}

export function updateSuggestionStatus(
  token: string,
  id: string,
  payload: {
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    categoryId?: string;
  },
) {
  return request<SuggestionStatusResponse>(`/suggestions/admin/${id}/status`, {
    method: 'PATCH',
    token,
    body: payload,
  });
}

export function createCategory(token: string, payload: { name: string }) {
  return request<Category>('/categories', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function createPlace(
  token: string,
  payload: {
    name: string;
    description: string;
    address: string;
    neighborhood: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    categoryId: string;
  },
) {
  return request<Place>('/places', {
    method: 'POST',
    token,
    body: payload,
  });
}

export function updatePlace(
  token: string,
  id: string,
  payload: {
    name: string;
    description: string;
    address: string;
    neighborhood: string;
    latitude?: number;
    longitude?: number;
    imageUrl?: string;
    categoryId: string;
  },
) {
  return request<Place>(`/places/${id}`, {
    method: 'PUT',
    token,
    body: payload,
  });
}

export function getProfile(token: string) {
  return request<Profile>('/perfil/me', { token });
}

export function updatePreferences(token: string, payload: { receiveUpdates: boolean }) {
  return request<Profile>('/perfil/me/preferencias', {
    method: 'PATCH',
    token,
    body: payload,
  });
}
