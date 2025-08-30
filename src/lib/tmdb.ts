const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function fetchTrendingMovies() {
  const res = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch trending movies");
  return res.json();
}

export async function fetchMoviesBySearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };

  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

  if (!res.ok) throw new Error("Failed to fetch search results");

  const data = await res.json();

  return {
    results: data.results || [],
    total_pages: data.total_pages || 0,
    total_results: data.total_results || 0,
  };
}

export async function fetchTVBySearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };

  const res = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

  if (!res.ok) throw new Error("Failed to fetch TV search results");

  const data = await res.json();

  return {
    results: data.results || [],
    total_pages: data.total_pages || 0,
    total_results: data.total_results || 0,
  };
}

// Search gabungan (movies + tv + person)
export async function fetchMultiBySearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };

  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );

  if (!res.ok) throw new Error("Failed to fetch multi search results");

  const data = await res.json();

  return {
    results: data.results || [],
    total_pages: data.total_pages || 0,
    total_results: data.total_results || 0,
  };
}

export async function fetchMultiSearch(query: string) {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  if (!res.ok) throw new Error("Failed to fetch search results");
  const data = await res.json();
  return data.results || [];
}
