"use client";

import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TrailerModal from "@/components/TrailerModal";

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Modal trailer
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    async function getMovies() {
      try {
        const data = await fetchTrendingMovies();
        setMovies(data.results || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    getMovies();
  }, []);

  // Auto slide banner tiap 5 detik
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % movies.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  // Fetch trailer dari TMDB
  const handlePlayTrailer = async (movieId: number) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
      );
      const data = await res.json();
      const trailer = data.results.find(
        (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      setTrailerKey(trailer ? trailer.key : null);
      setIsTrailerOpen(true);
    } catch (error) {
      console.error("Error fetching trailer:", error);
      setTrailerKey(null);
      setIsTrailerOpen(true);
    }
  };

  if (loading)
    return <p className="p-4 text-white bg-black">Loading movies...</p>;

  const currentMovie = movies[currentBanner];

  return (
    <main className="bg-black min-h-screen text-white">
      {/* Banner Section */}
      <div className="relative w-full h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          {currentMovie && (
            <motion.div
              key={currentMovie.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
                alt={currentMovie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-10 left-8 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  {currentMovie.title}
                </h2>
                <p className="mb-4 line-clamp-3">{currentMovie.overview}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePlayTrailer(currentMovie.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    ▶ Play Trailer
                  </button>
                  <Link
                    href={`/movie/${currentMovie.id}`}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prev / Next */}
        <button
          onClick={() =>
            setCurrentBanner((prev) => (prev - 1 + movies.length) % movies.length)
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
        >
          ‹
        </button>
        <button
          onClick={() => setCurrentBanner((prev) => (prev + 1) % movies.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-3 rounded-full"
        >
          ›
        </button>

        {/* Indicator Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {movies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBanner(idx)}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentBanner
                  ? "bg-white scale-110"
                  : "bg-gray-500 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Grid poster */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Trending Movies</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <Link
              href={`/movie/${movie.id}`}
              key={movie.id}
              className="group relative overflow-hidden rounded-lg"
            >
              {movie.poster_path ? (
                <motion.img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                />
              ) : (
                <div className="bg-gray-700 h-60 flex items-center justify-center">
                  No Image
                </div>
              )}
              <motion.div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                <p className="text-sm text-center px-2">{movie.title}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey={trailerKey}
      />
    </main>
  );
}
