"use client";

/* PixelTerrain — procedural pixel-art backdrop for the footer.
   ─────────────────────────────────────────────────────────────
   A chunky grid of cells, each in one of four fill states:
     · empty       — no fill (paper shows through)
     · light dither — 25 %-density checkerboard of accent dots
     · dense dither — 50 %-density checkerboard of accent dots
     · solid       — full accent fill
   A 2-D value-noise field selects each cell's state from
   thresholds on the noise value. The same noise function evolves
   slowly along a third (time) axis, so cells drift between states
   in a low-frequency way — the terrain "breathes" without ever
   looking random or jittery.

   Sibling component of PhilosophyVisuals: same theme-resolver
   approach (read --accent + --ink at mount, re-resolve on theme
   change), same DPR-aware canvas sizing, same IntersectionObserver
   pause so off-screen footers don't burn CPU. */

import { useEffect, useRef } from "react";
import styles from "./PixelTerrain.module.css";

const CELL_PX = 20;             // grid pitch
const NOISE_SCALE_XY = 0.18;    // spatial frequency of the field
const NOISE_SCALE_T = 0.00018;  // temporal frequency (very slow drift)
/* Cursor "shy" radius — terrain cells inside the inner radius are
   always skipped; out to the outer radius they're probabilistically
   skipped with the chance falling off with distance. A tight inner
   hole + a wide soft falloff gives the pointer a small clear core
   and a long, gentle dithered fade around it. */
const CURSOR_INNER_R = 30;
const CURSOR_OUTER_R = 180;

/* Thresholds carve the [0,1] noise range into four bands. Tuned so
   ~25 % of cells solid, ~25 % dense dither, ~20 % light dither,
   ~30 % empty — gives a "30 % terrain coverage" feel that reads
   as scattered organic clusters rather than a wall of texture. */
const T_EMPTY_MAX = 0.30;
const T_LIGHT_MAX = 0.50;
const T_DENSE_MAX = 0.75;

/* ── Simple 2D+time value-noise ────────────────────────────────
   Bilinear interpolation between hashed lattice points, then
   linearly interpolated again between two time slices. Cheap,
   smooth, and good enough for a slow drift. */
function hash3(x, y, t) {
  /* Stable integer hash → [0, 1). */
  let h = x * 374761393 + y * 668265263 + t * 2147483647;
  h = (h ^ (h >>> 13)) * 1274126177;
  h = (h ^ (h >>> 16)) >>> 0;
  return h / 4294967295;
}
function smooth(t) {
  /* Smoothstep — softens the bilinear interpolation. */
  return t * t * (3 - 2 * t);
}
function noise3(x, y, t) {
  const xi = Math.floor(x), yi = Math.floor(y), ti = Math.floor(t);
  const xf = x - xi, yf = y - yi, tf = t - ti;
  const u = smooth(xf), v = smooth(yf), w = smooth(tf);

  const slice = (ts) => {
    const c00 = hash3(xi,     yi,     ts);
    const c10 = hash3(xi + 1, yi,     ts);
    const c01 = hash3(xi,     yi + 1, ts);
    const c11 = hash3(xi + 1, yi + 1, ts);
    return (
      c00 * (1 - u) * (1 - v) +
      c10 * u       * (1 - v) +
      c01 * (1 - u) * v       +
      c11 * u       * v
    );
  };

  return slice(ti) * (1 - w) + slice(ti + 1) * w;
}

/* `clearSelector` lets the consumer mark DOM elements that should
   carve a hole in the terrain — any cell that overlaps one of
   those elements' bounding rects is skipped. The footer uses this
   so the text/CTA plates have a clean paper zone behind them
   without needing their own opaque background to mask the
   pattern. Pass a CSS selector (e.g. "[data-pixel-clear]") and any
   element matching it inside the document will create a safe
   region. Defaults to no clearing. */
export default function PixelTerrain({ clearSelector = null, clearPadding = 6 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* Theme-resolved colours. The terrain is drawn in --accent
       (the brand blue, same in both modes); paper shows through
       the empty cells naturally because the canvas itself is
       transparent. Re-resolve on theme flips so any custom
       accent override is picked up live. */
    let accentRGB = "31,81,255";
    const resolveColors = () => {
      const probe = document.createElement("span");
      probe.style.color = "var(--accent, #1F51FF)";
      probe.style.display = "none";
      document.body.appendChild(probe);
      const raw = getComputedStyle(probe).color;
      document.body.removeChild(probe);
      const m = raw.match(/\d+(?:\.\d+)?/g);
      if (m && m.length >= 3) accentRGB = `${m[0]},${m[1]},${m[2]}`;
    };
    resolveColors();
    const accent = (a = 1) => `rgba(${accentRGB},${a})`;

    const themeObs = new MutationObserver(resolveColors);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });

    let width = 0, height = 0, dpr = 1;
    let cols = 0, rows = 0;
    /* Safe-area rects in canvas-local pixels. Recomputed alongside
       resize so they always reflect current layout. The terrain
       skips any cell whose centre lands inside one of these. */
    let clearRects = [];

    const computeClearRects = () => {
      clearRects = [];
      if (!clearSelector) return;
      const canvasRect = canvas.getBoundingClientRect();
      document.querySelectorAll(clearSelector).forEach((el) => {
        const r = el.getBoundingClientRect();
        clearRects.push({
          x: r.left - canvasRect.left - clearPadding,
          y: r.top - canvasRect.top - clearPadding,
          w: r.width + clearPadding * 2,
          h: r.height + clearPadding * 2,
        });
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL_PX);
      rows = Math.ceil(height / CELL_PX);
      computeClearRects();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    /* Also observe each safe-area element so the cleared zone
       updates immediately when their layout changes (e.g. font
       loaded, content reflowed). */
    let elementObservers = [];
    if (clearSelector) {
      document.querySelectorAll(clearSelector).forEach((el) => {
        const o = new ResizeObserver(computeClearRects);
        o.observe(el);
        elementObservers.push(o);
      });
    }

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    /* Cursor tracking. The terrain "shies away" from the pointer:
       cells within CURSOR_INNER_R are skipped entirely, cells out
       to CURSOR_OUTER_R fade by a probability that scales with
       distance (deterministic per cell via the noise field).
       `cursor` holds the rendered position; `cursorTarget` is the
       raw pointer position. Each frame the rendered position lerps
       toward the target so motion is smooth even on fast mouse
       moves. `cursorIntensity` fades in/out on enter/leave so the
       effect doesn't pop. */
    let cursor = { x: -9999, y: -9999 };
    let cursorTarget = { x: -9999, y: -9999 };
    let cursorIntensity = 0;       // current 0..1
    let cursorIntensityTarget = 0; // 0 when pointer is outside, 1 when inside

    /* Document-level listener so the effect works regardless of
       which DOM node the pointer is over inside the footer band
       (the content plates sit in a separate subtree from the
       canvas and would otherwise swallow the event). Each move we
       check whether the pointer is inside the canvas's bounding
       box and toggle intensity accordingly. */
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      cursorTarget = { x, y };
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      cursorIntensityTarget = inside ? 1 : 0;
    };
    document.addEventListener("pointermove", onPointerMove, { passive: true });

    /* Cell renderers. Each draws inside an (x, y, size) box. Solid
       and dither share the same building block — dither just paints
       a subset of "subpixels" inside the cell. */
    const drawSolid = (x, y, s) => {
      ctx.fillStyle = accent(1);
      ctx.fillRect(x, y, s, s);
    };
    const drawDither = (x, y, s, density) => {
      /* 4×4 sub-grid inside the cell, paint a deterministic subset
         based on density. Looks like a halftone pattern at this
         pitch — square dots in a regular lattice. */
      const sub = s / 4;
      ctx.fillStyle = accent(1);
      for (let iy = 0; iy < 4; iy++) {
        for (let ix = 0; ix < 4; ix++) {
          let on;
          if (density === "dense") {
            /* checkerboard: 50 % coverage */
            on = (ix + iy) % 2 === 0;
          } else {
            /* light: every other row & col, 25 % coverage */
            on = ix % 2 === 0 && iy % 2 === 0;
          }
          if (on) {
            const px = x + ix * sub;
            const py = y + iy * sub;
            const d = Math.max(1, sub - 0.5);
            ctx.fillRect(px, py, d, d);
          }
        }
      }
    };

    let raf = 0;
    const start = performance.now();

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const now = performance.now();
      const t = (now - start) * NOISE_SCALE_T;

      /* Smoothly track the pointer. The lerp factor is framerate-
         independent enough at 60 fps; not worth tying to dt for
         this small interaction. */
      cursor.x += (cursorTarget.x - cursor.x) * 0.22;
      cursor.y += (cursorTarget.y - cursor.y) * 0.22;
      cursorIntensity += (cursorIntensityTarget - cursorIntensity) * 0.12;

      const cursorActive = cursorIntensity > 0.02;
      const innerSq = CURSOR_INNER_R * CURSOR_INNER_R;
      const outerSq = CURSOR_OUTER_R * CURSOR_OUTER_R;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL_PX;
          const y = r * CELL_PX;
          const cx = x + CELL_PX / 2;
          const cy = y + CELL_PX / 2;

          /* Skip cells whose centre lands inside any cleared rect
             — gives the footer content a clean paper zone without
             needing an opaque background. */
          if (clearRects.length) {
            let inside = false;
            for (const rc of clearRects) {
              if (cx >= rc.x && cx <= rc.x + rc.w && cy >= rc.y && cy <= rc.y + rc.h) {
                inside = true;
                break;
              }
            }
            if (inside) continue;
          }

          const n = noise3(c * NOISE_SCALE_XY, r * NOISE_SCALE_XY, t);
          if (n < T_EMPTY_MAX) continue; // empty cell — paper shows through

          /* Cursor shyness. Inside the inner radius the cell is
             always skipped; between inner and outer it's skipped
             with a probability scaled by distance — using the cell's
             own noise value as the deterministic dice roll so the
             halo has a softly-eroded edge rather than a circular
             cut. `cursorIntensity` scales the whole effect so the
             hole fades in/out cleanly on pointer enter/leave. */
          if (cursorActive) {
            const dx = cx - cursor.x;
            const dy = cy - cursor.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < outerSq) {
              if (distSq < innerSq) {
                continue;
              }
              const t01 = (Math.sqrt(distSq) - CURSOR_INNER_R) / (CURSOR_OUTER_R - CURSOR_INNER_R);
              /* Probability of skipping this cell: 1 at inner edge
                 → 0 at outer edge, scaled by intensity. Compare to
                 the cell's stable noise value so the same cell
                 doesn't flicker on/off across frames. */
              const skipProb = (1 - t01) * cursorIntensity;
              if (n - T_EMPTY_MAX < skipProb * (1 - T_EMPTY_MAX)) continue;
            }
          }

          if (n < T_LIGHT_MAX) drawDither(x, y, CELL_PX, "light");
          else if (n < T_DENSE_MAX) drawDither(x, y, CELL_PX, "dense");
          else drawSolid(x, y, CELL_PX);
        }
      }
    };

    /* Frame loop. We always run the loop so cursor interactions
       stay live (an input-driven effect, not autonomous motion).
       For prefers-reduced-motion the time axis is frozen so the
       noise field never drifts on its own — cells only change
       state when the cursor reveals/conceals them. */
    const draw0 = draw;
    const drawReduced = () => {
      /* Equivalent of draw() but with a fixed time so noise field
         is stationary. Cursor lerp still progresses. */
      const stash = NOISE_SCALE_T;
      const now = performance.now();
      const t = 0; // fixed
      ctx.clearRect(0, 0, width, height);
      cursor.x += (cursorTarget.x - cursor.x) * 0.22;
      cursor.y += (cursorTarget.y - cursor.y) * 0.22;
      cursorIntensity += (cursorIntensityTarget - cursorIntensity) * 0.12;
      const cursorActive = cursorIntensity > 0.02;
      const innerSq = CURSOR_INNER_R * CURSOR_INNER_R;
      const outerSq = CURSOR_OUTER_R * CURSOR_OUTER_R;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * CELL_PX;
          const y = r * CELL_PX;
          const cx = x + CELL_PX / 2;
          const cy = y + CELL_PX / 2;
          if (clearRects.length) {
            let inside = false;
            for (const rc of clearRects) {
              if (cx >= rc.x && cx <= rc.x + rc.w && cy >= rc.y && cy <= rc.y + rc.h) {
                inside = true;
                break;
              }
            }
            if (inside) continue;
          }
          const n = noise3(c * NOISE_SCALE_XY, r * NOISE_SCALE_XY, t);
          if (n < T_EMPTY_MAX) continue;
          if (cursorActive) {
            const dx = cx - cursor.x, dy = cy - cursor.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < outerSq) {
              if (distSq < innerSq) continue;
              const t01 = (Math.sqrt(distSq) - CURSOR_INNER_R) / (CURSOR_OUTER_R - CURSOR_INNER_R);
              const skipProb = (1 - t01) * cursorIntensity;
              if (n - T_EMPTY_MAX < skipProb * (1 - T_EMPTY_MAX)) continue;
            }
          }
          if (n < T_LIGHT_MAX) drawDither(x, y, CELL_PX, "light");
          else if (n < T_DENSE_MAX) drawDither(x, y, CELL_PX, "dense");
          else drawSolid(x, y, CELL_PX);
        }
      }
    };
    const tick = reduced ? drawReduced : draw0;
    const loop = () => {
      if (visible) tick();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      elementObservers.forEach((o) => o.disconnect());
      document.removeEventListener("pointermove", onPointerMove);
    };
  }, [clearSelector, clearPadding]);

  return (
    <div className={styles.terrain} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}
