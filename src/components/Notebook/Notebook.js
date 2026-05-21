"use client";

/* Notebook — a shelf of articles, presented as books.
   ----------------------------------------------------
   Same physical metaphor as the original BookLog carousel, but here
   the data model is articles: each "book" represents a single piece
   of writing. Category drives color, smart abbreviation drives the
   spine title, and opening a book reveals a magazine-style two-column
   accordion below the shelf.

   Ported from a Framer source. Framer + property controls removed,
   types stripped, defaults baked into the function signature. */

import * as React from "react";

// ─── Categories — the source of truth for per-article colors ──

const CATEGORIES = {
  philosophy: {
    label: "Philosophy",
    spine: "#2a2a3a",
    c0: "#2a2a3a",
    c1: "#13131c",
    accent: "#e7d8b8",
  },
  strategy: {
    label: "Strategy",
    spine: "#3d5a4a",
    c0: "#3d5a4a",
    c1: "#1f3027",
    accent: "#f1ece2",
  },
  "ai-and-technology": {
    label: "AI & Technology",
    spine: "#b24a37",
    c0: "#b24a37",
    c1: "#7a2e1f",
    accent: "#f6d27b",
  },
  "business-and-product": {
    label: "Business & Product",
    spine: "#c69a52",
    c0: "#c69a52",
    c1: "#8a6b35",
    accent: "#1b1424",
  },
  research: {
    label: "Research",
    spine: "#3a4a7a",
    c0: "#3a4a7a",
    c1: "#1f2a55",
    accent: "#cfd9ff",
  },
};

// ─── Spine font palette ───────────────────────────────────────

const SPINE_FONTS = {
  fraunces: {
    family: `"Fraunces", Georgia, serif`,
    transform: "none",
    italic: true,
    weight: 700,
    letterSpacing: 1.2,
    sizeMultiplier: 1,
    googleSpec: "Fraunces:ital,wght@0,700;1,700",
  },
  "instrument-serif": {
    family: `"Instrument Serif", Georgia, serif`,
    transform: "none",
    italic: true,
    weight: 400,
    letterSpacing: 0.8,
    sizeMultiplier: 1.15,
    googleSpec: "Instrument+Serif:ital@0;1",
  },
  "dm-serif-display": {
    family: `"DM Serif Display", Georgia, serif`,
    transform: "none",
    italic: false,
    weight: 400,
    letterSpacing: 0.6,
    sizeMultiplier: 1.05,
    googleSpec: "DM+Serif+Display:ital@0;1",
  },
  "space-grotesk": {
    family: `"Space Grotesk", system-ui, sans-serif`,
    transform: "uppercase",
    italic: false,
    weight: 600,
    letterSpacing: 2,
    sizeMultiplier: 0.85,
    googleSpec: "Space+Grotesk:wght@400;500;600;700",
  },
  geist: {
    family: `"Geist", system-ui, sans-serif`,
    transform: "uppercase",
    italic: false,
    weight: 600,
    letterSpacing: 2.2,
    sizeMultiplier: 0.82,
    googleSpec: "Geist:wght@400;500;600;700",
  },
  "jetbrains-mono": {
    family: `"JetBrains Mono", "SF Mono", monospace`,
    transform: "uppercase",
    italic: false,
    weight: 500,
    letterSpacing: 1.6,
    sizeMultiplier: 0.8,
    googleSpec: "JetBrains+Mono:wght@400;500;600;700",
  },
};

const SPINE_FONT_KEYS = Object.keys(SPINE_FONTS);

function spineFontFor(article, idx) {
  const key =
    article.font && article.font in SPINE_FONTS
      ? article.font
      : SPINE_FONT_KEYS[idx % SPINE_FONT_KEYS.length];
  return SPINE_FONTS[key];
}

// ─── Smart spine-title abbreviation ───────────────────────────

const STOPWORDS = new Set([
  "a", "an", "the", "and", "or", "of", "for", "to", "on", "in", "at",
  "by", "with", "from", "as", "is", "are", "be", "this", "that", "these",
  "those", "it",
]);

function abbreviateForSpine(title, max = 3) {
  const words = title.split(/\s+/).filter(Boolean);
  if (words.length <= max) return title;

  const meaningful = [];
  for (const w of words) {
    if (meaningful.length >= max) break;
    const stripped = w.toLowerCase().replace(/[^a-z]/g, "");
    if (STOPWORDS.has(stripped)) continue;
    meaningful.push(w);
  }
  if (meaningful.length === max) return meaningful.join(" ");
  return words.slice(0, max).join(" ");
}

function spineTitleOf(article) {
  return article.spineTitle || abbreviateForSpine(article.title);
}

// ─── Shelf rule ───────────────────────────────────────────────

function ShelfRule({ color, tickCount, tickHeight, strokeWidth = 2.5, softness = 0.55, style }) {
  const W = 1000;
  const lineY = strokeWidth / 2 + 1;
  const tickTop = lineY + strokeWidth / 2;
  const H = tickTop + tickHeight + strokeWidth / 2 + 1;

  return (
    <div style={{ width: "100%", height: H + 4, ...style }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        width="100%"
        height={H}
        style={{ display: "block" }}
      >
        <line
          x1={strokeWidth / 2}
          y1={lineY}
          x2={W - strokeWidth / 2}
          y2={lineY}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          opacity={softness}
          vectorEffect="non-scaling-stroke"
        />
        {Array.from({ length: tickCount }).map((_, i) => {
          const x = ((i + 1) / (tickCount + 1)) * W;
          return (
            <line
              key={i}
              x1={x}
              y1={tickTop}
              x2={x}
              y2={tickTop + tickHeight}
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              opacity={softness}
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Procedural cover ─────────────────────────────────────────

function CoverSVG({ article, coverW, bookH }) {
  const cat = CATEGORIES[article.category] || CATEGORIES.philosophy;
  const glyph = (article.title.charAt(0) || "?").toUpperCase();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${coverW} ${bookH}`}
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <rect width={coverW} height={bookH} fill={cat.c0} />
      <rect x={0} y={0} width={coverW} height={bookH * 0.18} fill={cat.c1} opacity={0.6} />
      <circle
        cx={coverW / 2}
        cy={bookH * 0.42}
        r={48}
        fill="none"
        stroke={cat.accent}
        strokeWidth={1.5}
        opacity={0.35}
      />
      <text
        x={coverW / 2}
        y={bookH * 0.495}
        textAnchor="middle"
        fontFamily="Fraunces, Georgia, serif"
        fontStyle="italic"
        fontSize={68}
        fontWeight={700}
        fill={cat.accent}
        opacity={0.95}
      >
        {glyph}
      </text>
      <rect x={0} y={bookH - 44} width={coverW} height={44} fill={cat.c1} />
      <text
        x={14}
        y={bookH - 16}
        fontFamily="Inter, sans-serif"
        fontSize={8}
        fontWeight={700}
        letterSpacing={2.4}
        fill={cat.accent}
        opacity={0.85}
      >
        {cat.label.toUpperCase()}
      </text>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────

export default function Notebook({
  articles = DEFAULT_ARTICLES,
  bgColor = "#F3F6F6",
  fgColor = "#1a2330",
  accentColor = "#b2562e",
  bookHeight = 280,
  spineWidth = 60,
  coverWidth = 200,
} = {}) {
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const [hoverIdx, setHoverIdx] = React.useState(null);
  const [visited, setVisited] = React.useState(() => new Set());

  const viewportRef = React.useRef(null);
  const rowRef = React.useRef(null);

  const reactId = React.useId().replace(/:/g, "");
  const filterId = `notebook-grain-${reactId}`;
  const scrollbarClass = `notebook-scroll-${reactId}`;

  const markVisited = React.useCallback((i) => {
    setVisited((set) => {
      if (set.has(i)) return set;
      const next = new Set(set);
      next.add(i);
      return next;
    });
  }, []);

  const toggle = React.useCallback(
    (i) => {
      setActiveIdx((prev) => {
        if (prev === i) return -1;
        markVisited(i);
        return i;
      });
    },
    [markVisited],
  );

  const goPrev = React.useCallback(() => {
    setActiveIdx((prev) => {
      if (prev <= 0) return prev;
      const next = prev - 1;
      markVisited(next);
      return next;
    });
  }, [markVisited]);

  const goNext = React.useCallback(() => {
    setActiveIdx((prev) => {
      if (prev === -1 || prev >= articles.length - 1) return prev;
      const next = prev + 1;
      markVisited(next);
      return next;
    });
  }, [articles.length, markVisited]);

  /* Center the opened article. */
  React.useEffect(() => {
    if (activeIdx === -1) return;
    const row = rowRef.current;
    if (!row) return;
    const wrap = row.children[activeIdx];
    if (!wrap) return;
    wrap.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeIdx]);

  /* Keyboard navigation. */
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && activeIdx !== -1) {
        setActiveIdx(-1);
        return;
      }
      if (activeIdx === -1) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIdx, goNext, goPrev]);

  /* Inject Google Fonts once per page. */
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    const id = "notebook-google-fonts";
    if (document.getElementById(id)) return;
    const families = SPINE_FONT_KEYS.map(
      (k) => `family=${SPINE_FONTS[k].googleSpec}`,
    ).join("&");
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
    document.head.appendChild(link);
  }, []);

  const active = activeIdx !== -1 ? articles[activeIdx] : null;
  const activeCategory = active
    ? CATEGORIES[active.category] || CATEGORIES.philosophy
    : null;

  /* Deterministic per-book lean for organic shelf feel. */
  const leanFor = (i) =>
    Math.sin(i * 2.4 + 0.8) * 2.4 + Math.cos(i * 1.1 + 0.3) * 1.2;

  return (
    <div
      style={{
        background: bgColor,
        color: fgColor,
        fontFamily: "Inter, system-ui, sans-serif",
        width: "100%",
        padding: "80px 32px 96px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Hidden SVG filter for paper grain */}
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={8} />
            <feDiffuseLighting lightingColor="white" surfaceScale={1}>
              <feDistantLight azimuth={45} elevation={35} />
            </feDiffuseLighting>
          </filter>
        </defs>
      </svg>

      {/* Shelf */}
      <div style={{ position: "relative", maxWidth: 960, margin: "0 auto" }}>
        <div
          ref={viewportRef}
          className={scrollbarClass}
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            paddingTop: 28,
            paddingBottom: 16,
          }}
        >
          <div
            ref={rowRef}
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 24,
              width: "max-content",
            }}
          >
            {articles.map((article, i) => {
              const isOpen = i === activeIdx;
              const isHovered = i === hoverIdx;
              const cat = CATEGORIES[article.category] || CATEGORIES.philosophy;
              const lean = leanFor(i);
              const font = spineFontFor(article, i);
              const spineLabel = spineTitleOf(article);

              const hoverLift = !isOpen && isHovered ? -6 : 0;
              const hoverUntilt = !isOpen && isHovered ? lean * 0.55 : lean;
              const inColor = isHovered || isOpen || visited.has(i);

              return (
                <div
                  key={article.id ?? i}
                  style={{
                    flexShrink: 0,
                    position: "relative",
                    transformOrigin: "bottom center",
                    transform: isOpen
                      ? "translateY(0) rotateZ(0deg)"
                      : `translateY(${hoverLift}px) rotateZ(${hoverUntilt}deg)`,
                    transition: "transform 360ms cubic-bezier(0.22,0.61,0.36,1)",
                    padding: 8,
                    margin: -8,
                  }}
                  onMouseEnter={() => setHoverIdx(i)}
                  onMouseLeave={() =>
                    setHoverIdx((p) => (p === i ? null : p))
                  }
                >
                  {/* Hover shadow */}
                  <div
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "5%",
                      right: "5%",
                      bottom: 6,
                      height: 12,
                      borderRadius: "50%",
                      background: `radial-gradient(
                        ellipse at center,
                        ${fgColor}80 0%,
                        ${fgColor}30 50%,
                        transparent 80%
                      )`,
                      filter: "blur(3px)",
                      opacity: !isOpen && isHovered ? 1 : 0,
                      transform:
                        !isOpen && isHovered ? "scaleX(1.05)" : "scaleX(0.85)",
                      transition: "opacity 280ms ease, transform 280ms ease",
                      pointerEvents: "none",
                      zIndex: 0,
                    }}
                  />
                  <button
                    onClick={() => toggle(i)}
                    aria-label={`Open ${article.title}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-end",
                      border: "none",
                      background: "none",
                      padding: 0,
                      cursor: "pointer",
                      outline: "none",
                      width: isOpen ? spineWidth + coverWidth : spineWidth,
                      perspective: 1000,
                      transition:
                        "width 500ms cubic-bezier(0.22,0.61,0.36,1)",
                    }}
                  >
                    {/* Spine */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: spineWidth,
                        height: bookHeight,
                        position: "relative",
                        overflow: "hidden",
                        transformOrigin: "right center",
                        transform: isOpen ? "rotateY(-60deg)" : "rotateY(0deg)",
                        transformStyle: "preserve-3d",
                        transition:
                          "transform 500ms cubic-bezier(0.22,0.61,0.36,1)",
                        boxShadow: inColor ? "none" : `inset 0 0 0 1px ${fgColor}`,
                        background: bgColor,
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: cat.spine,
                          opacity: inColor ? 1 : 0,
                          transition:
                            "opacity 400ms cubic-bezier(0.22,0.61,0.36,1)",
                          pointerEvents: "none",
                          zIndex: 1,
                        }}
                      />
                      {inColor && (
                        <span
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "white",
                            opacity: 0.18,
                            filter: `url(#${filterId})`,
                            pointerEvents: "none",
                            zIndex: 2,
                            mixBlendMode: "overlay",
                          }}
                        />
                      )}
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          zIndex: 3,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "16px 0",
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          fontFamily: font.family,
                          fontStyle: font.italic ? "italic" : "normal",
                          fontSize: 18 * font.sizeMultiplier,
                          fontWeight: font.weight,
                          letterSpacing: font.letterSpacing,
                          textTransform: font.transform,
                          whiteSpace: "nowrap",
                          userSelect: "none",
                          color: inColor ? cat.accent : fgColor,
                          textShadow: inColor
                            ? "0 1px 2px rgba(0,0,0,0.3)"
                            : "none",
                          transition:
                            "color 400ms cubic-bezier(0.22,0.61,0.36,1)",
                        }}
                      >
                        {spineLabel}
                      </span>
                    </div>
                    {/* Cover */}
                    <div
                      style={{
                        flexShrink: 0,
                        width: coverWidth,
                        height: bookHeight,
                        position: "relative",
                        overflow: "hidden",
                        transformOrigin: "left center",
                        transform: isOpen ? "rotateY(30deg)" : "rotateY(88.8deg)",
                        transformStyle: "preserve-3d",
                        filter: "brightness(0.9) contrast(1.4)",
                        transition:
                          "transform 500ms cubic-bezier(0.22,0.61,0.36,1)",
                      }}
                    >
                      <CoverSVG article={article} coverW={coverWidth} bookH={bookHeight} />
                      <span
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "white",
                          opacity: 0.18,
                          filter: `url(#${filterId})`,
                          pointerEvents: "none",
                          zIndex: 2,
                        }}
                      />
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <ShelfRule
          color={fgColor}
          tickCount={0}
          tickHeight={0}
          strokeWidth={2.5}
          style={{ marginTop: 6 }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            marginTop: 22,
            opacity: active ? 1 : 0,
            pointerEvents: active ? "auto" : "none",
            transition: "opacity 0.3s ease",
          }}
        >
          <button
            onClick={goPrev}
            disabled={activeIdx <= 0}
            aria-label="Previous article"
            style={stepArrowStyle(activeIdx > 0, accentColor, bgColor, fgColor)}
          >
            ‹
          </button>
          <button
            onClick={goNext}
            disabled={activeIdx >= articles.length - 1}
            aria-label="Next article"
            style={stepArrowStyle(activeIdx < articles.length - 1, accentColor, bgColor, fgColor)}
          >
            ›
          </button>
        </div>
      </div>

      {/* Magazine-layout review accordion */}
      <div
        aria-hidden={!active}
        style={{
          display: "grid",
          gridTemplateRows: active ? "1fr" : "0fr",
          transition: "grid-template-rows 500ms cubic-bezier(0.22,0.61,0.36,1)",
          maxWidth: 880,
          margin: "0 auto",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          {active && activeCategory && (
            <article
              key={activeIdx}
              style={{
                padding: "56px 0 16px",
                animation:
                  "notebook-card-in 0.45s cubic-bezier(0.22,0.61,0.36,1) both",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: 18,
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  fontWeight: 700,
                }}
              >
                <span style={{ color: activeCategory.spine }}>{activeCategory.label}</span>
                {active.readingTime ? (
                  <span style={{ color: `${fgColor}88` }}>
                    {active.readingTime} min read
                  </span>
                ) : null}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1fr)",
                  gap: "min(8vw, 64px)",
                  alignItems: "start",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontFamily: "Fraunces, Georgia, serif",
                      fontStyle: "italic",
                      fontWeight: 700,
                      fontSize: "clamp(34px, 4.6vw, 56px)",
                      lineHeight: 1.05,
                      letterSpacing: -0.5,
                      margin: 0,
                      color: fgColor,
                    }}
                  >
                    {active.title}
                  </h2>

                  {active.pullQuote && (
                    <blockquote
                      style={{
                        fontFamily: "Fraunces, Georgia, serif",
                        fontStyle: "italic",
                        fontWeight: 500,
                        fontSize: "clamp(18px, 1.6vw, 22px)",
                        lineHeight: 1.4,
                        margin: "28px 0 0",
                        paddingLeft: 18,
                        borderLeft: `2px solid ${activeCategory.spine}`,
                        color: `${fgColor}cc`,
                      }}
                    >
                      &ldquo;{active.pullQuote}&rdquo;
                    </blockquote>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 24,
                    paddingTop: 8,
                  }}
                >
                  <p
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      color: `${fgColor}b3`,
                      margin: 0,
                      maxWidth: 360,
                    }}
                  >
                    {active.summary}
                  </p>

                  {active.link && (
                    <a
                      href={active.link}
                      style={{
                        alignSelf: "flex-start",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "12px 22px",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        textDecoration: "none",
                        color: bgColor,
                        background: activeCategory.spine,
                        borderRadius: 999,
                        transition: "transform 0.2s ease",
                      }}
                    >
                      Read article
                      <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          )}
        </div>
      </div>

      <style>{`
        @keyframes notebook-card-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        .${scrollbarClass} {
          scrollbar-width: thin;
          scrollbar-color: ${fgColor}55 transparent;
        }
        .${scrollbarClass}::-webkit-scrollbar {
          height: 6px;
          background: transparent;
        }
        .${scrollbarClass}::-webkit-scrollbar-track {
          background: ${fgColor}15;
          border-radius: 3px;
        }
        .${scrollbarClass}::-webkit-scrollbar-thumb {
          background: ${fgColor}55;
          border-radius: 3px;
        }
        .${scrollbarClass}::-webkit-scrollbar-thumb:hover {
          background: ${accentColor};
        }
      `}</style>
    </div>
  );
}

function stepArrowStyle(enabled, accent, bg, fg) {
  return {
    width: 36,
    height: 36,
    borderRadius: "50%",
    border: `1px solid ${fg}30`,
    background: bg,
    color: fg,
    fontSize: 20,
    lineHeight: 1,
    padding: 0,
    cursor: enabled ? "pointer" : "default",
    opacity: enabled ? 1 : 0.35,
    transition:
      "background 0.2s, color 0.2s, opacity 0.2s, border-color 0.2s",
  };
}

const DEFAULT_ARTICLES = [
  {
    id: "philosophy",
    title: "Design philosophy for data navigation",
    category: "philosophy",
    readingTime: 6,
    summary:
      "Notes on the principles I lean on when designing tools for navigating dense, high-stakes data — progressive disclosure, hierarchy, and the case for skeuomorphic familiarity.",
    pullQuote:
      "I design therefore I am, and I use paradigms to take on challenging, complex problems on their own terms.",
    link: "#",
    font: "instrument-serif",
  },
  {
    id: "strategy",
    title: "Strategy as an act of subtraction",
    category: "strategy",
    readingTime: 5,
    summary:
      "Why the hardest part of product strategy is deciding what not to build, and how I use a small set of forcing constraints to get teams to the right answer.",
    link: "#",
    font: "fraunces",
  },
  {
    id: "ai-and-technology",
    title: "AI & technology in everyday tools",
    category: "ai-and-technology",
    readingTime: 7,
    summary:
      "How modern AI changes the surface of the products we use every day, and why the design discipline of restraint matters more, not less, in an era of automation.",
    pullQuote:
      "The model isn't the product. The product is the conversation between the user and the model.",
    link: "#",
    font: "space-grotesk",
  },
  {
    id: "business-and-product",
    title: "Business and product, two sides of the same brief",
    category: "business-and-product",
    readingTime: 4,
    summary:
      "A short essay on collapsing the wall between commercial and product thinking. The best decisions sit on both sides of the line at once.",
    link: "#",
    font: "dm-serif-display",
  },
  {
    id: "research",
    title: "Research as raw material",
    category: "research",
    readingTime: 6,
    summary:
      "What I've learned from running design research at scale: the most useful insights come from looking at the same thing repeatedly until it stops being familiar.",
    link: "#",
    font: "geist",
  },
];
