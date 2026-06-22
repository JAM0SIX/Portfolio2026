"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./FilmReelModal.module.css";

/**
 * FilmReelModal — WebGL "bending film reel" packaged for a modal / experiments box.
 * -------------------------------------------------------------------------------
 * Same effect as the full-page FilmReel (one continuous textured strip bent across
 * its own surface; the film feeds through a fixed bend), but adapted for a MODAL:
 *
 *   • Driven by scrolling INSIDE the modal (not the page). A tall inner track in a
 *     scrollable box maps its scroll position to the reel feed.
 *   • Sizes to the MODAL BOX (its own container), not the viewport — fully
 *     responsive to whatever size you make the modal, and the reel stays centred.
 *
 * Two exports:
 *   • <FilmReelView />   — just the reel, fills its parent. Drop it in any box.
 *   • <FilmReelModal />  — a ready-made open/close modal wrapper containing it.
 *
 * Requires three:  npm i three
 */

const DEFAULTS = {
  // Place your photos in /public/reel/ as 01.jpg … 10.jpg (Next serves them at /reel/).
  images: Array.from({ length: 10 }, (_, i) => `/reel/${String(i + 1).padStart(2, "0")}.jpg`),
  framesVisible: 4.4,
  framesByWidth: [[1100, 4.4], [820, 3.4], [520, 2.4], [0, 1.8]],
  segments: 240,
  flatZoneRight: 0.52,
  flatZoneLeft: 0.30,
  bendNear: 14.0,
  bendFar: 4.5,
  sharpness: 5.0,
  fov: 60,
  feedSpeed: 1.0,
  scrollLength: 3,      // inner track height as a MULTIPLE of the box height (e.g. 3 = 3× scroll)
  background: "#f1f1f0",
  grayscale: true,
  framePad: 10,
  gutter: "#e9e9e6",
  frameBorder: "rgba(0,0,0,0.14)",
};

/* ----------------------------------------------------------------------------
   FilmReelView — the reel itself. Fills its parent container. Scrolls internally.
---------------------------------------------------------------------------- */
export function FilmReelView(props) {
  const cfg = { ...DEFAULTS, ...props };
  const scrollRef = useRef(null);   // the scrollable box (the modal body)
  const canvasRef = useRef(null);
  const stickyRef = useRef(null);   // sticky stage that holds the canvas

  useEffect(() => {
    const canvas = canvasRef.current;
    const scroller = scrollRef.current;
    const sticky = stickyRef.current;
    if (!canvas || !scroller || !sticky) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(cfg.fov, 1, 0.02, 100);

    // ---- reel texture from images ----
    const n = cfg.images.length;
    const cellW = 600, cellH = 420;
    const texCanvas = document.createElement("canvas");
    texCanvas.width = cellW * n; texCanvas.height = cellH;
    const tctx = texCanvas.getContext("2d");
    tctx.fillStyle = "#cfcfca"; tctx.fillRect(0, 0, texCanvas.width, texCanvas.height);
    const reelTex = new THREE.CanvasTexture(texCanvas);
    reelTex.wrapS = THREE.RepeatWrapping;
    reelTex.wrapT = THREE.ClampToEdgeWrapping;
    reelTex.minFilter = THREE.LinearFilter;
    reelTex.colorSpace = THREE.SRGBColorSpace;

    cfg.images.forEach((item, i) => {
      const src = typeof item === "string" ? item : item.src;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const pad = cfg.framePad;
        tctx.fillStyle = cfg.gutter;
        tctx.fillRect(i * cellW, 0, cellW, cellH);
        // cover-fit
        const cw = cellW - pad * 2, ch = cellH - pad * 2;
        const ir = img.width / img.height, cr = cw / ch;
        let dw, dh, dx, dy;
        if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0; }
        else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
        tctx.save();
        tctx.beginPath(); tctx.rect(i * cellW + pad, pad, cw, ch); tctx.clip();
        tctx.drawImage(img, i * cellW + pad + dx, pad + dy, dw, dh);
        tctx.restore();
        tctx.strokeStyle = cfg.frameBorder; tctx.lineWidth = 1;
        tctx.strokeRect(i * cellW + pad + 0.5, pad + 0.5, cw - 1, ch - 1);
        reelTex.needsUpdate = true;
      };
      img.src = src;
    });

    const frameAspect = cellW / cellH;
    const planeH = 4.2;
    let planeW = planeH * frameAspect * cfg.framesVisible;
    const geo = new THREE.PlaneGeometry(planeW, planeH, cfg.segments, 1);

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        uTex: { value: reelTex },
        uOffset: { value: 0 },
        uRepeat: { value: cfg.framesVisible / n },
        uHalfW: { value: planeW / 2 },
        uFlatRight: { value: cfg.flatZoneRight * (planeW / 2) },
        uFlatLeft: { value: cfg.flatZoneLeft * (planeW / 2) },
        uBendNear: { value: reduced ? 0 : cfg.bendNear },
        uBendFar: { value: reduced ? 0 : cfg.bendFar },
        uSharpness: { value: cfg.sharpness },
        uGray: { value: cfg.grayscale ? 1 : 0 },
      },
      vertexShader: `
        uniform float uHalfW, uFlatRight, uFlatLeft, uBendNear, uBendFar, uSharpness;
        varying vec2 vUv; varying float vShade;
        void main() {
          vUv = uv; vec3 p = position; float x = p.x; float ax = abs(x);
          if (x > 0.0) {
            float ramp = clamp(max(ax - uFlatRight, 0.0) / max(uHalfW - uFlatRight, 0.0001), 0.0, 1.0);
            p.z += uBendNear * pow(ramp, uSharpness);
          } else {
            float ramp = clamp(max(ax - uFlatLeft, 0.0) / max(uHalfW - uFlatLeft, 0.0001), 0.0, 1.0);
            p.z -= uBendFar * pow(ramp, uSharpness);
          }
          vShade = 1.0 + p.z * 0.06;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uTex; uniform float uOffset, uRepeat, uGray;
        varying vec2 vUv; varying float vShade;
        void main() {
          vec2 uv = vec2(vUv.x * uRepeat + uOffset, vUv.y);
          vec4 c = texture2D(uTex, uv);
          if (uGray > 0.5) { float g = dot(c.rgb, vec3(0.299,0.587,0.114)); c.rgb = vec3(g); }
          c.rgb *= clamp(vShade, 0.45, 1.25);
          gl_FragColor = c;
        }
      `,
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // responsive
    let livePlaneW = planeW, liveFV = cfg.framesVisible;
    const framesForWidth = (w) => {
      for (const [minW, fv] of cfg.framesByWidth) if (w >= minW) return fv;
      return cfg.framesVisible;
    };
    const rebuildGeometry = (fv) => {
      livePlaneW = planeH * frameAspect * fv;
      const ng = new THREE.PlaneGeometry(livePlaneW, planeH, cfg.segments, 1);
      mesh.geometry.dispose(); mesh.geometry = ng;
      mat.uniforms.uHalfW.value = livePlaneW / 2;
      mat.uniforms.uFlatRight.value = cfg.flatZoneRight * (livePlaneW / 2);
      mat.uniforms.uFlatLeft.value = cfg.flatZoneLeft * (livePlaneW / 2);
      mat.uniforms.uRepeat.value = fv / n;
      liveFV = fv;
    };

    const resize = () => {
      // measure the STICKY STAGE (the modal-box-sized area), not the window
      const w = sticky.clientWidth, h = sticky.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const fv = framesForWidth(w);
      if (fv !== liveFV) rebuildGeometry(fv);
      const halfW = (livePlaneW / 2) * 1.06;
      const vFov = (camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
      const distW = halfW / Math.tan(hFov / 2);
      const distH = (planeH / 2 * 1.06) / Math.tan(vFov / 2);
      camera.position.z = Math.max(Math.max(distW, distH), cfg.bendNear + 0.4);
      camera.lookAt(0, 0, 0);
    };
    resize();

    let target = 0, current = 0;
    const onScroll = () => {
      // feed from the MODAL's own scroll position
      const scrollable = scroller.scrollHeight - scroller.clientHeight;
      const t = scrollable > 0 ? Math.min(1, Math.max(0, scroller.scrollTop / scrollable)) : 0;
      const span = (n - liveFV) / n;
      target = t * cfg.feedSpeed * span;
    };
    onScroll();

    scroller.addEventListener("scroll", onScroll, { passive: true });
    // ResizeObserver: reliable on grow AND shrink, fires after layout
    const ro = new ResizeObserver(() => resize());
    ro.observe(sticky);

    let raf;
    const tick = () => {
      current += (target - current) * 0.12;
      mat.uniforms.uOffset.value = current;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scroller.removeEventListener("scroll", onScroll);
      mesh.geometry.dispose();
      mat.dispose();
      reelTex.dispose();
      renderer.dispose();
    };
  }, [cfg.bendFar, cfg.bendNear, cfg.feedSpeed, cfg.flatZoneRight, cfg.flatZoneLeft, cfg.fov, cfg.frameBorder, cfg.framePad, cfg.framesByWidth, cfg.framesVisible, cfg.grayscale, cfg.gutter, cfg.images, cfg.segments, cfg.sharpness]);

  return (
    <div ref={scrollRef} className={styles.scroller}>
      {/* sticky stage = the visible reel, fills the box and stays put while you scroll */}
      <div ref={stickyRef} className={styles.sticky} style={{ background: cfg.background }}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      {/* tall track gives the box something to scroll, which feeds the reel */}
      <div style={{ height: `${cfg.scrollLength * 100}%` }} aria-hidden="true" />
    </div>
  );
}

/* ----------------------------------------------------------------------------
   FilmReelModal — ready-made modal wrapper. Controlled via `open` / `onClose`.
---------------------------------------------------------------------------- */
export default function FilmReelModal({ open = false, onClose, title = "Film reel", ...reelProps }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock page scroll while modal is open
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Close">×</button>
        <FilmReelView {...reelProps} />
      </div>
    </div>
  );
}
