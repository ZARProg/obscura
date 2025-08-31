"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import NoImage from "@/components/NoImage";
import { fetchMultiSearch } from "@/lib/tmdb";

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name?: string;
  poster_path?: string | null;
  release_date?: string;
  first_air_date?: string;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const data = await fetchMultiSearch(query);
        setResults(data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <h1 className="text-3xl font-bold mb-6">
        Search Results for:{" "}
        <span className="text-red-700">{query || "..."}</span>
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {results
            .filter((item) => item.media_type !== "person") // hide "people"
            .map((item) => {
              const title = item.title || item.name || "Untitled";
              const year =
                item.release_date?.split("-")[0] ||
                item.first_air_date?.split("-")[0] ||
                "N/A";

              const href =
                item.media_type === "movie"
                  ? `/movies/${item.id}`
                  : `/tv/${item.id}`;

              return (
                <Link
                  key={`${item.media_type}-${item.id}`}
                  href={href}
                  className="group bg-black rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform"
                >
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={title}
                      className="w-full h-[350px] object-cover"
                    />
                  ) : (
                    <NoImage className="w-full h-[350px]" alt={title} />
                  )}
                  <div className="p-3">
                    <h2 className="text-lg font-semibold group-hover:text-red-700 line-clamp-1">
                      {title}
                    </h2>
                    <p className="text-sm text-gray-400">{year}</p>
                    <p className="text-xs text-gray-500 uppercase mt-1">
                      {item.media_type}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      ) : (
        <p className="text-gray-400">No results found.</p>
      )}
    </div>
  );
}
