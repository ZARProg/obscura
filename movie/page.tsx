"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPopularMovies, getPosterUrl, fetchMovieDetails } from "@/lib/tmdb";
import SkeletonCard from "@/components/SkeletonCard";
import NoResults from "@/components/NoResults";
import OverviewModal from "@/components/OverviewModal";

const ITEMS_PER_PAGE = 20;
const FALLBACK_POSTER = "/no-poster.png";

export default function MoviePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);

  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [selectedMovie, setSelectedMovie] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularMovies(pageParam);
        if (cancelled) return;
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Error fetching movies:", err);
        if (!cancelled) {
          setMovies([]);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [pageParam]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    router.push(`/movie?page=${clamped}`);
  };

  const openOverview = async (id: number) => {
    try {
      const data = await fetchMovieDetails(id);
      setSelectedMovie(data);
      setOpenModal(true);
    } catch (err) {
      console.error("Error fetching movie detail:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <h1 className="text-3xl font-bold mb-6">Movies</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {movies.map((movie) => {
              const title = movie.title || "Untitled";
              const year = movie.release_date?.split("-")[0] || "N/A";

              return (
                <div
                  key={movie.id}
                  onClick={() => openOverview(movie.id)}
                  className="group cursor-pointer bg-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform relative"
                >
                  <img
                    src={getPosterUrl(movie.poster_path)}
                    alt={title}
                    className="w-full h-[350px] object-cover"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        FALLBACK_POSTER)
                    }
                  />

                  <span className="absolute top-2 left-2 bg-red-700 text-xs px-2 py-1 rounded-md font-semibold uppercase">
                    Movie
                  </span>

                  <div className="p-3">
                    <h2 className="text-lg font-semibold group-hover:text-red-700 line-clamp-1">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-400">{year}</p>
                    {movie.vote_average ? (
                      <p className="text-xs text-yellow-400 mt-1">
                        ⭐ {movie.vote_average.toFixed(1)}
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={pageParam <= 1}
                onClick={() => handlePageChange(pageParam - 1)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700"
              >
                Prev
              </button>
              <span className="text-sm text-gray-400">
                Page {Math.min(pageParam, totalPages)} of {totalPages}
              </span>
              <button
                disabled={pageParam >= totalPages}
                onClick={() => handlePageChange(pageParam + 1)}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          )}

          {/* Overview Modal */}
          <OverviewModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            data={selectedMovie}
            type="movie"
          />
        </>
      ) : (
        <NoResults query="movies" loading={loading} />
      )}
    </div>
  );
}
