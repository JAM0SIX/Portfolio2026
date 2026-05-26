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

   Tunables (all in ms unless noted):
     duration — how long each character scrambles before settling.
     stagger  — delay added per character index (left-to-right wave).
     cycleMs  — how often the random characters cycle (lower = faster
                cycling, but more re-renders).
     pool     — characters to draw random glyphs from. */

import { useEffect, useState } from "react";

const DEFAULT_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*?";

export default function ScrambleText({
  text,
  duration = 700,
  stagger = 28,
  cycleMs = 55,
  pool = DEFAULT_POOL,
  className,
  /* Optional render override — by default ScrambleText paints into
     a <span>, but a parent like an h1 can opt to render its own
     wrapper element and pass `as="text"` to receive just the
     character spans (skipping the outer span). */
  as = "span",
}) {
  /* Initial state matches the target text so SSR markup equals the
     first client render — no hydration mismatch. The scramble kicks
     off in useEffect, replacing the state with cycling characters. */
  const [chars, setChars] = useState(() => text.split(""));

  useEffect(() => {
    const target = text.split("");
    const startedAt = performance.now();
    const totalMs = target.length * stagger + duration + 100;
    let intervalId;

    function tick() {
      const now = performance.now() - startedAt;
      setChars(
        target.map((tc, i) => {
          /* Preserve whitespace and punctuation that doesn't read as
             a glyph — scrambling those produces noise without helping
             the reveal land. */
          if (/\s/.test(tc)) return tc;
          const settleAt = i * stagger + duration;
          if (now >= settleAt) return tc;
          return pool[Math.floor(Math.random() * pool.length)];
        }),
      );
      if (now > totalMs) clearInterval(intervalId);
    }

    /* Run once immediately so the scramble starts on this frame
       rather than waiting cycleMs ms. */
    tick();
    intervalId = setInterval(tick, cycleMs);
    return () => clearInterval(intervalId);
  }, [text, duration, stagger, cycleMs, pool]);

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
