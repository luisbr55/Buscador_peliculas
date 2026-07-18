import type {
  MediaType,
  TitleSummary,
  TitleDetail,
  TMDBMovieRaw,
  TMDBTVRaw,
} from "./types";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

//Para poder autenticarnos
const headers = {
  Authorization: `Bearer ${API_KEY}`,
  accept: "application/json",
};

//Apartado para la imagen de las peliculas
//Se le asigna un tamano a detalle y las cards

//Esta funcion es para poder armar la URL completa de la imagen y poder devolverla
export function posterURL(path: string | null, size: "w342" | "w500" = "w342") {
  if (!path) {
    return null;
  } else {
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}

//Funcion para normalizar resultados de peliculas

//Esto es para poder identificar cuando un titulo es de una pelicula o de una serie
function normalizeSummary(
  raw: TMDBMovieRaw | TMDBTVRaw,
  fallbackType?: MediaType,
): TitleSummary {
  const mediaType = (raw.media_type ?? fallbackType) as MediaType;
  const isMovie = mediaType === "movie";

  return {
    id: raw.id,
    mediaType,
    title: isMovie ? (raw as TMDBMovieRaw).title : (raw as TMDBTVRaw).name,
    posterPath: raw.poster_path,
    rating: raw.vote_average,
    releaseDate: isMovie
      ? (raw as TMDBMovieRaw).release_date || null
      : (raw as TMDBTVRaw).first_air_date || null,
  };
}

export async function getTrending(
  page: number = 1,
): Promise<{ results: TitleSummary[]; totalPages: number }> {
  const res = await fetch(`${BASE_URL}/trending/all/day?page=${page}`, {
    headers,
  });
  if (!res.ok) throw new Error("No se pudo cargar tendencias");
  const data = await res.json();

  const results = data.results
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .map((r: TMDBMovieRaw | TMDBTVRaw) => normalizeSummary(r));

  return { results, totalPages: data.total_pages };
}

export async function searchTitles(
  query: string,
  page: number = 1,
): Promise<{ results: TitleSummary[]; totalPages: number }> {
  const url = `${BASE_URL}/search/multi?query=${encodeURIComponent(query)}&page=${page}`;
  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error("Error al buscar");
  const data = await res.json();

  const results = data.results
    .filter((r: any) => r.media_type === "movie" || r.media_type === "tv")
    .map((r: TMDBMovieRaw | TMDBTVRaw) => normalizeSummary(r));

  return { results, totalPages: data.total_pages };
}

export async function getTitleDetail(
  type: MediaType,
  id: string,
): Promise<TitleDetail> {
  const res = await fetch(`${BASE_URL}/${type}/${id}`, { headers });
  if (!res.ok) throw new Error("No se pudo cargar el detalle.");
  const raw: TMDBMovieRaw | TMDBTVRaw = await res.json();

  return {
    ...normalizeSummary(raw, type),
    overview: raw.overview || "Sinopsis no disponible.",
    genres: (raw.genres ?? []).map((g) => g.name),
  };
}
