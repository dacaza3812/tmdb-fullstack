"use client"

import { Box, Typography, Button, Container } from "@mui/material"
import { PlayArrow, InfoOutlined } from "@mui/icons-material"
import useSWR from "swr"
import { apiConfig, fetcher } from "@/lib/api"
import { useRouter } from "next/navigation"

interface Movie {
  id: number
  title: string
  backdrop_path: string
  overview: string
  vote_average: number
}

interface MoviesResponse {
  results: Movie[]
}

export function HeroSection() {
  const router = useRouter()
  const { data } = useSWR<MoviesResponse>(apiConfig.endpoints.popularMovies(1), fetcher, {
    revalidateOnFocus: false,
  })

  const featuredMovie = data?.results[0]

  if (!featuredMovie) return null

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "70vh", md: "80vh" },
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: featuredMovie.backdrop_path
            ? `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "linear-gradient(to top, #141414 0%, transparent 50%, #141414 100%), linear-gradient(to right, #141414 0%, transparent 50%)",
          },
        }}
      />

      {/* Content */}
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          pt: { xs: 8, md: 0 },
        }}
      >
        <Box sx={{ maxWidth: { xs: "100%", md: "50%" } }}>
          <Typography
            variant="h2"
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
              mb: 2,
              textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            {featuredMovie.title}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              sx={{
                bgcolor: "#46d369",
                color: "#000",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontWeight: 700,
                fontSize: "0.9rem",
              }}
            >
              {Math.round(featuredMovie.vote_average * 10)}% Match
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: "#fff",
              fontSize: { xs: "0.9rem", md: "1.1rem" },
              mb: 3,
              lineHeight: 1.6,
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {featuredMovie.overview}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              onClick={() => router.push(`/movies/${featuredMovie.id}`)}
              sx={{
                bgcolor: "#fff",
                color: "#000",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.5 },
                borderRadius: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.75)",
                },
              }}
            >
              Reproducir
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<InfoOutlined />}
              onClick={() => router.push(`/movies/${featuredMovie.id}`)}
              sx={{
                bgcolor: "rgba(109, 109, 110, 0.7)",
                color: "#fff",
                fontWeight: 700,
                fontSize: { xs: "0.9rem", md: "1.1rem" },
                px: { xs: 2, md: 3 },
                py: { xs: 1, md: 1.5 },
                borderRadius: 1,
                textTransform: "none",
                "&:hover": {
                  bgcolor: "rgba(109, 109, 110, 0.4)",
                },
              }}
            >
              Más información
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}
