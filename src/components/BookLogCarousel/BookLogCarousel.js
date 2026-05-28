"use client";

/* BookLog — "My thoughts" section.
   ─────────────────────────────────
   Stacked list of articles, one row per piece. Each row carries
   a unique dot-matrix sigil + title + date. Hovering a row pops
   a floating description tooltip that tracks the cursor; the
   row itself is the full-bleed link into /reading/[id]. */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ARTICLES } from "./articles";
import styles from "./BookLogCarousel.module.css";

/* ── Animated dot matrix ───────────────────────────────────────
   5×5 grid of dots that loops through a sequence of frames. Every
   article gets a different animation from ANIMATIONS below (cross
   pulse, diagonal sweep, horizontal scan, cluster, perimeter
   spinner). All dots are always drawn — "on" cells render at
   full opacity, "off" cells at 0.2 — and the opacity transitions
   smoothly between frames so the pattern reads as motion rather
   than a hard cut. */

/* Tiny frame parser: takes a string of 0s and 1s (whitespace
   ignored) and returns a flat 25-cell array. Lets the animation
   sequences below stay readable line-by-line. */
function f(s) {
  return s.replace(/\s/g, "").split("").map((c) => (c === "1" ? 1 : 0));
}

/* Five animations, one per article. Each is an array of frames
   (each frame is a 5×5 grid expressed as 25 zeroes and ones).
   The component cycles through frames at a steady interval. */
const ANIMATIONS = [
  // 0 — Pulse: cross expands and contracts through a 10-frame
  // breathe cycle. Tightened from 12 frames by dropping the
  // "empty" pause; the loop is now one continuous in/out.
  [
    f("00000 00000 00100 00000 00000"),  // single
    f("00000 00100 01110 00100 00000"),  // small +
    f("00100 00100 11111 00100 00100"),  // plus
    f("01110 01110 11111 01110 01110"),  // thick +
    f("01110 11111 11111 11111 01110"),  // round square
    f("11111 11111 11111 11111 11111"),  // full
    f("01110 11111 11111 11111 01110"),  // round square
    f("01110 01110 11111 01110 01110"),  // thick +
    f("00100 00100 11111 00100 00100"),  // plus
    f("00000 00100 01110 00100 00000"),  // small +
  ],
  // 1 — Diagonal sweep: a full diagonal line travels across the
  // grid one cell at a time. 9 frames of motion + 1 rest = 10.
  [
    f("10000 00000 00000 00000 00000"),
    f("01000 10000 00000 00000 00000"),
    f("00100 01000 10000 00000 00000"),
    f("00010 00100 01000 10000 00000"),
    f("00001 00010 00100 01000 10000"),
    f("00000 00001 00010 00100 01000"),
    f("00000 00000 00001 00010 00100"),
    f("00000 00000 00000 00001 00010"),
    f("00000 00000 00000 00000 00001"),
    f("00000 00000 00000 00000 00000"),
  ],
  // 2 — Horizontal scan: a single row travels top to bottom and
  // back to top in one continuous round trip. 10 frames, no
  // rest — the bottom row holds for 2 consecutive frames to act
  // as the turnaround point.
  [
    f("11111 00000 00000 00000 00000"),  // row 0
    f("00000 11111 00000 00000 00000"),  // row 1
    f("00000 00000 11111 00000 00000"),  // row 2
    f("00000 00000 00000 11111 00000"),  // row 3
    f("00000 00000 00000 00000 11111"),  // row 4 (turnaround)
    f("00000 00000 00000 00000 11111"),  // row 4 (hold)
    f("00000 00000 00000 11111 00000"),  // row 3
    f("00000 00000 11111 00000 00000"),  // row 2
    f("00000 11111 00000 00000 00000"),  // row 1
    f("11111 00000 00000 00000 00000"),  // row 0
  ],
  // 3 — Cluster: a 2×2 block travels CW around the perimeter of
  // the grid. 10 frames — drops the two horizontal-edge middles
  // so the orbit completes a touch quicker but still hits every
  // corner.
  [
    f("11000 11000 00000 00000 00000"),  // TL
    f("01100 01100 00000 00000 00000"),
    f("00011 00011 00000 00000 00000"),  // TR (skip 2,0)
    f("00000 00011 00011 00000 00000"),
    f("00000 00000 00011 00011 00000"),
    f("00000 00000 00000 00011 00011"),  // BR
    f("00000 00000 00000 00110 00110"),
    f("00000 00000 00000 11000 11000"),  // BL (skip 2,3)
    f("00000 00000 11000 11000 00000"),
    f("00000 11000 11000 00000 00000"),
  ],
  // 4 — Perimeter spinner: a single dot orbits the outer ring in
  // 10 evenly-spaced steps (≈ 1.6 cells apart). The step sizes
  // are not perfectly uniform — most are 1 cell, a few are 2 —
  // but the long opacity transition blurs the cadence into a
  // continuous-feeling rotation.
  [
    f("10000 00000 00000 00000 00000"),  // (0,0)
    f("00100 00000 00000 00000 00000"),  // (2,0)
    f("00010 00000 00000 00000 00000"),  // (3,0)
    f("00000 00001 00000 00000 00000"),  // (4,1)
    f("00000 00000 00001 00000 00000"),  // (4,2)
    f("00000 00000 00000 00000 00001"),  // (4,4)
    f("00000 00000 00000 00000 00100"),  // (2,4)
    f("00000 00000 00000 00000 01000"),  // (1,4)
    f("00000 00000 00000 10000 00000"),  // (0,3)
    f("00000 00000 10000 00000 00000"),  // (0,2)
  ],
];

/* Frame duration is intentionally short and the CSS opacity
   transition (in BookLogCarousel.module.css) is intentionally
   long — that mismatch is what gives the matrix its motion. A
   dot that was lit in frame N starts fading toward its off
   opacity the moment frame N+1 promotes it to "off", and the
   long transition stretches that fade across several frames.
   Moving patterns naturally leave a smooth comet-tail trail; the
   pulse animation breathes in and out. No explicit trail logic
   in JS — the browser's interpolation does it all. */
const FRAME_DURATION = 150;
const OFF_OPACITY = 0.15;

function DotMatrix({ animation = 0, startFrame = 0, size = 5, cell = 6, dot = 2 }) {
  const frames = ANIMATIONS[animation % ANIMATIONS.length];
  const [frameIdx, setFrameIdx] = useState(startFrame % frames.length);

  useEffect(() => {
    const id = setInterval(() => {
      setFrameIdx((i) => (i + 1) % frames.length);
    }, FRAME_DURATION);
    return () => clearInterval(id);
  }, [frames.length]);

  const current = frames[frameIdx];
  const px = size * cell;
  const dots = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const i = r * size + c;
      const on = current[i] === 1;
      dots.push(
        <circle
          key={i}
          cx={c * cell + cell / 2}
          cy={r * cell + cell / 2}
          r={dot}
          fill="currentColor"
          style={{ opacity: on ? 1 : OFF_OPACITY }}
        />
      );
    }
  }

  return (
    <svg
      className={styles.matrix}
      viewBox={`0 0 ${px} ${px}`}
      width={px}
      height={px}
      aria-hidden="true"
    >
      {dots}
    </svg>
  );
}

export default function BookLogCarousel() {
  const total = ARTICLES.length;
  const [hoveredId, setHoveredId] = useState(null);
  const tooltipRef = useRef(null);
  const rafRef = useRef(0);
  const pendingRef = useRef({ x: 0, y: 0 });

  /* Mouse-follower. We track the latest pointer position in a ref
     and apply it to the tooltip via direct style writes inside an
     rAF tick — no React re-renders during cursor movement, only
     when the hovered article changes. The tooltip is offset down
     and to the right of the cursor so it doesn't sit under the
     pointer itself, and clamped to the viewport so it never falls
     off the right edge of the screen. */
  useEffect(() => {
    if (!hoveredId) return;

    const apply = () => {
      const el = tooltipRef.current;
      if (!el) return;
      const { x, y } = pendingRef.current;
      const tw = el.offsetWidth;
      const th = el.offsetHeight;
      const margin = 16;
      let left = x + 18;
      let top = y + 18;
      if (left + tw + margin > window.innerWidth) {
        /* Flip to the left of the cursor if the tooltip would
           overflow the viewport on the right. */
        left = x - tw - 18;
      }
      if (top + th + margin > window.innerHeight) {
        top = y - th - 18;
      }
      el.style.transform = `translate(${left}px, ${top}px)`;
      rafRef.current = 0;
    };

    const onMove = (e) => {
      pendingRef.current = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(apply);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    /* Seed an initial position so the tooltip lands at the cursor
       on first paint of the hovered article, not at (0,0). */
    apply();

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [hoveredId]);

  const hovered = hoveredId ? ARTICLES.find((a) => a.id === hoveredId) : null;

  return (
    <section className={styles.root} aria-label="My thoughts">
      <div className="section__head">
        <span className="section__label">My thoughts</span>
        <span className="section__rule" aria-hidden="true" />
        <span className="section__count">{total} articles</span>
      </div>

      <ul className={styles.list}>
        {ARTICLES.map((a, i) => (
          <li key={a.id} className={styles.row}>
            <Link
              href={`/reading/${a.id}`}
              className={styles.link}
              aria-label={`${a.title} — ${a.subtitle || ""}`.trim()}
              onPointerEnter={(e) => {
                pendingRef.current = { x: e.clientX, y: e.clientY };
                setHoveredId(a.id);
              }}
              onPointerLeave={() => setHoveredId(null)}
              onFocus={() => setHoveredId(a.id)}
              onBlur={() => setHoveredId(null)}
            >
              <div className={styles.matrixWrap}>
                {/* Each article gets one of the five animations.
                    startFrame=i staggers their phases so the row
                    of matrices doesn't blink in unison. */}
                <DotMatrix animation={i} startFrame={i} />
              </div>
              <div className={styles.body}>
                <div className={styles.head}>
                  <span className={styles.title}>{a.title}</span>
                  <span className={styles.date}>{a.date}</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {/* Floating description tooltip. Mounted in the DOM only when
          an article row is being hovered/focused; its absolute
          position is updated via direct transform writes inside an
          rAF tick so cursor tracking stays smooth. */}
      {hovered && (
        <div
          ref={tooltipRef}
          className={styles.tooltip}
          role="tooltip"
          aria-hidden="true"
        >
          {hovered.subtitle || hovered.excerpt}
        </div>
      )}
    </section>
  );
}
