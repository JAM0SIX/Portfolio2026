"use client";

/* Skills / Stack — portal carousel.
   ──────────────────────────────────
   Two rows of pills auto-scroll horizontally in OPPOSITE directions at
   a slow constant speed, and can be grabbed and scrubbed (draggable,
   never clickable — the pills are plain text, not links).

   The "portal" on each side is the clever-but-simple bit. It's two
   leaning parallelograms that overlap:

     · inner face  → z-index BELOW the pills  (the recessed back wall)
     · outer face  → z-index ABOVE the pills  (the front lip)

   A pill travelling toward an edge slides UNDER the outer face (so it
   vanishes) while the inner face sits behind it — reading as the pill
   passing through a portal in the middle of the shape. No masks, no
   canvas; pure stacking order. See SkillsStack.module.css for the
   geometry. */

import { useEffect, useRef, useState } from "react";
import styles from "./SkillsStack.module.css";
import { STACK, SKILLS } from "./skillsData";

/* Constant auto-scroll speed, px per second. Intentionally slow. */
const SPEED = 26;

/* Pill icon. Renders nothing until a real file exists in
   /public/icons/skills/. Two guards because the load error can fire
   either before hydration (caught by the mount check — img.complete &&
   naturalWidth === 0 means a 404) or after (caught by onError). */
function PillIcon({ icon }) {
  const [ok, setOk] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setOk(false);
  }, []);

  if (!ok) return null;

  return (
    <img
      ref={ref}
      className={styles.pillIcon}
      src={`/icons/skills/${icon}`}
      alt=""
      aria-hidden="true"
      draggable="false"
      onError={() => setOk(false)}
    />
  );
}

function Pill({ item, clone }) {
  return (
    <span className={styles.pill} aria-hidden={clone ? "true" : undefined}>
      {item.icon ? <PillIcon icon={item.icon} /> : null}
      <span className={styles.pillLabel}>{item.name}</span>
    </span>
  );
}

/* One marquee row. Owns its own rAF loop, drag handling, and release
   momentum. The track renders the item set twice so it wraps seamlessly
   at half its own width. `direction` is "left" or "right".

   Motion model each idle frame: offset += (base + momentum) · dt, where
   `base` is the constant auto-scroll and `momentum` is a post-release
   fling velocity that decays exponentially back to zero — so a flick
   carries the row on, then eases back to the steady drift. */
function Row({ items, direction, label }) {
  const trackRef = useRef(null);
  const offsetRef = useRef(0);
  const halfRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastTRef = useRef(0);
  const velRef = useRef(0); // smoothed pointer velocity while dragging (px/s)
  const momentumRef = useRef(0); // post-release fling velocity (px/s)
  const rafRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    /* Half the track = one full item set (we render two). */
    const measure = () => {
      halfRef.current = track.scrollWidth / 2;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    const base = (direction === "right" ? 1 : -1) * (reduce ? 0 : SPEED);
    const TAU = 0.45; // momentum decay time constant (seconds)
    let last = performance.now();

    const frame = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const half = halfRef.current || 1;

      if (!draggingRef.current) {
        offsetRef.current += (base + momentumRef.current) * dt;
        momentumRef.current *= Math.exp(-dt / TAU);
        if (Math.abs(momentumRef.current) < 1) momentumRef.current = 0;
      }

      /* Normalise into (-half, 0] so the duplicated set always covers
         the gap — works identically for either direction and for drag
         overshoot in both signs. */
      let o = offsetRef.current % half;
      if (o > 0) o -= half;
      offsetRef.current = o;

      track.style.transform = `translate3d(${o}px, 0, 0)`;
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [direction]);

  const onPointerDown = (e) => {
    draggingRef.current = true;
    momentumRef.current = 0;
    velRef.current = 0;
    lastXRef.current = e.clientX;
    lastTRef.current = performance.now();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    e.currentTarget.classList.add(styles.grabbing);
  };
  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dx = e.clientX - lastXRef.current;
    const dt = (now - lastTRef.current) / 1000;
    offsetRef.current += dx;
    if (dt > 0) {
      /* Smooth the instantaneous velocity so one jittery sample doesn't
         dominate the fling. */
      velRef.current = velRef.current * 0.7 + (dx / dt) * 0.3;
    }
    lastXRef.current = e.clientX;
    lastTRef.current = now;
  };
  const endDrag = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    /* Only fling if the pointer was actually moving at the moment of
       release — a drag that paused before letting go just stops. */
    const idle = performance.now() - lastTRef.current;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!reduce && idle < 80) {
      momentumRef.current = Math.max(-2600, Math.min(2600, velRef.current));
    }
    velRef.current = 0;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    e.currentTarget.classList.remove(styles.grabbing);
  };

  return (
    <div className={styles.row} role="list" aria-label={label}>
      <div
        ref={trackRef}
        className={styles.track}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {items.map((item, i) => (
          <Pill key={`a-${i}`} item={item} />
        ))}
        {items.map((item, i) => (
          <Pill key={`b-${i}`} item={item} clone />
        ))}
      </div>
    </div>
  );
}

export default function SkillsStack() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-label="Skills and stack"
    >
      <div className="section__head">
        <span className="section__label">Skills / Stack</span>
        <span className="section__rule" aria-hidden="true" />
      </div>

      <div className={styles.viewport}>
        {/* Bordered trapezoid portals behind the rows. The rows are
            masked so pills dissolve into them as they reach each edge;
            at the mouth the pills pass in front, reading as an opening. */}
        <span className={`${styles.portal} ${styles.portalLeft}`} aria-hidden="true" />
        <span className={`${styles.portal} ${styles.portalRight}`} aria-hidden="true" />

        <div className={styles.rows}>
          <Row items={STACK} direction="left" label="Stack and tools" />
          <Row items={SKILLS} direction="right" label="Skills" />
        </div>
      </div>
    </section>
  );
}
