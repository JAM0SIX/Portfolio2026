import ThemeToggle from "./ThemeToggle";

const LAST_UPDATED = "May 16, 2026";

export default function LocalClock() {
  return (
    <div className="local-clock">
      <ThemeToggle />
      <span className="updated">Updated {LAST_UPDATED}</span>
    </div>
  );
}
