import { Suspense } from "react"
import { HeroSection } from "@/components/hero-section"
import { MovieRows } from "@/components/movie-rows"

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#141414" }}>
      <Suspense fallback={<div style={{ height: "80vh", backgroundColor: "#141414" }} />}>
        <HeroSection />
      </Suspense>

      <Suspense fallback={<div style={{ height: "400px" }} />}>
        <MovieRows />
      </Suspense>
    </div>
  )
}
