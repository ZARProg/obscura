import { useEffect, useState } from "react";
import { fetchTrendingMovies } from "@/lib/tmdb"; // atau data dummy dulu
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroGrid() {
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    fetchTrendingMovies().then((res) => setMovies(res.results));
  }, []);

  return (
    <div className="bg-gray-900 text-white py-8">
      <div className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {movies.slice(0, 12).map((movie) => (
          <Link
            href={`/movie/${movie.id}`}
            key={movie.id}
            className="group relative overflow-hidden rounded-md"
          >
            <motion.img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            />
            <motion.div
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <span className="text-center px-2">{movie.title}</span>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
