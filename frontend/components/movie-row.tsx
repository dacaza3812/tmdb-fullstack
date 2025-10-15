"use client"

import { useRef } from "react"
import { Box, Typography, IconButton, Card, CardMedia } from "@mui/material"
import { ChevronLeft, ChevronRight } from "@mui/icons-material"
import { useRouter } from "next/navigation"

interface Movie {
  id: number
  title: string
  poster_path: string
  vote_average: number
}

export function MovieRow({
  title,
  movies,
}: {
  title?: string
  movies: Movie[]
}) {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (!movies || movies.length === 0) return null

  return (
    <Box sx={{ mb: 4, position: "relative", group: "movie-row" }}>
      {title && (
        <Typography
          variant="h5"
          sx={{
            color: "#e5e5e5",
            fontWeight: 600,
            mb: 2,
            px: { xs: 2, md: 4 },
            fontSize: { xs: "1.2rem", md: "1.4rem" },
          }}
        >
          {title}
        </Typography>
      )}

      <Box sx={{ position: "relative", px: { xs: 2, md: 4 } }}>
        {/* Left Arrow */}
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "#fff",
            width: { xs: 40, md: 50 },
            height: { xs: 60, md: 80 },
            borderRadius: 0,
            opacity: 0,
            transition: "opacity 0.3s",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
            ".movie-row:hover &": {
              opacity: 1,
            },
          }}
        >
          <ChevronLeft sx={{ fontSize: { xs: 30, md: 40 } }} />
        </IconButton>

        {/* Scrollable Container */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            pb: 1,
          }}
        >
          {movies.map((movie) => (
            <Card
              key={movie.id}
              onClick={() => router.push(`/movies/${movie.id}`)}
              sx={{
                minWidth: { xs: 120, sm: 150, md: 200 },
                maxWidth: { xs: 120, sm: 150, md: 200 },
                bgcolor: "transparent",
                cursor: "pointer",
                transition: "transform 0.3s ease, z-index 0s 0.3s",
                position: "relative",
                "&:hover": {
                  transform: "scale(1.15)",
                  zIndex: 10,
                  transition: "transform 0.3s ease, z-index 0s 0s",
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  paddingTop: "150%",
                  overflow: "hidden",
                  borderRadius: 1,
                  bgcolor: "#2a2a2a",
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
                    objectFit: "cover",
                  }}
                />
              </Box>
            </Card>
          ))}
        </Box>

        {/* Right Arrow */}
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 2,
            bgcolor: "rgba(0,0,0,0.5)",
            color: "#fff",
            width: { xs: 40, md: 50 },
            height: { xs: 60, md: 80 },
            borderRadius: 0,
            opacity: 0,
            transition: "opacity 0.3s",
            "&:hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
            ".movie-row:hover &": {
              opacity: 1,
            },
          }}
        >
          <ChevronRight sx={{ fontSize: { xs: 30, md: 40 } }} />
        </IconButton>
      </Box>
    </Box>
  )
}
