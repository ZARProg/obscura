"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchMultiSearch, fetchPersonCredits } from "@/lib/tmdb";

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

const ITEMS_PER_PAGE = 15;
const FALLBACK_POSTER = "/no-poster.png";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await fetchMultiSearch(query, pageParam);
        let finalResults: SearchResult[] = Array.isArray(data.results)
          ? data.results
          : [];

        // 🔥 kalau hasil utama adalah "person", fetch juga semua movie/TV nya
        const person = finalResults.find((r) => r.media_type === "person");
        if (person) {
          const credits = await fetchPersonCredits(person.id.toString());
          if (credits?.cast) {
            const mappedCredits: SearchResult[] = credits.cast.map((c: any) => ({
              id: c.id,
              media_type: c.media_type,
              title: c.title,
              name: c.name,
              poster_path: c.poster_path,
              release_date: c.release_date,
              first_air_date: c.first_air_date,
              vote_average: c.vote_average,
            }));

            // tambahkan movie/TV ke hasil search
            finalResults = [person, ...mappedCredits];
          }
        }

        setResults(finalResults);
        setTotalPages(Number(data.total_pages) || 1);
      } catch (err) {
        console.error("Error fetching search results:", err);
        setResults([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, pageParam]);

  const handlePageChange = (newPage: number) => {
    router.push(`/search?query=${encodeURIComponent(query)}&page=${newPage}`);
  };

  const pageItems = useMemo(() => {
    return results.slice(0, ITEMS_PER_PAGE);
  }, [results]);

  const getPoster = (item: SearchResult) => {
    if (item.media_type === "person") {
      return item.profile_path
        ? `https://image.tmdb.org/t/p/w500${item.profile_path}`
        : FALLBACK_POSTER;
    }
    return item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : FALLBACK_POSTER;
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for:{" "}
        <span className="text-red-700">{query || "..."}</span>
      </h1>

      {loading ? (
        // Skeleton
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-800 animate-pulse rounded-lg h-[400px]"
            />
          ))}
        </div>
      ) : pageItems.length > 0 ? (
        <>
          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {pageItems.map((item) => {
              const title = item.title || item.name || "Untitled";
              const year =
                item.release_date?.split("-")[0] ||
                item.first_air_date?.split("-")[0] ||
                "N/A";

              const goToDetail = () => {
                if (item.media_type === "person") {
                  router.push(`/person/${item.id}`);
                } else {
                  router.push(`/${item.media_type}/${item.id}`);
                }
              };

              return (
                <div
                  key={`${item.media_type}-${item.id}`}
                  onClick={goToDetail}
                  className="group cursor-pointer bg-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform relative"
                >
                  <img
                    src={getPoster(item)}
                    alt={title}
                    className="w-full h-[350px] object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        FALLBACK_POSTER;
                    }}
                  />

                  <span className="absolute top-2 left-2 bg-red-700 text-xs px-2 py-1 rounded-md font-semibold uppercase">
                    {item.media_type === "movie"
                      ? "Movie"
                      : item.media_type === "tv"
                      ? "Series"
                      : "Actor"}
                  </span>

                  <div className="p-3">
                    <h2 className="text-lg font-semibold group-hover:text-red-700 line-clamp-1">
                      {title}
                    </h2>
                    {item.media_type === "person" ? (
                      <p className="text-sm text-gray-400">Actor/Actress</p>
                    ) : (
                      <>
                        <p className="text-sm text-gray-400">{year}</p>
                        {item.vote_average ? (
                          <p className="text-xs text-yellow-400 mt-1">
                            ⭐ {item.vote_average.toFixed(1)}
                          </p>
                        ) : null}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
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
                Page {pageParam} of {totalPages}
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
        </>
      ) : (
        <p className="text-gray-400">No results found.</p>
      )}
    </div>
  );
}
