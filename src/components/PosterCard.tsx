import { Link } from "react-router-dom";
import { posterURL } from "../lib/tmdb";
import type { TitleSummary } from "../lib/types";

export function PosterCard({ title }: { title: TitleSummary }) {
  const src = posterURL(title.posterPath, "w342");

  return (
    <Link
      to={`/${title.mediaType}/${title.id}`}
      className="group block overflow-hidden rounded-poster bg-surface transition-transform hover:scale-[1.03]"
    >
      <div className="relative aspect-[2/3] w-full bg-surface-hover">
        {src ? (
          <img
            src={src}
            alt={title.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-text-muted">
            Sin imagen
          </div>
        )}
        {title.rating > 0 && (
          <span className="absolute top-2 right-2 flex items-center gap-1 rounded-control bg-background/80 px-2 py-1 text-xs font-semibold text-rating-gold">
            * {title.rating.toFixed(1)}
          </span>
        )}
      </div>
      <p className="mt-2 truncate text-sm text-text group-hover:text-accent">
        {title.title}
      </p>
    </Link>
  );
}
