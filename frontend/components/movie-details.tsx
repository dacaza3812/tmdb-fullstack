"use client"

import { Box, Container, Typography, Chip, Rating, Grid, IconButton } from "@mui/material"
import { CalendarToday, AccessTime, Language, Home, ArrowBack } from "@mui/icons-material"
import useSWR from "swr"
import { apiConfig, fetcher } from "@/lib/api"
import { useRouter } from "next/navigation"

interface MovieDetail {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string
  backdrop_path: string
  release_date: string
  vote_average: number
  vote_count: number
  runtime: number
  genres: { id: number; name: string }[]
  spoken_languages: { english_name: string }[]
  budget: number
  revenue: number
}

export function MovieDetails({ movieId }: { movieId: string }) {
  const router = useRouter()
  const {
    data: movie,
    error,
    isLoading,
  } = useSWR<MovieDetail>(apiConfig.endpoints.movieDetails(movieId), fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    dedupingInterval: 300000,
  })

  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8, color: "#94a3b8" }}>
        <Typography>Cargando detalles...</Typography>
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h5" sx={{ color: "#fff", mb: 2 }}>
            Error al cargar la película
          </Typography>
          <Typography sx={{ color: "#94a3b8", mb: 2 }}>{error.message}</Typography>
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            Verifica que la API esté corriendo en: {apiConfig.baseUrl}
          </Typography>
        </Box>
      </Container>
    )
  }

  if (!movie) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" sx={{ color: "#fff" }}>
          Película no encontrada
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {/* Backdrop Header */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "300px", md: "500px" },
          backgroundImage: movie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10, 14, 39, 0.3) 0%, rgba(10, 14, 39, 0.95) 100%)",
          },
        }}
      >
        <Container maxWidth="xl" sx={{ position: "relative", pt: 10 }}>
          <IconButton
            onClick={() => router.push("/")}
            sx={{
              color: "#fff",
              bgcolor: "rgba(0, 0, 0, 0.5)",
              "&:hover": { bgcolor: "rgba(0, 0, 0, 0.7)" },
            }}
          >
            <ArrowBack />
          </IconButton>
        </Container>
      </Box>

      {/* Movie Content */}
      <Container maxWidth="xl" sx={{ mt: -15, position: "relative", pb: 6 }}>
        <Grid container spacing={4}>
          {/* Poster */}
          <Grid item xs={12} md={4} lg={3}>
            <Box
              component="img"
              src={
                movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/abstract-movie-poster.png"
              }
              alt={movie.title}
              sx={{
                width: "100%",
                borderRadius: 2,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
              }}
            />
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={8} lg={9}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                color: "#fff",
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.75rem", md: "2.5rem" },
              }}
            >
              {movie.title}
            </Typography>

            {movie.original_title !== movie.title && (
              <Typography variant="subtitle1" sx={{ color: "#94a3b8", mb: 2, fontStyle: "italic" }}>
                {movie.original_title}
              </Typography>
            )}

            {/* Rating */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Rating
                value={movie.vote_average / 2}
                precision={0.1}
                size="large"
                readOnly
                sx={{
                  "& .MuiRating-iconFilled": { color: "#e11d48" },
                  "& .MuiRating-iconEmpty": { color: "#475569" },
                }}
              />
              <Chip
                label={`${movie.vote_average.toFixed(1)}/10`}
                sx={{
                  bgcolor: "#e11d48",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              />
              <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                ({movie.vote_count.toLocaleString()} votos)
              </Typography>
            </Box>

            {/* Genres */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
              {movie.genres.map((genre) => (
                <Chip
                  key={genre.id}
                  label={genre.name}
                  sx={{
                    bgcolor: "#1e293b",
                    color: "#fff",
                    borderColor: "#475569",
                    border: "1px solid",
                  }}
                />
              ))}
            </Box>

            {/* Meta Info */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarToday sx={{ color: "#e11d48", fontSize: 20 }} />
                <Typography sx={{ color: "#94a3b8" }}>
                  {new Date(movie.release_date).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
              {movie.runtime > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccessTime sx={{ color: "#e11d48", fontSize: 20 }} />
                  <Typography sx={{ color: "#94a3b8" }}>
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
                  </Typography>
                </Box>
              )}
              {movie.spoken_languages.length > 0 && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Language sx={{ color: "#e11d48", fontSize: 20 }} />
                  <Typography sx={{ color: "#94a3b8" }}>{movie.spoken_languages[0].english_name}</Typography>
                </Box>
              )}
            </Box>

            {/* Overview */}
            {movie.overview && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: "#fff", fontWeight: 600, mb: 1 }}>
                  Sinopsis
                </Typography>
                <Typography
                  sx={{
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                    fontSize: { xs: "0.95rem", md: "1rem" },
                  }}
                >
                  {movie.overview}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  )
}
