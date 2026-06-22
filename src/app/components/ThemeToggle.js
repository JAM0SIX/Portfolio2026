"use client";

/* ThemeToggle — draggable sliding switch in a bevelled plate.
   --------------------------------------------------------------
   Sun + moon icons sit above a horizontal track with a draggable
   knob. The knob can be:
     (a) dragged across the track with a pointer — it snaps to
         whichever side it's closer to on release;
     (b) clicked directly on either icon — the knob springs to
         that side.
   Spring animation handled by Motion; drag handled by Motion's
   pointer-event drag. */

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "motion/react";

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
  const [theme, setTheme] = useState("paper");
  const trackRef = useRef(null);
  /* Drag offset only. The knob's resting side is driven entirely by
     CSS keyed on html[data-theme] (see .skeuo-theme-knob in globals)
     — this build's Motion `animate` prop does not apply transforms,
     so we never rely on it for positioning. The motion value here is
     used purely so a drag can be reset to the resting position with
     an instant x.set(0) on release. */
  const x = useMotionValue(0);

  useEffect(() => {
    const t = document.documentElement.dataset.theme || "paper";
    setTheme(t);
  }, []);

  function apply(next) {
    if (next === theme) return;
    const root = document.documentElement;
    root.classList.add("is-theme-changing");
    root.dataset.theme = next;
    window.setTimeout(() => root.classList.remove("is-theme-changing"), 750);
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    setTheme(next);
  }

  return (
    <div className="skeuo-theme" role="group" aria-label="Theme">
      <div
        ref={trackRef}
        className="skeuo-theme-track"
        onClick={(e) => {
          /* Click anywhere on the track to send the knob to that side —
             no dragging required. (A drag ends via onDragEnd; apply()
             ignores a no-op so the trailing click is harmless.) */
          if (!trackRef.current) return;
          const rect = trackRef.current.getBoundingClientRect();
          const midpoint = rect.left + rect.width / 2;
          apply(e.clientX > midpoint ? "onyx" : "paper");
        }}
      >
        {/* Both icons sit in the track as a dull backdrop; the knob's
            blue icon slides over whichever side is active, leaving the
            inactive one showing dull behind it. */}
        <span className="skeuo-theme-bg skeuo-theme-bg--sun" aria-hidden="true">
          <SunIcon />
        </span>
        <span className="skeuo-theme-bg skeuo-theme-bg--moon" aria-hidden="true">
          <MoonIcon />
        </span>
        <motion.div
          className="skeuo-theme-knob"
          style={{ x }}
          drag="x"
          dragConstraints={trackRef}
          dragElastic={0}
          dragMomentum={false}
          onDragEnd={(_, info) => {
            /* Snap the drag transform back to 0 instantly; the knob's
               resting side then follows from CSS as soon as the theme
               (and therefore html[data-theme]) updates. */
            x.set(0);
            if (!trackRef.current) return;
            const rect = trackRef.current.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            apply(info.point.x > midpoint ? "onyx" : "paper");
          }}
          aria-hidden="true"
        >
          {theme === "onyx" ? <MoonIcon /> : <SunIcon />}
        </motion.div>
      </div>
    </div>
  );
}
