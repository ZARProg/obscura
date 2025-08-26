"use client";

import Link from "next/link";

interface MovieCardProps {
  id: number;
  title: string;
  posterPath: string;
  rating: number;
}

const MovieCard: React.FC<MovieCardProps> = ({ id, title, posterPath, rating }) => {
  return (
    <Link
      href={`/movie/${id}`}
      className="bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.03] transition-all duration-200"
    >
      <img
        src={`https://image.tmdb.org/t/p/w500${posterPath}`}
        alt={title}
        className="w-full h-[350px] object-cover"
      />
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-1">{title}</h3>
        <p className="text-yellow-400 text-sm mt-1">⭐ {rating.toFixed(1)}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
