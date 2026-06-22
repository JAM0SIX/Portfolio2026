"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CarouselRing.module.css";
import Modal from "@/components/Modal/Modal";
import ExperimentModal from "@/components/ExperimentModal/ExperimentModal";

/**
 * CarouselRing — images arranged around a horizontal ring (merry-go-round)
 * -----------------------------------------------------------------------
 * N cards are placed evenly around a circle on the horizontal plane, orbiting a
 * vertical axis. A card at angle θ sits at:
 *
 *     x = sin(θ)·R      z = cos(θ)·R      (z+ = toward the viewer)
 *
 * and is rotated rotateY(θ) so it stays tangent to the ring — the front card
 * faces you, side cards turn away, the back card faces away. Scrolling adds to
 * every card's θ, spinning the whole ring so cards cycle front → side → back.
 * Front cards scale up and are opaque; back cards shrink and fade. A small
 * per-card tilt keeps the loose, dynamic character of the reference.
 *
 * Cards are selectable: hovering one grows it, lifts it and tilts it toward the
 * cursor. The grow/lift/tilt are eased via a per-frame lerp (spring-like
 * damping) layered onto an inner wrapper so the orbit loop doesn't fight it.
 *
 * CSS 3D, no dependencies — fits a Next/React + CSS Modules stack directly.
 */

const DEFAULTS = {
  images: Array.from({ length: 7 }, (_, i) =>
    `https://picsum.photos/seed/ring${i}/600/430`
  ),
  aspect: 1.4,       // w / h
  // RESPONSIVE: card width + ring radius are derived from the stage width so the
  // ring suits 700px / 600px containers and scales down to mobile.
  cardWFrac: 0.38,   // front card width as a fraction of stage width
  cardWMin: 150,     // px floor (mobile)
  cardWMax: 300,     // px ceiling
  radiusFrac: 0.40,  // ring radius as a fraction of stage width
  radiusMin: 180,    // px floor
  radiusMax: 420,    // px ceiling
  slantZ: -10,       // deg: diagonal lean of the ring plane (low-left -> high-right)
  slantX: 22,        // deg: tip the ring back toward the viewer
  turns: 1.0,        // full rotations across a full scroll of the section
  frontScale: 1.0,   // scale at the very front
  backScale: 0.55,   // scale at the very back
  tilt: 6,           // deg small per-card loose tilt
  scrollLength: 700, // vh the pinned section consumes
  background: "#f1f1f0",
  grayscale: false,
  hoverGrow: 0.07,   // extra scale at full hover
  hoverLift: 34,     // px translateZ at full hover
  hoverTilt: 11,     // deg max cursor-driven tilt on hover
  hoverEase: 0.16,   // per-frame lerp toward target (spring-like damping)
  label: null,       // optional node rendered inside the pinned stage (static, not sticky)
};

function rnd(seed) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export default function CarouselRing(props) {
  const cfg = { ...DEFAULTS, ...props };
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const cardInnerRefs = useRef([]);
  const rafRef = useRef(0);

  /* Per-card hover physics (eased target -> current each frame) + which card
     is hovered (for the z-index lift). No React state — purely imperative. */
  const hoverRef = useRef([]);
  const hoveredRef = useRef(null);

  /* Clicking a card opens a modal with its title, artefact + description. */
  const [selected, setSelected] = useState(null);

  /* Cards can supply a dark-theme image (srcDark); swap to it under onyx. */
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => setDark(document.documentElement.dataset.theme === "onyx");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  const updateTilt = (i, e) => {
    const h = hoverRef.current[i];
    if (!h) return;
    const r = e.currentTarget.getBoundingClientRect();
    // Cursor offset from card centre, -1..1 on each axis. The corner nearest
    // the cursor is lifted toward the viewer, so the card tilts TOWARD that
    // corner — same behaviour in all four corners. Strength peaks in the
    // corners and eases to flat at the centre. (Both axes use -offset: the
    // CSS rotateX/rotateY sign convention works out the same for each.)
    const nx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2 || 1);
    const ny = (e.clientY - (r.top + r.height / 2)) / (r.height / 2 || 1);
    const c = (v) => Math.max(-1, Math.min(1, v));
    h.tiltTgtX = -c(nx) * cfg.hoverTilt; // rotateY: cursor-side edge forward
    h.tiltTgtY = -c(ny) * cfg.hoverTilt; // rotateX: cursor-side edge forward
  };

  const handleEnter = (i, e) => {
    const h = hoverRef.current[i];
    if (!h) return;
    h.target = 1;
    hoveredRef.current = i;
    updateTilt(i, e);
  };

  const handleMove = (i, e) => updateTilt(i, e);

  const handleLeave = (i) => {
    const h = hoverRef.current[i];
    if (h) {
      h.target = 0;
      h.tiltTgtX = 0;
      h.tiltTgtY = 0;
    }
    if (hoveredRef.current === i) hoveredRef.current = null;
  };

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const n = cfg.images.length;
    const meta = cfg.images.map((_, i) => ({
      base: (i / n) * Math.PI * 2,
      tilt: (rnd(i + 5) * 2 - 1) * cfg.tilt,
    }));

    /* Init per-card hover physics. */
    hoverRef.current = cfg.images.map(() => ({
      cur: 0, target: 0,
      tiltCurX: 0, tiltCurY: 0, tiltTgtX: 0, tiltTgtY: 0,
    }));

    // live, recomputed on resize
    let cardW = cfg.cardWMax;
    let radius = cfg.radiusMax;
    let target = 0, current = 0;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      target = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;
    };
    onScroll();

    const render = (t) => {
      // reduced motion: hold the ring still (no scroll-driven spin)
      const spin = reduced ? 0 : t * cfg.turns * Math.PI * 2;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const theta = meta[i].base + spin;
        const x = Math.sin(theta) * radius;
        const z = Math.cos(theta) * radius;
        const depth = (z / radius + 1) / 2;              // 0 back .. 1 front
        const scale = cfg.backScale + (cfg.frontScale - cfg.backScale) * depth;
        const rotY = (theta * 180) / Math.PI;
        // counter-rotate by the inverse ring slant so the image stays upright/facing
        // while its position rides the slanted orbit
        el.style.transform =
          `translate3d(${x}px, 0, ${z}px) ` +
          `rotateX(${-cfg.slantX}deg) rotateZ(${-cfg.slantZ}deg) ` +
          `rotateY(${rotY}deg) rotateZ(${meta[i].tilt}deg) scale(${scale})`;
        el.style.opacity = "1";                          // always fully visible
        // hovered card lifts above its neighbours
        el.style.zIndex =
          hoveredRef.current === i ? "3000" : String(1000 + Math.round(z));

        // hover grow/lift/tilt — eased toward target for spring-like damping
        const inner = cardInnerRefs.current[i];
        const h = hoverRef.current[i];
        if (inner && h) {
          const k = cfg.hoverEase;
          h.cur += (h.target - h.cur) * k;
          h.tiltCurX += (h.tiltTgtX - h.tiltCurX) * k;
          h.tiltCurY += (h.tiltTgtY - h.tiltCurY) * k;
          const lift = h.cur * cfg.hoverLift;
          const sc = 1 + h.cur * cfg.hoverGrow;
          inner.style.transform =
            `translateZ(${lift}px) scale(${sc}) ` +
            `rotateX(${h.tiltCurY}deg) rotateY(${h.tiltCurX}deg)`;
        }
      });
    };

    // derive card size + radius from the current stage width, size every card
    const resize = () => {
      const w = stage.clientWidth || window.innerWidth;
      cardW = clamp(w * cfg.cardWFrac, cfg.cardWMin, cfg.cardWMax);
      radius = clamp(w * cfg.radiusFrac, cfg.radiusMin, cfg.radiusMax);
      const h = cardW / cfg.aspect;
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${cardW}px`;
        el.style.height = `${h}px`;
        el.style.marginLeft = `${-cardW / 2}px`;
        el.style.marginTop = `${-h / 2}px`;
      });
      render(current);
    };
    resize();

    const tick = () => {
      current += (target - current) * 0.1;
      render(current);
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, [cfg.aspect, cfg.backScale, cfg.cardWFrac, cfg.cardWMax, cfg.cardWMin, cfg.frontScale, cfg.hoverEase, cfg.hoverGrow, cfg.hoverLift, cfg.hoverTilt, cfg.images, cfg.radiusFrac, cfg.radiusMax, cfg.radiusMin, cfg.slantX, cfg.slantZ, cfg.tilt, cfg.turns]);

  const selItem = selected != null ? cfg.images[selected] : null;
  const selIsStr = typeof selItem === "string";
  const selSrc = selItem ? (selIsStr ? selItem : selItem.src) : "";
  const selAlt = selItem ? (selIsStr ? `Project ${selected + 1}` : selItem.alt ?? "") : "";
  const selTitle = selItem
    ? selIsStr
      ? `Project ${selected + 1}`
      : selItem.title ?? selItem.alt ?? `Project ${selected + 1}`
    : "";
  const selDesc = selItem && !selIsStr ? selItem.description : "";
  // Cards backed by an experiment carry an href — open the live experiment in
  // an embedded iframe (chrome stripped via ?embed=1), matching /experiments.
  const selHref = selItem && !selIsStr ? selItem.href : null;

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={{ height: `${cfg.scrollLength}vh` }}
      aria-label="Project carousel ring"
    >
      <div className={styles.sticky} style={{ background: cfg.background }}>
        {cfg.label ? <div className={styles.label}>{cfg.label}</div> : null}
        <div className={styles.stage} ref={stageRef}>
          <div className={styles.ringHolder}>
            <div
              className={styles.ring}
              style={{ transform: `rotateZ(${cfg.slantZ}deg) rotateX(${cfg.slantX}deg)` }}
            >
            {cfg.images.map((item, i) => {
              const isStr = typeof item === "string";
              const src = isStr
                ? item
                : (dark && item.srcDark ? item.srcDark : item.src);
              const alt = isStr ? `Project ${i + 1}` : (item.alt ?? `Project ${i + 1}`);
              // A card may carry a live React node (e.g. the Ripple canvas)
              // instead of a static image — rendered into the same card box.
              const node = isStr ? null : item.node;
              return (
                <figure
                  key={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  className={styles.card}
                  onPointerEnter={(e) => handleEnter(i, e)}
                  onPointerMove={(e) => handleMove(i, e)}
                  onPointerLeave={() => handleLeave(i)}
                  onClick={() => setSelected(i)}
                >
                  <div
                    className={styles.cardInner}
                    ref={(el) => (cardInnerRefs.current[i] = el)}
                  >
                    {node ? (
                      <div className={styles.live}>{node}</div>
                    ) : (
                      <img
                        src={src}
                        alt={alt}
                        /* All ring cards orbit continuously, so lazy-loading
                           causes pop-in as off-screen cards rotate forward
                           (and the 3D transforms don't trigger it reliably). */
                        loading="eager"
                        draggable={false}
                        style={{ filter: cfg.grayscale ? "grayscale(1) contrast(1.04)" : "contrast(1.04)" }}
                      />
                    )}
                  </div>
                </figure>
              );
            })}
            </div>
          </div>
        </div>
      </div>

      {selItem != null ? (
        selHref ? (
          <ExperimentModal
            experiment={{
              title: selTitle,
              href: selHref,
              meta: selItem.meta,
              note: selItem.note,
            }}
            onClose={() => setSelected(null)}
          />
        ) : (
          <Modal
            title={selTitle}
            description={selDesc}
            onClose={() => setSelected(null)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selSrc} alt={selAlt} />
          </Modal>
        )
      ) : null}
    </section>
  );
}
