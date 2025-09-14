import { notFound } from "next/navigation";
import { fetchMovieDetails } from "@/lib/tmdb";
import MovieDetailClient from "./MovieDetailClient";

interface MovieDetailProps {
  params: { id: string };
}

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const movie = await fetchMovieDetails(Number(params.id));
  if (!movie || movie.success === false) return notFound();

  const trailer = movie.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const topCast = movie.credits?.cast?.slice(0, 5) || [];

  return (
    <MovieDetailClient movie={movie} trailerKey={trailer?.key || null} topCast={topCast} />
  );
}
