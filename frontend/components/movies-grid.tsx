"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Grid, Card, CardMedia, CardContent, Typography, Box, Pagination, Chip, Rating, Skeleton } from "@mui/material"
import { CalendarToday } from "@mui/icons-material"
import useSWR from "swr"
import { apiConfig, fetcher } from "@/lib/api"

interface Movie {
  id: number
  title: string
  poster_path: string
  release_date: string
  vote_average: number
  overview: string
}

interface MoviesResponse {
  page: number
  results: Movie[]
  total_pages: number
}

function MovieSkeleton() {
  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#1e293b",
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          paddingTop: "150%", // 2:3 aspect ratio
          overflow: "hidden",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "#334155",
          }}
          animation="wave"
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
        <Skeleton
          variant="text"
          sx={{
            bgcolor: "#334155",
            fontSize: "0.75rem",
            mb: 0.5,
          }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          sx={{
            bgcolor: "#334155",
            fontSize: "0.75rem",
            width: "60%",
            mb: 0.5,
          }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          sx={{
            bgcolor: "#334155",
            fontSize: "0.625rem",
            width: "40%",
            mb: 0.5,
          }}
          animation="wave"
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Skeleton
            variant="rectangular"
            sx={{
              bgcolor: "#334155",
              width: 80,
              height: 16,
            }}
            animation="wave"
          />
          <Skeleton
            variant="rectangular"
            sx={{
              bgcolor: "#334155",
              width: 32,
              height: 16,
              borderRadius: 2,
            }}
            animation="wave"
          />
        </Box>
      </CardContent>
    </Card>
  )
}

export function MoviesGrid({
  page,
  searchQuery,
}: {
  page: number
  searchQuery: string
}) {
  const router = useRouter()

  const {
    data: movies,
    error,
    isLoading,
  } = useSWR<MoviesResponse>(apiConfig.endpoints.popularMovies(page), fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 60000, // Cache for 1 minute
  })

  const { data: nextPageData } = useSWR<MoviesResponse>(
    movies ? apiConfig.endpoints.popularMovies(page + 1) : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  useEffect(() => {
    if (nextPageData) {
      console.log("[v0] Next page prefetched successfully")
    }
  }, [nextPageData])

  const filteredMovies = searchQuery
    ? movies?.results.filter((movie) => movie.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : movies?.results

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/?page=${value}${searchQuery ? `&search=${searchQuery}` : ""}`)
  }

  const handleMovieClick = (movieId: number) => {
    router.push(`/movies/${movieId}`)
  }

  if (isLoading) {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: 20 }).map((_, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <MovieSkeleton />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
          Error al cargar las películas
        </Typography>
        <Typography sx={{ color: "#94a3b8", mb: 2 }}>{error.message}</Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Verifica que la API esté corriendo en: {apiConfig.baseUrl}
        </Typography>
      </Box>
    )
  }

  if (!filteredMovies || filteredMovies.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
          No se encontraron películas
        </Typography>
        <Typography sx={{ color: "#94a3b8" }}>Intenta con otra búsqueda</Typography>
      </Box>
    )
  }

  return (
    <>
      <Grid container spacing={2}>
        {filteredMovies.map((movie) => (
          <Grid item xs={6} sm={4} md={3} key={movie.id}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                bgcolor: "#1e293b",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: "0 12px 24px rgba(225, 29, 72, 0.3)",
                },
              }}
              onClick={() => handleMovieClick(movie.id)}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "150%", // 2:3 aspect ratio (height = 150% of width)
                  overflow: "hidden",
                  bgcolor: "#334155",
                }}
              >
                <CardMedia
                  component="img"
                  image={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/abstract-movie-poster.png"
                  }
                  alt={movie.title}
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ensures image covers the area without distortion
                  }}
                />
              </Box>
              <CardContent
                sx={{
                  p: 1.5,
                  height: 110,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    mb: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.2,
                    height: "2.4em",
                    fontSize: { xs: "0.75rem", sm: "0.8rem" },
                  }}
                >
                  {movie.title}
                </Typography>
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      mb: 0.5,
                    }}
                  >
                    <CalendarToday sx={{ fontSize: 12, color: "#94a3b8" }} />
                    <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: "0.7rem" }}>
                      {movie.release_date?.split("-")[0] || "N/A"}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Rating
                      value={movie.vote_average / 2}
                      precision={0.1}
                      size="small"
                      readOnly
                      sx={{
                        fontSize: "0.9rem",
                        "& .MuiRating-iconFilled": { color: "#e11d48" },
                        "& .MuiRating-iconEmpty": { color: "#475569" },
                      }}
                    />
                    <Chip
                      label={movie.vote_average.toFixed(1)}
                      size="small"
                      sx={{
                        bgcolor: "#e11d48",
                        color: "#fff",
                        fontWeight: 600,
                        fontSize: "0.65rem",
                        height: 18,
                        minWidth: 32,
                      }}
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {movies && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={Math.min(movies.total_pages, 500)}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "#fff",
                borderColor: "#475569",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                bgcolor: "#e11d48",
                color: "#fff",
                "&:hover": {
                  bgcolor: "#be123c",
                },
              },
            }}
          />
        </Box>
      )}
    </>
  )
}
