import styles from "./DialTagPills.module.css";

/* Chamfered tag-pill row, ported from the original PortfolioDial. */
export default function DialTagPills({ tags, className }) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(" ")}>
      {tags.map((t) => (
        <span key={t} className={styles.pill}>
          <span className={styles.pillInset} aria-hidden="true" />
          <span className={styles.pillLabel}>{t}</span>
        </span>
      ))}
    </div>
  );
}
