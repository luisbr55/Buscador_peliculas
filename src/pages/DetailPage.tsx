import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTitleDetail, posterURL } from "../lib/tmdb";
import type { TitleDetail, MediaType } from "../lib/types";
import { ErrorState } from "../components/ErrorState";

export function DetailPage() {
  const { type, id } = useParams<{ type: MediaType; id: string }>();

  const [detail, setDetail] = useState<TitleDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!type || !id) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getTitleDetail(type, id);
      setDetail(data);
    } catch (e) {
      setError("No pudimos cargar este titulo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [type, id]);
  if (loading) {
    return <p className="p-8 text-center text-text-muted">Cargando...</p>;
  }

  if (error || !detail) {
    return (
      <div className="p-8">
        <ErrorState message={error ?? "Título no encontrado."} onRetry={load} />
      </div>
    );
  }

  const src = posterURL(detail.posterPath, "w500");
  const year = detail.releaseDate ? detail.releaseDate.slice(0, 4) : "—";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="mb-6 inline-block text-sm text-text-muted hover:text-accent"
      >
        ← Volver
      </Link>

      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="w-full max-w-xs shrink-0">
          {src ? (
            <img
              src={src}
              alt={detail.title}
              className="w-full rounded-poster"
            />
          ) : (
            <div className="flex aspect-[2/3] w-full items-center justify-center rounded-poster bg-surface text-text-muted">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-text sm:text-4xl">
            {detail.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
            <span>{year}</span>
            <span>·</span>
            <span className="capitalize">
              {detail.mediaType === "movie" ? "Película" : "Serie"}
            </span>
            {detail.rating > 0 && (
              <>
                <span>·</span>
                <span className="text-rating-gold">
                  ★ {detail.rating.toFixed(1)}
                </span>
              </>
            )}
          </div>

          {detail.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {detail.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-control bg-surface px-3 py-1 text-xs text-text-muted"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm leading-relaxed text-text-muted sm:text-base">
            {detail.overview}
          </p>
        </div>
      </div>
    </div>
  );
}
