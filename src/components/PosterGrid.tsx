import type { TitleSummary } from "../lib/types";
import { PosterCard } from "./PosterCard";

export function PosterGrid({ titles }: { titles: TitleSummary[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {titles.map((title) => (
        <PosterCard key={`${title.mediaType}-${title.id}`} title={title} />
      ))}
    </div>
  );
}
