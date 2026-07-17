import { useEffect, useState } from "react"
import { getTrending, searchTitles } from "../lib/tmdb"
import { useDebouncedValue } from "../lib/useDebouncedValue"
import type { TitleSummary } from "../lib/types"
import { SearchBar } from "../components/SearchBar"
import { TypeTabs, type TypeFilter } from "../components/TypeTabs"
import { PosterGrid } from "../components/PosterGrid"
import { EmptyState } from "../components/EmptyState"
import { ErrorState } from "../components/ErrorState"

export function HomePage() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebouncedValue(query, 400)

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all")
  const [titles, setTitles] = useState<TitleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isSearching = debouncedQuery.trim().length >= 2

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const results = isSearching
          ? (await searchTitles(debouncedQuery)).results
          : await getTrending()

        if (!cancelled) setTitles(results)
      } catch (err) {
        if (!cancelled) setError("Ocurrió un error al cargar los títulos.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [debouncedQuery, isSearching])

  const filteredTitles = titles.filter((t) =>
    typeFilter === "all" ? true : t.mediaType === typeFilter
  )

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-10 -mx-4 mb-6 flex flex-col gap-4 bg-background/90 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <SearchBar onSearch={setQuery} />
        <TypeTabs value={typeFilter} onChange={setTypeFilter} />
      </header>

      {loading && <p className="text-center text-text-muted">Cargando...</p>}

      {!loading && error && (
        <ErrorState message={error} onRetry={() => setQuery((q) => q)} />
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
        <PosterGrid titles={filteredTitles} />
      )}
    </div>
  )
}