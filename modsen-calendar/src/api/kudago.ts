import axios from 'axios';

const kudagoApi = axios.create({
  baseURL: '/kudago-api',
  timeout: 7000
});

export const searchKudaGoEvents = async (keyword: string) => {
  const query = keyword.trim();
  const { data } = await kudagoApi.get('/search/', {
    params: {
      q: query,
      ctype: 'event',
      location: 'spb',
      page_size: 5
    }
  });

  const normalizedQuery = query.toLowerCase();
  const results = (data.results ?? []) as Array<{ id: number; title: string }>;

  const relevant = results.filter((item) => item.title.toLowerCase().includes(normalizedQuery));
  return (relevant.length > 0 ? relevant : results).slice(0, 5);
};
