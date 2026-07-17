import { useState } from "react";

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [value, setValue] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);
    onSearch(newValue);
  }

  return (
    <div className="relative w-full max-w-2xl">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Buscar películas o series..."
        className="w-full rounded-control border border-border bg-surface py-3 pl-10 pr-4 text-text outline-none placeholder:text-text-muted focus:border-accent"
      />
    </div>
  );
}
