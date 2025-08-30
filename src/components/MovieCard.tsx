"use client";

import Image from "next/image";
import NoImage from "./NoImage";

interface MovieCardProps {
  movie: any;
  type?: "movie" | "tv";
}

export default function MovieCard({ movie, type = "movie" }: MovieCardProps) {
  const title = type === "tv" ? movie.name : movie.title;
  const date =
    type === "tv" ? movie.first_air_date : movie.release_date;

  return (
    <div className="border rounded overflow-hidden shadow hover:shadow-lg transition">
      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={title || "Untitled"}
          width={500}
          height={750}
          className="w-full h-72 object-cover"
        />
      ) : (
        <NoImage className="w-full h-72" />
      )}

      <div className="p-2">
        <h3 className="font-semibold text-sm line-clamp-1">{title}</h3>
        <p className="text-xs text-gray-500">{date || "Unknown"}</p>
      </div>
    </div>
  );
}
