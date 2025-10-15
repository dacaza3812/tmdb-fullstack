const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://tmdb-fullstack.onrender.com"

export const apiConfig = {
  baseUrl: API_BASE_URL,
  endpoints: {
    popularMovies: (page: number) => `${API_BASE_URL}/movies/popular?page=${page}`,
    movieDetails: (id: string) => `${API_BASE_URL}/movies/${id}`,
  },
}

export const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}
