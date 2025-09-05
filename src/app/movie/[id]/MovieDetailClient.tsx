"use client";

import { useState } from "react";
import TrailerModal from "@/components/TrailerModal";
import Link from "next/link";

export default function MovieDetailClientBanner({
  movie,
  trailerKey,
  topCast,
}: {
  movie: any;
  trailerKey: string | null;
  topCast: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Banner */}
      <div
        className="relative h-[400px] md:h-[500px] w-full bg-cover bg-center"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            movie.backdrop_path || movie.poster_path
          })`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/40" />
        <div className="absolute bottom-8 left-6 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
          <p className="text-gray-300 text-sm mt-1">
            {movie.release_date} • {movie.runtime} min
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {movie.genres?.map((g: any) => (
              <span
                key={g.id}
                className="px-2 py-1 text-xs bg-gray-800 rounded-md"
              >
                {g.name}
              </span>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            {trailerKey && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                ▶ Watch Movies
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="max-w-5xl mx-auto p-6 space-y-4">
        <p className="text-gray-300">
          {movie.overview && movie.overview.trim() !== ""
            ? movie.overview
            : "No overview available"}
        </p>

        {/* Tambahan Aktor */}
        {topCast.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">Main Cast</h3>
            <ul className="flex gap-4 flex-wrap">
              {topCast.map((actor: any) => (
                <li key={actor.id} className="text-sm text-gray-300">
                  <Link
                    href={`/person/${actor.id}`}
                    className="text-blue-400 hover:underline"
                  >
                    {actor.name}
                  </Link>{" "}
                  <span className="text-gray-500">as {actor.character}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <TrailerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trailerKey={trailerKey}
      />
    </div>
  );
}
