"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fetchMultiSearch, fetchPersonCredits } from "@/lib/tmdb";
import NoResults from "@/components/NoResults";
import SkeletonCard from "@/components/SkeletonCard";

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
  const pageParam = Math.max(1, Number(searchParams.get("page")) || 1);

  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [personMode, setPersonMode] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!query) return;

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      try {
        const data = await fetchMultiSearch(query, pageParam);
        const baseResults: SearchResult[] = Array.isArray(data.results)
          ? data.results
          : [];

        let finalResults: SearchResult[] = [...baseResults];
        const personFound = baseResults.find((r) => r.media_type === "person");

        if (personFound) {
          const credits = await fetchPersonCredits(personFound.id.toString());
          if (credits?.cast) {
            const creditResults: SearchResult[] = credits.cast.map((c: any) => ({
              id: c.id,
              media_type:
                (c.media_type as "movie" | "tv") ||
                (c.first_air_date ? "tv" : "movie"),
              title: c.title,
              name: c.name,
              poster_path: c.poster_path,
              release_date: c.release_date,
              first_air_date: c.first_air_date,
              vote_average: c.vote_average,
            }));
            finalResults = [personFound, ...creditResults, ...finalResults];
          }
        }

        const unique = Array.from(
          new Map(finalResults.map((it) => [`${it.media_type}-${it.id}`, it])).values()
        );

        if (cancelled) return;
        setAllResults(unique);
        setPersonMode(!!personFound);
        const totalResultsCount = Number(data.total_results) || unique.length;
        setTotalPages(Math.max(1, Math.ceil(totalResultsCount / ITEMS_PER_PAGE)));
      } catch (err) {
        console.error("Error fetching search results:", err);
        if (cancelled) return;
        setPersonMode(false);
        setAllResults([]);
        setTotalPages(1);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [query, pageParam]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.max(1, Math.min(newPage, totalPages));
    router.push(`/search?query=${encodeURIComponent(query)}&page=${clamped}`);
  };

  const pageItems = useMemo(() => {
    if (personMode) {
      const start = (pageParam - 1) * ITEMS_PER_PAGE;
      return allResults.slice(start, start + ITEMS_PER_PAGE);
    }
    return allResults.slice(0, ITEMS_PER_PAGE);
  }, [allResults, pageParam, personMode]);

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
      {loading ? (
        <div
          className={`grid gap-6 ${
            personMode
              ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
              : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          }`}
        >
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
            <SkeletonCard
              key={idx}
              variant={personMode ? "mini" : "default"}
            />
          ))}
        </div>
      ) : pageItems.length > 0 ? (
        <>
          <div
            className={`grid gap-6 ${
              personMode
                ? "grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            }`}
          >
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
                    className={`w-full ${
                      personMode ? "h-[150px]" : "h-[350px]"
                    } object-cover`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_POSTER;
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
                    <h2
                      className={`${
                        personMode ? "text-sm" : "text-lg"
                      } font-semibold group-hover:text-red-700 line-clamp-1`}
                    >
                      {title}
                    </h2>
                    {item.media_type === "person" ? (
                      <p className="text-xs text-gray-400">Actor/Actress</p>
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
        </>
      ) : (
        <NoResults query={query} loading={loading} />
      )}
    </div>
  );
}
