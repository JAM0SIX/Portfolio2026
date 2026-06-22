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
}) {
  /* Initial state matches the target so SSR markup equals the first
     client render (no hydration mismatch). */
  const [chars, setChars] = useState(() => text.split(""));
  /* null = natural flow (no width lock); array = per-char locked
     widths in px (kerning-accurate advances) applied during scramble. */
  const [widths, setWidths] = useState(null);
  const spanRefs = useRef([]);

  useLayoutEffect(() => {
    /* Already animated this text in the session — render settled. */
    if (seenTexts.has(text)) return;

    const target = text.split("");

    /* Measure each character's true advance from the natural render
       (chars still equal target here). Within a word, the advance is
       the delta to the next character's left edge so inter-character
       kerning is captured; the last character of a word uses its own
       measured width. */
    const measured = target.map((tc, i) => {
      if (isSpace(tc)) return null;
      const el = spanRefs.current[i];
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const next = target[i + 1];
      if (next != null && !isSpace(next) && spanRefs.current[i + 1]) {
        return spanRefs.current[i + 1].getBoundingClientRect().left - rect.left;
      }
      return rect.width;
    });

    /* Pick one random glyph per non-space slot, then lock widths +
       scramble in the same paint. */
    const scrambled = target.map((tc) =>
      isSpace(tc) ? tc : pool[Math.floor(Math.random() * pool.length)],
    );
    setWidths(measured);
    setChars(scrambled);

    const timers = target.map((tc, i) => {
      if (isSpace(tc)) return null;
      const settleAt = i * stagger + duration;
      return setTimeout(() => {
        setChars((prev) => {
          const next = prev.slice();
          next[i] = tc;
          return next;
        });
      }, settleAt);
    });

    /* Once the last character settles, release the width lock (the
       locked widths equal the natural advances, so this is a no-op
       visually but restores responsiveness to viewport changes) and
       mark the text seen. */
    const finalSettleAt = (target.length - 1) * stagger + duration;
    const doneTimer = setTimeout(() => {
      setWidths(null);
      markSeen(text);
    }, finalSettleAt + 60);

    return () => {
      timers.forEach((t) => t && clearTimeout(t));
      clearTimeout(doneTimer);
    };
  }, [text, duration, stagger, pool]);

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
