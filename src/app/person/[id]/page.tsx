import { notFound } from "next/navigation";
import PersonDetailClient from "./PersonDetailClient";

interface PersonDetailProps {
  params: Promise<{ id: string }>;
}

export default async function PersonDetailPage({ params }: PersonDetailProps) {
  // ✅ Unwrap params (menghilangkan warning/ error)
  const { id } = await params;

  // Fetch person detail
  const personRes = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    { cache: "no-store" }
  );
  if (!personRes.ok) return notFound();
  const person = await personRes.json();

  // Fetch filmography (combined credits)
  const creditsRes = await fetch(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`,
    { cache: "no-store" }
  );
  const credits = creditsRes.ok ? await creditsRes.json() : { cast: [] };

  // Lempar ke client component untuk modal & interaksi
  return <PersonDetailClient person={person} credits={credits} />;
}
