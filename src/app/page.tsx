"use client";

import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "@/lib/tmdb";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentBanner, setCurrentBanner] = useState(0);

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

  // auto-slide banner setiap 5 detik
  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [movies]);

  if (loading)
    return <p className="p-4 text-white bg-gray-900">Loading movies...</p>;

  return (
    <main className="bg-gray-900 min-h-screen text-white">
      <div className="container mx-auto px-4 py-8">

        {/* Banner Slider */}
        {movies.length > 0 && (
          <div className="relative w-full h-[400px] mb-8 overflow-hidden rounded-xl">
            {movies.slice(0, 5).map((movie, index) => (
              <motion.div
                key={movie.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
                  index === currentBanner ? "opacity-100" : "opacity-0"
                }`}
              >
                {movie.backdrop_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    No Image
                  </div>
                )}

                {/* Overlay teks */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-end p-6">
                  <div>
                    <h2 className="text-2xl font-bold">{movie.title}</h2>
                    <p className="text-sm text-gray-300 line-clamp-2 max-w-2xl">
                      {movie.overview}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {movies.slice(0, 5).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBanner(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentBanner === index ? "bg-white" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Grid poster */}
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

              {/* Overlay muncul saat hover */}
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
    </main>
  );
}
