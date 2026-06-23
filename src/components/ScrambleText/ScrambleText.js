"use client";

/* ScrambleText — character-scramble reveal animation.
   -----------------------------------------------------
   On mount, each character of the target text cycles through a random
   character before settling on its real value. Characters lock in
   left-to-right via a per-character `stagger`.

   Layout stability — the important guarantee:
   The scramble must NEVER change the heading's line layout. With a
   proportional font, a random glyph has a different advance width than
   the real character it stands in for, which would rewrap the heading
   (more/fewer lines, characters truncating in and out). To prevent
   this we measure each character's true advance (left-edge delta, so
   kerning is included) from the natural first render, then lock every
   character slot to that exact width for the duration of the scramble.
   Because the locked widths equal the natural advances, the line
   wrapping is identical to the settled heading throughout — and the
   lock can be released on completion with no reflow. Words are grouped
   in nowrap spans so locking (which makes each slot inline-block)
   never introduces a mid-word break.

   Whitespace is preserved verbatim and is the only wrap opportunity.
   Aria-label carries the real text; the visible spans are aria-hidden.

   "Once per session": each piece of text only animates on its first
   appearance in a tab session (sessionStorage), so revisiting a page
   shows headings already settled.

   Tunables (ms): duration (hold before settle), stagger (per-char
   delay). pool = glyphs to draw randoms from. */

import { useLayoutEffect, useRef, useState } from "react";

const DEFAULT_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*?";

/* How often (ms) unsettled characters re-randomise in random mode.
   Decoupled from the frame rate so churn cost stays bounded on long
   copy regardless of refresh rate. */
const CYCLE_MS = 70;

/* Session-scoped store of every text that has finished animating in
   this tab. */
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
    /* Storage quota / disabled — in-memory Set still works. */
  }
}

const isSpace = (c) => /\s/.test(c);

export default function ScrambleText({
  text,
  duration = 700,
  stagger = 28,
  pool = DEFAULT_POOL,
  className,
  /* Optional render override — by default ScrambleText paints into a
     <span>; a parent like an h1 can pass `as="text"` to receive just
     the character spans (skipping the outer span). */
  as = "span",
  /* By default each text animates only once per tab session. Pass
     `once={false}` to replay on every mount — useful where the same
     copy re-enters the viewport (e.g. a scroller that re-reveals a
     card's copy each time it becomes active, keyed by the caller). */
  once = true,
  /* Settle order:
       "random" (default) — every character cycles through glyphs
         continuously and they clear in a shuffled order, so the new
         copy resolves out of churning noise rather than a
         left-to-right wipe. Used site-wide.
       "linear" — characters settle left-to-right, each holding a
         single random glyph until its turn (the original behaviour,
         kept available per-caller). */
  order = "random",
  /* Width-locking measures each character's advance and pins the slot
     so a random glyph can't reflow the line. It's only needed for
     proportional fonts; in a monospace context (every glyph the same
     width) it's pure overhead — a forced layout over every span — so
     pass `lockWidths={false}` to skip it. */
  lockWidths = true,
}) {
  /* Initial state matches the target so SSR markup equals the first
     client render (no hydration mismatch). */
  const [chars, setChars] = useState(() => text.split(""));
  /* null = natural flow (no width lock); array = per-char locked
     widths in px (kerning-accurate advances) applied during scramble. */
  const [widths, setWidths] = useState(null);
  const spanRefs = useRef([]);

  useLayoutEffect(() => {
    /* Already animated this text in the session — render settled.
       Skipped when once={false}, so the caller can replay via key. */
    if (once && seenTexts.has(text)) return;

    const target = text.split("");

    /* Measure each character's true advance from the natural render
       (chars still equal target here) so the slot can be pinned during
       scramble. Skipped entirely when lockWidths is false (monospace),
       which avoids a forced layout over every span. */
    const measured = lockWidths
      ? target.map((tc, i) => {
          if (isSpace(tc)) return null;
          const el = spanRefs.current[i];
          if (!el) return null;
          const rect = el.getBoundingClientRect();
          const next = target[i + 1];
          if (next != null && !isSpace(next) && spanRefs.current[i + 1]) {
            return (
              spanRefs.current[i + 1].getBoundingClientRect().left - rect.left
            );
          }
          return rect.width;
        })
      : null;

    const randGlyph = () => pool[Math.floor(Math.random() * pool.length)];

    /* Settle sequence — the order in which characters lock to their
       real value. Linear keeps source order; random shuffles the
       non-space slots (Fisher-Yates) so they clear unpredictably. */
    const nonSpace = [];
    for (let i = 0; i < target.length; i++) {
      if (!isSpace(target[i])) nonSpace.push(i);
    }
    const sequence = nonSpace.slice();
    if (order === "random") {
      for (let i = sequence.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [sequence[i], sequence[j]] = [sequence[j], sequence[i]];
      }
    }
    const settleTimeOf = new Map();
    sequence.forEach((idx, rank) => settleTimeOf.set(idx, rank * stagger + duration));

    const lastRank = nonSpace.length > 0 ? nonSpace.length - 1 : 0;
    const finalSettleAt = lastRank * stagger + duration;

    /* Lock widths + initial scramble in the same paint. */
    setWidths(measured);
    setChars(target.map((tc) => (isSpace(tc) ? tc : randGlyph())));

    let raf = 0;
    let timers = [];

    if (order === "random") {
      /* Single rAF loop drives the whole animation: each frame, settle
         every character whose time has come and re-randomise the rest
         at most every CYCLE_MS. Batching all updates into ONE setState
         per frame (and skipping frames where nothing changes) keeps
         re-renders at frame-rate instead of one-per-character — which
         is what made long body copy stutter. */
      let start = 0;
      let lastCycle = 0;
      let prevDue = -1;
      const step = (t) => {
        if (!start) start = t;
        const elapsed = t - start;
        const churn = t - lastCycle >= CYCLE_MS;
        if (churn) lastCycle = t;

        let due = 0;
        for (const idx of nonSpace) {
          if (elapsed >= settleTimeOf.get(idx)) due++;
        }
        /* Only re-render when a character settles or it's a churn
           frame — otherwise the frame is a no-op. */
        if (churn || due !== prevDue) {
          prevDue = due;
          setChars((prev) => {
            const nextArr = prev.slice();
            for (const idx of nonSpace) {
              if (elapsed >= settleTimeOf.get(idx)) nextArr[idx] = target[idx];
              else if (churn) nextArr[idx] = randGlyph();
            }
            return nextArr;
          });
        }

        if (elapsed < finalSettleAt) {
          raf = requestAnimationFrame(step);
        } else {
          setChars(target.slice());
          setWidths(null);
          if (once) markSeen(text);
        }
      };
      raf = requestAnimationFrame(step);
    } else {
      /* Linear: each character holds a single random glyph until its
         scheduled settle. Per-character timers are fine for the short
         headings that opt into this mode. */
      timers = target.map((tc, i) => {
        if (isSpace(tc)) return null;
        return setTimeout(() => {
          setChars((prev) => {
            const nextArr = prev.slice();
            nextArr[i] = tc;
            return nextArr;
          });
        }, settleTimeOf.get(i) ?? 0);
      });
      timers.push(
        setTimeout(() => {
          setWidths(null);
          if (once) markSeen(text);
        }, finalSettleAt + 60),
      );
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      timers.forEach((t) => t && clearTimeout(t));
    };
  }, [text, duration, stagger, pool, once, order, lockWidths]);

  /* Build the span tree grouped by word so the width lock (inline-block
     slots) can never create a mid-word break — only the standalone
     whitespace spans are wrap opportunities. */
  const nodes = [];
  let word = [];
  let wordKey = 0;
  const flushWord = () => {
    if (!word.length) return;
    nodes.push(
      <span key={`w${wordKey++}`} style={{ whiteSpace: "nowrap" }}>
        {word}
      </span>,
    );
    word = [];
  };
  for (let i = 0; i < chars.length; i++) {
    if (isSpace(text[i])) {
      flushWord();
      nodes.push(
        <span key={`s${i}`} aria-hidden="true">
          {chars[i]}
        </span>,
      );
      continue;
    }
    const style =
      widths && widths[i] != null
        ? { display: "inline-block", width: `${widths[i]}px`, textAlign: "center" }
        : undefined;
    word.push(
      <span
        key={i}
        ref={(el) => {
          spanRefs.current[i] = el;
        }}
        aria-hidden="true"
        style={style}
      >
        {chars[i]}
      </span>,
    );
  }
  flushWord();

  if (as === "text") {
    /* Caller renders its own wrapper (and its own accessible name). */
    return <>{nodes}</>;
  }

  return (
    <span className={className} aria-label={text}>
      {nodes}
    </span>
  );
}
