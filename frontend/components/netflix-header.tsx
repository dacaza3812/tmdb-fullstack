"use client"

import { AppBar, Toolbar, Box, Typography, Container } from "@mui/material"
import { Movie } from "@mui/icons-material"
import { useEffect, useState } from "react"
import Link from "next/link"

export function NetflixHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: scrolled ? "#141414" : "transparent",
        transition: "background-color 0.3s ease",
        backgroundImage: scrolled ? "none" : "linear-gradient(to bottom, rgba(0,0,0,0.7) 10%, transparent)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ px: { xs: 0, md: 2 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Movie sx={{ color: "#e50914", fontSize: 32 }} />
            <Typography
              variant="h6"
              sx={{
                color: "#e50914",
                fontWeight: 700,
                fontSize: { xs: "1.2rem", md: "1.5rem" },
                letterSpacing: "0.05em",
              }}
            >
              <Link href={"/"} prefetch>
              MOVIEFLIX
              </Link>
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
