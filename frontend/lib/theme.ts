"use client"

import { createTheme } from "@mui/material/styles"

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#e50914", // Netflix red color
    },
    secondary: {
      main: "#e5e5e5",
    },
    background: {
      default: "#141414", // Netflix dark background
      paper: "#181818",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans)",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: "#4d4d4d #141414", // Netflix-style scrollbar
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: 8,
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            borderRadius: 8,
            backgroundColor: "#4d4d4d",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "#141414",
          },
        },
      },
    },
  },
})
