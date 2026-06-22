"use client";

/* ProblemCards — interactive progressive-disclosure problem cards.
   ----------------------------------------------------------------
   Replaces the old "subsectionHeader + prose" pairs in the Problem
   section with two cards that borrow the homepage project-card
   vocabulary (slanted top-left notch, badge in the notch, status
   dot, paper-deep frame).

   Each card opens with just its title. A button invites the reader
   to dig in ("Why was this a problem?"). Each click reveals the
   next step — a divider + optional sub-heading + body paragraph —
   with a height + fade transition, then the button morphs to the
   next step's prompt ("What risk did this pose to the business?").
   Once every step is revealed the button retires. Reveal is
   one-way; there's no collapse-back.

   Data shape (per card):
     { badge, title, steps: [{ prompt, heading?, body }] }
   `prompt` is the button label that reveals THAT step. The button
   always shows the next unrevealed step's prompt.

   Notch geometry: identical slant/radius maths to ProjectsGrid —
   the badge is measured and the slanted clip-path corners are
   computed from it so the notch hugs "P1"/"P2" exactly. */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ProblemCards.module.css";

/* Matches ProjectsGrid: breathing room cleared to the right/below
   the badge, and the slant compensation so the notch's bottom edge
   stays wide enough after the wall leans left. */
const TAB_PADDING = 14;
const NOTCH_SLANT_PX = 10;
/* Entrance stagger between the two cards (ms). */
const CARD_STAGGER_MS = 110;

export default function ProblemCards({ cards = [] }) {
  const ref = useRef(null);
  /* Cards start hidden and fade/rise in when the section scrolls
     into view, one after another. `shown` flips once via observer;
     reduced-motion + no-JS fall back to fully shown. */
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${styles.grid}${shown ? ` ${styles.gridShown}` : ""}`}
    >
      {cards.map((card, i) => (
        <Card
          key={card.badge ?? i}
          card={card}
          style={{ "--card-delay": `${i * CARD_STAGGER_MS}ms` }}
        />
      ))}
    </div>
  );
}

function Card({ card, style }) {
  const { badge, title, steps = [] } = card;
  const [revealed, setRevealed] = useState(0);
  const headRef = useRef(null);
  const notchRef = useRef(null);

  /* Size the notch to the status dot that sits in it — same fillet
     maths as the project cards so the slanted corners stay true
     circular arcs. */
  useLayoutEffect(() => {
    const head = headRef.current;
    const el = notchRef.current;
    if (!head) return;
    if (!el) {
      head.style.setProperty("--notch-tl-w", "0px");
      head.style.setProperty("--notch-tl-h", "0px");
      return;
    }

    const update = () => {
      const w = el.offsetWidth + TAB_PADDING + NOTCH_SLANT_PX;
      const h = el.offsetHeight + TAB_PADDING;
      head.style.setProperty("--notch-tl-w", `${w}px`);
      head.style.setProperty("--notch-tl-h", `${h}px`);

      const cs = getComputedStyle(head);
      const slant = parseFloat(cs.getPropertyValue("--notch-slant")) || 0;
      const radius = parseFloat(cs.getPropertyValue("--notch-radius")) || 0;

      if (slant > 0 && h > 0 && radius > 0) {
        const wallLen = Math.hypot(slant, h);
        const theta = Math.acos(-slant / wallLen);
        const d = radius / Math.tan(theta / 2);
        const dx = (d * slant) / wallLen;
        const dy = (d * h) / wallLen;
        head.style.setProperty("--notch-corner-d", `${d}px`);
        head.style.setProperty("--notch-corner-dx", `${dx}px`);
        head.style.setProperty("--notch-corner-dy", `${dy}px`);
      } else {
        head.style.setProperty("--notch-corner-d", `${radius}px`);
        head.style.setProperty("--notch-corner-dx", "0px");
        head.style.setProperty("--notch-corner-dy", `${radius}px`);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(head);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const nextStep = revealed < steps.length ? steps[revealed] : null;

  return (
    <article className={styles.card} style={style}>
      <header className={styles.head} ref={headRef}>
        <div className={styles.headSurface} aria-hidden="true" />
        {/* Status dot sits in the notch and drives its size. */}
        <span className={styles.dot} ref={notchRef} aria-hidden="true" />
        {badge && <span className={styles.label}>{badge}</span>}
        <h3 className={styles.title}>{title}</h3>
      </header>

      <div className={styles.reveals}>
        {steps.map((step, i) => (
          <div
            key={i}
            className={`${styles.step}${i < revealed ? ` ${styles.stepOpen}` : ""}`}
            aria-hidden={i < revealed ? undefined : true}
          >
            <div className={styles.stepInner}>
              <div className={styles.stepContent}>
                {step.heading && (
                  <h4 className={styles.stepHeading}>{step.heading}</h4>
                )}
                <p className={styles.stepBody}>{step.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {nextStep && (
        <button
          type="button"
          className={`btn btn-secondary btn-skeuo ${styles.button}`}
          onClick={() => setRevealed((n) => n + 1)}
        >
          {nextStep.prompt}
        </button>
      )}
    </article>
  );
}
