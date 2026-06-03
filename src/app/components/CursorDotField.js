"use client";

/* Cursor-tracked proximity dot field.
   A canvas grid of dots that brighten and grow as the cursor approaches.
   Confined to the page's main column (.shell__main) — never reaches the
   sidebar. Palette swaps with the active theme via a MutationObserver on
   <html data-theme>. Idle drift kicks in after 2.5s of no input unless
   prefers-reduced-motion is set.

   Ported from the source Haz mockup (hero.html). All numbers below come
   from that reference — tweak in CFG. */

import { useEffect, useRef } from "react";
import { getCursorMode, subscribeCursorMode } from "@/lib/cursorMode";

const CFG = {
  spacing: 32,         // dot grid pitch in px
  dotSize: 0.7,        // base dot radius in px
  radius: 410,         // proximity-influence radius in px
  falloff: 2.1,        // power curve of strength → distance
  growth: 3.4,         // peak size multiplier under the cursor
  hoverOpacity: 0.75,  // cap on alpha for a single dot
};

// OKLCH palette stops. Paper = cool grey ramp for light theme;
// ink = warm paper-tone ramp for dark theme.
const PALETTES = {
  paper: [
    [0.0, [0.45, 0.005, 240]],
    [0.5, [0.7,  0.005, 240]],
    [1.0, [0.92, 0.005, 240]],
  ],
  ink: [
    [0.0, [0.92, 0.005, 60]],
    [0.5, [0.7,  0.005, 60]],
    [1.0, [0.42, 0.005, 60]],
  ],
};

function oklchToRgb(L, C, hDeg) {
  const h = (hDeg * Math.PI) / 180;
  const a = Math.cos(h) * C;
  const b = Math.sin(h) * C;
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548  * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const r  =  4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g  = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bl = -0.0041960863 * l - 0.7034186147 * m + 1.707614701  * s;
  const enc = (v) => {
    v = Math.max(0, Math.min(1, v));
    return v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  };
  return [enc(r) * 255, enc(g) * 255, enc(bl) * 255];
}

function buildLUT(stops) {
  const lut = new Array(256);
  for (let i = 0; i < 256; i++) {
    const t = i / 255;
    let a = stops[0];
    let b = stops[stops.length - 1];
    for (let k = 0; k < stops.length - 1; k++) {
      if (t >= stops[k][0] && t <= stops[k + 1][0]) {
        a = stops[k]; b = stops[k + 1]; break;
      }
    }
    const span = b[0] - a[0] || 1;
    const u = (t - a[0]) / span;
    const L = a[1][0] + (b[1][0] - a[1][0]) * u;
    const C = a[1][1] + (b[1][1] - a[1][1]) * u;
    const h0 = a[1][2];
    const h1 = b[1][2];
    let dh = h1 - h0;
    if (dh > 180) dh -= 360;
    if (dh < -180) dh += 360;
    const H = h0 + dh * u;
    lut[i] = oklchToRgb(L, C, H);
  }
  return lut;
}

function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function CursorDotField() {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* Touch / coarse-pointer devices: there's no precise cursor to
       react to, so skip the whole field — no canvas paint, no RAF
       loop, no touchmove listener. The CSS already hides .dot-field
       on these devices; this stops it doing any work behind that. */
    const coarse =
      window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let variant = document.documentElement.dataset.theme === "onyx" ? "ink" : "paper";
    let LUT = buildLUT(PALETTES[variant]);
    // Theme crossfade: when the theme changes, we keep the old LUT around
    // and interpolate toward the new one over THEME_DUR ms so the dot
    // colours breathe instead of snapping.
    let prevLUT = null;
    let themeStart = 0;
    const THEME_DUR = 700;

    let W = 0, H = 0, DPR = 1;
    let mx = -9999, my = -9999;
    let realMx = -9999, realMy = -9999;
    let lastInputAt = 0;
    let dots = [];
    let isVisible = true;
    let raf = 0;
    /* Render mode — "dot" | "plus" | "tick" | "off". Subscribed to
       the shared cursor-mode store; CursorToggle in the side panel
       writes to it. */
    let mode = getCursorMode();
    /* Preview wave — when the user picks a new symbol, a circular
       ripple emanates from the bottom-left corner of the canvas
       and expands outward to the top-right. Each cell briefly
       peaks as the wave's radius matches its distance from the
       bottom-left, so the field reveals the new symbol as a
       directional gesture with a *curved* leading edge rather than
       a straight line. Skipped when switching TO "off" — turning
       the field off shouldn't flash on the way out.

       PREVIEW_DUR: total time for the wave to expand from
       radius 0 (at BL) to radius = diagonal length (just past TR).
       2000 ms reads as deliberate without dragging.
       WAVE_HALF_WIDTH: thickness of the wave ring in normalised
       radius units (0 at BL, 1 at TR). A wider ring lights more
       cells at once; narrower reads as a sharper arc.
       ~0.28 keeps the band visible without losing the curve. */
    let previewStartAt = 0;
    const PREVIEW_DUR = 2000;
    const WAVE_HALF_WIDTH = 0.28;
    const unsubMode = subscribeCursorMode((next) => {
      const wasOff = mode === "off";
      mode = next;
      if (mode === "off" && ctx) {
        ctx.clearRect(0, 0, W, H);
        return;
      }
      /* Flash whenever the symbol changes — including switching back
         on from off, since that's also a moment the user wants to
         see what they picked. */
      previewStartAt = performance.now();
      /* Defensive: if we were stuck off, force a redraw next frame. */
      if (wasOff) lastInputAt = performance.now();
    });

    function rebuildDots() {
      dots = [];
      const sp = CFG.spacing;
      const cols = Math.ceil(W / sp) + 2;
      const rows = Math.ceil(H / sp) + 2;
      const ox = (W - (cols - 1) * sp) / 2;
      const oy = (H - (rows - 1) * sp) / 2;
      const r = mulberry32(7);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          dots.push({
            x: ox + i * sp,
            y: oy + j * sp,
            jx: (r() - 0.5) * 0.6,
            jy: (r() - 0.5) * 0.6,
            phase: r() * Math.PI * 2,
          });
        }
      }
    }

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      DPR = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      rebuildDots();
    }

    function onPointerMove(clientX, clientY) {
      const rect = wrapper.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        realMx = -9999; realMy = -9999;
        return;
      }
      realMx = x; realMy = y;
      lastInputAt = performance.now();
    }

    function frame() {
      raf = requestAnimationFrame(frame);
      if (!isVisible) return;
      /* When the field is off, skip everything — the canvas was
         cleared once on the mode change and stays empty. */
      if (mode === "off") return;

      const now = performance.now();
      const idleFor = now - lastInputAt;
      let useX = realMx, useY = realMy;

      // Idle drift: after 2.5s with no input, swing a slow lissajous so
      // the field stays alive. Skipped under prefers-reduced-motion.
      if (!prefersReduced && (idleFor > 2500 || lastInputAt === 0)) {
        const k = now / 1000;
        const cx = W * 0.5 + Math.cos(k * 0.35) * W * 0.28;
        const cy = H * 0.5 + Math.sin(k * 0.55) * H * 0.22;
        const blend = Math.min(1, (idleFor - 2500) / 1500);
        useX = realMx * (1 - blend) + cx * blend;
        useY = realMy * (1 - blend) + cy * blend;
        if (lastInputAt === 0) { useX = cx; useY = cy; }
      }

      mx += (useX - mx) * 0.18;
      my += (useY - my) * 0.18;

      ctx.clearRect(0, 0, W, H);

      // Theme crossfade factor — eased so the colours arrive softly.
      let themeT = 1;
      if (prevLUT) {
        const elapsed = now - themeStart;
        if (elapsed >= THEME_DUR) {
          prevLUT = null;
          themeT = 1;
        } else {
          const u = elapsed / THEME_DUR;
          themeT = u * u * (3 - 2 * u); // smoothstep
        }
      }

      const R = CFG.radius, R2 = R * R;
      const fall = CFG.falloff, growth = CFG.growth, baseR = CFG.dotSize;

      /* Preview wave — a circular ripple expanding from the bottom-
         left corner whenever the user picks a new symbol. Each cell
         peaks briefly as the ripple's radius matches its distance
         from BL, so the visible "lit-up" arc curves across the
         canvas rather than reading as a straight line. While the
         per-cell boost is > 0 we floor that cell's strength to at
         least that value, so the cell shows the active glyph at
         full size for the moment it's lit.

         Two values drive it:
         - WAVE_HALF_WIDTH: ring thickness in normalised-radius
           units (0 at BL, 1 at TR — the diagonal length).
         - waveFront: the radius of the leading-edge of the ring,
           extended past [0,1] so the wave fully enters and exits
           the canvas (every corner still gets a clean peak). */
      const previewElapsed = now - previewStartAt;
      const previewActive =
        previewStartAt > 0 && previewElapsed < PREVIEW_DUR;
      let waveFront = -2; // out-of-range default — no boost
      if (previewActive) {
        const previewT = previewElapsed / PREVIEW_DUR;
        waveFront =
          previewT * (1 + 2 * WAVE_HALF_WIDTH) - WAVE_HALF_WIDTH;
      }
      /* Inverse diagonal length — used to normalise each cell's
         distance from BL into a 0..1 progress value. Computed once
         per frame so the per-cell loop only does the distance
         calculation, not the costlier sqrt + divide. */
      const invMaxDist =
        W > 0 && H > 0 ? 1 / Math.sqrt(W * W + H * H) : 0;

      for (let n = 0; n < dots.length; n++) {
        const d = dots[n];
        const px = d.x + d.jx;
        const py = d.y + d.jy;
        const dx = px - mx;
        const dy = py - my;
        const dist2 = dx * dx + dy * dy;

        let strength = 0;
        if (dist2 < R2) {
          const dist = Math.sqrt(dist2);
          strength = 1 - dist / R;
          strength = Math.pow(strength, fall);
        }
        /* Wave preview boost — radial ripple from the bottom-left
           corner. Cell's normalised radial distance from BL is 0
           at the corner itself and 1 at the top-right corner
           (px and (H - py) measure horizontal and vertical
           displacement from BL; the Pythagorean distance is then
           normalised by the diagonal length). The cell peaks
           while its radius is within WAVE_HALF_WIDTH of the wave
           front, so the lit band is a curved arc rather than a
           straight line. */
        if (previewActive) {
          const wx = px;            // x distance from left edge
          const wy = H - py;         // y distance from bottom edge
          const cellProg =
            Math.sqrt(wx * wx + wy * wy) * invMaxDist;
          const distFromFront = Math.abs(cellProg - waveFront);
          if (distFromFront < WAVE_HALF_WIDTH) {
            const fade = 1 - distFromFront / WAVE_HALF_WIDTH;
            /* smoothstep so the peak is rounded, not pointy. */
            const previewBoost = fade * fade * (3 - 2 * fade);
            if (previewBoost > strength) strength = previewBoost;
          }
        }

        const baseline = 0.05;
        const total = Math.min(CFG.hoverOpacity, baseline + strength);
        const lutIdx = Math.max(0, Math.min(255, Math.floor((1 - strength) * 255)));
        const cNew = LUT[lutIdx];
        const cOld = prevLUT ? prevLUT[lutIdx] : cNew;
        const cr = cOld[0] + (cNew[0] - cOld[0]) * themeT;
        const cg = cOld[1] + (cNew[1] - cOld[1]) * themeT;
        const cb = cOld[2] + (cNew[2] - cOld[2]) * themeT;
        const radius = baseR * (1 + (growth - 1) * strength);
        const color =
          "rgba(" + (cr | 0) + "," + (cg | 0) + "," + (cb | 0) + "," + total.toFixed(3) + ")";

        if (mode === "plus") {
          /* "+" glyph — two crossed line segments. Arm length scales
             with proximity strength; stroke width stays thin for a
             technical/grid feel. */
          const arm = baseR * 2.6 * (1 + (growth - 1) * strength);
          ctx.lineWidth = 0.7;
          ctx.lineCap = "round";
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(px - arm, py);
          ctx.lineTo(px + arm, py);
          ctx.moveTo(px, py - arm);
          ctx.lineTo(px, py + arm);
          ctx.stroke();
        } else if (mode === "tick") {
          /* Tick mark — short diagonal line that orients itself
             toward the cursor. When the cursor is far, each tick
             leans at its baseline angle (per-cell `phase` jitter
             around `/`), so the field reads as paper grain. Under
             the cursor's influence the tick rotates onto the radial
             axis — both endpoints land on the line that passes
             through the cursor, so every tick visibly points at it.

             Implementation: lerp the (cos, sin) vectors of the
             baseline and the radial unit vector, then renormalise.
             No atan2 round-trip in the hot loop. */
          const baseAngle = -Math.PI / 4 + (d.phase - Math.PI) * 0.05;
          const baseCos = Math.cos(baseAngle);
          const baseSin = Math.sin(baseAngle);
          let ux = baseCos, uy = baseSin;
          if (strength > 0) {
            /* Unit vector from the tick toward the cursor. Because
               dx = px − mx (tick − cursor), the toward-cursor
               direction is (−dx, −dy) / dist. The sign on the line
               itself doesn't matter (a segment is symmetric), but
               using the toward-cursor vector keeps the math obvious. */
            const invDist = 1 / Math.sqrt(dist2 || 1);
            const rx = -dx * invDist;
            const ry = -dy * invDist;
            const w = strength;
            ux = baseCos * (1 - w) + rx * w;
            uy = baseSin * (1 - w) + ry * w;
            /* Normalise so the visible length stays uniform whatever
               the blend between the two unit vectors. */
            const norm = Math.hypot(ux, uy) || 1;
            ux /= norm;
            uy /= norm;
          }
          const len = baseR * 3.0 * (1 + (growth - 1) * strength);
          ctx.lineWidth = 0.7;
          ctx.lineCap = "round";
          ctx.strokeStyle = color;
          ctx.beginPath();
          ctx.moveTo(px - ux * len, py - uy * len);
          ctx.lineTo(px + ux * len, py + uy * len);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0 });
    io.observe(wrapper);

    const onMM = (e) => onPointerMove(e.clientX, e.clientY);
    const onTM = (e) => {
      const t = e.touches[0];
      if (!t) return;
      onPointerMove(t.clientX, t.clientY);
    };
    const onLeave = () => { realMx = -9999; realMy = -9999; };

    window.addEventListener("mousemove", onMM);
    window.addEventListener("touchmove", onTM, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    // Theme sync — when <html data-theme> changes, keep the old LUT as
    // prevLUT and start the crossfade. The frame loop interpolates from
    // prevLUT → LUT over THEME_DUR ms.
    const themeObs = new MutationObserver(() => {
      const next = document.documentElement.dataset.theme === "onyx" ? "ink" : "paper";
      if (next !== variant) {
        prevLUT = LUT;
        variant = next;
        LUT = buildLUT(PALETTES[variant]);
        themeStart = performance.now();
      }
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    resize();
    raf = requestAnimationFrame(frame);

    return () => {
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      unsubMode();
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("touchmove", onTM);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="dot-field" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
