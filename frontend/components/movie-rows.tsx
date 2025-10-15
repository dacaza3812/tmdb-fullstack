"use client"

import { Box, Button, CircularProgress } from "@mui/material"
import { MovieRow } from "@/components/movie-row"
import useSWR from "swr"
import { apiConfig, fetcher } from "@/lib/api"
import { useState } from "react"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
}

interface MoviesResponse {
  results: Movie[]
}

export function MovieRows() {
  const [pagesToShow, setPagesToShow] = useState(3)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const page1 = useSWR<MoviesResponse>(apiConfig.endpoints.popularMovies(1), fetcher, {
    revalidateOnFocus: false,
  })
  const page2 = useSWR<MoviesResponse>(apiConfig.endpoints.popularMovies(2), fetcher, {
    revalidateOnFocus: false,
  })
  const page3 = useSWR<MoviesResponse>(apiConfig.endpoints.popularMovies(3), fetcher, {
    revalidateOnFocus: false,
  })
  const page4 = useSWR<MoviesResponse>(pagesToShow >= 4 ? apiConfig.endpoints.popularMovies(4) : null, fetcher, {
    revalidateOnFocus: false,
  })
  const page5 = useSWR<MoviesResponse>(pagesToShow >= 5 ? apiConfig.endpoints.popularMovies(5) : null, fetcher, {
    revalidateOnFocus: false,
  })
  const page6 = useSWR<MoviesResponse>(pagesToShow >= 6 ? apiConfig.endpoints.popularMovies(6) : null, fetcher, {
    revalidateOnFocus: false,
  })
  const page7 = useSWR<MoviesResponse>(pagesToShow >= 7 ? apiConfig.endpoints.popularMovies(7) : null, fetcher, {
    revalidateOnFocus: false,
  })
  const page8 = useSWR<MoviesResponse>(pagesToShow >= 8 ? apiConfig.endpoints.popularMovies(8) : null, fetcher, {
    revalidateOnFocus: false,
  })
  const page9 = useSWR<MoviesResponse>(pagesToShow >= 9 ? apiConfig.endpoints.popularMovies(9) : null, fetcher, {
    revalidateOnFocus: false,
  })
  const page10 = useSWR<MoviesResponse>(pagesToShow >= 10 ? apiConfig.endpoints.popularMovies(10) : null, fetcher, {
    revalidateOnFocus: false,
  })

  const pages = [page1, page2, page3, page4, page5, page6, page7, page8, page9, page10]

  const handleLoadMore = () => {
    setIsLoadingMore(true)
    setPagesToShow((prev) => Math.min(prev + 2, 10))
    setTimeout(() => setIsLoadingMore(false), 500)
  }

  const rowTitles = [
    "Populares en Netflix",
    "Tendencias",
    "Mejor valoradas",
    "Acción y aventura",
    "Comedias",
    "Dramas",
    "Thrillers",
    "Documentales",
    "Ciencia ficción",
    "Terror",
  ]

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ mt: { xs: 2, md: -12 }, position: "relative", zIndex: 2 }}>
        {pages.slice(0, pagesToShow).map((pageData, index) => (
          <MovieRow
            key={index}
            title={rowTitles[index] || `Página ${index + 1}`}
            movies={pageData.data?.results || []}
          />
        ))}

        {pagesToShow < 10 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              sx={{
                bgcolor: "#e50914",
                color: "#fff",
                fontWeight: 700,
                fontSize: "1rem",
                px: 4,
                py: 1.5,
                borderRadius: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#f40612",
                },
                "&:disabled": {
                  bgcolor: "#666",
                  color: "#999",
                },
              }}
            >
              {isLoadingMore ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "#fff" }} />
                  Cargando...
                </>
              ) : (
                "Cargar más películas"
              )}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}
