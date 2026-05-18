"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "harrys-theme";

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

export default function ThemeToggle() {
  // Default to paper. The inline boot script in layout.js already applied the
  // stored theme to <html> before hydration, so this state syncs on mount.
  const [theme, setTheme] = useState("paper");

  useEffect(() => {
    const t = document.documentElement.dataset.theme || "paper";
    setTheme(t);
  }, []);

  function apply(next) {
    const root = document.documentElement;
    // Add the transient class so the long, soft theme-fade kicks in.
    // Cleared after the transition window so it doesn't interfere with
    // normal hover/interaction transitions.
    root.classList.add("is-theme-changing");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("is-theme-changing"), 750);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    setTheme(next);
  }

  return (
    <div className="theme-toggle" role="group" aria-label="Theme">
      <button
        type="button"
        className={`tt-btn${theme === "onyx" ? " is-active" : ""}`}
        aria-label="Use dark theme"
        aria-pressed={theme === "onyx"}
        onClick={() => apply("onyx")}
      >
        <MoonIcon />
      </button>
      <button
        type="button"
        className={`tt-btn${theme === "paper" ? " is-active" : ""}`}
        aria-label="Use light theme"
        aria-pressed={theme === "paper"}
        onClick={() => apply("paper")}
      >
        <SunIcon />
      </button>
    </div>
  );
}
