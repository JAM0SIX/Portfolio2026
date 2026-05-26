"use client";

/* CursorToggle — three-button dial that picks the cursor-field mode.
   Mirrors the ThemeToggle visual (.theme-toggle / .tt-btn classes).
   Mode = "dot" | "plus" | "off"; "off" hides the entire field. */

import { useEffect, useState } from "react";
import {
  getCursorMode,
  setCursorMode,
  subscribeCursorMode,
} from "@/lib/cursorMode";

function DotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}
function OffIcon() {
  /* Dotted line / forbidden cross — reads as "no field". */
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <line x1="6.5" y1="17.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

export default function CursorToggle() {
  const [mode, setMode] = useState("dot");

  useEffect(() => {
    setMode(getCursorMode());
    return subscribeCursorMode((m) => setMode(m));
  }, []);

  return (
    <div className="theme-toggle" role="group" aria-label="Cursor field">
      <button
        type="button"
        className={`tt-btn${mode === "dot" ? " is-active" : ""}`}
        aria-label="Dot field"
        aria-pressed={mode === "dot"}
        onClick={() => setCursorMode("dot")}
      >
        <DotIcon />
      </button>
      <button
        type="button"
        className={`tt-btn${mode === "plus" ? " is-active" : ""}`}
        aria-label="Plus field"
        aria-pressed={mode === "plus"}
        onClick={() => setCursorMode("plus")}
      >
        <PlusIcon />
      </button>
      <button
        type="button"
        className={`tt-btn${mode === "off" ? " is-active" : ""}`}
        aria-label="Cursor field off"
        aria-pressed={mode === "off"}
        onClick={() => setCursorMode("off")}
      >
        <OffIcon />
      </button>
    </div>
  );
}
