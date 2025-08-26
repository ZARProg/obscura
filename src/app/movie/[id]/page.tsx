import { notFound } from "next/navigation";

interface MovieDetailProps {
  params: { id: string };
}

export default async function MovieDetailPage({ params }: MovieDetailProps) {
  const res = await fetch(
    `https://api.themoviedb.org/3/movie/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const movie = await res.json();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div
        className="relative h-[500px] w-full flex items-end"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-6 max-w-4xl">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <p className="text-gray-300 mt-2">{movie.release_date} • {movie.runtime} min</p>
          <p className="text-yellow-400 mt-1">⭐ {movie.vote_average.toFixed(1)}</p>
        </div>
      </div>

      {/* Detail Content */}
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-gray-300 leading-relaxed">{movie.overview}</p>

        {movie.genres?.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Genres</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {movie.genres.map((genre: { id: number; name: string }) => (
                <span
                  key={genre.id}
                  className="bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-200"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
