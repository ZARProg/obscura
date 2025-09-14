"use client";

import { X } from "lucide-react";
import Link from "next/link";

interface OverviewModalProps {
  open: boolean;
  onClose: () => void;
  data: any | null;
  type: "movie" | "tv";
}

const FALLBACK_POSTER = "/no-poster.png";

export default function OverviewModal({ open, onClose, data, type }: OverviewModalProps) {
  if (!open || !data) return null;

  const title = data.title || data.name || "Untitled";
  const year =
    data.release_date?.split("-")[0] ||
    data.first_air_date?.split("-")[0] ||
    "N/A";
  const poster = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : FALLBACK_POSTER;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 text-white rounded-xl max-w-3xl w-full mx-4 relative shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/50 hover:bg-black/70"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row">
          <img
            src={poster}
            alt={title}
            className="w-full md:w-1/3 h-[350px] object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
            onError={(e) => ((e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER)}
          />
          <div className="p-6 flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-400 text-sm mb-1">{year}</p>
            {data.vote_average ? (
              <p className="text-yellow-400 text-sm mb-3">
                ⭐ {data.vote_average.toFixed(1)} / 10
              </p>
            ) : null}

            <p className="text-gray-300 flex-1 overflow-y-auto pr-2">
              {data.overview && data.overview.trim() !== ""
                ? data.overview
                : "No overview available."}
            </p>

            <div className="mt-4 flex gap-3">
              <Link
                href={`/${type}/${data.id}`}
                onClick={onClose}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm"
              >
                More Details
              </Link>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
