/* Footer — site-wide block with an atmospheric image and a tagline
   + contact CTA on the right. Image lives at /public/footer-skier.jpg
   so the path resolves at the site root. */

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.media} role="img" aria-label="Skier on a snowy slope">
        <div className={styles.content}>
          <p className={styles.tagline}>It&apos;s just a leap of faith.</p>
          <a
            className={styles.cta}
            href="mailto:harryspawforth@gmail.com"
          >
            Get in touch
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="8" x2="13" y2="8" />
              <polyline points="9 4 13 8 9 12" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
