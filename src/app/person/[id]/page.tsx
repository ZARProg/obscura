import { notFound } from "next/navigation";

interface PersonDetailProps {
  params: { id: string };
}

export default async function PersonDetailPage({ params }: PersonDetailProps) {
  const res = await fetch(
    `https://api.themoviedb.org/3/person/${params.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    { cache: "no-store" }
  );

  if (!res.ok) return notFound();

  const person = await res.json();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col md:flex-row items-start p-6 max-w-5xl mx-auto">
        <img
          src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
          alt={person.name}
          className="w-64 h-auto rounded-2xl shadow-lg"
        />
        <div className="mt-6 md:mt-0 md:ml-8 flex-1">
          <h1 className="text-4xl font-bold">{person.name}</h1>
          <p className="text-gray-300 mt-2">{person.known_for_department}</p>
          <p className="text-gray-400 text-sm mt-1">
            Born: {person.birthday}
            {person.place_of_birth ? ` • ${person.place_of_birth}` : ""}
          </p>
          {person.deathday && (
            <p className="text-gray-400 text-sm">
              Died: {person.deathday}
            </p>
          )}
        </div>
      </div>

      {/* Biography */}
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-semibold mb-2">Biography</h2>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {person.biography || "No biography available."}
        </p>
      </div>
    </div>
  );
}
