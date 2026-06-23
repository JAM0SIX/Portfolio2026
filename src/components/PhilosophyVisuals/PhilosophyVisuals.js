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

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import ScrambleText from "@/components/ScrambleText/ScrambleText";
import styles from "./PhilosophyVisuals.module.css";

/* ─── Shared canvas wrapper ──────────────────────────────────────
   Sizes the canvas to its container with DPR scaling, runs the
   variant's draw routine on every frame, and gates the loop on
   viewport visibility + reduced-motion preference + whether this
   card is the active (on-top) one in the scroller. */
function VisualCanvas({ variant, active = true }) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  /* The active flag flips as the user scrolls between cards; mirror
     it into a ref so the rAF loop reads the latest value without the
     whole canvas effect re-running (which would reset the scene). */
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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
      if (visible && activeRef.current && !reduced)
        scene.draw(ctx, width, height, t, colorFn);
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
  const POINT_COUNT = 48;
  const PATTERN_SIZE_MIN = 4;
  const PATTERN_SIZE_MAX = 7;
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
        /* Smaller pinpoints so they read as distant stars rather than
           nodes; a few sit a touch larger/brighter to give depth. */
        size: 0.4 + rand() * 1.0,
        bright: 0.2 + rand() * 0.5,
        /* Each star twinkles on its own slow cycle. */
        twPhase: rand() * Math.PI * 2,
        twSpeed: 0.0008 + rand() * 0.0014,
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

  function drawField(ctx, c, now) {
    for (const p of points) {
      /* Twinkle: brightness eases around the star's base level. */
      const tw = 0.7 + 0.3 * Math.sin(now * p.twSpeed + p.twPhase);
      const a = p.bright * tw;
      /* Soft halo on the brighter stars only — a hint of glow rather
         than the old hard target ring, so the field reads as sky. */
      if (p.bright > 0.5) {
        ctx.fillStyle = c(a * 0.16);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size + 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = c(a);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
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

    drawField(ctx, c, now);

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
   "Research isn't a straight line." A faint branching tree is drawn
   in full; a bright cursor traces it depth-first — descending a thread
   to a leaf, pausing, then backtracking to the nearest fork and taking
   another branch. Only the route from the root to the cursor stays
   lit, so at any moment you read the current line of enquiry against
   the whole shape of the search. When the tour finishes it pauses and
   regrows a fresh tree. */
function makeSearchPaths() {
  const TRUNK_MIN = 4;          // fewest core-trunk segments
  const TRUNK_MAX = 6;          // most core-trunk segments
  const TRUNK_SPAN_FRAC = 0.86; // trunk length as a fraction of width
  const BRANCH_DEPTH = 2;       // levels of sub-branching off a side branch
  const BRANCH_LEN_FRAC = 0.3;  // first side-branch length as a fraction of height
  const PIXELS_PER_MS = 0.19;   // cursor travel speed
  const LEAF_PAUSE = 260;       // ms dwell when a leaf (rabbit hole) is reached
  const RESET_PAUSE = 1000;     // ms hold on the bare trunk start before regrowing

  let nodes = [];        // [{ x, y, parent }]
  let children = [];      // parallel: child index lists
  let moves = [];         // Euler tour: [{ from, to, dir }] dir 1 = descend, -1 = back
  let moveIdx = 0;
  let prog = 0;           // 0..1 along the current move
  let stack = [];         // node indices from root down to the cursor
  let phase = "traverse"; // or "reset"
  let resetAt = 0;
  let pauseUntil = 0;
  let lastFrame = 0;
  let seed = 1;

  /* Mulberry32 — seeded PRNG so a tree is stable across resizes within
     a mount, but each regrow cycle advances the seed for variety. */
  function rand() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function build(w, h) {
    nodes = [];
    children = [];
    const add = (x, y, parent) => {
      const i = nodes.length;
      nodes.push({ x, y, parent });
      children.push([]);
      if (parent >= 0) children[parent].push(i);
      return i;
    };

    /* A single core trunk runs left → right (the line always travels
       it); side branches fork off it and sub-branch. `trunkNext` maps
       each trunk node to its trunk-continuation child so the tour can
       keep that edge for last — the cursor detours into the branches at
       a node, then carries on along the spine. */
    const trunkNext = new Map();

    /* Off-trunk side branches recurse to fan into sub-threads — kept
       sparse so the spine stays readable. */
    function grow(parent, angle, len, depth) {
      if (depth >= BRANCH_DEPTH) return;
      const n = depth === 0 ? (rand() < 0.4 ? 2 : 1) : rand() < 0.35 ? 1 : 0;
      const spread = 0.45 + rand() * 0.3;
      for (let k = 0; k < n; k++) {
        const frac = n > 1 ? k / (n - 1) - 0.5 : 0;
        const a = angle + frac * spread + (rand() - 0.5) * 0.25;
        const l = len * (0.7 + rand() * 0.2);
        const p = nodes[parent];
        const child = add(p.x + Math.cos(a) * l, p.y + Math.sin(a) * l, parent);
        grow(child, a, l, depth + 1);
      }
    }

    /* Build the trunk: a chain stepping rightward with gentle vertical
       wobble, kept within the middle band of the frame. */
    const root = add(w * 0.06, h * 0.5, -1);
    const segCount = TRUNK_MIN + Math.floor(rand() * (TRUNK_MAX - TRUNK_MIN + 1));
    const seg = (w * TRUNK_SPAN_FRAC) / segCount;
    const trunk = [root];
    let py = h * 0.5;
    let prev = root;
    for (let i = 0; i < segCount; i++) {
      const px = nodes[prev].x + seg * (0.85 + rand() * 0.3);
      py += (rand() - 0.5) * h * 0.12;
      py = Math.max(h * 0.3, Math.min(h * 0.7, py));
      const node = add(px, py, prev);
      trunkNext.set(prev, node);
      trunk.push(node);
      prev = node;
    }

    /* One branch per interior trunk node, leaning forward (toward the
       right, the trunk's direction of travel) at roughly 45–60° off
       the spine, and alternating up / down node-to-node — so the tree
       reads as a balanced feather flowing rightward rather than a
       random scatter. */
    const branchLen = h * BRANCH_LEN_FRAC;
    /* Steeper than before so the branches clearly rise off the spine,
       but still angled forward toward the right. ~52–69° off +x. */
    const forwardAngle = () => 0.9 + rand() * 0.3;
    let side = rand() < 0.5 ? -1 : 1; // up-right or down-right to start
    for (let i = 1; i < trunk.length; i++) {
      const tn = trunk[i];
      grow(tn, side * forwardAngle(), branchLen * (0.8 + rand() * 0.4), 0);
      side = -side; // alternate sides along the spine
    }

    /* Euler tour: at each node explore the side branches (shuffled)
       first, then continue along the trunk — so the cursor takes the
       rabbit holes and returns to the spine before moving on. */
    moves = [];
    (function dfs(node) {
      const trunkChild = trunkNext.has(node) ? trunkNext.get(node) : -1;
      const rest = children[node].filter((c) => c !== trunkChild);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      const order = trunkChild >= 0 ? [...rest, trunkChild] : rest;
      for (const ch of order) {
        moves.push({ from: node, to: ch, dir: 1 });
        dfs(ch);
        moves.push({ from: ch, to: node, dir: -1 });
      }
    })(root);

    restart();
  }

  /* Replay the existing tree from the trunk start. Used both after a
     build and when the tour loops — so the branching stays identical
     every cycle (it resets rather than regrowing a new shape). */
  function restart() {
    moveIdx = 0;
    prog = 0;
    stack = [0]; // root is always the first node added
    phase = "traverse";
    pauseUntil = 0;
  }

  function init(w, h) {
    lastFrame = 0;
    seed = 1;
    build(w, h);
  }

  const lerp = (a, b, t) => a + (b - a) * t;

  function drawFaintTree(ctx, c) {
    ctx.lineWidth = 1;
    ctx.strokeStyle = c(0.15);
    ctx.beginPath();
    for (let i = 1; i < nodes.length; i++) {
      const n = nodes[i];
      const p = nodes[n.parent];
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(n.x, n.y);
    }
    ctx.stroke();
    for (const n of nodes) {
      ctx.fillStyle = c(0.16);
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /* Bright route from the root to the cursor. During a descend the
     full stack is solid and the leading edge extends to the cursor;
     during a backtrack the last stack edge retracts toward the cursor
     instead, so the thread is visibly withdrawn. */
  function drawActiveRoute(ctx, c, current) {
    const dir = current ? current.dir : 1;
    const solidEnd = dir === -1 ? stack.length - 1 : stack.length;

    ctx.lineWidth = 1.7;
    ctx.strokeStyle = c(0.88);
    ctx.beginPath();
    for (let i = 1; i < solidEnd; i++) {
      const a = nodes[stack[i - 1]];
      const b = nodes[stack[i]];
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
    }
    ctx.stroke();

    for (let i = 0; i < solidEnd; i++) {
      const n = nodes[stack[i]];
      ctx.fillStyle = c(0.9);
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    if (current) {
      const { from, to, dir: d } = current;
      const cx = lerp(from.x, to.x, current.prog);
      const cy = lerp(from.y, to.y, current.prog);
      ctx.lineWidth = 1.7;
      ctx.strokeStyle = c(0.88);
      ctx.beginPath();
      if (d === 1) {
        ctx.moveTo(from.x, from.y);
      } else {
        ctx.moveTo(to.x, to.y); // parent end stays put; segment shrinks to it
      }
      ctx.lineTo(cx, cy);
      ctx.stroke();
      return { x: cx, y: cy };
    }
    return null;
  }

  function drawCursor(ctx, c, cur) {
    if (!cur) return;
    ctx.fillStyle = c(0.22);
    ctx.beginPath();
    ctx.arc(cur.x, cur.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = c(1);
    ctx.beginPath();
    ctx.arc(cur.x, cur.y, 2.1, 0, Math.PI * 2);
    ctx.fill();
  }

  function draw(ctx, w, h, now, c) {
    if (!lastFrame) lastFrame = now;
    const dt = Math.min(64, now - lastFrame);
    lastFrame = now;

    ctx.clearRect(0, 0, w, h);
    drawFaintTree(ctx, c);

    if (phase === "reset") {
      drawActiveRoute(ctx, c, null); // only the trunk start remains lit
      if (now >= resetAt) restart(); // replay the same tree
      return;
    }

    /* Advance the cursor unless dwelling at a leaf. */
    if (now >= pauseUntil) {
      const m = moves[moveIdx];
      if (m) {
        const from = nodes[m.from];
        const to = nodes[m.to];
        const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
        prog += (dt * PIXELS_PER_MS) / len;
        if (prog >= 1) {
          prog = 0;
          if (m.dir === 1) stack.push(m.to);
          else stack.pop();
          /* Dwell when a rabbit hole bottoms out (leaf reached). */
          if (m.dir === 1 && children[m.to].length === 0) {
            pauseUntil = now + LEAF_PAUSE;
          }
          moveIdx++;
          if (moveIdx >= moves.length) {
            phase = "reset";
            resetAt = now + RESET_PAUSE;
          }
        }
      }
    }

    let current = null;
    if (phase === "traverse" && moves[moveIdx]) {
      const m = moves[moveIdx];
      current = { from: nodes[m.from], to: nodes[m.to], prog, dir: m.dir };
    }
    const cur = drawActiveRoute(ctx, c, current);
    drawCursor(ctx, c, cur);
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

/* ─── Section renderer (scroll-driven) ───────────────────────────
   A two-column sticky scroller. The left column lists the principle
   titles, each with a progress bar that fills as the reader scrolls
   through that principle's step. The right column is a stack of
   cards: one is pinned in place while the next slides up over it and
   takes its place. Only one title + card is "active" at a time.

   Mechanics: the outer section is `STEP_VH × N` tall and the inner
   row is `position: sticky`, so it pins while the reader scrolls the
   section's full height. We map the section's scroll position to a
   continuous `total ∈ [0, N]`; `floor(total)` is the active index
   and the fraction is that step's progress (bar fill). The next card
   slides in over the back half of each step.

   Below the layout breakpoint (or under prefers-reduced-motion) the
   scroller degrades to a plain vertical stack of cards — every card
   visible, no pinning, no transforms. */

const STEP_VH = 100; // section height per card, in vh
const SCAN_MS = 720; // duration of the scanline reveal sweep

/* ─── Scanline reveal ────────────────────────────────────────────
   When the card becomes active, a panel the colour of the recessed
   frame slides down off the visual — revealing it top-to-bottom —
   with a bright line riding its leading edge. The panel moves on
   `transform` only (a `--reveal` custom property 0 → 100 → translateY),
   so it's compositor-driven and never forces the live canvas beneath
   it to repaint. Driven via direct DOM writes (no React state) so the
   sweep doesn't re-render the card. Keyed by `trigger`: replays each
   change. */
function Scanline({ targetRef, trigger }) {
  useLayoutEffect(() => {
    if (!trigger) return; // trigger 0 = never activated yet
    const target = targetRef.current;
    if (!target) return;

    /* Start fully covered, synchronously (before paint) so the visual
       doesn't flash in for a frame before the sweep. */
    target.style.setProperty("--reveal", "0");

    let raf = 0;
    let start = 0;
    const easeInOut = (p) =>
      p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

    const step = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / SCAN_MS);
      target.style.setProperty("--reveal", (easeInOut(p) * 100).toFixed(2));
      if (p < 1) raf = requestAnimationFrame(step);
      else target.style.setProperty("--reveal", "100");
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, targetRef]);

  return <div className={styles.cover} aria-hidden="true" />;
}

/* A single card — visual frame on top, copy panel underneath. The
   outer/inner surfaces mirror the landing-page project cards (rule
   border via the outer fill + an inset `--paper` fill behind).

   When the card becomes active it plays a transition: the visual
   tunes in out of static fuzz and the copy reveals with the
   character-scramble effect. `animate` is false under reduced motion,
   where the copy renders as plain settled text and no fuzz plays. */
function PhilosophyCard({ item, active, style, animate }) {
  /* `play` increments each time the card transitions inactive→active,
     re-keying the fuzz burst and the scramble so they replay. */
  const [play, setPlay] = useState(0);
  const wasActive = useRef(false);
  const visualRef = useRef(null);
  useEffect(() => {
    if (active && !wasActive.current) setPlay((p) => p + 1);
    wasActive.current = active;
  }, [active]);

  return (
    <article className={styles.card} style={style} aria-hidden={!active}>
      <div className={styles.cardVisual} ref={visualRef}>
        <VisualCanvas variant={item.variant} active={active} />
        {animate && <Scanline targetRef={visualRef} trigger={play} />}
      </div>
      <div className={styles.cardCopy}>
        {item.eyebrow && (
          <span className={styles.eyebrow}>
            {animate && active ? (
              <ScrambleText
                key={play}
                text={item.eyebrow}
                as="text"
                once={false}
                lockWidths={false}
                stagger={14}
                duration={180}
              />
            ) : (
              item.eyebrow
            )}
          </span>
        )}
        <h3 className={styles.title}>
          {animate && active ? (
            <ScrambleText
              key={play}
              text={item.title}
              as="text"
              once={false}
              lockWidths={false}
              stagger={16}
              duration={200}
            />
          ) : (
            item.title
          )}
        </h3>
        <p className={styles.body}>
          {animate && active ? (
            <ScrambleText
              key={play}
              text={item.body}
              as="text"
              once={false}
              lockWidths={false}
              stagger={3}
              duration={260}
            />
          ) : (
            item.body
          )}
        </p>
      </div>
    </article>
  );
}

export default function PhilosophyVisuals({ items = [] }) {
  const sectionRef = useRef(null);
  const N = items.length;

  /* `total` is the continuous scroll position across all steps. We
     keep it in state so the React tree (nav fills + card transforms)
     re-renders on scroll; the scroll math itself is rAF-throttled. */
  const [total, setTotal] = useState(0);
  /* `scroller` gates the whole sticky behaviour: false on narrow
     viewports or under reduced-motion, where we render a plain stack
     instead. Resolved on mount (and on resize) to stay SSR-safe. */
  const [scroller, setScroller] = useState(false);
  /* `animate` gates the transition effects (fuzz + scramble). On by
     default; off under reduced-motion so the copy renders settled and
     no static plays. Resolved on mount to stay SSR-safe. */
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 881px)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const evaluate = () => {
      setScroller(wide.matches && !reduced.matches);
      setAnimate(!reduced.matches);
    };
    evaluate();
    wide.addEventListener?.("change", evaluate);
    reduced.addEventListener?.("change", evaluate);
    return () => {
      wide.removeEventListener?.("change", evaluate);
      reduced.removeEventListener?.("change", evaluate);
    };
  }, []);

  useEffect(() => {
    if (!scroller) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      /* progress 0→1 as the section travels through the pinned zone. */
      const progress =
        scrollable > 0 ? clamp(-rect.top / scrollable, 0, 1) : 0;
      /* Scale to [0, N] but cap just shy of N so the last card holds
         its place (floor never lands on the out-of-range Nth index). */
      setTotal(Math.min(progress * N, N - 0.0001));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scroller, N]);

  const activeIndex = scroller ? Math.min(Math.floor(total), N - 1) : 0;
  const stepProgress = scroller ? total - activeIndex : 0;

  /* Jump the page so the given step sits at the start of its pinned
     zone — lets the nav titles act as a table of contents. */
  const scrollToStep = useCallback(
    (i) => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const target =
        window.scrollY + rect.top + (scrollable * i) / N + 1;
      window.scrollTo({ top: target, behavior: "smooth" });
    },
    [N]
  );

  /* Fill amount for a given title's progress bar: past steps full,
     the active step tracks its own progress, future steps empty. */
  const fillFor = (i) => {
    if (!scroller) return 0;
    if (i < activeIndex) return 1;
    if (i === activeIndex) return clamp(stepProgress, 0, 1);
    return 0;
  };

  /* Cards don't move — they share one stacked cell and swap in place.
     Only the active card is shown; the fuzz + scramble carry the
     transition. Inactive cards stay mounted (hidden) so their canvas
     state and activation triggers persist. */
  const cardStyle = (i) => {
    if (!scroller) return undefined;
    const active = i === activeIndex;
    return {
      opacity: active ? 1 : 0,
      visibility: active ? "visible" : "hidden",
      zIndex: active ? 2 : 1,
    };
  };

  return (
    <div
      ref={sectionRef}
      className={styles.section}
      data-scroller={scroller ? "1" : "0"}
      style={scroller ? { height: `${STEP_VH * N}vh` } : undefined}
    >
      <div className={styles.sticky}>
        <div className={styles.grid}>
          {/* Left column — title list with scroll-fill progress bars. */}
          <nav className={styles.nav} aria-label="Design principles">
            <ol className={styles.navList}>
              {items.map((it, i) => (
                <li key={i} className={styles.navItem}>
                  <button
                    type="button"
                    className={styles.navButton}
                    data-active={scroller && i === activeIndex ? "1" : "0"}
                    onClick={() => scrollToStep(i)}
                    disabled={!scroller}
                  >
                    {it.label ?? it.title}
                  </button>
                  <div className={styles.track} aria-hidden="true">
                    <span
                      className={styles.trackFill}
                      style={{ transform: `scaleX(${fillFor(i)})` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Right column — stacked cards. */}
          <div className={styles.stage}>
            {items.map((it, i) => (
              <PhilosophyCard
                key={i}
                item={it}
                active={!scroller || i === activeIndex}
                animate={animate}
                style={cardStyle(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function clamp(v, lo, hi) {
  return v < lo ? lo : v > hi ? hi : v;
}
