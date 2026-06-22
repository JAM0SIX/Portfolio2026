"use client";

import ThemeToggle from "./ThemeToggle";
import CursorToggle from "./CursorToggle";

export default function LocalClock() {
  return (
    <div className="local-clock">
      {/* Background-field keypad first, light/dark slider underneath.
          (On mobile the keypad + heading are hidden, leaving just the
          theme toggle in the header bar.) */}
      <span className="local-clock__heading">Background</span>
      <CursorToggle />
      <ThemeToggle />
    </div>
  );
}
