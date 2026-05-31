"use client";

import ThemeToggle from "./ThemeToggle";
import CursorToggle from "./CursorToggle";

export default function LocalClock() {
  return (
    <div className="local-clock">
      {/* Light/dark slider first, background-field keypad underneath.
          Each group keeps its own header so the four cursor keys
          read as a labelled set rather than a row of icons. */}
      <ThemeToggle />
      <span className="local-clock__heading">Background</span>
      <CursorToggle />
    </div>
  );
}
