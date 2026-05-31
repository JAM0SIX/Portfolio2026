/* Footer — site-wide. Two atmospheric map plates (one per theme)
   run edge-to-edge as the band's ground. On top, a contained panel
   carries the real work: identity, sitemap, contact + social, and
   a colophon line. The footer functions as the page's exit ramp,
   not just a decorative banner.

   Layout (desktop):
     ┌──────────────────────────────────────────────────────────┐
     │  [map plate]                                             │
     │  ┌────────────────────────────────────────────────────┐  │
     │  │ Identity     │ Sitemap      │ Contact + Socials   │  │
     │  └────────────────────────────────────────────────────┘  │
     │  Colophon row (small print, full width)                  │
     └──────────────────────────────────────────────────────────┘
*/

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PixelTerrain from "@/components/PixelTerrain/PixelTerrain";
import styles from "./Footer.module.css";

/* Tiny inline icon set so we don't pull a whole icon library for
   two off-site links. 14 px square, stroke-based to match the rest
   of the chrome (Sidebar back arrow, CTA arrow, etc.). */
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.27 0h4.37v1.91h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 6.99V22h-4.56v-6.55c0-1.56-.03-3.57-2.18-3.57-2.18 0-2.51 1.7-2.51 3.46V22H7.49V8z" />
    </svg>
  );
}
function ReadCvIcon() {
  /* No official Read.cv glyph; using a clean document mark that
     reads as "résumé." */
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  );
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#projects", label: "Work" },
  { href: "/#writing", label: "Writing" },
  { href: "/experiments", label: "Experiments" },
  { href: "/about", label: "About" },
];

const SOCIAL_LINKS = [
  {
    href: "https://www.linkedin.com/in/harryspawforth",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
  {
    href: "https://read.cv/harryspawforth",
    label: "Read.cv",
    icon: ReadCvIcon,
  },
];

/* Re-used live London time, ticking every 30s like the LocalClock
   in the header. Saves importing LocalClock itself which carries
   the cursor + theme toggle controls (don't belong in the footer). */
function useLondonTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => {
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Europe/London",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date())
      );
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* Atmospheric ground — a procedural pixel-grid terrain that
          drifts slowly between solid / dithered / empty cells.
          The terrain reads `[data-pixel-clear]` elements (the two
          content plates below) and carves clean paper holes around
          them so text/CTAs never sit on top of dithered pixels. */}
      <div className={styles.media} aria-hidden="true">
        <PixelTerrain clearSelector="[data-pixel-clear]" clearPadding={10} />
      </div>

      {/* Foreground content panel — sits over the map, contained by
          the footer's own border + drop-shadow. Three columns at
          desktop, stacked at mobile. */}
      <div className={styles.inner}>
        <div className={styles.columns}>
          {/* Plate 1 — identity + contact in one recessed container,
              laid out as a 2×2 grid so the rows share a baseline:
                Row 1: Harry Spawforth        ⟷  LinkedIn · Read.cv
                Row 2: Designing with intent  ⟷  Start a conversation
              `align-items: end` on each row pins the contents to a
              single bottom baseline per row, regardless of the
              individual element heights. */}
          <section className={`${styles.col} ${styles.colSplit}`} data-pixel-clear aria-label="Identity and contact">
            <p className={`${styles.name} ${styles.cellTopLeft}`}>Harry Spawforth</p>
            <ul className={`${styles.socialList} ${styles.cellTopRight}`}>
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <a
                    className={styles.socialLink}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className={`${styles.role} ${styles.cellBottomLeft}`}>Designing with intent</p>
            <a
              className={`${styles.cta} ${styles.cellBottomRight}`}
              href="mailto:harryspawforth@gmail.com"
            >
              Start a conversation
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="3" y1="8" x2="13" y2="8" />
                <polyline points="9 4 13 8 9 12" />
              </svg>
            </a>
          </section>

          {/* Plate 2 — site nav. Horizontal row of top-level links. */}
          <nav className={styles.col} data-pixel-clear aria-label="Site sections">
            <ul className={styles.navList}>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={styles.navLink}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </div>
    </footer>
  );
}
