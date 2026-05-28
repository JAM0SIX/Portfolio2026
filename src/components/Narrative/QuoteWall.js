"use client";

/* QuoteWall — staggered scroll-revealed quote rows.
   ----------------------------------------------------
   Each row sits initially folded out (rotateX -28°, opacity 0). When
   the list scrolls into view, the rows flip down into place one by
   one (140 ms apart), and inside each row the quote text appears
   character-by-character — the "type cards" feel: an old index-card
   flipping into the viewer and being typed onto.

   Sticky reveal — two levels:
   - Within a single visit: once a row has flipped in, it stays in;
     re-entering the viewport doesn't replay the row's animation.
   - Across navigations within the same tab: once the WALL has
     finished animating, leaving the page and coming back shows the
     quotes already in place. Tracked in sessionStorage keyed on the
     wall's content, so two pages with the same quotes share the
     "already seen" state. Matches the policy on the ScrambleText
     H1s — animations are first-arrival flair, not a recurring intro.

   Implementation notes:
   - Intersection Observer at threshold 0.4 so the flip fires when
     the row is meaningfully in view, not as soon as its top edge
     crosses the fold.
   - Per-character delay is computed from the row reveal start so
     the typewriter syncs with the flip. With 14 ms per character a
     60-char quote types in ~840 ms, which lines up with the row
     animation finishing first and the typewriter completing just
     after — reads as "the card lands, then types itself in." */

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./Narrative.module.css";

const ROW_STAGGER_MS = 140;
const CHAR_STAGGER_MS = 14;
const CHAR_FADE_MS = 90;

/* Session-scoped store of every QuoteWall instance that has finished
   animating in this tab. Each wall is keyed on the concatenation of
   its quote strings — same content → same key → same "already seen"
   state, even if the user lands on a different page that happens to
   use the same wall. */
const SEEN_KEY = "harrys-quotewall-seen";
const seenWalls = (() => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
})();
function markWallSeen(wallKey) {
  if (seenWalls.has(wallKey)) return;
  seenWalls.add(wallKey);
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      SEEN_KEY,
      JSON.stringify(Array.from(seenWalls)),
    );
  } catch {
    /* Storage quota / disabled — the in-memory Set still works for
       the rest of the session. */
  }
}

export default function QuoteWall({ items }) {
  const ref = useRef(null);
  /* Wall key — content-based. Two walls with identical quotes share
     the same seen state, which matches the user's mental model
     ("I've seen these quotes before"). */
  const wallKey = useMemo(
    () => items.map((it) => it.quote).join(""),
    [items],
  );
  /* `shown` is a Set of row indices that have entered the viewport.
     Sticky within a session: indices are only ever added, never
     removed. Always starts EMPTY so server-rendered HTML matches
     the client's first render — the "already seen" check happens
     in useEffect, AFTER hydration, to avoid a hydration mismatch
     (sessionStorage is unavailable on the server but populated on
     the client for return visits). */
  const [shown, setShown] = useState(() => new Set());
  /* When true, transitions are suppressed so the reveal is instant
     (no character-by-character typewriter). Set in useEffect when
     the wall has already been seen this session — the flip from
     opacity 0 → 1 happens in a single paint with no fade, which
     reads as "already there" rather than "appearing fresh". */
  const [instant, setInstant] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Already seen this wall in the session — skip the observer
       setup and reveal everything instantly (no transition). */
    if (seenWalls.has(wallKey)) {
      setInstant(true);
      setShown(new Set(items.map((_, i) => i)));
      return;
    }

    const rows = Array.from(
      el.querySelectorAll(`[data-quote-wall-row]`),
    );
    if (rows.length === 0) return;

    /* Honour reduced-motion users — show everything at once with no
       per-character delay, and still mark the wall as seen so a
       different-motion-preference future session doesn't re-trigger. */
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setShown(new Set(rows.map((_, i) => i)));
      markWallSeen(wallKey);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = rows.indexOf(entry.target);
          /* Stagger reveal so rows cascade in. setTimeout instead of
             CSS animation-delay because the parent flip is a state-
             driven class toggle, not a keyframe. */
          window.setTimeout(() => {
            setShown((prev) => {
              if (prev.has(idx)) return prev;
              const next = new Set(prev);
              next.add(idx);
              /* Once every row has revealed, mark the wall as seen
                 so subsequent navigations skip the animation. */
              if (next.size === rows.length) {
                /* Wait for the typewriter to also finish before
                   marking — otherwise a fast navigation away while
                   text is still typing would cheat the user out of
                   seeing it next visit. */
                const lastQuoteLen =
                  rows[rows.length - 1]?.querySelector?.(
                    `.${styles.quoteWallQuote}`,
                  )?.textContent?.length ?? 0;
                const typewriterTail =
                  lastQuoteLen * CHAR_STAGGER_MS + CHAR_FADE_MS;
                window.setTimeout(
                  () => markWallSeen(wallKey),
                  typewriterTail,
                );
              }
              return next;
            });
          }, idx * ROW_STAGGER_MS);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.4 },
    );

    rows.forEach((row) => io.observe(row));
    return () => io.disconnect();
  }, [items, wallKey]);

  return (
    <ul ref={ref} className={styles.quoteWall}>
      {items.map((it, i) => {
        const isShown = shown.has(i);
        return (
          <li
            key={i}
            data-quote-wall-row
            className={`${styles.quoteWallRow}${
              isShown ? " " + styles.quoteWallRowShown : ""
            }`}
          >
            <span className={styles.quoteWallQuote}>
              &ldquo;
              <Typewriter
                text={it.quote}
                shown={isShown}
                instant={instant}
              />
              &rdquo;
            </span>
            <span className={styles.quoteWallLabel}>{it.label}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* Typewriter — reveals each character with a small per-character
   delay once `shown` flips true. Each character is wrapped in its
   own span so opacity transitions can be staggered via inline
   `transitionDelay`. Spaces are emitted as-is so word boundaries
   don't jump around during the reveal.

   When `shown` is false the characters are still in the DOM (so the
   row reserves its full height pre-reveal) but invisible.

   When `instant` is true (a return visit to an already-seen wall),
   the transition is disabled so the opacity flips from 0 → 1 in a
   single paint with no fade.

   Note on style serialisation: the transition is expressed as
   longhand properties (transitionProperty, transitionDuration,
   transitionTimingFunction, transitionDelay) rather than the
   `transition` shorthand. React serialises the shorthand differently
   between SSR (expanded to longhand on the server) and CSR
   (rendered as shorthand on the client), causing hydration
   mismatches. Longhand-only keeps the two outputs identical. */
function Typewriter({ text, shown, instant }) {
  const chars = Array.from(text);
  return chars.map((c, i) => (
    <span
      key={i}
      style={{
        opacity: shown ? 1 : 0,
        transitionProperty: instant ? "none" : "opacity",
        transitionDuration: `${CHAR_FADE_MS}ms`,
        transitionTimingFunction: "ease-out",
        transitionDelay:
          shown && !instant ? `${i * CHAR_STAGGER_MS}ms` : "0ms",
      }}
    >
      {c}
    </span>
  ));
}
