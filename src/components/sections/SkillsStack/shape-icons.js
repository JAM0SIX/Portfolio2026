/**
 * shape-icons.js
 * ---------------------------------------------------------------------------
 * Animated 3D wireframe icons in the "Default" style (white wireframe on a
 * blue stage, with pedestal rings and a dynamic floor shadow).
 *
 * Zero dependencies. Plain Canvas 2D. Works as an ES module.
 *
 *   import { ShapeIcon, SHAPES, SHAPE_KEYS } from "./shape-icons.js";
 *   const icon = new ShapeIcon(document.querySelector("#slot"), { shape: "torus" });
 *
 * See demo.html for full usage.
 * ---------------------------------------------------------------------------
 */

/* =========================================================================
 *  DEFAULT STYLE
 *  Change these once to restyle every icon.
 * ========================================================================= */
export const DEFAULT_STYLE = {
  stage: "linear-gradient(135deg,#0f2f6b 0%,#1b4fb0 45%,#2f6bff 75%,#79a7ff 100%)",
  edge: "rgba(255,255,255,0.85)",
  edgeWidth: 1,
  face: "rgba(255,255,255,0.04)",
  dot: "rgba(255,255,255,0.95)",
  dotRadius: 1.5,
  ringOuter: "rgba(255,255,255,0.20)",
  ringInner: "rgba(255,255,255,0.32)",
  shadow: "rgba(6,18,60,0.32)",
  // layout (fractions of the canvas)
  centerY: 0.44,   // vertical position of the shape
  stageY: 0.84,    // vertical position of the pedestal floor
  fitFraction: 0.56, // how much of the canvas the shape fills
  perspective: 6
};

/* =========================================================================
 *  3D MATH
 * ========================================================================= */
const rotX = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }; };
const rotY = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }; };
const rotZ = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }; };
const project = (p, cx, cy, scale, persp) => { const f = persp / (persp + p.z); return { x: cx + p.x * f * scale, y: cy + p.y * f * scale, z: p.z, f }; };

function normalise(shape) {
  let maxR = 0;
  for (const p of shape.v) { const r = Math.hypot(p.x, p.y, p.z); if (r > maxR) maxR = r; }
  if (maxR > 0) for (const p of shape.v) { p.x /= maxR; p.y /= maxR; p.z /= maxR; }
  return shape;
}

function edgesFromFaces(faces) {
  const set = new Set(), e = [];
  for (const f of faces) for (let i = 0; i < f.length; i++) {
    const a = f[i], b = f[(i + 1) % f.length];
    const key = a < b ? a + "_" + b : b + "_" + a;
    if (!set.has(key)) { set.add(key); e.push([a, b]); }
  }
  return e;
}

function makeCube(s) {
  const v = [];
  for (const x of [-s, s]) for (const y of [-s, s]) for (const z of [-s, s]) v.push({ x, y, z });
  const e = [[0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]];
  const f = [[0,1,3,2],[4,5,7,6],[0,1,5,4],[2,3,7,6],[0,2,6,4],[1,3,7,5]];
  return { v, e, f };
}

function convexHull(points) {
  const pts = points.slice().sort((a, b) => a.x - b.x || a.y - b.y);
  if (pts.length < 3) return pts;
  const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lo = []; for (const p of pts) { while (lo.length >= 2 && cross(lo[lo.length-2], lo[lo.length-1], p) <= 0) lo.pop(); lo.push(p); }
  const up = []; for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cross(up[up.length-2], up[up.length-1], p) <= 0) up.pop(); up.push(p); }
  lo.pop(); up.pop(); return lo.concat(up);
}

/* =========================================================================
 *  SHAPE LIBRARY  (all normalised to a unit bounding sphere)
 * ========================================================================= */
export const SHAPES = {};

// 1. nested cubes
(() => {
  const o = makeCube(1.0), n = makeCube(0.5);
  const v = o.v.concat(n.v);
  const e = o.e.concat(n.e.map(([a, b]) => [a + 8, b + 8]));
  const f = o.f.concat(n.f.map(q => q.map(i => i + 8)));
  SHAPES.cubes = { name: "Nested Cubes", ...normalise({ v, e, f }) };
})();

// 2. 3D bar chart
(() => {
  const v = [], e = [], f = [];
  const heights = [[0.5,1.1,0.7],[1.3,0.6,1.5],[0.9,1.4,0.8]];
  const step = 0.95, bw = 0.34; let idx = 0;
  for (let gx = 0; gx < 3; gx++) for (let gz = 0; gz < 3; gz++) {
    const cx = (gx-1)*step, cz = (gz-1)*step, h = heights[gx][gz], base = idx;
    [[cx-bw,0,cz-bw],[cx+bw,0,cz-bw],[cx+bw,0,cz+bw],[cx-bw,0,cz+bw],
     [cx-bw,-h,cz-bw],[cx+bw,-h,cz-bw],[cx+bw,-h,cz+bw],[cx-bw,-h,cz+bw]]
     .forEach(([x,y,z]) => v.push({ x, y, z }));
    [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]]
      .forEach(([a,b]) => e.push([base+a, base+b]));
    f.push([base+4,base+5,base+6,base+7]);
    f.push([base+0,base+1,base+5,base+4]); f.push([base+1,base+2,base+6,base+5]);
    f.push([base+2,base+3,base+7,base+6]); f.push([base+3,base+0,base+4,base+7]);
    idx += 8;
  }
  v.forEach(p => p.y += 0.55);
  SHAPES.bars = { name: "3D Bar Chart", ...normalise({ v, e, f }) };
})();

// 3. torus
(() => {
  const R = 0.95, r = 0.40, N = 20, M = 12;
  const v = [], e = [], f = [], grid = [];
  for (let i = 0; i < N; i++) {
    const u = (i / N) * Math.PI * 2; const row = [];
    for (let j = 0; j < M; j++) {
      const vv = (j / M) * Math.PI * 2;
      row.push(v.length);
      v.push({ x: (R + r * Math.cos(vv)) * Math.cos(u), y: r * Math.sin(vv), z: (R + r * Math.cos(vv)) * Math.sin(u) });
    }
    grid.push(row);
  }
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
    const a = grid[i][j], b = grid[(i+1)%N][j], c = grid[i][(j+1)%M], d = grid[(i+1)%N][(j+1)%M];
    e.push([a, b]); e.push([a, c]); f.push([a, b, d, c]);
  }
  SHAPES.torus = { name: "Torus", ...normalise({ v, e, f }) };
})();

// 4. octahedron
(() => {
  const s = 1.0;
  const v = [{x:0,y:-s,z:0},{x:0,y:s,z:0},{x:-s,y:0,z:0},{x:s,y:0,z:0},{x:0,y:0,z:-s},{x:0,y:0,z:s}];
  const f = [[0,2,4],[0,4,3],[0,3,5],[0,5,2],[1,2,4],[1,4,3],[1,3,5],[1,5,2]];
  SHAPES.octahedron = normalise({ name: "Octahedron", v, e: edgesFromFaces(f), f });
})();

// 5. tetrahedron
(() => {
  const v = [{x:1,y:1,z:1},{x:-1,y:-1,z:1},{x:-1,y:1,z:-1},{x:1,y:-1,z:-1}];
  const f = [[0,1,2],[0,3,1],[0,2,3],[1,3,2]];
  SHAPES.tetra = normalise({ name: "Tetrahedron", v, f, e: edgesFromFaces(f) });
})();

// 6. icosahedron
(() => {
  const t = (1 + Math.sqrt(5)) / 2;
  const v = [[-1,t,0],[1,t,0],[-1,-t,0],[1,-t,0],[0,-1,t],[0,1,t],[0,-1,-t],[0,1,-t],[t,0,-1],[t,0,1],[-t,0,-1],[-t,0,1]]
    .map(([x,y,z]) => ({ x, y, z }));
  const f = [[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
             [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]];
  SHAPES.icosa = normalise({ name: "Icosahedron", v, f, e: edgesFromFaces(f) });
})();

// 7. dodecahedron
(() => {
  const phi = (1 + Math.sqrt(5)) / 2, a = 1, b = 1 / phi, c = phi;
  const raw = [[a,a,a],[a,a,-a],[a,-a,a],[a,-a,-a],[-a,a,a],[-a,a,-a],[-a,-a,a],[-a,-a,-a],
    [0,b,c],[0,b,-c],[0,-b,c],[0,-b,-c],[b,c,0],[b,-c,0],[-b,c,0],[-b,-c,0],[c,0,b],[c,0,-b],[-c,0,b],[-c,0,-b]];
  const v = raw.map(([x,y,z]) => ({ x, y, z }));
  const f = [[0,8,10,2,16],[0,16,17,1,12],[0,12,14,4,8],[8,4,18,6,10],[10,6,15,13,2],[16,2,13,3,17],
    [12,1,9,5,14],[1,17,3,11,9],[3,13,15,7,11],[4,14,5,19,18],[5,9,11,7,19],[6,18,19,7,15]];
  SHAPES.dodeca = normalise({ name: "Dodecahedron", v, f, e: edgesFromFaces(f) });
})();

// 8. geodesic (UV) sphere
(() => {
  const N = 16, M = 12;
  const v = [], e = [], f = [], grid = [];
  for (let i = 0; i <= M; i++) {
    const lat = (i / M) * Math.PI; const row = [];
    for (let j = 0; j < N; j++) {
      const lon = (j / N) * Math.PI * 2;
      row.push(v.length);
      v.push({ x: Math.sin(lat) * Math.cos(lon), y: Math.cos(lat), z: Math.sin(lat) * Math.sin(lon) });
    }
    grid.push(row);
  }
  for (let i = 0; i < M; i++) for (let j = 0; j < N; j++) {
    const a = grid[i][j], b = grid[i+1][j], c = grid[i][(j+1)%N], d = grid[i+1][(j+1)%N];
    e.push([a, b]); e.push([a, c]); f.push([a, b, d, c]);
  }
  SHAPES.sphere = { name: "Geodesic Sphere", ...normalise({ v, e, f }) };
})();

// 9. helix
(() => {
  const turns = 3, perTurn = 24, total = turns * perTurn, R = 0.7, hgt = 1.8;
  const v = [], e = [];
  for (let i = 0; i <= total; i++) {
    const ang = (i / perTurn) * Math.PI * 2;
    v.push({ x: R * Math.cos(ang), y: -hgt/2 + (i/total)*hgt, z: R * Math.sin(ang) });
    if (i > 0) e.push([i-1, i]);
  }
  SHAPES.helix = { name: "Helix", v, e, f: null };
  normalise(SHAPES.helix);
})();

// 10. square pyramid
(() => {
  const v = [{x:-1,y:0.7,z:-1},{x:1,y:0.7,z:-1},{x:1,y:0.7,z:1},{x:-1,y:0.7,z:1},{x:0,y:-1,z:0}];
  const f = [[0,1,2,3],[0,1,4],[1,2,4],[2,3,4],[3,0,4]];
  SHAPES.pyramid = normalise({ name: "Pyramid", v, f, e: edgesFromFaces(f) });
})();

// 11. torus knot (p=2, q=3)
(() => {
  const p = 2, q = 3, N = 140;
  const v = [], e = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI * 2, r = Math.cos(q * t) + 2;
    v.push({ x: r * Math.cos(p*t) * 0.5, y: Math.sin(q*t) * 0.5, z: r * Math.sin(p*t) * 0.5 });
    if (i > 0) e.push([i-1, i]);
  }
  SHAPES.knot = { name: "Torus Knot", v, e, f: null };
  normalise(SHAPES.knot);
})();

// 12. gem (bipyramid)
(() => {
  const v = [{x:0,y:-1.3,z:0},{x:0,y:0.8,z:0},{x:-1,y:0.2,z:0},{x:1,y:0.2,z:0},{x:0,y:0.2,z:-1},
    {x:0,y:0.2,z:1},{x:-0.7,y:0.2,z:-0.7},{x:0.7,y:0.2,z:-0.7},{x:0.7,y:0.2,z:0.7},{x:-0.7,y:0.2,z:0.7}];
  const ring = [2,6,4,7,3,8,5,9], f = [];
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i], b = ring[(i+1)%ring.length];
    f.push([0, a, b]); f.push([1, b, a]);
  }
  SHAPES.gem = normalise({ name: "Gem", v, f, e: edgesFromFaces(f) });
})();

export const SHAPE_KEYS = ["cubes","bars","torus","octahedron","tetra","icosa","dodeca","sphere","helix","pyramid","knot","gem"];

/* =========================================================================
 *  RENDER A SINGLE FRAME OF A SHAPE INTO A 2D CONTEXT
 *  (low-level — most users just want the ShapeIcon class below)
 * ========================================================================= */
export function drawShape(ctx, shape, W, H, rotXa, rotYa, style = DEFAULT_STYLE, opts = {}) {
  const dots   = opts.dots   !== false;
  const faces  = opts.faces  !== false;
  const stage  = opts.stage  !== false;

  ctx.clearRect(0, 0, W, H);

  const persp = style.perspective;
  const cx = W / 2, cy = H * style.centerY, stageY = H * style.stageY;

  const tv = shape.v.map(p => { let q = rotZ(p, 0); q = rotX(q, rotXa); q = rotY(q, rotYa); return q; });

  const maxFront = persp / (persp - 1);
  const target = Math.min(W, H) * style.fitFraction;
  const fit = target / (2 * maxFront);

  // stage rings + dynamic shadow
  if (stage) {
    ctx.save();
    ctx.lineWidth = 1;
    const rad = Math.min(W, H) * 0.27;
    ctx.strokeStyle = style.ringOuter;
    ctx.beginPath(); ctx.ellipse(cx, stageY, rad, rad * 0.30, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = style.ringInner;
    ctx.beginPath(); ctx.ellipse(cx, stageY, rad * 0.62, rad * 0.62 * 0.30, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();

    const pts = tv.map(p => { const f = persp / (persp + p.z); return { x: cx + p.x * f * fit, y: stageY + p.z * f * fit * 0.18 }; });
    const hull = convexHull(pts);
    if (hull.length >= 3) {
      ctx.save();
      ctx.beginPath();
      hull.forEach((p, k) => k === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath();
      let mx = 0, my = 0; hull.forEach(p => { mx += p.x; my += p.y; }); mx /= hull.length; my /= hull.length;
      const fade = style.shadow.replace(/[\d.]+\)$/, "0)");
      const g = ctx.createRadialGradient(mx, my, 2, mx, my, Math.max(20, fit * 1.1));
      g.addColorStop(0, style.shadow); g.addColorStop(1, fade);
      ctx.fillStyle = g; ctx.globalCompositeOperation = "multiply"; ctx.filter = "blur(3px)";
      ctx.fill();
      ctx.restore();
    }
  }

  const proj = tv.map(p => project(p, cx, cy, fit, persp));

  // faces
  if (faces && shape.f) {
    ctx.fillStyle = style.face;
    for (const face of shape.f) {
      ctx.beginPath();
      face.forEach((idx, k) => { const pp = proj[idx]; k === 0 ? ctx.moveTo(pp.x, pp.y) : ctx.lineTo(pp.x, pp.y); });
      ctx.closePath(); ctx.fill();
    }
  }

  // edges
  ctx.lineWidth = style.edgeWidth;
  ctx.strokeStyle = style.edge;
  ctx.lineJoin = "round";
  ctx.beginPath();
  for (const [a, b] of shape.e) { ctx.moveTo(proj[a].x, proj[a].y); ctx.lineTo(proj[b].x, proj[b].y); }
  ctx.stroke();

  // vertex dots
  if (dots) {
    ctx.fillStyle = style.dot;
    for (const p of proj) { ctx.beginPath(); ctx.arc(p.x, p.y, style.dotRadius, 0, Math.PI * 2); ctx.fill(); }
  }
}

/* =========================================================================
 *  ShapeIcon — drop a self-managing animated icon into any element.
 *
 *  new ShapeIcon(container, {
 *    shape: "torus",        // key from SHAPE_KEYS
 *    autospin: true,        // idle rotation
 *    speed: 1,              // spin multiplier
 *    interactive: true,     // drag to rotate (with inertia)
 *    radius: 16,            // stage corner radius (px)
 *    style: { ... }         // override any DEFAULT_STYLE field
 *  });
 *
 *  Methods: setShape(key), destroy()
 * ========================================================================= */
export class ShapeIcon {
  constructor(container, options = {}) {
    this.container = container;
    this.opts = Object.assign({
      shape: "torus", autospin: true, speed: 1, interactive: true,
      radius: 16, dots: true, faces: true, stage: true
    }, options);
    this.style = Object.assign({}, DEFAULT_STYLE, options.style || {});

    // build stage element
    const stage = document.createElement("div");
    stage.style.position = "relative";
    stage.style.width = "100%";
    stage.style.height = "100%";
    stage.style.borderRadius = this.opts.radius + "px";
    stage.style.overflow = "hidden";
    stage.style.background = this.style.stage;
    if (this.opts.interactive) stage.style.cursor = "grab";
    const cv = document.createElement("canvas");
    cv.style.display = "block";
    cv.style.width = "100%";
    cv.style.height = "100%";
    stage.appendChild(cv);
    container.appendChild(stage);

    this.stageEl = stage;
    this.canvas = cv;
    this.ctx = cv.getContext("2d");
    this.shape = SHAPES[this.opts.shape] || SHAPES.torus;

    this.state = { rotX: 0.5, rotY: 0.7, dragging: false, lastX: 0, lastY: 0, vx: 0, vy: 0 };
    this._t0 = performance.now();
    this._last = this._t0;

    this._bindEvents();
    this._resize();
    this._ro = new ResizeObserver(() => this._resize());
    this._ro.observe(stage);

    this._raf = requestAnimationFrame(this._loop);
  }

  _bindEvents() {
    if (!this.opts.interactive) return;
    const s = this.state, st = this.stageEl;
    this._onDown = (ev) => { s.dragging = true; s.lastX = ev.clientX; s.lastY = ev.clientY; st.style.cursor = "grabbing"; st.setPointerCapture?.(ev.pointerId); };
    this._onMove = (ev) => {
      if (!s.dragging) return;
      const dx = ev.clientX - s.lastX, dy = ev.clientY - s.lastY;
      s.rotY += dx * 0.01; s.rotX += dy * 0.01;
      s.vx = dx * 0.01; s.vy = dy * 0.01;
      s.lastX = ev.clientX; s.lastY = ev.clientY;
    };
    this._onUp = () => { s.dragging = false; st.style.cursor = "grab"; };
    st.addEventListener("pointerdown", this._onDown);
    st.addEventListener("pointermove", this._onMove);
    st.addEventListener("pointerup", this._onUp);
    st.addEventListener("pointercancel", this._onUp);
  }

  _resize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const r = this.stageEl.getBoundingClientRect();
    this._W = r.width; this._H = r.height;
    this.canvas.width = Math.max(1, Math.round(r.width * dpr));
    this.canvas.height = Math.max(1, Math.round(r.height * dpr));
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  _loop = (now) => {
    const dt = Math.min(50, now - this._last); this._last = now;
    const s = this.state;
    if (this.opts.autospin && !s.dragging) s.rotY += 0.006 * this.opts.speed * (dt / 16);
    if (!s.dragging) { s.rotY += s.vx; s.rotX += s.vy; s.vx *= 0.92; s.vy *= 0.92; }
    const rx = s.rotX + Math.sin((now - this._t0) * 0.0003) * 0.04;
    drawShape(this.ctx, this.shape, this._W, this._H, rx, s.rotY, this.style,
      { dots: this.opts.dots, faces: this.opts.faces, stage: this.opts.stage });
    this._raf = requestAnimationFrame(this._loop);
  };

  setShape(key) { if (SHAPES[key]) { this.shape = SHAPES[key]; this.opts.shape = key; } }

  destroy() {
    cancelAnimationFrame(this._raf);
    this._ro?.disconnect();
    if (this.opts.interactive) {
      this.stageEl.removeEventListener("pointerdown", this._onDown);
      this.stageEl.removeEventListener("pointermove", this._onMove);
      this.stageEl.removeEventListener("pointerup", this._onUp);
      this.stageEl.removeEventListener("pointercancel", this._onUp);
    }
    this.stageEl.remove();
  }
}
