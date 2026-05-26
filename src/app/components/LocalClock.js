import ThemeToggle from "./ThemeToggle";
import CursorToggle from "./CursorToggle";

const LAST_UPDATED = "May 16, 2026";

export default function LocalClock() {
  return (
    <div className="local-clock">
      <CursorToggle />
      <ThemeToggle />
      <span className="updated">Updated {LAST_UPDATED}</span>
    </div>
  );
}
