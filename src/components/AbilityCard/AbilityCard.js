/* AbilityCard — Haz.
   Hover-reveal capability card. Frame draws in from corners, content
   fades+unblurs in a soft top-down cascade. See the .module.css file
   header for full spec. */

import styles from "./AbilityCard.module.css";

const TL_REST_PATH = "M 0.5 16 L 0.5 0.5 L 0.5 0.5 L 16 0.5";
const BR_REST_PATH = "M 15.5 0 L 15.5 15.5 L 15.5 15.5 L 0 15.5";

export default function AbilityCard({
  title,
  description,
  ctaLabel,
  href,
  external = false,
  variant = "default",
  className,
  tabIndex,
}) {
  const cardClass = [
    styles.card,
    variant === "metric" ? styles.metricCard : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  const contentClass = [
    styles.content,
    variant === "metric" ? styles.metricContent : "",
  ].filter(Boolean).join(" ");

  const headingClass = [
    styles.heading,
    variant === "metric" ? styles.metricHeading : "",
  ].filter(Boolean).join(" ");

  const descriptionClass = [
    styles.description,
    variant === "metric" ? styles.metricDescription : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={cardClass} tabIndex={tabIndex}>
      <span className={styles.cornerTR} aria-hidden="true" />
      <span className={styles.cornerBL} aria-hidden="true" />

      <svg className={styles.morphCornerTL} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path className={styles.morphPath} d={TL_REST_PATH} />
      </svg>
      <svg className={styles.morphCornerBR} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <path className={styles.morphPath} d={BR_REST_PATH} />
      </svg>

      <span className={styles.topLine} aria-hidden="true" />
      <span className={styles.rightLine} aria-hidden="true" />
      <span className={styles.bottomLine} aria-hidden="true" />
      <span className={styles.leftLine} aria-hidden="true" />

      <div className={contentClass}>
        <h3 className={headingClass}>{title}</h3>
        <p className={descriptionClass}>{description}</p>

        {ctaLabel && href ? (
          <a
            className={styles.cta}
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            <span className={styles.ctaLabel} data-text={ctaLabel}>{ctaLabel}</span>
            <span className={styles.ctaArrow} aria-hidden="true">{external ? "↗" : "→"}</span>
          </a>
        ) : null}
      </div>
    </article>
  );
}
