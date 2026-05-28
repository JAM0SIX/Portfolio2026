"use client";

/* CursorToggle — recessed key-pad with one button per mode.
   ----------------------------------------------------------
   Each cursor mode (dot, plus, tick, off) is its own skeumorphic
   key. Clicking a key sets that mode; the active key reads as
   pressed-in via the inverted shadow stack. Same plate vocabulary
   as the ThemeToggle slider, different mechanism. */

import { useEffect, useState } from "react";
import {
  CURSOR_MODES,
  getCursorMode,
  setCursorMode,
  subscribeCursorMode,
} from "@/lib/cursorMode";

function DotIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="3.4" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="12" y1="6" x2="12" y2="18" />
      <line x1="6" y1="12" x2="18" y2="12" />
    </svg>
  );
}
function TickIcon() {
  /* Short diagonal — the iron-filing tick the renderer draws when
     this mode is active. */
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
    </svg>
  );
}
function OffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <line x1="6.5" y1="17.5" x2="17.5" y2="6.5" />
    </svg>
  );
}

const ICONS = { dot: DotIcon, plus: PlusIcon, tick: TickIcon, off: OffIcon };
const LABELS = {
  dot: "Dot field",
  plus: "Plus field",
  tick: "Tick field",
  off: "Cursor field off",
};

export default function CursorToggle() {
  const [mode, setMode] = useState("dot");

  useEffect(() => {
    setMode(getCursorMode());
    return subscribeCursorMode((m) => setMode(m));
  }, []);

  return (
    <div className="skeuo-keypad" role="group" aria-label="Cursor field">
      {CURSOR_MODES.map((m) => {
        const Icon = ICONS[m];
        const isActive = mode === m;
        return (
          <button
            key={m}
            type="button"
            className={`skeuo-key${isActive ? " is-active" : ""}`}
            aria-label={LABELS[m]}
            aria-pressed={isActive}
            onClick={() => setCursorMode(m)}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}
