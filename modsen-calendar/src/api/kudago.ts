import axios, { AxiosError } from 'axios';
import { KudaGoEvent, KudaGoSearchResponse, KudaGoSearchParams, ApiError } from '@/common/apiTypes';
import { UI_CONSTANTS } from '@/common/uiConstants';

const kudagoApi = axios.create({
  baseURL: '/kudago-api',
  timeout: UI_CONSTANTS.API_TIMEOUT_MS
});

kudagoApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError: ApiError = {
      message: error.message || 'Network error',
      code: error.code,
      details: error.response?.data
    };
    return Promise.reject(apiError);
  }
);

export const searchKudaGoEvents = async (keyword: string): Promise<KudaGoEvent[]> => {
  if (!keyword.trim() || keyword.trim().length < UI_CONSTANTS.SEARCH_MIN_LENGTH) {
    return [];
  }

  try {
    const query = keyword.trim();
    const params: KudaGoSearchParams = {
      q: query,
      ctype: 'event',
      location: UI_CONSTANTS.DEFAULT_LOCATION,
      page_size: UI_CONSTANTS.SEARCH_RESULTS_LIMIT,
      fields: 'id,title,description,dates,location',
      text_format: 'text'
    };

    const { data } = await kudagoApi.get<KudaGoSearchResponse>('/search/', { params });

    const normalizedQuery = query.toLowerCase();
    const results = data.results || [];

    const relevant = results.filter((item) => 
      item.title.toLowerCase().includes(normalizedQuery)
    );

    return (relevant.length > 0 ? relevant : results)
      .slice(0, UI_CONSTANTS.SEARCH_RESULTS_LIMIT);

  } catch (error) {
    console.error('KudaGo API Error:', error);
    
    return [];
  }
};

export const searchKudaGoEventsWithRetry = async (
  keyword: string, 
  maxRetries: number = 2
): Promise<KudaGoEvent[]> => {
  let lastError: ApiError | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await searchKudaGoEvents(keyword);
    } catch (error) {
      lastError = error as ApiError;
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error(`Failed to search after ${maxRetries + 1} attempts:`, lastError);
  return [];
};
