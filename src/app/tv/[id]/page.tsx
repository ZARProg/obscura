import { notFound } from "next/navigation";
import { fetchTVDetails } from "@/lib/tmdb";
import TvDetailClient from "./TvDetailClient";

interface TvDetailProps {
  params: { id: string };
}

export default async function TvDetailPage({ params }: TvDetailProps) {
  const tv = await fetchTVDetails(Number(params.id));
  if (!tv || tv.success === false) return notFound();

  const trailer = tv.videos?.results?.find(
    (v: any) => v.type === "Trailer" && v.site === "YouTube"
  );

  const topCast = tv.credits?.cast?.slice(0, 5) || [];

  return (
    <TvDetailClient tv={tv} trailerKey={trailer?.key || null} topCast={topCast} />
  );
}
