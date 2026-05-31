"use client";

/* ScrambleText — character-scramble reveal animation.
   -----------------------------------------------------
   On mount, each character of the target text cycles through random
   characters before settling on its real value. Characters lock in
   left-to-right via a per-character `stagger`; once a character's
   `settleAt` time passes, that slot holds its final character for
   the rest of the lifecycle.

   Whitespace is preserved verbatim so word boundaries don't dance
   during the scramble. Aria-label carries the real text for screen
   readers; the visible span tree is aria-hidden.

   "Once per session" behaviour: each piece of text only animates on
   its first appearance in a tab session. Navigating away and back
   shows the heading already settled — the animation reads as page-
   arrival flair the first time you encounter a heading, not a
   recurring intro every time you revisit. Persisted in
   sessionStorage so it survives both client-side route changes and
   full-page refreshes within the same tab.

   Tunables (all in ms unless noted):
     duration — how long each character scrambles before settling.
     stagger  — delay added per character index (left-to-right wave).
     cycleMs  — how often the random characters cycle (lower = faster
                cycling, but more re-renders).
     pool     — characters to draw random glyphs from. */

import { useEffect, useState } from "react";

const DEFAULT_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*?";

/* Session-scoped store of every text that has finished animating in
   this tab. Read once at module load from sessionStorage; the
   in-memory Set keeps lookups O(1) and writes flush back to storage
   so a refresh doesn't replay every heading. Memory-only fallback
   if storage is unavailable (private browsing on some Safari builds). */
const SEEN_KEY = "harrys-scrambled-seen";
const seenTexts = (() => {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.sessionStorage.getItem(SEEN_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
})();
function markSeen(text) {
  if (seenTexts.has(text)) return;
  seenTexts.add(text);
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      SEEN_KEY,
      JSON.stringify(Array.from(seenTexts)),
    );
  } catch {
    /* Storage quota / disabled — fine, the in-memory Set still works
       for the rest of the session. */
  }
}

export default function ScrambleText({
  text,
  /* `duration` is each slot's hold time before it settles to its
     real character. With the one-glyph-per-slot model this also
     determines how long the random glyph is visible. */
  duration = 700,
  stagger = 28,
  pool = DEFAULT_POOL,
  className,
  /* Optional render override — by default ScrambleText paints into
     a <span>, but a parent like an h1 can opt to render its own
     wrapper element and pass `as="text"` to receive just the
     character spans (skipping the outer span). */
  as = "span",
}) {
  /* Initial state matches the target text so SSR markup equals the
     first client render — no hydration mismatch. */
  const [chars, setChars] = useState(() => text.split(""));

  useEffect(() => {
    /* Skip the animation if this exact text has already animated
       in this tab session. The initial state already matches the
       target text so the heading just renders as-is. */
    if (seenTexts.has(text)) return;

    const target = text.split("");

    /* Pick ONE random glyph per slot up-front, then schedule per-
       slot settle timers. Each slot shows exactly one random glyph
       before locking onto its real character, so the total visible
       glyph rotation is roughly equal to the length of the heading
       (rather than length × cycles). Reads as deliberate, not
       frantic. */
    const initialScrambled = target.map((tc) => {
      if (/\s/.test(tc)) return tc;
      return pool[Math.floor(Math.random() * pool.length)];
    });
    setChars(initialScrambled);

    const timers = target.map((tc, i) => {
      if (/\s/.test(tc)) return null;
      const settleAt = i * stagger + duration;
      return setTimeout(() => {
        setChars((prev) => {
          const next = prev.slice();
          next[i] = tc;
          return next;
        });
      }, settleAt);
    });

    /* Mark the text as seen once the last character has settled —
       not on mount — so a quick mid-animation navigation doesn't
       cheat the next visit out of its animation. */
    const finalSettleAt = (target.length - 1) * stagger + duration;
    const seenTimer = setTimeout(() => markSeen(text), finalSettleAt);

    return () => {
      timers.forEach((t) => t && clearTimeout(t));
      clearTimeout(seenTimer);
    };
  }, [text, duration, stagger, pool]);

  if (as === "text") {
    /* Caller renders its own wrapper; we just supply the spans. */
    return (
      <>
        {chars.map((c, i) => (
          <span key={i} aria-hidden="true">{c}</span>
        ))}
      </>
    );
  }

  return (
    <span className={className} aria-label={text}>
      {chars.map((c, i) => (
        <span key={i} aria-hidden="true">{c}</span>
      ))}
    </span>
  );
}
