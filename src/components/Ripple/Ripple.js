"use client";

/* Ripple — an accent dot-grid that ripples outward in wavefronts.
   ----------------------------------------------------------------
   A grid of faint dots fills the container; a "pulse" sends a Gaussian
   ring expanding from a point, brightening and growing the dots it
   crosses. Click anywhere to fire a pulse from that point; ambient
   pulses fire on their own. Lifted out of the first-visit entry
   sequence so it can stand alone as an experiment.

   Self-contained: sizes to its parent (ResizeObserver), tracks the
   theme accent, and respects prefers-reduced-motion (no ambient
   pulses; click still works). */

import { useEffect, useRef } from "react";
import styles from "./Ripple.module.css";

function readAccent() {
  if (typeof window === "undefined") return [31, 81, 255];
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent")
    .trim();
  const m = raw.match(/^#?([0-9a-f]{6})$/i);
  if (m) {
    const n = parseInt(m[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  return [31, 81, 255];
}

export default function Ripple({ spacing = 30, ambient = true, interactive = true }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const pulsesRef = useRef([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext("2d");
    if (!wrap || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let accent = readAccent();

    const BASE = 0.85; // resting dot radius
    const GROWTH = 3.2; // peak radius multiplier under a wavefront
    const BASE_ALPHA = 0.12; // resting dot alpha
    const WIDTH = 36; // wavefront thickness
    const CROSS_MS = 1400; // time for a pulse to reach the farthest corner

    let dpr = 1;
    let W = 0;
    let H = 0;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    /* The host may size this canvas imperatively just after mount (e.g. the
       carousel ring sets its card width/height in its own effect, which runs
       after this child effect), so the first measure can read 0. Re-measure
       each frame until we actually have a size (the ResizeObserver only fires
       on subsequent changes), then send a fresh centre pulse. */
    let settleRaf = 0;
    const settle = (tries) => {
      resize();
      if (W > 0 && H > 0) {
        fire(W / 2, H / 2, 1.6);
      } else if (tries > 0) {
        settleRaf = requestAnimationFrame(() => settle(tries - 1));
      }
    };
    settleRaf = requestAnimationFrame(() => settle(60));

    /* Keep the dot colour in sync with the theme. */
    const mo = new MutationObserver(() => {
      accent = readAccent();
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const fire = (x, y, strength = 1.6) => {
      const maxR = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
      const speed = maxR / CROSS_MS;
      pulsesRef.current.push({
        x, y,
        start: performance.now(),
        speed,
        strength,
        life: CROSS_MS + 300,
      });
    };

    // a first wavefront from the centre so it's alive on load
    fire(W / 2, H / 2, 1.6);

    let raf = 0;
    const draw = () => {
      const now = performance.now();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const pulses = pulsesRef.current;
      for (let gx = spacing / 2; gx < W; gx += spacing) {
        for (let gy = spacing / 2; gy < H; gy += spacing) {
          let s = 0;
          for (let p = 0; p < pulses.length; p++) {
            const pl = pulses[p];
            const age = now - pl.start;
            if (age < 0) continue;
            const d = Math.hypot(gx - pl.x, gy - pl.y);
            const dd = d - age * pl.speed;
            const ring = Math.exp(-(dd * dd) / (2 * WIDTH * WIDTH));
            const fade = Math.max(0, 1 - age / pl.life);
            s += ring * fade * pl.strength;
          }
          if (s > 1) s = 1;
          const r = BASE * (1 + s * GROWTH);
          const alpha = BASE_ALPHA + s * (1 - BASE_ALPHA);
          ctx.beginPath();
          ctx.fillStyle = `rgba(${accent[0]},${accent[1]},${accent[2]},${alpha})`;
          ctx.arc(gx, gy, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      pulsesRef.current = pulses.filter((pl) => now - pl.start < pl.life + 200);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    let onPointer = null;
    if (interactive) {
      onPointer = (e) => {
        const rect = wrap.getBoundingClientRect();
        fire(e.clientX - rect.left, e.clientY - rect.top, 2);
      };
      wrap.addEventListener("pointerdown", onPointer);
    }

    let autoTimer = 0;
    const scheduleAmbient = () => {
      if (!ambient || reduced) return;
      autoTimer = window.setTimeout(() => {
        fire(spacing + Math.random() * (W - spacing * 2), spacing + Math.random() * (H - spacing * 2), 1.25);
        scheduleAmbient();
      }, 2400 + Math.random() * 2000);
    };
    scheduleAmbient();

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(settleRaf);
      ro.disconnect();
      mo.disconnect();
      if (onPointer) wrap.removeEventListener("pointerdown", onPointer);
      if (autoTimer) clearTimeout(autoTimer);
    };
  }, [spacing, ambient, interactive]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.wrap}${interactive ? " " + styles.interactive : ""}`}
    >
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </div>
  );
}
