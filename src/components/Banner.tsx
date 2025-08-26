"use client";

import { useEffect, useState } from "react";

interface BannerProps {
  movies: any[];
}

export default function Banner({ movies }: BannerProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000); // ganti slide tiap 5 detik
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] mb-8 overflow-hidden rounded-lg">
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold">{movie.title}</h2>
              <p className="text-sm md:text-base text-gray-300 max-w-2xl mt-2 line-clamp-3">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* indikator bulat */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === current ? "bg-white" : "bg-gray-500"
            }`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
}
