export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Place = {
  id: string;
  name: string;
  description: string;
  address: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  imageUrl: string | null;
  categoryId: string;
  category: Category;
};

export type Suggestion = {
  id: string;
  name: string;
  description: string | null;
  address: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  categoryName: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  receiveUpdates: boolean;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type SignupResponse = {
  message: string;
  user: User;
};

export type Profile = User & {
  createdAt: string;
};

export type SuggestionPayload = {
  name: string;
  description?: string;
  address: string;
  neighborhood: string;
  latitude?: number;
  longitude?: number;
  categoryName: string;
};

export type SuggestionStatusResponse = {
  suggestion: Suggestion;
  place?: Place;
};
