import { useEffect, useState, useCallback } from "react";
import { getTrending, searchTitles } from "../lib/tmdb";
import { useDebouncedValue } from "../lib/useDebouncedValue";
import type { TitleSummary } from "../lib/types";
import { SearchBar } from "../components/SearchBar";
import { TypeTabs, type TypeFilter } from "../components/TypeTabs";
import { PosterGrid } from "../components/PosterGrid";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";

export function HomePage() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [titles, setTitles] = useState<TitleSummary[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isSearching = debouncedQuery.trim().length >= 2;

  const load = useCallback(
    async (pageToLoad: number, append: boolean) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError(null);

      try {
        const { results, totalPages: newTotalPages } = isSearching
          ? await searchTitles(debouncedQuery, pageToLoad)
          : await getTrending(pageToLoad);

        setTitles((prev) => (append ? [...prev, ...results] : results));
        setTotalPages(newTotalPages);
        setPage(pageToLoad);
      } catch (err) {
        setError("Ocurrió un error al cargar los títulos.");
      } finally {
        append ? setLoadingMore(false) : setLoading(false);
      }
    },
    [debouncedQuery, isSearching],
  );

  useEffect(() => {
    load(1, false);
  }, [debouncedQuery, isSearching]);

  const filteredTitles = titles.filter((t) =>
    typeFilter === "all" ? true : t.mediaType === typeFilter,
  );

  const canLoadMore = !loading && !error && page < totalPages;

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-10 -mx-4 mb-6 flex flex-col gap-4 bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <SearchBar onSearch={setQuery} />
        <TypeTabs value={typeFilter} onChange={setTypeFilter} />
      </header>

      {loading && <p className="text-center text-text-muted">Cargando...</p>}

      {!loading && error && (
        <ErrorState message={error} onRetry={() => load(1, false)} />
      )}

      {!loading && !error && filteredTitles.length === 0 && (
        <EmptyState
          message={
            isSearching
              ? "No encontramos resultados para tu búsqueda."
              : "No hay títulos para mostrar."
          }
        />
      )}

      {!loading && !error && filteredTitles.length > 0 && (
        <>
          <PosterGrid titles={filteredTitles} />

          {canLoadMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => load(page + 1, true)}
                disabled={loadingMore}
                className="rounded-control bg-surface px-6 py-2 text-sm text-text hover:bg-surface-hover disabled:opacity-60"
              >
                {loadingMore ? "Cargando..." : "Cargar más"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
