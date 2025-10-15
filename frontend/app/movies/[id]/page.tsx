import { Suspense } from "react"
import { MovieDetails } from "@/components/movie-details"

export default async function MoviePage({ params }: { params: { id: string } }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0e27" }}>
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              color: "#e11d48",
            }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-current"></div>
          </div>
        }
      >
        <MovieDetails movieId={params.id} />
      </Suspense>
    </div>
  )
}
