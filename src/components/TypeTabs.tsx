import type { MediaType } from "../lib/types";

//agregando el all junto a movie y tv
export type TypeFilter = MediaType | "all";

const OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Peliculas" },
  { value: "tv", label: "Series" },
];

export function TypeTabs({
  value,
  onChange,
}: {
  value: TypeFilter;
  onChange: (value: TypeFilter) => void;
}) {
  return (
    <div className="flex gap-2">
      {OPTIONS.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`rounded-control px-4 py-1.5 text-sm transition-colors ${
              isActive
                ? "bg-accent text-white"
                : "bg-surface text-text-muted hover:text-text"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
