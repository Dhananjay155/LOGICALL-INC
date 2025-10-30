export type MediaType = 'MOVIE' | 'TV_SHOW';

export interface Media {
  id: string;
  title: string;
  type: MediaType;
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    name: string;
    email: string;
  };
}

export interface MediaFormData {
  title: string;
  type: MediaType;
  director: string;
  budget: string;
  location: string;
  duration: string;
  year: string;
  imageUrl?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
}

export interface MediaResponse {
  media: Media[];
  pagination: PaginationInfo;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface SearchFilters {
  search: string;
  type: MediaType | '';
}