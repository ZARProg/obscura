const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

// Trending Movies
export async function fetchTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json();
}

// Search Movies
export async function fetchMoviesBySearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch search results");
  return res.json();
}

// Search TV
export async function fetchTVBySearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };

  const res = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch TV search results");
  return res.json();
}

// Multi Search (movie + tv + person)
export async function fetchMultiSearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };

  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  if (!res.ok) throw new Error("Failed to fetch multi search results");
  return res.json();
}

// Get Poster URL
export function getPosterUrl(path: string | null) {
  return path
    ? `https://image.tmdb.org/t/p/w500${path}`
    : "/no-poster.png"; // fallback poster
}

// Movie Details (+videos)
export async function fetchMovieDetails(movieId: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos`
  );
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return res.json();
}

// TV Details (+videos)
export async function fetchTVDetails(tvId: number) {
  const res = await fetch(
    `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=videos`
  );
  if (!res.ok) throw new Error("Failed to fetch TV details");
  return res.json();
}

// Person Credits (gabungan movie+tv)
export async function fetchPersonCredits(personId: string) {
  const res = await fetch(
    `${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch person credits");
  return res.json();
}
