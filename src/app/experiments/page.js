import Link from "next/link";
import styles from "./page.module.css";
import { EXPERIMENTS as EXPERIMENT_META } from "@/lib/experiments";

export const metadata = {
  title: "Experiments — Harry Spawforth",
  description: "A scratchpad of things I'm building and shipping on the side.",
};

/* ─── Thumbnails ─────────────────────────────────────────────
   Pure SVG glyphs that hint at each experiment without running
   the live component. */

function DialThumbnail() {
  /* Round trig results so server and client emit the same strings
     (IEEE 754 last-bit drift would otherwise trip hydration). */
  const f = (n) => n.toFixed(3);
  return (
    <svg viewBox="0 0 200 120" className={styles.thumbSvg}>
      <g transform="translate(70 60)">
        <circle r="42" fill="none" stroke="var(--ink)" strokeWidth="1" opacity="0.6" />
        <circle r="32" fill="none" stroke="var(--ink-mute)" strokeWidth="0.6" />
        <circle r="22" fill="var(--paper-deep)" />
        {Array.from({ length: 24 }).map((_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 42;
          const r2 = i % 4 === 0 ? 36 : 39;
          return (
            <line
              key={i}
              x1={f(r1 * Math.cos(a))}
              y1={f(r1 * Math.sin(a))}
              x2={f(r2 * Math.cos(a))}
              y2={f(r2 * Math.sin(a))}
              stroke="var(--ink-mute)"
              strokeWidth="0.6"
            />
          );
        })}
        <line x1="32" y1="0" x2="50" y2="0" stroke="var(--accent)" strokeWidth="1.2" />
        <circle cx="50" cy="0" r="2.4" fill="var(--accent)" />
      </g>
      <g
        transform="translate(120 30)"
        fontFamily="var(--font-sans)"
        fontSize="6"
        fill="var(--ink-mute)"
        letterSpacing="0.1em"
      >
        <text y="0">P/01</text>
        <text y="14" fontSize="9" fill="var(--ink)" fontWeight="600">Atlas</text>
        <text y="28">2026, PRODUCT</text>
      </g>
    </svg>
  );
}

function NotebookThumbnail() {
  /* Five leaning book spines in the Notebook category colours,
     standing on a hairline shelf rule. */
  const spines = [
    { c: "#2a2a3a", lean: -3 },
    { c: "#3d5a4a", lean: 1.5 },
    { c: "#b24a37", lean: -1 },
    { c: "#c69a52", lean: 2 },
    { c: "#3a4a7a", lean: -2.5 },
  ];
  return (
    <svg viewBox="0 0 200 120" className={styles.thumbSvg}>
      {spines.map((s, i) => (
        <g key={i} transform={`translate(${24 + i * 32} 96) rotate(${s.lean})`}>
          <rect x="-8" y="-72" width="16" height="72" fill={s.c} />
          <rect x="-8" y="-72" width="16" height="6" fill={s.c} opacity="0.7" />
        </g>
      ))}
      <line x1="14" y1="100" x2="186" y2="100" stroke="var(--ink)" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function BookLogThumbnail() {
  return (
    <svg viewBox="0 0 200 120" className={styles.thumbSvg}>
      {[
        { x: 20, hue: 32, l: 0.62 },
        { x: 64, hue: 220, l: 0.58 },
        { x: 108, hue: 88, l: 0.55 },
        { x: 152, hue: 18, l: 0.48 },
      ].map((b, i) => (
        <g key={i} transform={`translate(${b.x} 16)`}>
          <rect
            x="0" y="0" width="34" height="78"
            fill={`oklch(${b.l * 100}% 0.06 ${b.hue})`}
            stroke="var(--ink-mute)"
            strokeWidth="0.5"
          />
          <line x1="6" y1="2" x2="6" y2="76" stroke="var(--ink-mute)" strokeWidth="0.3" />
          {Array.from({ length: 5 }).map((_, p) => (
            <circle key={p} cx="3" cy={6 + p * 14} r="0.8" fill="var(--paper-deep)" />
          ))}
          <text
            x="17" y="50"
            fontFamily="var(--font-sans)"
            fontSize="5.5"
            fill={b.l > 0.55 ? "#1A1815" : "#ECEAE5"}
            textAnchor="middle"
          >
            NO.0{i + 1}
          </text>
        </g>
      ))}
    </svg>
  );
}

function StackThumbnail() {
  return (
    <svg viewBox="0 0 200 120" className={styles.thumbSvg}>
      <defs>
        <linearGradient id="stack-card-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6FA8DC" />
          <stop offset="100%" stopColor="#3D85C6" />
        </linearGradient>
        <linearGradient id="stack-card-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93C47D" />
          <stop offset="100%" stopColor="#6AA84F" />
        </linearGradient>
        <linearGradient id="stack-card-3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E69138" />
          <stop offset="100%" stopColor="#B45F06" />
        </linearGradient>
      </defs>
      <g transform="translate(30 30) skewY(-8)">
        <rect x="0" y="0" width="60" height="46" rx="4" fill="url(#stack-card-3)" opacity="0.55" />
      </g>
      <g transform="translate(50 26) skewY(-5)">
        <rect x="0" y="0" width="70" height="54" rx="4" fill="url(#stack-card-2)" opacity="0.8" />
      </g>
      <g transform="translate(78 22)">
        <rect x="0" y="0" width="92" height="72" rx="6" fill="url(#stack-card-1)" />
      </g>
    </svg>
  );
}

function MetallicThumbnail() {
  return (
    <svg viewBox="0 0 200 120" className={styles.thumbSvg}>
      <defs>
        <radialGradient id="metal" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#f6f0d6" />
          <stop offset="35%" stopColor="#c9a14a" />
          <stop offset="70%" stopColor="#5b3a13" />
          <stop offset="100%" stopColor="#1a1815" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="200" height="120" fill="#0a0a0a" />
      <g transform="translate(100 60)">
        <rect x="-48" y="-32" width="96" height="64" rx="6" fill="url(#metal)" />
        <rect x="-48" y="-32" width="96" height="64" rx="6" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
      </g>
      <circle cx="92" cy="106" r="2" fill="#fff" opacity="0.8" />
      <circle cx="100" cy="106" r="2" fill="#fff" opacity="0.4" />
      <circle cx="108" cy="106" r="2" fill="#fff" opacity="0.4" />
    </svg>
  );
}

function SoundsThumbnail() {
  return (
    <svg viewBox="0 0 200 120" className={styles.thumbSvg}>
      <g
        transform="translate(100 60)"
        stroke="var(--ink)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      >
        <path d="M -80 0 Q -60 -22 -40 0 T 0 0 T 40 0 T 80 0" opacity="0.85" />
        <path d="M -80 0 Q -60 -14 -40 0 T 0 0 T 40 0 T 80 0" opacity="0.45" transform="translate(0 12)" />
        <path d="M -80 0 Q -60 -8 -40 0 T 0 0 T 40 0 T 80 0" opacity="0.25" transform="translate(0 22)" />
      </g>
      <g transform="translate(100 100)" fill="var(--ink-mute)">
        {[-30, -18, -6, 6, 18, 30].map((x, i) => (
          <circle
            key={i}
            cx={x}
            cy="0"
            r={i === 2 ? 3 : 2}
            fill={i === 2 ? "var(--accent)" : "var(--ink-mute)"}
          />
        ))}
      </g>
    </svg>
  );
}

function CometThumbnail() {
  /* Static SVG hint at the comet: a rectangle frame with a bright
     leading dot and a fading trail trailing back along the top
     edge. No animation in the thumbnail — keeps the hub page calm
     and reserves the motion for the experiment itself. */
  const TRAIL = Array.from({ length: 14 }, (_, i) => {
    const t = i / 14;
    const fade = Math.pow(t, 1.4);
    return {
      x: +(150 - i * 8).toFixed(2),
      r: +(2.6 - 2.2 * fade).toFixed(3),
      opacity: +(1 - fade).toFixed(3),
    };
  });
  return (
    <svg viewBox="0 0 200 120" className={styles.thumbSvg}>
      <rect
        x="20"
        y="20"
        width="160"
        height="80"
        fill="none"
        stroke="var(--ink-mute)"
        strokeWidth="0.8"
        opacity="0.6"
      />
      {TRAIL.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={20}
          r={p.r}
          fill="var(--accent)"
          opacity={p.opacity}
        />
      ))}
    </svg>
  );
}

/* Pair each experiment's metadata with its visual thumbnail. The
   metadata comes from /lib/experiments.js (shared with the Sidebar
   + each experiment's page), the thumbnails are only used here. */
const THUMBNAILS = {
  metallic: MetallicThumbnail,
  stack: StackThumbnail,
  booklog: BookLogThumbnail,
  notebook: NotebookThumbnail,
  dial: DialThumbnail,
  sounds: SoundsThumbnail,
  comet: CometThumbnail,
};
const EXPERIMENTS = EXPERIMENT_META.map((e) => ({
  ...e,
  Thumbnail: THUMBNAILS[e.slug],
}));

export default function ExperimentsPage() {
  return (
    <main className="page">
      <article className="col case-study">
        <div className="case-study__eyebrow">Scratchpad</div>
        <h1 className="case-study__title">Experiments</h1>
        <p className="case-study__lede">
          A landing pad for the half-finished, the just-shipped, and the
          weird-on-purpose. More to come.
        </p>

        <ul className={styles.list}>
          {EXPERIMENTS.map((e) => {
            const Thumb = e.Thumbnail;
            return (
              <li key={e.href}>
                <Link href={e.href} className={styles.entry}>
                  <div className={styles.entryGrid}>
                    <div className={styles.thumb} aria-hidden="true">
                      <Thumb />
                    </div>
                    <div className={styles.entryBody}>
                      <div className={styles.entryHead}>
                        <span className={styles.entryTag}>{e.tag}</span>
                        <h2 className={styles.entryTitle}>{e.title}</h2>
                        {e.meta && <span className={styles.entryMeta}>{e.meta}</span>}
                      </div>
                      <p className={styles.entryDesc}>{e.description}</p>
                      <span className={styles.entryArrow}>
                        Open experiment
                        <svg
                          viewBox="0 0 16 16"
                          width="12"
                          height="12"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="3" y1="8" x2="13" y2="8" />
                          <polyline points="9 4 13 8 9 12" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </article>
    </main>
  );
}
