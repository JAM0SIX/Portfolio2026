"use client";

/* EntryProvider — first-arrival entry sequence orchestrator.
   --------------------------------------------------------------
   On the first home-page load of a tab session, an entry overlay
   plays (ripple + timed scramble text), then a shockwave fires and
   the page assembles in a fixed order:

     1. hero H1 scramble
     2. hero body copy charges in
     3. identity (name + London/time)
     4. left sidebar clip-reveal (mirrors the right SidePanel)

   The ordering is exposed as a `level` through context; presentation
   components reveal when `level` reaches their step. The sidebar is
   driven imperatively here (it doesn't consume the context).

   No-flash: the inline boot script in layout.js sets
   `data-entering="1"` on <html> before first paint, and CSS holds the
   hero + sidebar hidden. This provider takes over once mounted and
   clears the attribute at the end.

   Once-per-tab: gated on sessionStorage. Returning loads (or any
   non-home route) render normally with no gating. */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

export const LEVELS = {
  OVERLAY: 0, // intro text playing, content held hidden
  SHOCKWAVE: 1, // wave fired, assembly begins
  H1: 2,
  BODY: 3,
  IDENTITY: 4,
  SIDEBAR: 5,
  WORK: 6, // below-hero sections (Recent work, etc.) load in
  DONE: 7, // everything revealed; overlay gone
};

const ENTERED_KEY = "harrys-entered";

const EntryContext = createContext({
  entering: false,
  level: LEVELS.DONE,
  fireShockwave: () => {},
});

export const useEntry = () => useContext(EntryContext);

/* Same dot → line → rounded-rect inset stages the right SidePanel
   uses, so the left sidebar reveals with the matching language. */
const SIDEBAR_DOT =
  "inset(calc(50% - 2px) calc(50% - 3px) calc(50% - 2px) calc(50% - 3px) round var(--radius-panel))";
const SIDEBAR_LINE =
  "inset(calc(50% - 2px) 0px calc(50% - 2px) 0px round var(--radius-panel))";
const SIDEBAR_FULL = "inset(0px 0px 0px 0px round var(--radius-panel))";

export default function EntryProvider({ children }) {
  const pathname = usePathname();
  const [entering, setEntering] = useState(false);
  const [level, setLevel] = useState(LEVELS.DONE);
  const timers = useRef([]);
  const started = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    if (started.current) return;

    const isHome = pathname === "/";
    /* The home hero is also embedded elsewhere on a loop via
       ?embed=1 / ?hero=1 — never run the entry sequence there. */
    const ds = document.documentElement.dataset;
    const embedded = ds.embed === "1" || ds.hero === "1";
    let entered = false;
    try {
      entered = !!sessionStorage.getItem(ENTERED_KEY);
    } catch {
      /* storage blocked — treat as not entered */
    }

    if (!isHome || entered || embedded) {
      /* No entry sequence: make sure nothing stays hidden. */
      document.documentElement.removeAttribute("data-entering");
      setEntering(false);
      setLevel(LEVELS.DONE);
      return;
    }

    started.current = true;
    setEntering(true);
    setLevel(LEVELS.OVERLAY);
  }, [pathname]);

  /* When the sidebar step fires, run the clip reveal on the actual
     .sidebar element (it doesn't read this context) and fade the
     fixed controls (theme toggle + background keys) in with it.
     Once-guarded — the effect re-runs on every later level change, so
     without this the clip animation would replay and flicker. */
  const navRevealed = useRef(false);
  useEffect(() => {
    if (!entering || level < LEVELS.SIDEBAR || navRevealed.current) return;
    const el = document.querySelector(".sidebar");
    if (!el) return;
    navRevealed.current = true;

    /* The theme/background controls are a separate fixed element —
       fade them in alongside the rail (CSS transition on .local-clock)
       so they don't pop in out of sync. */
    const clock = document.querySelector(".local-clock");
    if (clock) clock.style.opacity = "1";

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      el.style.opacity = "1";
      el.style.clipPath = "";
      return;
    }

    el.style.opacity = "1";
    const anim = el.animate(
      [
        { clipPath: SIDEBAR_DOT, opacity: 0, offset: 0 },
        { clipPath: SIDEBAR_LINE, opacity: 1, offset: 0.2 },
        { clipPath: SIDEBAR_FULL, opacity: 1, offset: 1 },
      ],
      { duration: 1000, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    );
    anim.addEventListener("finish", () => {
      el.style.clipPath = "";
    });
  }, [entering, level]);

  /* Called by the overlay when the intro text has finished and the
     shockwave fires. Steps the assembly, then marks the tab entered
     and tears the overlay down. */
  const fireShockwave = useCallback(() => {
    clearTimers();
    setLevel(LEVELS.SHOCKWAVE);

    /* Deliberate, well-separated steps so the page assembles one piece
       at a time rather than all at once: heading scrambles in, then the
       body, then the identity, then the sidebar. */
    const steps = [
      [LEVELS.H1, 250],
      [LEVELS.BODY, 1550],
      [LEVELS.IDENTITY, 2600],
      [LEVELS.SIDEBAR, 3600],
    ];
    steps.forEach(([lvl, t]) => {
      timers.current.push(setTimeout(() => setLevel(lvl), t));
    });

    /* Below-hero sections (Recent work + the rest) cascade in as
       components after the sidebar — never revealed by the wipe. They
       don't read the context, so reveal them imperatively with a
       per-section animation delay. */
    timers.current.push(
      setTimeout(() => {
        setLevel(LEVELS.WORK);
        document
          .querySelectorAll(".col > section:not(.hc-root)")
          .forEach((el, i) => {
            el.style.animationDelay = `${i * 160}ms`;
            el.classList.add("entry-in");
            /* Drop entry-in once the rise finishes. The animation's
               `both` fill otherwise leaves a lingering identity-matrix
               transform, which makes the section a containing block for
               the fixed "My thoughts" tooltip and mis-anchors it. */
            el.addEventListener(
              "animationend",
              () => {
                el.classList.remove("entry-in");
                el.style.animationDelay = "";
              },
              { once: true },
            );
          });
        /* Hand opacity back to base styles now that hero + sidebar +
           sections all drive their own reveal (each section's entry-in
           holds opacity 0 until its delayed start, so no flash). */
        document.documentElement.removeAttribute("data-entering");
      }, 4500),
    );

    timers.current.push(
      setTimeout(() => {
        try {
          sessionStorage.setItem(ENTERED_KEY, "1");
        } catch {
          /* ignore */
        }
        setLevel(LEVELS.DONE);
        setEntering(false);
      }, 6200),
    );
  }, []);

  useEffect(() => () => clearTimers(), []);

  return (
    <EntryContext.Provider value={{ entering, level, fireShockwave }}>
      {children}
    </EntryContext.Provider>
  );
}
