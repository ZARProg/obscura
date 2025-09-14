"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchPopularTV, getPosterUrl, fetchTVDetails } from "@/lib/tmdb";
import SkeletonCard from "@/components/SkeletonCard";
import NoResults from "@/components/NoResults";
import OverviewModal from "@/components/OverviewModal";

const ITEMS_PER_PAGE = 20;
const FALLBACK_POSTER = "/no-poster.png";

export default function TVShowsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);

  const [tvShows, setTvShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [selectedTV, setSelectedTV] = useState<any | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchPopularTV(pageParam);
        if (cancelled) return;
        setTvShows(data.results || []);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error("Error fetching TV shows:", err);
        if (!cancelled) {
          setTvShows([]);
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
    router.push(`/tv?page=${clamped}`);
  };

  const openOverview = async (id: number) => {
    try {
      const data = await fetchTVDetails(id);
      setSelectedTV(data);
      setOpenModal(true);
    } catch (err) {
      console.error("Error fetching TV detail:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <h1 className="text-3xl font-bold mb-6">TV Shows</h1>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : tvShows.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {tvShows.map((show) => {
              const title = show.name || "Untitled";
              const year = show.first_air_date?.split("-")[0] || "N/A";

              return (
                <div
                  key={show.id}
                  onClick={() => openOverview(show.id)}
                  className="group cursor-pointer bg-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform relative"
                >
                  <img
                    src={getPosterUrl(show.poster_path)}
                    alt={title}
                    className="w-full h-[350px] object-cover"
                    onError={(e) =>
                      ((e.currentTarget as HTMLImageElement).src =
                        FALLBACK_POSTER)
                    }
                  />

                  <span className="absolute top-2 left-2 bg-red-700 text-xs px-2 py-1 rounded-md font-semibold uppercase">
                    Series
                  </span>

                  <div className="p-3">
                    <h2 className="text-lg font-semibold group-hover:text-red-700 line-clamp-1">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-400">{year}</p>
                    {show.vote_average ? (
                      <p className="text-xs text-yellow-400 mt-1">
                        ⭐ {show.vote_average.toFixed(1)}
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
            data={selectedTV}
            type="tv"
          />
        </>
      ) : (
        <NoResults query="tv shows" loading={loading} />
      )}
    </div>
  );
}
