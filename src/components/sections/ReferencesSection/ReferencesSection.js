import styles from "./ReferencesSection.module.css";
import { references } from "./references";

export default function ReferencesSection() {
  return (
    <section
      id="references"
      className={styles.section}
      aria-label="References"
    >
      <div className="section__head">
        <span className="section__label">References</span>
        <span className="section__rule" aria-hidden="true" />
        <span className="section__count">{references.length} voices</span>
      </div>

      <ul className={styles.list}>
        {references.map((r) => (
          <li key={r.name} className={styles.row}>
            <div className={styles.head}>
              <span className={styles.name}>{r.name}</span>
              <span className={styles.meta}>
                <span className={styles.role}>{r.role}</span>
                <span className={styles.sep} aria-hidden="true">·</span>
                <span className={styles.company}>{r.company}</span>
              </span>
              <span className={styles.year}>{r.year}</span>
            </div>
            <p className={styles.quote}>“{r.quote}”</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
