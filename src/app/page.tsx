"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import TrailerModal from "@/components/TrailerModal";
import {
  fetchTrendingMovies,
  fetchDiscoverTVByLanguage,
  fetchDiscoverMovieByRegion,
  fetchMovieTrailer,
  fetchTVTrailer,
  getPosterUrl,
} from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";

type Item = any;

export default function HomePage() {
  const [trending, setTrending] = useState<Item[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);
  const [bannerIndex, setBannerIndex] = useState(0);

  const [kdrama, setKdrama] = useState<Item[]>([]);
  const [cdrama, setCdrama] = useState<Item[]>([]);
  const [hollywood, setHollywood] = useState<Item[]>([]);
  const [loadingSections, setLoadingSections] = useState(false);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  const kRef = useRef<HTMLDivElement | null>(null);
  const cRef = useRef<HTMLDivElement | null>(null);
  const hRef = useRef<HTMLDivElement | null>(null);

  // trending
  useEffect(() => {
    const load = async () => {
      setLoadingTrending(true);
      try {
        const data = await fetchTrendingMovies(1);
        setTrending(data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTrending(false);
      }
    };
    load();
  }, []);

  // banner auto slide
  useEffect(() => {
    if (trending.length === 0) return;
    const t = setInterval(() => {
      setBannerIndex((s) => (s + 1) % trending.length);
    }, 5000);
    return () => clearInterval(t);
  }, [trending]);

  // discover categories
  useEffect(() => {
    const loadSections = async () => {
      setLoadingSections(true);
      try {
        const [kData, cData, hData] = await Promise.all([
          fetchDiscoverTVByLanguage("ko", 1),
          fetchDiscoverTVByLanguage("zh", 1),
          fetchDiscoverMovieByRegion("US", 1),
        ]);

        setKdrama(kData.results?.slice(0,10) || []);
        setCdrama(cData.results?.slice(0, 10) || []);
        setHollywood(hData.results?.slice(0, 10) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSections(false);
      }
    };
    loadSections();
  }, []);

  const handlePlayTrailer = async (item: Item) => {
    try {
      let key: string | null = null;
      if (item.media_type === "tv" || item.first_air_date) {
        key = await fetchTVTrailer(item.id);
      } else {
        key = await fetchMovieTrailer(item.id);
      }
      setTrailerKey(key);
      setIsTrailerOpen(true);
    } catch (err) {
      console.error("Trailer error:", err);
      setTrailerKey(null);
      setIsTrailerOpen(true);
    }
  };

  return (
    <main className="bg-black min-h-screen text-white">
      {/* Banner */}
      <div className="relative w-full h-screen overflow-hidden pt-0">
        <AnimatePresence mode="wait">
          {trending[bannerIndex] && (
            <motion.div
              key={trending[bannerIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0"
            >
              <img
                src={`https://image.tmdb.org/t/p/original${trending[bannerIndex].poster_path}`}
                alt={trending[bannerIndex].title || trending[bannerIndex].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-16 left-8 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-4 line-clamp-2">
                  {trending[bannerIndex].title || trending[bannerIndex].name}
                </h2>
                <p className="mb-4 max-w-md line-clamp-3">
                  {trending[bannerIndex].overview}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handlePlayTrailer(trending[bannerIndex])}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    ▶ Play Trailer
                  </button>
                  <Link
                    href={`/movie/${trending[bannerIndex].id}`}
                    className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Section title="K-Drama" items={kdrama} loading={loadingSections} />
        <Section title="C-Drama" items={cdrama} loading={loadingSections} />
        <Section title="Hollywood" items={hollywood} loading={loadingSections} />
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey={trailerKey}
      />
    </main>
  );
}

function Section({
  title,
  items,
  loading,
}: {
  title: string;
  items: Item[];
  loading: boolean;
}) {
  return (
    <section id={title.toLowerCase()} className="mb-12 scroll-mt-20">
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      {loading ? (
        <div className="flex gap-4 overflow-x-auto" />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((it: any) => {
            const poster = it.poster_path
              ? `https://image.tmdb.org/t/p/w500${it.poster_path}`
              : "/no-poster.png";
            const titleStr = it.title || it.name || "Untitled";
            const year =
              (it.release_date && it.release_date.split("-")[0]) ||
              (it.first_air_date && it.first_air_date.split("-")[0]) ||
              "N/A";
            return (
              <div
                key={`${it.id}-${it.media_type || (it.first_air_date ? "tv" : "movie")}`}
                className="group bg-black rounded-lg overflow-hidden shadow-md"
              >
                <img
                  src={poster}
                  alt={titleStr}
                  className="w-full h-[300px] object-cover"
                />
                <div className="p-3">
                  <h4 className="font-semibold text-sm line-clamp-2">
                    {titleStr}
                  </h4>
                  <p className="text-xs text-gray-400">{year}</p>
                  {it.vote_average && (
                    <p className="text-xs text-yellow-400 mt-1">
                      ⭐ {it.vote_average.toFixed(1)}
                    </p>
                  )}
                  <div className="mt-2">
                    <Link
                      href={`/${it.first_air_date ? "tv" : "movie"}/${it.id}`}
                      className="text-sm text-gray-300 hover:text-red-500"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
