const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchJson(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch: ${url}`);
  return res.json();
}

// Trending Movies
export async function fetchTrendingMovies(page: number = 1) {
  return fetchJson(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`);
}

// Search Movies
export async function fetchMoviesBySearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };
  const data = await fetchJson(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  return {
    results: data.results || [],
    total_pages: data.total_pages || 0,
    total_results: data.total_results || 0,
  };
}

// Search TV
export async function fetchTVBySearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };
  const data = await fetchJson(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  return {
    results: data.results || [],
    total_pages: data.total_pages || 0,
    total_results: data.total_results || 0,
  };
}

// Multi Search (movie + tv + person)
export async function fetchMultiSearch(query: string, page: number = 1) {
  if (!query) return { results: [], total_pages: 0, total_results: 0 };
  const data = await fetchJson(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
  );
  return {
    results: data.results || [],
    total_pages: data.total_pages || 0,
    total_results: data.total_results || 0,
  };
}

// Get Poster URL
export function getPosterUrl(path: string | null) {
  return path ? `https://image.tmdb.org/t/p/w500${path}` : "/no-poster.png";
}

// Movie Details (+videos+credits)
export async function fetchMovieDetails(movieId: number) {
  return fetchJson(
    `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`
  );
}

// TV Details (+videos+credits)
export async function fetchTVDetails(tvId: number) {
  return fetchJson(
    `${BASE_URL}/tv/${tvId}?api_key=${API_KEY}&append_to_response=videos,credits`
  );
}

// Person Credits (combined)
export async function fetchPersonCredits(personId: string) {
  return fetchJson(
    `${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}&language=en-US`
  );
}

// Fetch Movie Trailer
export async function fetchMovieTrailer(movieId: number) {
  const data = await fetchJson(
    `${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`
  );
  const trailer = (data.results || []).find(
    (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
  );
  return trailer ? trailer.key : null;
}

// Fetch TV Trailer
export async function fetchTVTrailer(tvId: number) {
  const data = await fetchJson(
    `${BASE_URL}/tv/${tvId}/videos?api_key=${API_KEY}&language=en-US`
  );
  const trailer = (data.results || []).find(
    (vid: any) => vid.type === "Trailer" && vid.site === "YouTube"
  );
  return trailer ? trailer.key : null;
}

/**
 * Discover helpers for categories:
 * - K-Drama (tv with Korean language)
 * - C-Drama (tv with Chinese language)
 * - Hollywood (movies for region US)
 *
 * Each returns the raw TMDB page object so caller can read results/total_pages/total_results
 */

// Discover TV by original language (use for K/C drama)
export async function fetchDiscoverTVByLanguage(lang = "ko", page: number = 1) {
  return fetchJson(
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_original_language=${lang}&sort_by=popularity.desc&page=${page}`
  );
}

// Discover Movies by region (Hollywood = US)
export async function fetchDiscoverMovieByRegion(region = "US", page: number = 1) {
  // We use "region" only for filtering release_dates; also filter by language 'en' for Hollywood-ish
  return fetchJson(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&region=${region}&with_original_language=en&sort_by=popularity.desc&page=${page}`
  );
}
