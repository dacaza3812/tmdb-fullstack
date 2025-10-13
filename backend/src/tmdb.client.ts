import axios from 'axios';

export function createTmdbClient(apiKey: string) {
  return axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: { Authorization: `Bearer ${apiKey}` },
    params: { language: 'es-ES' },
    timeout: 5000,
  });
}
