/* Shared cursor-mode store.
   ---------------------------
   CursorDotField reads its render mode from here. CursorToggle writes
   to it. A tiny module-level pubsub avoids the boilerplate of React
   context for a single global setting. localStorage persists the
   choice across reloads. */

const KEY = "harrys-cursor-mode";
/* Mode order matters — it's also the cycle order for the
   CursorToggle button. Adding a mode here automatically adds it to
   the cycle and to the persisted-value allowlist. */
export const CURSOR_MODES = ["dot", "plus", "tick", "off"];
const DEFAULT_MODE = "dot";

const listeners = new Set();
let current = DEFAULT_MODE;

/* Hydrate from localStorage on first import (client only). */
if (typeof window !== "undefined") {
  try {
    const stored = window.localStorage.getItem(KEY);
    if (CURSOR_MODES.includes(stored)) current = stored;
  } catch {
    /* localStorage can throw in private mode — ignore. */
  }
}

export function getCursorMode() {
  return current;
}

export function setCursorMode(mode) {
  if (!CURSOR_MODES.includes(mode) || current === mode) return;
  current = mode;
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(KEY, mode); } catch {}
  }
  listeners.forEach((l) => l(current));
}

export function subscribeCursorMode(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
