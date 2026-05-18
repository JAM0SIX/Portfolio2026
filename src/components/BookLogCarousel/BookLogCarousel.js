/* BookLog — "My Notes" section.
   2×3 grid of note covers (max 200px wide each). Each links to /reading/[id]. */

import Link from "next/link";
import { ARTICLES } from "./articles";
import Cover from "./Cover";
import styles from "./BookLogCarousel.module.css";

/* Deterministic pseudo-random tilt from the article id. Same input
   always returns the same output, so SSR and client agree. Range is
   roughly -2.5deg to +2.5deg. */
function tiltFor(id) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const t = ((h >>> 0) % 1000) / 1000;
  return (t * 5 - 2.5).toFixed(2);
}

export default function BookLogCarousel() {
  const total = ARTICLES.length;

  return (
    <div className={styles.root}>
      <div className="section__head">
        <span className="section__label">My thoughts</span>
        <span className="section__rule" aria-hidden="true" />
        <span className="section__count">{total} articles</span>
      </div>

      <nav className={styles.bookGrid} aria-label="Reading notes">
        {ARTICLES.map((a) => (
          <Link
            key={a.id}
            href={`/reading/${a.id}`}
            className={styles.bookGridLink}
            style={{ "--book-tilt": `${tiltFor(a.id)}deg` }}
            aria-label={`${a.title} by ${a.author}`}
          >
            <Cover article={a} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
