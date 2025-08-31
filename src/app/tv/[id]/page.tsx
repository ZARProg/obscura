import { notFound } from "next/navigation";

interface TvDetailProps {
  params: { id: string };
}

export default async function TvDetailPage({ params }: TvDetailProps) {
  const [tv, videos] = await Promise.all([
    fetch(
      `https://api.themoviedb.org/3/tv/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
      { cache: "no-store" }
    ).then((res) => res.json()),
    fetch(
      `https://api.themoviedb.org/3/tv/${params.id}/videos?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
      { cache: "no-store" }
    ).then((res) => res.json()),
  ]);

  if (!tv || tv.success === false) return notFound();

  const trailer = videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col md:flex-row items-start p-6 max-w-5xl mx-auto">
        <img
          src={`https://image.tmdb.org/t/p/w500${tv.poster_path}`}
          alt={tv.name}
          className="w-64 h-auto rounded-2xl shadow-lg"
        />
        <div className="mt-6 md:mt-0 md:ml-8 flex-1">
          <h1 className="text-4xl font-bold">{tv.name}</h1>
          <p className="text-gray-300 mt-2">{tv.tagline}</p>
          <p className="text-gray-400 text-sm mt-1">
            {tv.first_air_date} • {tv.number_of_seasons} Season(s)
          </p>
          <div className="mt-4">
            <p className="text-gray-300">{tv.overview}</p>
          </div>

          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              ▶ Watch Trailer
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
