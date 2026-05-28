"use client";

/* PhilosophyVisuals — three canvas scenes that stand in for the
   Nexis+AI design philosophy. Each one is a metaphor lifted directly
   from how the principle actually behaves in the product:

     Landscape of Data    → a constellation of data points the user
                            can connect in different ways to surface
                            different patterns. The visual cycles
                            through subsets, drawing fresh connections
                            and dissolving the old ones — the same
                            field of points, a different reading.

     Search Paths         → vector paths branching upward from a
                            single source, like an inverted root
                            system. Each thread can fork into more
                            threads; the investigative shape stays
                            visible instead of collapsing into a chat
                            log.

     Progressive Disclosure → a single helix of dots spiralling
                            around a near-invisible cylinder. Each
                            turn of the helix earns the next; the
                            structure is calm but rewards depth.

   All three share the same visual language (monochrome white-on-
   near-black, dotted, mathematical curve aesthetic) so the section
   reads as a family. A single component renders the appropriate
   draw routine based on `variant`, pauses when off-screen via
   IntersectionObserver, and respects prefers-reduced-motion. */

import { useEffect, useRef } from "react";
import styles from "./PhilosophyVisuals.module.css";

/* ─── Shared canvas wrapper ──────────────────────────────────────
   Sizes the canvas to its container with DPR scaling, runs the
   variant's draw routine on every frame, and gates the loop on
   viewport visibility + reduced-motion preference. */
function VisualCanvas({ variant, label }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* No panel — the visuals sit directly on the page background.
       Marks are drawn in --ink so they read as ink-on-paper in
       light mode and paper-on-ink in dark mode (i.e. the marks
       themselves carry the contrast). Resolve into "r,g,b" so
       variants can compose `rgba(${rgb}, ${alpha})`. Re-resolves
       when the theme flips. */
    let drawRGB = "0,0,0";
    const resolveColor = () => {
      const probe = document.createElement("span");
      probe.style.color = "var(--ink, #000)";
      probe.style.display = "none";
      document.body.appendChild(probe);
      const raw = getComputedStyle(probe).color;
      document.body.removeChild(probe);
      const m = raw.match(/\d+(?:\.\d+)?/g);
      if (m && m.length >= 3) drawRGB = `${m[0]},${m[1]},${m[2]}`;
    };
    resolveColor();
    const colorFn = (alpha) => `rgba(${drawRGB},${alpha})`;
    const themeObs = new MutationObserver(resolveColor);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    });
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onScheme = () => resolveColor();
    mql.addEventListener?.("change", onScheme);

    /* Per-variant state lives outside the frame loop so it survives
       across resizes and pause/resume. Variants seed their own state
       inside `init`, mutate it inside `draw`. */
    const variants = {
      constellation: makeConstellation,
      "search-paths": makeSearchPaths,
      helix: makeHelix,
    };
    const factory = variants[variant];
    if (!factory) return;
    const scene = factory();

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.init(width, height);
      scene.draw(ctx, width, height, performance.now(), colorFn);
      stateRef.current = { width, height };
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    let raf = 0;
    const loop = (t) => {
      if (visible && !reduced) scene.draw(ctx, width, height, t, colorFn);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      mql.removeEventListener?.("change", onScheme);
    };
  }, [variant]);

  return (
    <div className={styles.visual}>
      {label && <span className={styles.label}>{label}</span>}
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

/* ─── Constellation ──────────────────────────────────────────────
   A fixed field of stars. At any moment the scene holds 2-3 active
   constellations drawn on top of the field with straight diagonal
   lines (Big Dipper / Orion grammar — not stepped orthogonal). Each
   constellation has its own lifecycle: fade in, hold, fade out, then
   a new one takes its place. Because the constellations overlap in
   time and share the same star field, the visual is constantly
   re-reading the same points as different stories. */
function makeConstellation() {
  const POINT_COUNT = 95;
  const PATTERN_SIZE_MIN = 5;
  const PATTERN_SIZE_MAX = 9;
  const HOLD_DURATION = 5200;       // ms each constellation stays full-strength
  const FADE_DURATION = 1100;       // ms in/out cross-fade
  const SPAWN_GAP = 1700;           // ms between new constellation births
  const MAX_ACTIVE = 3;             // most constellations on screen at once

  let points = [];
  let active = [];      // [{ edges, indices, bornAt, lifespan }]
  let lastSpawn = 0;
  let rngSeed = 1;

  /* Mulberry32 — tiny seeded PRNG so the layout is stable across
     resizes within a single mount. */
  function rand() {
    rngSeed |= 0; rngSeed = (rngSeed + 0x6D2B79F5) | 0;
    let t = Math.imul(rngSeed ^ (rngSeed >>> 15), 1 | rngSeed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function init(w, h) {
    rngSeed = 1;
    points = [];
    /* Star field with a soft Gaussian-ish bias toward the centre so
       it reads as a sky rather than a grid. */
    for (let i = 0; i < POINT_COUNT; i++) {
      const u = (rand() + rand() + rand()) / 3; // central bias
      const v = (rand() + rand() + rand()) / 3;
      points.push({
        x: u * w,
        y: v * h,
        size: 0.6 + rand() * 1.8,
        ring: rand() > 0.78,
      });
    }
    active = [];
    lastSpawn = 0;
    /* Pre-seed two constellations so the canvas isn't empty on
       first paint. */
    spawn(performance.now() - HOLD_DURATION * 0.4);
    spawn(performance.now());
  }

  function pickClusterPattern() {
    /* Pick a seed star, then build a constellation by repeatedly
       attaching one of its nearby unused neighbours. The result is
       a small connected graph that reads as a real constellation
       (a few branches, an occasional fork) rather than a TSP loop. */
    const n = PATTERN_SIZE_MIN + Math.floor(rand() * (PATTERN_SIZE_MAX - PATTERN_SIZE_MIN));
    const seed = Math.floor(rand() * points.length);
    const used = new Set([seed]);
    const edges = [];
    const order = [seed];

    while (order.length < n) {
      /* Pick a random already-used star to attach off of, biased
         toward more recent additions so we extend an arm rather
         than star-bursting from the seed. */
      const anchor = order[Math.floor(rand() * order.length * 0.7) + Math.floor(order.length * 0.3)];
      const ap = points[anchor];
      /* Find the nearest unused star within a reasonable radius. */
      let best = -1;
      let bestDist = Infinity;
      for (let i = 0; i < points.length; i++) {
        if (used.has(i)) continue;
        const p = points[i];
        const d = (p.x - ap.x) ** 2 + (p.y - ap.y) ** 2;
        if (d < bestDist) { bestDist = d; best = i; }
      }
      if (best < 0) break;
      used.add(best);
      order.push(best);
      edges.push([anchor, best]);
    }

    return { indices: order, edges };
  }

  function spawn(now) {
    if (active.length >= MAX_ACTIVE) return;
    const { indices, edges } = pickClusterPattern();
    const lifespan = HOLD_DURATION + (rand() - 0.5) * 1400;
    active.push({ indices, edges, bornAt: now, lifespan });
  }

  function constellationAlpha(con, now) {
    /* In/out envelope: rise over FADE_DURATION, hold, fall over
       FADE_DURATION. Returns 0..1. */
    const age = now - con.bornAt;
    if (age < 0) return 0;
    if (age < FADE_DURATION) return age / FADE_DURATION;
    if (age < con.lifespan - FADE_DURATION) return 1;
    if (age < con.lifespan) return (con.lifespan - age) / FADE_DURATION;
    return -1; // dead
  }

  function drawField(ctx, c) {
    for (const p of points) {
      ctx.fillStyle = c(0.35);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      if (p.ring) {
        ctx.strokeStyle = c(0.22);
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  function drawConstellation(ctx, con, alpha, c) {
    /* Straight diagonal segments connecting the chosen stars —
       constellation grammar, not stepped orthogonal. */
    ctx.strokeStyle = c(0.85 * alpha);
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (const [ai, bi] of con.edges) {
      const a = points[ai];
      const b = points[bi];
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();

    /* Brighter dots on the highlighted stars + small concentric ring
       so they pop out of the background field. */
    for (const idx of con.indices) {
      const p = points[idx];
      ctx.fillStyle = c(Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = c(0.45 * alpha);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size + 3.2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function draw(ctx, w, h, now, c) {
    ctx.clearRect(0, 0, w, h);

    drawField(ctx, c);

    /* Spawn new constellations on cadence; prune dead ones. */
    if (now - lastSpawn > SPAWN_GAP && active.length < MAX_ACTIVE) {
      spawn(now);
      lastSpawn = now;
    }
    active = active.filter((con) => constellationAlpha(con, now) >= 0);

    for (const con of active) {
      const a = constellationAlpha(con, now);
      if (a > 0) drawConstellation(ctx, con, a, c);
    }
  }

  return { init, draw };
}

/* ─── Search Paths ───────────────────────────────────────────────
   A horizontal main path runs from the source anchor on the left
   toward the right edge. Side branches fork off the trunk at
   varying points along its length, curving up or down to terminal
   tip-dots. Branches grow, hold, then peel back from tip to fork —
   so the trunk stays continuously present while the side threads
   come and go around it. */
function makeSearchPaths() {
  const MAX_BRANCHES = 5;           // concurrent side branches
  const BRANCH_SPAWN_GAP = 1100;    // ms between new branch spawns
  const GROW_SPEED = 0.0014;        // progress per ms (grow phase)
  /* Hold durations: most branches live short, a minority anchor for
     much longer so the visual has a few persistent threads while
     others come and go around them. */
  const HOLD_SHORT_MIN = 900;
  const HOLD_SHORT_MAX = 2200;
  const HOLD_LONG_MIN = 5000;
  const HOLD_LONG_MAX = 9000;
  const LONG_HOLD_CHANCE = 0.3;     // probability a new branch gets a long hold
  const RETRACT_SPEED = 0.0018;     // progress per ms (retract phase)

  let trunk = null;   // { sx,sy,tx,ty,cx,cy,progress } — grows once, stays
  let branches = [];  // [{ tParent, sx,sy,tx,ty,cx,cy,phase,progress,retract,holdUntil,tipPulse }]
  let lastSpawn = 0;
  let lastFrame = 0;
  let widthRef = 0;
  let heightRef = 0;

  function init(w, h) {
    widthRef = w;
    heightRef = h;
    branches = [];
    lastSpawn = 0;
    lastFrame = 0;

    /* Trunk: left side → right side, gently undulating. Control
       point pushes it slightly above the midline so the curve
       reads as a path, not a ruler. */
    const sx = w * 0.06;
    const sy = h * 0.55;
    const tx = w * 0.94;
    const ty = h * 0.5;
    const cx = w * 0.5;
    const cy = h * 0.42;
    trunk = { sx, sy, tx, ty, cx, cy, progress: 0 };
  }

  function pointOnQuad(b, t) {
    const u = 1 - t;
    const x = u * u * b.sx + 2 * u * t * b.cx + t * t * b.tx;
    const y = u * u * b.sy + 2 * u * t * b.cy + t * t * b.ty;
    return { x, y };
  }

  function tangentOnQuad(b, t) {
    /* Derivative of quadratic Bézier — gives the local direction
       of the trunk at parameter t. We use the perpendicular of
       this vector to send branches "off" the trunk rather than
       parallel to it. */
    const dx = 2 * (1 - t) * (b.cx - b.sx) + 2 * t * (b.tx - b.cx);
    const dy = 2 * (1 - t) * (b.cy - b.sy) + 2 * t * (b.ty - b.cy);
    const len = Math.hypot(dx, dy) || 1;
    return { x: dx / len, y: dy / len };
  }

  function spawnBranch(now) {
    /* Pick a fork point in the early-to-mid section of the trunk —
       branches always need room to flow right toward the trunk's
       end. Each branch tip lies to the *right* of its fork (in the
       trunk's general direction of travel), with vertical
       displacement giving it its shape. The result is a tributary
       feel: branches diverge above and below the trunk but every
       one keeps progressing rightward, like rivers heading to the
       sea. */
    const tParent = 0.1 + Math.random() * 0.55;
    const root = pointOnQuad(trunk, tParent);
    const side = Math.random() < 0.5 ? -1 : 1; // up or down off trunk

    /* Pick a shape archetype. All archetypes are net-rightward;
       they vary in how dramatically they peel away from the trunk
       and how much they wobble on the way. */
    const archetype = Math.random();
    let shape;
    if (archetype < 0.4) shape = "arc";       // gentle outward arc, continues right
    else if (archetype < 0.7) shape = "S";    // S-shape, but still rightward overall
    else if (archetype < 0.9) shape = "swoop"; // dips far before rising back near trunk
    else shape = "long";                       // long sweeping arc to the right edge

    /* Tip position: forward (rightward) distance dominates, vertical
       displacement varies by shape. The trunk's end is roughly at
       trunk.tx, so branches aim for somewhere between their root and
       past it (long sweeps can finish near the right edge). */
    const remainingX = trunk.tx - root.x;
    let forward;
    let vertical;
    if (shape === "long") {
      forward = remainingX * (0.7 + Math.random() * 0.45);
      vertical = heightRef * (0.08 + Math.random() * 0.08);
    } else if (shape === "swoop") {
      forward = remainingX * (0.45 + Math.random() * 0.35);
      vertical = heightRef * (0.05 + Math.random() * 0.06);
    } else {
      forward = remainingX * (0.3 + Math.random() * 0.35);
      vertical = heightRef * (0.07 + Math.random() * 0.08);
    }

    const tx = root.x + forward;
    const ty = root.y + side * vertical;

    /* Cubic Bézier control points. c1 governs the launch direction
       (how the branch peels off the trunk); c2 governs the approach
       direction (how it returns toward horizontal). Both are biased
       rightward in their x component so the curve never doubles
       back on itself. */
    let c1x, c1y, c2x, c2y;
    const dx = tx - root.x;

    if (shape === "arc") {
      /* Single bow: peel outward then ease back rightward toward
         the tip. */
      const bow = 0.6 + Math.random() * 0.4;
      c1x = root.x + dx * 0.3;
      c1y = root.y + side * vertical * bow * 1.4;
      c2x = root.x + dx * 0.7;
      c2y = ty + side * vertical * bow * 0.4;
    } else if (shape === "S") {
      /* Opposite-sign control points → S-curve, but both control
         xs sit between root and tip so the branch still progresses
         right. */
      c1x = root.x + dx * 0.25;
      c1y = root.y - side * vertical * (0.5 + Math.random() * 0.4);
      c2x = root.x + dx * 0.75;
      c2y = ty + side * vertical * (0.5 + Math.random() * 0.4);
    } else if (shape === "swoop") {
      /* Pulls deep away from the trunk early, then comes back close
         to it near the tip — a wide swoop that often crosses or
         brushes against neighbouring branches. */
      const swoopDepth = 1.6 + Math.random() * 0.8;
      c1x = root.x + dx * 0.4;
      c1y = root.y + side * vertical * swoopDepth;
      c2x = root.x + dx * 0.8;
      c2y = ty - side * vertical * 0.3;
    } else { // long
      /* Long arc with a randomised crest position — early-crest vs
         late-crest variations so two long branches don't trace the
         same line. */
      const crestT = 0.3 + Math.random() * 0.4;
      const bow = 1.2 + Math.random() * 0.5;
      c1x = root.x + dx * crestT;
      c1y = root.y + side * vertical * bow;
      c2x = root.x + dx * (crestT + 0.35);
      c2y = ty + side * vertical * 0.5;
    }

    /* Decide whether this branch is one of the long-hold "anchor"
       threads or a short-lived one. Long-shape branches lean toward
       longer hold so the most-tangled threads tend to stick around. */
    const wantsLong =
      Math.random() < (shape === "long" ? 0.7 : LONG_HOLD_CHANCE);
    const holdMs = wantsLong
      ? HOLD_LONG_MIN + Math.random() * (HOLD_LONG_MAX - HOLD_LONG_MIN)
      : HOLD_SHORT_MIN + Math.random() * (HOLD_SHORT_MAX - HOLD_SHORT_MIN);

    branches.push({
      tParent,
      sx: root.x,
      sy: root.y,
      tx,
      ty,
      c1x, c1y, c2x, c2y,
      shape,
      holdMs,
      phase: "grow",
      progress: 0,
      retract: 0,
      holdUntil: 0,
      tipPulse: 0,
      bornAt: now,
    });
  }

  function pointOnCubic(b, t) {
    const u = 1 - t;
    const x =
      u * u * u * b.sx +
      3 * u * u * t * b.c1x +
      3 * u * t * t * b.c2x +
      t * t * t * b.tx;
    const y =
      u * u * u * b.sy +
      3 * u * u * t * b.c1y +
      3 * u * t * t * b.c2y +
      t * t * t * b.ty;
    return { x, y };
  }

  function draw(ctx, w, h, now, c) {
    if (!lastFrame) lastFrame = now;
    const dt = now - lastFrame;
    lastFrame = now;

    ctx.clearRect(0, 0, w, h);

    /* Advance trunk growth (one-shot, then it stays at full length). */
    if (trunk.progress < 1) {
      trunk.progress = Math.min(1, trunk.progress + 0.0009 * dt);
    }

    /* Spawn side branches only once the trunk is mostly grown, so
       the eye reads "main path first, branches off it" — not all
       fanning out from the source at once. */
    if (
      trunk.progress > 0.55 &&
      now - lastSpawn > BRANCH_SPAWN_GAP &&
      branches.length < MAX_BRANCHES
    ) {
      spawnBranch(now);
      lastSpawn = now;
    }

    /* Step each branch's lifecycle. Each branch carries its own
       `holdMs` (set at spawn) so short-lived and long-hold branches
       coexist. */
    for (const b of branches) {
      if (b.phase === "grow") {
        b.progress = Math.min(1, b.progress + GROW_SPEED * dt);
        if (b.progress >= 1) {
          b.phase = "hold";
          b.holdUntil = now + b.holdMs;
        }
      } else if (b.phase === "hold") {
        b.tipPulse += dt;
        if (now >= b.holdUntil) b.phase = "retract";
      } else if (b.phase === "retract") {
        b.retract = Math.min(1, b.retract + RETRACT_SPEED * dt);
      }
    }
    branches = branches.filter((b) => b.retract < 1);

    /* Source anchor on the left */
    ctx.fillStyle = c(0.95);
    ctx.beginPath();
    ctx.arc(trunk.sx, trunk.sy, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = c(0.4);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(trunk.sx, trunk.sy, 6, 0, Math.PI * 2);
    ctx.stroke();

    /* Draw the trunk — full strength so it reads as the spine. */
    {
      ctx.strokeStyle = c(0.85);
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const steps = 36;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * trunk.progress;
        const p = pointOnQuad(trunk, t);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      /* Trunk tip dot once fully grown. */
      if (trunk.progress >= 1) {
        ctx.fillStyle = c(0.95);
        ctx.beginPath();
        ctx.arc(trunk.tx, trunk.ty, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    /* Draw side branches — slightly lighter than the trunk so the
       trunk stays dominant. Retract peels start-of-line toward the
       tip just like before. Cubic Bézier — branches have varied
       shape (C, S, hook, long sweep) and can entangle. */
    for (const b of branches) {
      const tStart = b.retract * b.progress;
      const tEnd = b.progress;
      if (tEnd - tStart < 0.001) continue;

      /* Long-sweep / swoop branches get a touch more weight so they
         read as the more-deliberate threads. */
      const isAnchor = b.shape === "long" || b.shape === "swoop";
      ctx.strokeStyle = c(isAnchor ? 0.7 : 0.55);
      ctx.lineWidth = isAnchor ? 1.25 : 1.05;
      ctx.beginPath();
      const steps = 28;
      for (let i = 0; i <= steps; i++) {
        const t = tStart + ((tEnd - tStart) * i) / steps;
        const p = pointOnCubic(b, t);
        if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      /* Fork marker — small dot where the branch leaves the trunk,
         only visible while the branch itself is on screen. */
      ctx.fillStyle = c(0.7);
      ctx.beginPath();
      ctx.arc(b.sx, b.sy, 1.6, 0, Math.PI * 2);
      ctx.fill();

      if (b.phase === "hold") {
        const pulse = 1 + Math.sin(b.tipPulse / 360) * 0.2;
        ctx.fillStyle = c(0.95);
        ctx.beginPath();
        ctx.arc(b.tx, b.ty, 1.9 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  return { init, draw };
}

/* ─── Helix ───────────────────────────────────────────────────────
   A single helix of dots spiralling around an implicit vertical
   axis. The helix rotates slowly; dots fade and shrink with depth
   so the back of the helix recedes naturally. No cylinder, no
   axis line — the spiral itself is the entire form. */
function makeHelix() {
  const DOT_COUNT = 90;
  const TURNS = 3.2;
  const ROTATION_SPEED = 0.0006; // radians per ms

  let cx = 0;
  let cyTop = 0;
  let cyBot = 0;
  let radius = 0;
  let lastFrame = 0;
  let phase = 0;

  function init(w, h) {
    cx = w / 2;
    cyTop = h * 0.08;
    cyBot = h * 0.92;
    radius = Math.min(w, h) * 0.18;
    lastFrame = 0;
    phase = 0;
  }

  function draw(ctx, w, h, now, c) {
    if (!lastFrame) lastFrame = now;
    const dt = now - lastFrame;
    lastFrame = now;
    phase += dt * ROTATION_SPEED;

    ctx.clearRect(0, 0, w, h);

    /* Helix dots only — no cylinder, no axis. Each dot sits at
       parameter t ∈ [0,1] along the implicit axis; its angle is
       `phase + t * TURNS * 2π`. The y-flatten on the sphere term
       simulates orthographic depth so front-of-helix dots are
       crisp and back-of-helix dots recede. */
    for (let i = 0; i < DOT_COUNT; i++) {
      const t = i / (DOT_COUNT - 1);
      const a = phase + t * TURNS * Math.PI * 2;
      const x = cx + Math.cos(a) * radius;
      const y = cyTop + t * (cyBot - cyTop) + Math.sin(a) * radius * 0.18;
      const depth = (Math.sin(a) + 1) / 2; // 0 = back, 1 = front
      const alpha = 0.4 + depth * 0.6;
      const size = 1.4 + depth * 1.6;
      ctx.fillStyle = c(alpha);
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return { init, draw };
}

/* ─── Section renderer ───────────────────────────────────────────
   Takes an array of { variant, eyebrow, title, body, label } items
   and lays them out in alternating rows (visual left → right → left). */
export default function PhilosophyVisuals({ items = [] }) {
  return (
    <div className={styles.section}>
      {items.map((it, i) => (
        <div key={i} className={styles.row}>
          <VisualCanvas variant={it.variant} />
          <div className={styles.copy}>
            <h3 className={styles.title}>{it.title}</h3>
            <p className={styles.body}>{it.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
