// src/app/watch/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";

export default function WatchMoviePage() {
  const { id } = useParams();

  // ini contoh link streaming. Nanti kamu bisa fetch dari database / API
  const movieLink = `https://link-streaming-kamu.com/${id}`;

  return (
    <iframe
        src={movieLink}
        width="100%"
        height="600"
        allowFullScreen
        className="rounded"
    ></iframe>
  );
}
