"use client";

/* ─────────────────────────────────────────────────────────────
   Portfolio Dial — ported as an experiment.
   Embedded as a section in /experiments/dial. No scroll-jack;
   utility/HUD aesthetic preserved. Dial rotates 6 projects orbiting
   near 3 o'clock; active item expands as an inline accordion.

   Interactions (only when the section is at least 50% in view):
     ArrowKeys   rotate through projects (clamped at ends)
     Enter / ⎵   "open" (no-op in this experiment)
     click ▲ ▼   step prev / next via the indicator-flanking arrows
     touch swipe rotate through projects (mobile only)
   ───────────────────────────────────────────────────────────── */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import DialTagPills from "./DialTagPills";
import { PROJECTS } from "./projects";
import "./PortfolioDial.css";

const DISC_EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#C2410C";

const CONFIG = {
  dialSize: 1200,
  hudOn: true,
  arcSpread: 132,
};

const TABLET_DIAL_MAX_W = 1024;
const TABLET_ARC_SPREAD = 162;

const TAU = Math.PI * 2;
const SLOT_ANGLE = (i, n = PROJECTS.length) => (i * TAU) / n;

/* useTransitionAngle — animates the orbiting list past activeIdx changes. */
function useTransitionAngle(activeIdx, step) {
  const [residual, setResidual] = useState(0);
  const prevIdxRef = useRef(activeIdx);
  const rafRef = useRef(null);

  useEffect(() => {
    const delta = activeIdx - prevIdxRef.current;
    prevIdxRef.current = activeIdx;
    if (delta === 0) return;
    setResidual((r) => r + delta * step);
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const tick = () => {
      setResidual((r) => {
        if (Math.abs(r) < 0.0008) return 0;
        rafRef.current = requestAnimationFrame(tick);
        return r * 0.9;
      });
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [activeIdx, step]);

  return residual;
}

/* TickRing — SVG tick marks + indicator at 3 o'clock. */
function TickRing({ size, accent, hudOn }) {
  const r = size / 2;
  const inner = r - 4;
  const outer = r;
  const ticks = 60;
  const lines = [];
  for (let i = 0; i < ticks; i++) {
    const a = (i / ticks) * TAU;
    const major = i % 5 === 0;
    const len = major ? 8 : 3;
    const x1 = inner * Math.cos(a);
    const y1 = inner * Math.sin(a);
    const x2 = (inner - len) * Math.cos(a);
    const y2 = (inner - len) * Math.sin(a);
    lines.push(
      <line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={major ? "rgba(26, 24, 21, 0.62)" : "rgba(26, 24, 21, 0.22)"}
        strokeWidth={major ? 1 : 0.6}
      />,
    );
  }
  const cardinals = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g transform={`translate(${r} ${r})`}>
        <circle r={outer - 1} fill="none" stroke="rgba(26, 24, 21, 0.22)" strokeWidth="0.5" />
        <circle r={inner - 10} fill="none" stroke="rgba(26, 24, 21, 0.12)" strokeWidth="0.5" />
        {lines}
      </g>
      <g transform={`translate(${r} ${r})`}>
        <line x1={inner - 16} y1={0} x2={outer + 6} y2={0} stroke={accent} strokeWidth="1.2" />
        <circle cx={outer + 6} cy={0} r="3" fill={accent} />
        <circle cx={outer + 6} cy={0} r="6" fill="none" stroke={accent} strokeWidth="0.5" opacity={0.6} />
      </g>
      {hudOn && (
        <g
          transform={`translate(${r} ${r})`}
          style={{
            font: '500 8px/1 var(--font-sans)',
            letterSpacing: ".08em",
            fill: "var(--ink-42)",
          }}
        >
          {cardinals.map((deg) => {
            const a = (deg * Math.PI) / 180;
            const lr = outer + 18;
            const x = lr * Math.cos(a);
            const y = lr * Math.sin(a);
            const label = String(deg).padStart(3, "0") + "°";
            return (
              <text key={deg} x={x} y={y} textAnchor="middle" dominantBaseline="middle">
                {label}
              </text>
            );
          })}
        </g>
      )}
    </svg>
  );
}

/* DotField — three concentric rings of dots, rotating with the dial. */
function DotField({ size, angle }) {
  const r = size / 2;
  const ringSpecs = [
    { radius: r * 0.78, count: 36, dot: 1.8, op: 0.85, isActive: true },
    { radius: r * 0.84, count: 60, dot: 1.4, op: 0.5 },
    { radius: r * 0.9, count: 84, dot: 1.2, op: 0.4 },
  ];
  const rings = [];
  ringSpecs.forEach((spec, ri) => {
    for (let i = 0; i < spec.count; i++) {
      const a = (i / spec.count) * TAU;
      const x = spec.radius * Math.cos(a);
      const y = spec.radius * Math.sin(a);
      const fill = spec.isActive ? "rgba(26, 24, 21, 0.82)" : `rgba(26, 24, 21, ${spec.op})`;
      rings.push(<circle key={`${ri}-${i}`} cx={x} cy={y} r={spec.dot} fill={fill} />);
    }
  });

  return (
    <svg
      width={size}
      height={size}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <g transform={`translate(${r} ${r}) rotate(${(angle * 180) / Math.PI})`}>
        {rings}
      </g>
    </svg>
  );
}

/* CenterImage — disc that cross-fades on active change. Falls back
   to solid paper-deep when no project image is set (the default for
   this experiment's placeholder data). */
function CenterImage({ size, image, alt }) {
  return (
    <div
      aria-hidden={!image}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow:
          "0 0 0 1px var(--ink-22), 0 0 0 6px var(--paper), 0 0 0 7px var(--ink-12)",
        background: "var(--paper-deep)",
        pointerEvents: "none",
      }}
    >
      <AnimatePresence mode="sync">
        {image && (
          <motion.div
            key={image}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: DISC_EASE }}
            style={{ position: "absolute", inset: 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Up / Down arrows next to the 3 o'clock indicator. */
function NavArrows({ dialSize, canPrev, canNext, onPrev, onNext }) {
  const baseLeft = dialSize + 18;
  const offsetY = 22;
  const posStyle = (top) => ({
    position: "absolute",
    left: baseLeft,
    pointerEvents: "auto",
    top,
  });
  return (
    <>
      <button
        type="button"
        aria-label="Previous project"
        onClick={() => canPrev && onPrev()}
        disabled={!canPrev}
        className="btn-icon btn-icon-sm"
        style={posStyle(`calc(50% - ${offsetY + 28}px)`)}
      >
        <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden="true">
          <path d="M1 6 L5.5 1 L10 6" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => canNext && onNext()}
        disabled={!canNext}
        className="btn-icon btn-icon-sm"
        style={posStyle(`calc(50% + ${offsetY}px)`)}
      >
        <svg width="11" height="7" viewBox="0 0 11 7" aria-hidden="true">
          <path d="M1 1 L5.5 6 L10 1" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}

/* CTA buttons — uses the design system's .btn .btn-primary /
   .btn .btn-secondary so it matches the rest of the portfolio. */
function ActiveCTA({ onOpen }) {
  return (
    <button
      type="button"
      className="btn btn-primary"
      onClick={(e) => { e.stopPropagation(); onOpen(); }}
    >
      View Project
    </button>
  );
}

function LiveSiteLink({ href }) {
  return (
    <a
      className="btn btn-secondary"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
    >
      See live site
    </a>
  );
}

/* HeadingItem — one slot in the orbiting list. */
function HeadingItem({ project, idx, x, y, isActive, opacity, hidden, accent, onSelect, onOpen }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform .85s cubic-bezier(.32,.72,.32,1)",
        pointerEvents: hidden ? "none" : "auto",
      }}
    >
      <div
        className="isClickable"
        onClick={() => {
          if (hidden) return;
          if (isActive) {
            if (!project.comingSoon) onOpen();
          } else onSelect();
        }}
        style={{
          transform: "translateY(-50%)",
          opacity,
          transition:
            "opacity .55s cubic-bezier(.32,.72,.32,1), transform .85s cubic-bezier(.32,.72,.32,1)",
          userSelect: "none",
          whiteSpace: "nowrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingLeft: 22,
            font: '500 10px/1 var(--font-sans)',
            letterSpacing: ".22em",
            color: isActive ? accent : "var(--ink-62)",
            transition: "color .55s cubic-bezier(.32,.72,.32,1)",
          }}
        >
          <span
            style={{
              width: isActive ? 26 : 14,
              height: 1,
              background: "currentColor",
              opacity: 0.65,
              transition: "width .7s cubic-bezier(.32,.72,.32,1)",
            }}
          />
          <span>P/{String(idx + 1).padStart(2, "0")}</span>
        </div>

        <div
          style={{
            marginTop: isActive ? 10 : 6,
            paddingLeft: 22,
            font: `${isActive ? 600 : 500} ${isActive ? 28 : 20}px/1 var(--font-sans)`,
            letterSpacing: ".04em",
            color: "var(--ink)",
            transition:
              "font-size .55s cubic-bezier(.32,.72,.32,1), font-weight .55s cubic-bezier(.32,.72,.32,1), margin-top .55s cubic-bezier(.32,.72,.32,1)",
          }}
        >
          {project.title}
        </div>

        <div
          style={{
            marginTop: isActive ? 8 : 5,
            paddingLeft: 22,
            font: '500 10px/1.3 var(--font-sans)',
            letterSpacing: ".16em",
            color: "var(--ink-62)",
            textTransform: "none",
            transition: "margin-top .55s cubic-bezier(.32,.72,.32,1)",
          }}
        >
          {project.dialMetaLine ?? `${project.year}, ${project.role}`}
        </div>

        <div
          aria-hidden={!isActive}
          style={{
            marginLeft: 22,
            marginTop: isActive ? 22 : 0,
            opacity: isActive ? 1 : 0,
            transform: isActive ? "translateY(0)" : "translateY(-6px)",
            maxHeight: isActive ? 280 : 0,
            overflow: "hidden",
            pointerEvents: isActive ? "auto" : "none",
            transition:
              "opacity .65s cubic-bezier(.32,.72,.32,1), " +
              "transform .65s cubic-bezier(.32,.72,.32,1), " +
              "max-height .65s cubic-bezier(.32,.72,.32,1), " +
              "margin-top .65s cubic-bezier(.32,.72,.32,1)",
          }}
        >
          <div
            style={{
              marginTop: 0,
              paddingTop: 0,
              marginBottom: 18,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <DialTagPills tags={project.tags} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 10,
            }}
          >
            {project.comingSoon ? (
              <span className="dial-coming-soon-cta" role="status">Coming soon</span>
            ) : (
              <>
                <ActiveCTA onOpen={onOpen} />
                {project.liveSiteUrl ? <LiveSiteLink href={project.liveSiteUrl} /> : null}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* OrbitingHeadings — desktop list of headings around the dial. */
function OrbitingHeadings({ projects, activeIdx, radius, dialAngle, arcSpread, accent, onSelect, onOpen }) {
  const n = projects.length;
  const arcRad = (arcSpread * Math.PI) / 180;
  const step = n > 1 ? arcRad / (n - 1) : 0;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 0,
        height: 0,
        pointerEvents: "none",
      }}
    >
      {projects.map((p, i) => {
        const offset = i - activeIdx;
        const a = offset * step + dialAngle;
        const x = radius * Math.cos(a);
        const y = radius * Math.sin(a);
        const isActive = i === activeIdx;
        const dist = Math.abs(a);
        const hidden = Math.abs(offset) > 2;
        const opacity = hidden ? 0 : isActive ? 1 : Math.max(0.3, 0.7 - dist * 1.6);
        return (
          <HeadingItem
            key={p.id}
            project={p}
            idx={i}
            x={x}
            y={y}
            isActive={isActive}
            opacity={opacity}
            hidden={hidden}
            accent={accent}
            onSelect={() => onSelect(i)}
            onOpen={() => onOpen(p.id)}
          />
        );
      })}
    </div>
  );
}

/* MiniMap — small position tracker (lives in the HUD footer). */
function MiniMap({ activeIdx, n, accent }) {
  const size = 56;
  const r = size / 2 - 4;
  const slotLabel = `Project ${activeIdx + 1} of ${n} on dial`;
  return (
    <div
      role="group"
      aria-label={`Dial position tracker. ${slotLabel}. Ring A.`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        font: '500 10px/1.4 var(--font-sans)',
        letterSpacing: ".1em",
        color: "var(--ink-62)",
      }}
    >
      <svg width={size} height={size} style={{ display: "block" }} aria-hidden="true" focusable="false">
        <g transform={`translate(${size / 2} ${size / 2})`}>
          <circle r={r} fill="none" stroke="rgba(26, 24, 21, 0.22)" strokeWidth="0.5" />
          {Array.from({ length: n }).map((_, i) => {
            const a = SLOT_ANGLE(i, n);
            const cx = r * Math.cos(a);
            const cy = r * Math.sin(a);
            const active = i === activeIdx;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={active ? 3 : 1.6}
                fill={active ? accent : "rgba(26, 24, 21, 0.62)"}
              />
            );
          })}
          <line x1={r - 4} y1={0} x2={r + 6} y2={0} stroke={accent} strokeWidth="1" />
        </g>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <div>
          NODE {String(activeIdx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </div>
        <div style={{ opacity: 0.55 }}>RING · A</div>
      </div>
    </div>
  );
}

function HudFooter({ accent, activeIdx, n }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 18,
        left: 22,
        right: 22,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 16,
        font: '500 10px/1.4 var(--font-sans)',
        letterSpacing: ".16em",
        color: "var(--ink-62)",
        pointerEvents: "none",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <MiniMap activeIdx={activeIdx} n={n} accent={accent} />
    </div>
  );
}

/* Mobile arrows. */
function MobileNavArrows({ activeIdx, n, onPrev, onNext }) {
  const canPrev = activeIdx > 0;
  const canNext = activeIdx < n - 1;
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16 }}>
      <button
        type="button"
        aria-label="Previous project"
        onClick={() => canPrev && onPrev()}
        disabled={!canPrev}
        className="btn-icon btn-icon-md"
      >
        <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden="true">
          <path d="M7.5 1 L2 5.5 L7.5 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span
        style={{
          font: '500 10px/1 var(--font-sans)',
          letterSpacing: ".22em",
          color: "var(--ink-62)",
          textTransform: "uppercase",
          minWidth: 56,
          textAlign: "center",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(activeIdx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
      </span>
      <button
        type="button"
        aria-label="Next project"
        onClick={() => canNext && onNext()}
        disabled={!canNext}
        className="btn-icon btn-icon-md"
      >
        <svg width="9" height="11" viewBox="0 0 9 11" aria-hidden="true">
          <path d="M1.5 1 L7 5.5 L1.5 10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}

/* MobileActiveCard — the inline card shown under the dial on mobile. */
function MobileActiveCard({ project, idx, accent, direction, onOpen }) {
  const slideFrom = direction >= 0 ? 28 : -28;
  const cardStyle = {
    margin: "0 16px",
    padding: "20px 22px",
    background: "rgba(245, 243, 238, 0.6)",
    border: "none",
    "--card-slide-from": `${slideFrom}px`,
    animation: "mobCardSlide .45s cubic-bezier(.32,.72,.32,1) both",
  };

  return (
    <div key={project.id} style={cardStyle}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          font: '500 10px/1 var(--font-sans)',
          letterSpacing: ".22em",
          color: accent,
          marginBottom: 10,
        }}
      >
        <span>P/{String(idx + 1).padStart(2, "0")}</span>
      </div>

      <div
        style={{
          font: '600 24px/1.05 var(--font-sans)',
          letterSpacing: ".04em",
          color: "var(--ink)",
        }}
      >
        {project.title}
      </div>

      <div
        style={{
          marginTop: 6,
          font: '500 10px/1.3 var(--font-sans)',
          letterSpacing: ".16em",
          color: "var(--ink-62)",
        }}
      >
        {project.dialMetaLine ?? `${project.year}, ${project.role}`}
      </div>

      <div style={{ marginTop: 14, paddingTop: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        <DialTagPills tags={project.tags} />
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 10,
        }}
      >
        {project.comingSoon ? (
          <span className="dial-coming-soon-cta" role="status">Coming soon</span>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-primary"
              onClick={(e) => { e.stopPropagation(); onOpen(project.id); }}
            >
              View Project
            </button>
            {project.liveSiteUrl ? <LiveSiteLink href={project.liveSiteUrl} /> : null}
          </>
        )}
      </div>
    </div>
  );
}

/* Main component. */
const ORBIT_PAD = 112;
const ACTIVE_PANEL_W = 460;
const HUD_V = 90;
const SAFE_MARGIN = 20;
const MOBILE_DIAL_MAX = 380;

export default function PortfolioDial() {
  const [activeIdx, setActiveIdx] = useState(0);
  const n = PROJECTS.length;
  const accent = ACCENT;

  /* This experiment renders the dial in isolation; "View Project" is
     a no-op (no real case studies to open). Swap this with a router
     push later if it ever becomes the real homepage dial. */
  const openCaseStudy = useCallback((id) => {
    if (typeof window !== "undefined") {
      // eslint-disable-next-line no-console
      console.log("[PortfolioDial demo] open", id);
    }
  }, []);

  const [direction, setDirection] = useState(0);
  const prevActiveRef = useRef(activeIdx);
  useEffect(() => {
    const delta = activeIdx - prevActiveRef.current;
    if (delta !== 0) setDirection(delta > 0 ? 1 : -1);
    prevActiveRef.current = activeIdx;
  }, [activeIdx]);

  /* Track viewport height for vertical sizing AND the container's
     own width (via ResizeObserver below) so the dial fits inside
     whatever column its parent reserves for it, not the whole
     window. */
  const [vp, setVp] = useState({ w: 0, h: 0 });
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const onResize = () =>
      setVp((s) => ({ ...s, h: window.innerHeight }));
    onResize();
    setMounted(true);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = vp.w > 0 && vp.w <= 720;
  const isTabletDial = vp.w > 720 && vp.w <= TABLET_DIAL_MAX_W;
  const dialShift = isMobile ? 0 : ACTIVE_PANEL_W * 0.6;

  let dialSize;
  if (vp.w === 0) {
    dialSize = 220;
  } else if (isMobile) {
    const byW = vp.w * 0.7;
    const byH = vp.h * 0.45;
    dialSize = Math.max(220, Math.min(MOBILE_DIAL_MAX, byW, byH));
  } else {
    const halfW = vp.w / 2;
    const rByLeft = halfW - dialShift - SAFE_MARGIN;
    const rByRight = halfW + dialShift - SAFE_MARGIN - ORBIT_PAD - ACTIVE_PANEL_W;
    const rByH = (vp.h - 2 * HUD_V) / 2;
    const maxRadius = Math.max(180, Math.min(rByLeft, rByRight, rByH));
    const maxDiameter = maxRadius * 2;
    dialSize = Math.min(CONFIG.dialSize, maxDiameter);
  }

  const arcSpread = isTabletDial ? TABLET_ARC_SPREAD : CONFIG.arcSpread;
  const arcRad = (arcSpread * Math.PI) / 180;
  const slotStep = n > 1 ? arcRad / (n - 1) : 0;
  const dialAngle = useTransitionAngle(activeIdx, slotStep);
  const visualAngle = dialAngle;

  const containerRef = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio >= 0.5),
      { threshold: [0, 0.5, 1] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /* Measure the container's actual width and drive the dial's
     sizing from that instead of window.innerWidth. Lets a parent
     restrict the dial to a column width by wrapping it in a
     constrained container. */
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === "number" && w > 0) {
        setVp((s) => (s.w !== w ? { ...s, w } : s));
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const onKey = (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, n - 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCaseStudy(PROJECTS[activeIdx].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [inView, activeIdx, n, openCaseStudy]);

  const active = PROJECTS[activeIdx];

  const touchRef = useRef(null);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, fired: false };
  };
  const onTouchMove = (e) => {
    if (!touchRef.current || touchRef.current.fired) return;
    const t = e.touches[0];
    const dx = t.clientX - touchRef.current.x;
    const dy = t.clientY - touchRef.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      touchRef.current.fired = true;
      if (dx < 0) setActiveIdx((i) => Math.min(i + 1, n - 1));
      else setActiveIdx((i) => Math.max(i - 1, 0));
    }
  };
  const onTouchEnd = () => {
    touchRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={isMobile ? onTouchStart : undefined}
      onTouchMove={isMobile ? onTouchMove : undefined}
      onTouchEnd={isMobile ? onTouchEnd : undefined}
      className="dial-stage"
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans)",
        minHeight: "720px",
      }}
    >
      {mounted && (
        <>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0.35,
              background:
                "radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(26, 24, 21, 0.06))",
            }}
          />

          {isMobile ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 28,
                paddingBottom: 90,
                gap: 32,
                width: "100%",
                minHeight: "100%",
              }}
            >
              <div style={{ position: "relative", width: dialSize, height: dialSize, flexShrink: 0 }}>
                <DotField size={dialSize} angle={visualAngle} />
                <TickRing size={dialSize} accent={accent} hudOn={CONFIG.hudOn} />
                <CenterImage size={Math.round(dialSize * 0.76)} image={active.image} alt={active.title} />
              </div>

              <MobileNavArrows
                activeIdx={activeIdx}
                n={n}
                onPrev={() => setActiveIdx((i) => Math.max(0, i - 1))}
                onNext={() => setActiveIdx((i) => Math.min(n - 1, i + 1))}
              />

              <div style={{ width: "100%" }}>
                <MobileActiveCard
                  project={active}
                  idx={activeIdx}
                  accent={accent}
                  direction={direction}
                  onOpen={openCaseStudy}
                />
              </div>
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% - ${dialShift}px), -50%)`,
                width: dialSize,
                height: dialSize,
              }}
            >
              <DotField size={dialSize} angle={visualAngle} />
              <TickRing size={dialSize} accent={accent} hudOn={CONFIG.hudOn} />
              <CenterImage size={Math.round(dialSize * 0.72)} image={active.image} alt={active.title} />

              <OrbitingHeadings
                projects={PROJECTS}
                activeIdx={activeIdx}
                radius={dialSize / 2 + ORBIT_PAD}
                dialAngle={dialAngle}
                arcSpread={arcSpread}
                accent={accent}
                onSelect={setActiveIdx}
                onOpen={openCaseStudy}
              />

              <NavArrows
                dialSize={dialSize}
                canPrev={activeIdx > 0}
                canNext={activeIdx < n - 1}
                onPrev={() => setActiveIdx((i) => Math.max(0, i - 1))}
                onNext={() => setActiveIdx((i) => Math.min(n - 1, i + 1))}
              />
            </div>
          )}

          {CONFIG.hudOn && <HudFooter accent={accent} activeIdx={activeIdx} n={n} />}
        </>
      )}
    </div>
  );
}
