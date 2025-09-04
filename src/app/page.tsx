"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import TrailerModal from "@/components/TrailerModal";
import {
  fetchTrendingMovies,
  fetchDiscoverTVByLanguage,
  fetchDiscoverMovieByRegion,
  fetchMovieTrailer,
  fetchTVTrailer,
  fetchNewThisWeek,
  fetchAnimation,
} from "@/lib/tmdb";
import { motion, AnimatePresence } from "framer-motion";

// Tambahan Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type Item = any;

export default function HomePage() {
  const [trending, setTrending] = useState<Item[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);

  const [newThisWeek, setNewThisWeek] = useState<Item[]>([]);
  const [kdrama, setKdrama] = useState<Item[]>([]);
  const [cdrama, setCdrama] = useState<Item[]>([]);
  const [hollywood, setHollywood] = useState<Item[]>([]);
  const [anime, setAnime] = useState<Item[]>([]);

  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const data = await fetchTrendingMovies();
      setTrending(data.results || []);
    })();
  }, []);

  useEffect(() => {
    if (!trending.length) return;
    const t = setInterval(() => {
      setBannerIndex((i) => (i + 1) % trending.length);
    }, 5000);
    return () => clearInterval(t);
  }, [trending]);

  useEffect(() => {
    (async () => {
      const [newData, kData, cData, hData, aData] = await Promise.all([
        fetchNewThisWeek(),
        fetchDiscoverTVByLanguage("ko"),
        fetchDiscoverTVByLanguage("zh"),
        fetchDiscoverMovieByRegion("US"),
        fetchAnimation(),
      ]);
      setNewThisWeek(newData.results);
      setKdrama(kData.results);
      setCdrama(cData.results);
      setHollywood(hData.results);
      setAnime(aData.results);
    })();
  }, []);

  const handlePlayTrailer = async (item: Item) => {
    let key: string | null = null;
    if (item.first_air_date) key = await fetchTVTrailer(item.id);
    else key = await fetchMovieTrailer(item.id);
    setTrailerKey(key);
    setIsTrailerOpen(true);
  };

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
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
                src={`https://image.tmdb.org/t/p/original${
                  trending[bannerIndex].backdrop_path ||
                  trending[bannerIndex].poster_path
                }`}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-8 left-6 md:left-12 max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold mb-3">
                  {trending[bannerIndex].title || trending[bannerIndex].name}
                </h2>
                <p className="mb-4 line-clamp-3">
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

      <div className="px-6 md:px-12 py-8 space-y-12">
        <Section title="New This Week" items={newThisWeek} />
        <Section title="Trending Now" items={trending} />
        <Section title="Korean Drama" items={kdrama} />
        <Section title="Chinese Drama" items={cdrama} />
        <Section title="Hollywood" items={hollywood} />
        <Section title="Anime" items={anime} />
      </div>

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        trailerKey={trailerKey}
      />
    </main>
  );
}

// Section dengan Swiper + panah
function Section({ title, items }: { title: string; items: Item[] }) {
  const navPrev = `prev-${title.replace(/\s+/g, "")}`;
  const navNext = `next-${title.replace(/\s+/g, "")}`;

  return (
    <section className="relative">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xl font-bold">{title}</h3>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: `.${navNext}`,
          prevEl: `.${navPrev}`,
        }}
        spaceBetween={16}
        slidesPerView={"auto"}
        grabCursor={true}
      >
        {items.map((it) => {
          const poster = it.poster_path
            ? `https://image.tmdb.org/t/p/w300${it.poster_path}`
            : "/no-poster.png";
          const titleStr = it.title || it.name;
          const year =
            it.release_date?.split("-")[0] ||
            it.first_air_date?.split("-")[0] ||
            "N/A";
          return (
            <SwiperSlide key={it.id} style={{ width: "150px" }}>
              <Link href={`/movie/${it.id}`}>
                <div className="bg-black rounded-lg overflow-hidden">
                  <img
                    src={poster}
                    alt={titleStr}
                    className="w-full h-[220px] object-cover"
                  />
                  <div className="p-2">
                    <h4 className="text-sm font-semibold line-clamp-2">
                      {titleStr}
                    </h4>
                    <p className="text-xs text-gray-400">{year}</p>
                    {it.vote_average && (
                      <p className="text-xs text-yellow-400">
                        ⭐ {it.vote_average.toFixed(1)}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
      {/* tombol panah kiri/kanan */}
      <button
        className={`${navPrev} absolute top-1/2 -left-4 z-10 bg-black/60 hover:bg-black/80 text-white px-2 py-3 rounded-full`}
      >
        ‹
      </button>
      <button
        className={`${navNext} absolute top-1/2 -right-4 z-10 bg-black/60 hover:bg-black/80 text-white px-2 py-3 rounded-full`}
      >
        ›
      </button>
    </section>
  );
}
