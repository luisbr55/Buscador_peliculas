import { Link } from "react-router-dom";

export function Header() {
  return (
    <Link to="/" className="mb-4 inline-block">
      <h1 className="text-xl font-extrabold tracking-tigh text-text">
        Film<span className="text-accent">Finder</span>
      </h1>
    </Link>
  );
}
