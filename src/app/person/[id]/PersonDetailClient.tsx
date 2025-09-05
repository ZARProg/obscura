"use client";

import { useState } from "react";

export default function PersonDetailClient({
  person,
  credits,
}: {
  person: any;
  credits: { cast: any[] };
}) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative w-full flex flex-col md:flex-row items-start p-6 max-w-5xl mx-auto">
        <img
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w500${person.profile_path}`
              : "/no-profile.png"
          }
          alt={person.name}
          className="w-64 h-auto rounded-2xl shadow-lg object-cover"
        />
        <div className="mt-6 md:mt-0 md:ml-8 flex-1">
          <h1 className="text-4xl font-bold">{person.name}</h1>
          <p className="text-gray-300 mt-2">{person.known_for_department}</p>
          <p className="text-gray-400 text-sm mt-1">
            Born: {person.birthday}
            {person.place_of_birth ? ` • ${person.place_of_birth}` : ""}
          </p>
          {person.deathday && (
            <p className="text-gray-400 text-sm">Died: {person.deathday}</p>
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

      {/* Known For / Filmography */}
      {credits.cast?.length > 0 && (
        <div className="max-w-5xl mx-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Known For</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {credits.cast
              .sort((a: any, b: any) => (b.popularity ?? 0) - (a.popularity ?? 0))
              .slice(0, 12)
              .map((credit: any) => (
                <div
                  key={`${credit.media_type}-${credit.id}`}
                  className="text-center cursor-pointer"
                  onClick={() => setSelectedItem(credit)}
                >
                  <img
                    src={
                      credit.poster_path
                        ? `https://image.tmdb.org/t/p/w300${credit.poster_path}`
                        : "/no-poster.png"
                    }
                    alt={credit.title || credit.name}
                    className="rounded-xl shadow-lg w-full h-44 object-cover"
                  />
                  <p className="mt-2 text-sm text-gray-300 truncate">
                    {credit.title || credit.name}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Modal Detail */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
              aria-label="Close"
            >
              ✕
            </button>
            <div className="flex flex-col md:flex-row gap-4">
              <img
                src={
                  selectedItem.poster_path
                    ? `https://image.tmdb.org/t/p/w300${selectedItem.poster_path}`
                    : "/no-poster.png"
                }
                alt={selectedItem.title || selectedItem.name}
                className="w-40 h-60 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {selectedItem.title || selectedItem.name}
                </h2>
                <p className="text-gray-300 mt-2 text-sm">
                  {selectedItem.overview || "No description available."}
                </p>
                <p className="text-gray-400 mt-2 text-sm">
                  Role: {selectedItem.character || "-"}
                </p>
                <p className="text-gray-400 text-sm">
                  Media: {selectedItem.media_type?.toUpperCase() || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
