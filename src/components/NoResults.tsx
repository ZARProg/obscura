"use client";

import Link from "next/link";

export default function NoResults({ query, loading }: { query: string; loading: boolean }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 animate-pulse">
        <div className="h-6 w-40 bg-gray-800 rounded-md mb-4" />
        <div className="h-10 w-32 bg-gray-800 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mt-20 transition-opacity duration-300">
      <p className="text-gray-400 mt-4">No results found for "{query}"</p>
      <Link
        href="/"
        className="mt-6 px-6 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800"
      >
        Back to Home
      </Link>
    </div>
  );
}
