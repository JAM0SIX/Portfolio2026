/* BookLog — "My Notes" section.
   2×3 grid of note covers (max 200px wide each). Each links to /reading/[id]. */

import Link from "next/link";
import { ARTICLES } from "./articles";
import Cover from "./Cover";
import styles from "./BookLogCarousel.module.css";

export default function BookLogCarousel() {
  const total = ARTICLES.length;

  return (
    <div className={styles.root}>
      <header className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <h2 className={styles.topbarTitle}>My Notes</h2>
        </div>
        <div className={styles.topbarRight}>
          <span className={styles.topbarCount}>
            {String(total).padStart(2, "0")} entries
          </span>
        </div>
      </header>

      <nav className={styles.bookGrid} aria-label="Reading notes">
        {ARTICLES.map((a) => (
          <Link
            key={a.id}
            href={`/reading/${a.id}`}
            className={styles.bookGridLink}
            aria-label={`${a.title} by ${a.author}`}
          >
            <Cover article={a} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
