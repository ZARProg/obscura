"use client";

import { useState } from "react";
import TrailerModal from "@/components/TrailerModal";

export default function TvDetailClient({
  tv,
  trailerKey,
  topCast,
}: {
  tv: any;
  trailerKey: string | null;
  topCast: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative w-full flex flex-col md:flex-row items-start p-6 max-w-5xl mx-auto">
        <img
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
          alt={tv.name}
          className="w-64 h-auto rounded-2xl shadow-lg"
        />
        <div className="mt-6 md:mt-0 md:ml-8 flex-1">
          <h1 className="text-4xl font-bold">{tv.name}</h1>
          <p className="text-gray-400 text-sm mt-1">
            {tv.first_air_date} • {tv.number_of_seasons} Season(s)
          </p>

          <div className="flex flex-wrap gap-2 mt-2">
            {tv.genres?.map((g: any) => (
              <span
                key={g.id}
                className="px-2 py-1 text-xs bg-gray-800 rounded-md"
              >
                {g.name}
              </span>
            ))}
          </div>

          <div className="mt-4">
            <p className="text-gray-300">{tv.overview}</p>
          </div>

          {topCast.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Top Cast</h3>
              <ul className="flex gap-4">
                {topCast.map((actor: any) => (
                  <li key={actor.id} className="text-sm text-gray-300">
                    {actor.name}{" "}
                    <span className="text-gray-500">as {actor.character}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {trailerKey && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              ▶ Watch Trailer
            </button>
          )}
        </div>
      </div>

      <TrailerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        trailerKey={trailerKey}
      />
    </div>
  );
}
