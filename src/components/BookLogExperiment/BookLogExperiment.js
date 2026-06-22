"use client";

/* BookLog carousel — ported as an experiment.
   ---------------------------------------------
   A utility/HUD-style horizontal carousel of magazine-style "books".
   Active card is in colour with a pulsing accent rim; peeked cards
   on the right are desaturated and fade out. A scalebar below the
   track acts as a major/minor tick navigator. The active card's
   excerpt panel cross-fades in below. Arrow keys + click peeks +
   prev/next buttons all rotate focus.

   Kept self-contained: data and SVG insignia live in this file. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./BookLogExperiment.module.css";

/* Scenario: a shelf of operator's / service manuals for iconic equipment. */
const ARTICLES = [
  {
    id: "001", num: "001",
    title: "Hasselblad 500C/M",
    subtitle: "Operator's manual — loading, metering, the V-system",
    author: "Victor Hasselblad AB",
    issue: "VOL.07 / ISSUE 04",
    date: "1972.04.18",
    readtime: "48 PP",
    section: "OPERATION",
    excerpt:
      "Before loading, confirm the magazine dark slide is withdrawn only with the body attached. Cock the shutter with the winding crank, set the lens to the metered aperture, and compose on the ground glass. The mirror returns on wind, not release — keep the slide closed between exposures.",
    cover: { hue: 32, chroma: 0.04, lightness: 0.62 },
    coords: "57.70 N / 11.97 E", field: "OP_04", revision: "R.04",
  },
  {
    id: "002", num: "002",
    title: "Land Rover Series III",
    subtitle: "Workshop manual — engine, axles, electrics",
    author: "Rover Co. Ltd",
    issue: "VOL.07 / ISSUE 04",
    date: "1974.04.11",
    readtime: "312 PP",
    section: "SERVICE",
    excerpt:
      "Torque the cylinder head in three stages, working from the centre outward to the figures in Section B. Check tappet clearances cold: 0.010 in inlet, 0.010 in exhaust. Grease the propshaft nipples every 3,000 miles and inspect the swivel housings for the correct oil level.",
    cover: { hue: 220, chroma: 0.03, lightness: 0.58 },
    coords: "52.40 N / 01.51 W", field: "SV_11", revision: "R.02",
  },
  {
    id: "003", num: "003",
    title: "Roland TR-808",
    subtitle: "Owner's manual — patterns, sync, the drum voices",
    author: "Roland Corporation",
    issue: "VOL.07 / ISSUE 03",
    date: "1980.03.27",
    readtime: "64 PP",
    section: "OPERATION",
    excerpt:
      "Program a rhythm in PATTERN WRITE: select the instrument, then tap the sixteen step keys to place hits on the bar. Chain patterns into a song in COMPOSE. Sync to tape via the DIN connector at 24 pulses per quarter note, and tune the bass drum with the DECAY and TONE trimmers.",
    cover: { hue: 88, chroma: 0.025, lightness: 0.55 },
    coords: "34.69 N / 135.50 E", field: "OP_27", revision: "R.07",
  },
  {
    id: "004", num: "004",
    title: "Leica M3",
    subtitle: "Instruction book — rangefinder, frame lines, film",
    author: "Ernst Leitz GmbH",
    issue: "VOL.07 / ISSUE 03",
    date: "1954.03.14",
    readtime: "40 PP",
    section: "OPERATION",
    excerpt:
      "Focus by aligning the bright central rangefinder patch. The viewfinder selects the 50, 90 and 135 mm frame lines automatically as the lens is mounted. Advance with a single stroke or several short strokes of the lever; the frame counter resets when the baseplate is removed.",
    cover: { hue: 18, chroma: 0.04, lightness: 0.48 },
    coords: "50.61 N / 08.68 E", field: "OP_14", revision: "R.03",
  },
  {
    id: "005", num: "005",
    title: "Eames Lounge Chair",
    subtitle: "Assembly & care — shock mounts, shells, leather",
    author: "Herman Miller",
    issue: "VOL.07 / ISSUE 02",
    date: "1956.02.28",
    readtime: "16 PP",
    section: "ASSEMBLY",
    excerpt:
      "Seat the back shell onto the armrest with the rubber shock mounts aligned; do not over-tighten — the mounts are designed to flex. Buff the leather with a soft, dry cloth only. Keep the rosewood veneer out of direct sun, and check the five-star base glides for wear annually.",
    cover: { hue: 58, chroma: 0.05, lightness: 0.66 },
    coords: "42.79 N / 85.76 W", field: "AS_28", revision: "R.05",
  },
  {
    id: "006", num: "006",
    title: "Braun SK 4",
    subtitle: "Service guide — the lid, the platter, the cartridge",
    author: "Braun AG",
    issue: "VOL.07 / ISSUE 02",
    date: "1956.02.14",
    readtime: "24 PP",
    section: "SERVICE",
    excerpt:
      "Set the tracking force to 2 grams at the counterweight and level the platter before play. The acrylic lid (the reason for the nickname) lifts clear for stylus access. Replace the cartridge with the leads colour-matched, and check the idler wheel for flat spots if the speed drifts.",
    cover: { hue: 260, chroma: 0.025, lightness: 0.42 },
    coords: "50.11 N / 08.68 E", field: "SV_14", revision: "R.02",
  },
];

const PEEK_COUNT = 3;
const CARD_WIDTH = 240;
const CARD_GAP = 28;
const STEP = CARD_WIDTH + CARD_GAP;

/* Six insignia variants — picked deterministically from the article id. */
function Insignia({ id, ink, inkSoft }) {
  const v = id % 6;
  const stroke = ink;
  const soft = inkSoft;
  const inv = stroke === "#1A1815" ? "#ECEAE5" : "#1A1815";

  if (v === 0)
    return (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="32" fill="none" stroke={stroke} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="22" fill="none" stroke={stroke} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="12" fill="none" stroke={stroke} strokeWidth="0.5" />
        <line x1="18" y1="50" x2="82" y2="50" stroke={stroke} strokeWidth="0.5" />
        <line x1="50" y1="18" x2="50" y2="82" stroke={stroke} strokeWidth="0.5" />
        <rect x="46" y="46" width="8" height="8" fill={stroke} />
      </svg>
    );
  if (v === 1)
    return (
      <svg viewBox="0 0 100 100">
        <rect x="20" y="20" width="60" height="60" fill="none" stroke={stroke} strokeWidth="0.5" />
        <rect x="32" y="32" width="36" height="36" fill="none" stroke={stroke} strokeWidth="0.5" />
        <line x1="20" y1="20" x2="80" y2="80" stroke={soft} strokeWidth="0.5" />
        <line x1="80" y1="20" x2="20" y2="80" stroke={soft} strokeWidth="0.5" />
        <circle cx="50" cy="50" r="3" fill={stroke} />
      </svg>
    );
  if (v === 2)
    return (
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="34" fill="none" stroke={stroke} strokeWidth="0.5" />
        {Array.from({ length: 24 }).map((_, i) => {
          /* Round so the server and client emit identical strings — raw
             IEEE-754 trig values differ in the last digit and trip hydration. */
          const f = (n) => +n.toFixed(3);
          const a = (i / 24) * Math.PI * 2;
          const x1 = f(50 + Math.cos(a) * 34);
          const y1 = f(50 + Math.sin(a) * 34);
          const x2 = f(50 + Math.cos(a) * (i % 4 === 0 ? 28 : 31));
          const y2 = f(50 + Math.sin(a) * (i % 4 === 0 ? 28 : 31));
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="0.5" />;
        })}
        <line x1="50" y1="50" x2="78" y2="36" stroke={stroke} strokeWidth="0.7" />
        <circle cx="78" cy="36" r="2" fill={stroke} />
      </svg>
    );
  if (v === 3)
    return (
      <svg viewBox="0 0 100 100">
        <line x1="14" y1="50" x2="86" y2="50" stroke={stroke} strokeWidth="0.5" />
        {Array.from({ length: 17 }).map((_, i) => (
          <line
            key={i}
            x1={14 + i * 4.5}
            y1="46"
            x2={14 + i * 4.5}
            y2={i % 4 === 0 ? 40 : 44}
            stroke={stroke}
            strokeWidth="0.5"
          />
        ))}
        <polygon points="50,38 53,44 47,44" fill={stroke} />
        <text x="50" y="62" fontSize="7" fontFamily='"DM Sans", ui-sans-serif, system-ui, sans-serif' fontWeight="500" textAnchor="middle" fill={stroke}>
          R.A. 80
        </text>
      </svg>
    );
  if (v === 4)
    return (
      <svg viewBox="0 0 100 100">
        <rect x="22" y="42" width="56" height="16" fill="none" stroke={stroke} strokeWidth="0.5" />
        <rect x="22" y="42" width="34" height="16" fill={stroke} />
        <text x="29" y="54" fontSize="8" fontFamily='"DM Sans", ui-sans-serif, system-ui, sans-serif' fontWeight="500" fill={inv}>
          75%
        </text>
        <line x1="22" y1="34" x2="78" y2="34" stroke={soft} strokeWidth="0.5" strokeDasharray="2 2" />
        <line x1="22" y1="66" x2="78" y2="66" stroke={soft} strokeWidth="0.5" strokeDasharray="2 2" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100">
      <polygon points="50,18 82,50 50,82 18,50" fill="none" stroke={stroke} strokeWidth="0.5" />
      <polygon points="50,30 70,50 50,70 30,50" fill="none" stroke={stroke} strokeWidth="0.5" />
      <line x1="18" y1="50" x2="82" y2="50" stroke={soft} strokeWidth="0.5" />
      <line x1="50" y1="18" x2="50" y2="82" stroke={soft} strokeWidth="0.5" />
      <rect x="48" y="48" width="4" height="4" fill={stroke} />
    </svg>
  );
}

function Cover({ article, focused }) {
  const { id, num, title, author, section, issue, cover, field } = article;

  const chroma = focused ? Math.min(0.16, cover.chroma * 4 + 0.06) : cover.chroma;
  const lightness = focused ? Math.min(0.78, cover.lightness + 0.05) : cover.lightness;
  const bg = `oklch(${lightness * 100}% ${chroma} ${cover.hue})`;
  const ink = lightness > 0.55 ? "#1A1815" : "#ECEAE5";
  const inkSoft = lightness > 0.55 ? "rgba(26, 24, 21, 0.62)" : "rgba(236, 234, 229, 0.55)";
  const rule = lightness > 0.55 ? "rgba(26, 24, 21, 0.22)" : "rgba(236, 234, 229, 0.28)";

  const ticks = useMemo(() => Array.from({ length: 32 }, (_, i) => i), []);
  const seed = parseInt(id, 10);
  const dotPos = (seed * 37) % 100;

  return (
    <div className={styles.cover} style={{ background: bg, color: ink }}>
      <div
        className={styles.coverGrid}
        style={{
          backgroundImage:
            `linear-gradient(to right,  ${rule} 1px, transparent 1px),` +
            `linear-gradient(to bottom, ${rule} 1px, transparent 1px)`,
        }}
      />

      <div className={styles.coverPunches} aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className={styles.coverPunch} />
        ))}
      </div>

      <span className={styles.coverSpine} aria-hidden="true" />

      <div className={`${styles.coverBand} ${styles.coverBandTop}`}>
        <span className={styles.xs}>MANUALS / {issue}</span>
        <span className={styles.xs}>{field}</span>
      </div>

      <svg className={`${styles.coverCorner} ${styles.cornerTL}`} viewBox="0 0 24 24">
        <path d="M0 8 L0 0 L8 0" stroke={ink} fill="none" strokeWidth="1" />
      </svg>
      <svg className={`${styles.coverCorner} ${styles.cornerTR}`} viewBox="0 0 24 24">
        <path d="M16 0 L24 0 L24 8" stroke={ink} fill="none" strokeWidth="1" />
      </svg>
      <svg className={`${styles.coverCorner} ${styles.cornerBL}`} viewBox="0 0 24 24">
        <path d="M0 16 L0 24 L8 24" stroke={ink} fill="none" strokeWidth="1" />
      </svg>
      <svg className={`${styles.coverCorner} ${styles.cornerBR}`} viewBox="0 0 24 24">
        <path d="M16 24 L24 24 L24 16" stroke={ink} fill="none" strokeWidth="1" />
      </svg>

      <div className={styles.coverBignum} style={{ color: ink }}>
        <span className={styles.bignumPrefix} style={{ color: inkSoft }}>NO.</span>
        <span className={styles.bignumVal}>{num}</span>
      </div>

      <div className={styles.coverTicks}>
        {ticks.map((t) => (
          <span
            key={t}
            className={styles.tick}
            style={{
              background: ink,
              opacity: t % 4 === 0 ? 0.85 : 0.35,
              height: t % 4 === 0 ? 10 : 5,
            }}
          />
        ))}
        <span
          className={styles.tickMarker}
          style={{ left: `${dotPos}%`, background: ink }}
        />
      </div>

      <div className={styles.coverInsignia}>
        <Insignia id={seed} ink={ink} inkSoft={inkSoft} />
      </div>

      <div className={styles.coverTitleBlock}>
        <div className={`${styles.xs} ${styles.coverSection}`} style={{ color: inkSoft }}>{section}</div>
        <div className={styles.coverTitle}>{title}</div>
        <div className={`${styles.xs} ${styles.coverAuthor}`} style={{ color: inkSoft }}>{author.toUpperCase()}</div>
      </div>

      <div className={`${styles.coverBand} ${styles.coverBandBot}`}>
        <span className={styles.xs} style={{ color: inkSoft }}>{article.coords}</span>
        <span className={styles.xs} style={{ color: inkSoft }}>{article.date}</span>
      </div>

      {focused && <div className={styles.coverFocusedPulse} />}
    </div>
  );
}

function PreviewPanel({ article }) {
  return (
    <div className={styles.preview} key={article.id}>
      <div className={styles.previewStrip}>
        <div className={styles.stripLeft}>
          <span className={`${styles.xs} ${styles.muted}`}>FOCUS / NO.{article.num}</span>
          <span className={styles.stripDot} />
          <span className={`${styles.xs} ${styles.muted}`}>{article.section}</span>
        </div>
        <div className={styles.stripRight}>
          <span className={`${styles.xs} ${styles.muted}`}>REV {article.revision}</span>
        </div>
      </div>

      <div className={styles.previewHead}>
        <div className={styles.previewNumblock}>
          <div className={`${styles.xs} ${styles.muted}`}>NUM</div>
          <div className={`${styles.lg} ${styles.previewNum}`}>{article.num}</div>
        </div>
        <div className={styles.previewTitleblock}>
          <div className={`${styles.xl} ${styles.previewTitle}`}>{article.title}</div>
          <div className={`${styles.xs} ${styles.muted} ${styles.previewSub}`}>{article.subtitle}</div>
        </div>
      </div>

      <div className={styles.rule} />

      <div className={styles.previewRow}>
        <div className={styles.rowRead}>
          <div className={`${styles.xs} ${styles.muted}`}>READ</div>
          <div className={styles.sm}>{article.readtime}</div>
        </div>
        <div className={styles.rowExcerpt}>
          <span className={styles.excerptMark}>¶</span>
          {article.excerpt}
        </div>
        <a
          href="#"
          className={`btn btn-secondary ${styles.rowCta}`}
          onClick={(e) => e.preventDefault()}
        >
          OPEN ARTICLE
        </a>
      </div>

      <div className={`${styles.previewFoot} ${styles.xs} ${styles.muted}`}>
        <span>MANUALS / {article.issue}</span>
        <span>{article.coords}</span>
      </div>
    </div>
  );
}

function ScaleBar({ focus, total, onPick }) {
  const minorPerMajor = 6;
  const totalMinors = (total - 1) * minorPerMajor;
  const majorPos = (i) => (i / (total - 1)) * 100;
  const pos = majorPos(focus);

  return (
    <div className={styles.scalebar}>
      <div className={styles.scalebarTrack}>
        <span className={styles.scalebarBaseline} />
        {Array.from({ length: totalMinors + 1 }).map((_, i) => {
          const isMajor = i % minorPerMajor === 0;
          if (isMajor) return null;
          return (
            <span
              key={`mn-${i}`}
              className={`${styles.scalebarTick} ${styles.scalebarTickMinor}`}
              style={{ left: `${(i / totalMinors) * 100}%` }}
            />
          );
        })}
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={`mj-${i}`}
            className={`${styles.scalebarMajor} ${i === focus ? styles.isActive : ""}`}
            style={{ left: `${majorPos(i)}%` }}
            onClick={() => onPick(i)}
            aria-label={`Article ${i + 1}`}
          >
            <span className={`${styles.scalebarTick} ${styles.scalebarTickMajor}`} />
            <span className={`${styles.scalebarMajorLabel} ${styles.xs}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
        <span className={styles.scalebarMarker} style={{ left: `${pos}%` }}>
          <span className={styles.scalebarMarkerArrow} />
        </span>
      </div>
    </div>
  );
}

export default function BookLogExperiment() {
  const [focus, setFocus] = useState(0);
  const total = ARTICLES.length;
  const containerRef = useRef(null);

  const go = useCallback(
    (dir) => {
      setFocus((f) => Math.max(0, Math.min(total - 1, f + dir)));
    },
    [total]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const focused = ARTICLES[focus];

  return (
    <div className={styles.carouselRoot} ref={containerRef}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <span className={styles.xs}>MANUALS</span>
          <span className={styles.topbarSep} />
          <span className={`${styles.xs} ${styles.muted}`}>ARCHIVE / 2026</span>
        </div>
        <div />
        <div className={styles.topbarRight}>
          <span className={`${styles.xs} ${styles.muted}`}>FOCUS</span>
          <span className={styles.sm}>
            {String(focus + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      </header>

      <section className={styles.trackWrap}>
        <div
          className={styles.track}
          style={{ transform: `translateX(${-focus * STEP}px)` }}
        >
          {ARTICLES.map((a, i) => {
            const offset = i - focus;
            const isFocus = offset === 0;
            const visible = offset >= 0 && offset <= PEEK_COUNT + 1;
            return (
              <button
                key={a.id}
                className={`${styles.card} ${isFocus ? styles.isFocus : ""} ${visible ? "" : styles.isHidden}`}
                style={{
                  opacity: isFocus ? 1 : Math.max(0, 1 - Math.max(0, offset) * 0.18),
                }}
                onClick={() => {
                  if (!isFocus) setFocus(i);
                }}
                aria-label={`${a.title} by ${a.author}`}
              >
                <Cover article={a} focused={isFocus} />
                <div className={styles.cardFoot}>
                  <span className={styles.xs}>{a.num}</span>
                  <span className={styles.cardFootLine} />
                  <span className={`${styles.xs} ${styles.muted}`}>{a.section}</span>
                </div>
              </button>
            );
          })}
        </div>

        <button
          className={`btn-icon btn-icon-md ${styles.navbtnPrev}`}
          onClick={() => go(-1)}
          disabled={focus === 0}
          aria-label="Previous"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M15 4 L7 12 L15 20" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </button>
        <button
          className={`btn-icon btn-icon-md ${styles.navbtnNext}`}
          onClick={() => go(1)}
          disabled={focus === total - 1}
          aria-label="Next"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M9 4 L17 12 L9 20" stroke="currentColor" strokeWidth="1.2" fill="none" />
          </svg>
        </button>

        <div className={styles.trackScale}>
          <ScaleBar focus={focus} total={total} onPick={setFocus} />
        </div>
      </section>

      <section className={styles.previewWrap}>
        <PreviewPanel article={focused} />
      </section>

      <footer className={styles.botbar}>
        <div className={`${styles.botLeft} ${styles.xs} ${styles.muted}`}>
          ← / → navigate · click peek
        </div>
        <div className={`${styles.botRight} ${styles.xs} ${styles.muted}`}>
          <span>SIG.{focused.id}</span>
          <span className={styles.topbarSep} />
          <span>OK</span>
          <span className={styles.statusDot} />
        </div>
      </footer>
    </div>
  );
}
