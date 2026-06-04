/* Cover — utility / archival folder design.
   Each notebook has:
     · a paper palette (6 cardstock variants in PAPER_PALETTES)
     · a left binding strip with two small metal clips
     · a tilted paper tape label top-right with the source reference
     · the title underlined at the bottom
     · 1-3 decorations layered on top (post-its, paper inserts,
       mug rings, doodles) authored per-article in articles.js. */

import styles from "./BookLogCarousel.module.css";

const PAPER_PALETTES = {
  manila: { bg: "#C8B98E", bgDeep: "#B5A77C", ink: "#2A2218", tape: "#F4EDD8" },
  slate:  { bg: "#A8B0BC", bgDeep: "#96A0AC", ink: "#1A1815", tape: "#F1ECDD" },
  moss:   { bg: "#9CAE91", bgDeep: "#88997D", ink: "#1A2010", tape: "#F1ECDD" },
  clay:   { bg: "#B89578", bgDeep: "#A5836A", ink: "#2A1F18", tape: "#F4EDD8" },
  legal:  { bg: "#D7CF8A", bgDeep: "#C2B97A", ink: "#2A2818", tape: "#F8F2DE" },
  ash:    { bg: "#BCBAB2", bgDeep: "#A8A69E", ink: "#1A1815", tape: "#F1ECDD" },
};

const POSTIT_COLORS = {
  yellow: "#FFE57A",
  pink:   "#FFB5C5",
  orange: "#FFC58A",
  mint:   "#B5E5C5",
};

/* RoughDoodle — wraps the doodle paths in a per-instance feTurbulence
   + feDisplacementMap filter so each one has its own wobble pattern.
   Seed comes from the article id so the wobble is stable per book. */
function RoughDoodle({ shape, seed }) {
  const filterId = `rough-${shape}-${seed}`;
  const ink = "currentColor";

  /* The path data is intentionally slightly imperfect; the filter
     adds organic wobble on top. The result reads as drawn without
     a ruler. */
  let paths = null;
  if (shape === "asterisk") {
    paths = (
      <g stroke={ink} strokeWidth="1.6" strokeLinecap="round" fill="none">
        <path d="M 12 3 Q 12.2 12 12 21" />
        <path d="M 3 12 Q 12 12.2 21 12" />
        <path d="M 5 5 Q 12 12.2 19 19" />
        <path d="M 19 5 Q 12 12.2 5 19" />
      </g>
    );
  } else if (shape === "star") {
    paths = (
      <g stroke={ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 12 2.9 L 14.3 9.5 L 21.6 9.7 L 15.8 14.6 L 17.9 21.0 L 12.1 17.2 L 6.2 21.3 L 8.1 14.3 L 2.4 9.6 L 9.4 9.4 Z" />
      </g>
    );
  } else if (shape === "arrow") {
    paths = (
      <g stroke={ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 2.6 18.4 C 6.4 11.4, 11.2 8.1, 20.3 5.9" />
        <path d="M 13.6 3.9 L 20.4 5.8 L 18.2 12.3" />
      </g>
    );
  } else if (shape === "heart") {
    paths = (
      <g stroke={ink} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 12 20.4 C 6.2 16.1, 2.1 12.3, 4 7.2 C 5.5 3.7, 9.8 3.6, 12 6.9 C 14.2 3.5, 18.5 3.8, 20 7.1 C 22 12.2, 17.9 16 12 20.4 Z" />
      </g>
    );
  } else {
    return null;
  }

  return (
    <svg viewBox="0 0 24 24">
      <defs>
        {/* feTurbulence creates pseudo-random noise; feDisplacementMap
            uses it to push the path pixels around in two dimensions,
            giving the strokes a natural shaky hand feel. Seed is
            stable per book so the wobble doesn't change on re-render. */}
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.08"
            numOctaves="2"
            seed={seed}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="1.5"
          />
        </filter>
      </defs>
      <g filter={`url(#${filterId})`}>{paths}</g>
    </svg>
  );
}

/* MugRing — three variants so books with mug rings don't all stamp
   the same. Author picks variant in articles.js (default: "a"). */
function MugRing({ variant = "a" }) {
  const stroke = "rgba(89, 53, 27, 0.32)";

  if (variant === "b") {
    /* Variant B — two distinct rings, weak top arc, no drip. */
    return (
      <svg viewBox="0 0 40 40" fill="none" stroke={stroke} strokeLinecap="round">
        <ellipse cx="20.5" cy="20" rx="16.2" ry="17.1" strokeWidth="1.8" />
        <ellipse cx="18" cy="22" rx="15" ry="15.4" strokeWidth="1.2" opacity="0.55" />
        <path d="M 9 8 Q 13 6 17 7" strokeWidth="1.1" opacity="0.45" />
      </svg>
    );
  }

  if (variant === "c") {
    /* Variant C — strong bottom arc + faint upper sweep, no full ring. */
    return (
      <svg viewBox="0 0 40 40" fill="none" stroke={stroke} strokeLinecap="round">
        <path d="M 4 18 Q 6 30 14 35 Q 26 38 34 30 Q 38 22 35 14" strokeWidth="1.9" />
        <path d="M 8 14 Q 14 6 22 5" strokeWidth="1.2" opacity="0.55" />
        <path d="M 32 9 q 1.5 1.5 0.6 3" strokeWidth="1.1" opacity="0.6" />
      </svg>
    );
  }

  /* Variant A (default) — main ring + ghost arc on left + drip bottom-right. */
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke={stroke} strokeLinecap="round">
      <ellipse cx="20" cy="20.5" rx="17.4" ry="16.4" strokeWidth="2" />
      <path d="M 6 13 Q 4.4 24 13 33" strokeWidth="1.4" opacity="0.65" />
      <path d="M 31 32 q 1.5 1 1 2.2" strokeWidth="1.2" opacity="0.6" />
    </svg>
  );
}

function Decoration({ deco, seed }) {
  const transform = deco.rotate ? `rotate(${deco.rotate}deg)` : undefined;
  const baseStyle = { ...(deco.style || {}), transform };

  switch (deco.type) {
    case "postit": {
      const bg = POSTIT_COLORS[deco.color] || POSTIT_COLORS.yellow;
      return (
        <span
          className={styles.postit}
          style={{ ...baseStyle, "--postit-bg": bg }}
          aria-hidden="true"
        />
      );
    }
    case "paper-out": {
      const sideClass =
        deco.side === "top"
          ? styles.paperOutTop
          : deco.side === "right"
            ? styles.paperOutRight
            : styles.paperOutBottom;
      return (
        <span
          className={`${styles.paperOut} ${sideClass}`}
          style={baseStyle}
          aria-hidden="true"
        />
      );
    }
    case "mug-ring":
      return (
        <span className={styles.mugRing} style={baseStyle} aria-hidden="true">
          <MugRing variant={deco.variant} />
        </span>
      );
    case "doodle":
      return (
        <span className={styles.doodle} style={baseStyle} aria-hidden="true">
          <RoughDoodle shape={deco.shape} seed={seed} />
        </span>
      );
    default:
      return null;
  }
}

export default function Cover({ article }) {
  const { id, title, part, author, section, paper, decorations = [] } = article;
  const palette = PAPER_PALETTES[paper] || PAPER_PALETTES.slate;
  /* Stable numeric seed for filters that need one (rough-doodle). */
  const seed = parseInt(id, 10) || 1;

  const coverStyle = {
    "--cover-bg":       palette.bg,
    "--cover-bg-deep":  palette.bgDeep,
    "--cover-ink":      palette.ink,
    "--cover-tape-bg":  palette.tape,
    "--cover-tape-ink": palette.ink,
  };

  const paperOuts = decorations.filter((d) => d.type === "paper-out");
  const overlays  = decorations.filter((d) => d.type !== "paper-out");

  return (
    <div className={styles.coverContainer}>
      {paperOuts.map((deco, i) => (
        <Decoration key={`po-${i}`} deco={deco} seed={seed} />
      ))}

      <div className={styles.cover} style={coverStyle}>
        <span className={styles.grain} aria-hidden="true" />

        <div className={styles.binding} aria-hidden="true">
          <span className={styles.clip} />
          <span className={styles.clip} />
        </div>

        <div className={styles.tape}>
          <span className={styles.tapeText}>
            {section} · by {author}
          </span>
        </div>

        <div className={styles.titleBlock}>
          <p className={styles.title}>
            {part ? `${part}: ` : ""}
            {title}
          </p>
        </div>

        {overlays.map((deco, i) => (
          <Decoration key={`o-${i}`} deco={deco} seed={seed} />
        ))}
      </div>
    </div>
  );
}
