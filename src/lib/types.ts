export type MediaType = "movie" | "tv";

export interface TitleSummary {
  id: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  rating: number;
}

export interface TitleDetail extends TitleSummary {
  overview: string | null;
  genres: string[];
}

export interface TMDBMovieRaw {
  id: number;
  media_type?: "movie" | "tv" | "person";
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  overview?: string;
  genres?: { id: number; name: string }[];
}

export interface TMDBTVRaw {
  id: number;
  media_type?: "movie" | "tv" | "person";
  name: string;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  overview?: string;
  genres?: { id: number; name: string }[];
}
