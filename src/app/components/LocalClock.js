"use client";

import ThemeToggle from "./ThemeToggle";
import CursorToggle from "./CursorToggle";

export default function LocalClock() {
  return (
    <div className="local-clock">
      <CursorToggle />
      <ThemeToggle />
    </div>
  );
}
