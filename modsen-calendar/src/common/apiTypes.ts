export interface KudaGoEvent {
  id: number;
  title: string;
  description?: string;
  body_text?: string;
  location?: {
    name: string;
    address: string;
  };
  dates?: Array<{
    start: string;
    end: string;
  }>;
  images?: Array<{
    image: string;
    source: {
      name: string;
      link: string;
    };
  }>;
  categories?: string[];
  tags?: string[];
  price?: string;
  is_free?: boolean;
  site_url?: string;
}

export interface KudaGoSearchResponse {
  count: number;
  next?: string;
  previous?: string;
  results: KudaGoEvent[];
}

export interface KudaGoSearchParams {
  q: string;
  ctype: 'event' | 'place';
  location: string;
  page_size: number;
  page?: number;
  fields?: string;
  expand?: string;
  order_by?: string;
  text_format?: 'text' | 'html' | 'markdown';
}

export interface FirebaseAuthError extends Error {
  code: string;
  message: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
  photoURL?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: unknown;
}