"use client";

/* References — folder-tab card stack.
   ─────────────────────────────────────
   Five testimonial cards filed like folders in a sleeve. Each
   card carries a folder tab protruding above its top edge that
   holds the reference name. Cards behind translate UPWARD so
   their tabs peek above the active card.

   The selected card "pulls out and places forward" via a 3D
   WAAPI animation: it lifts slightly toward the viewer, drops
   down past the stack, then settles into the front position.
   Other cards smoothly slide to their new depth. */

import { useEffect, useRef, useState } from "react";
import styles from "./ReferencesSection.module.css";
import { references } from "./references";

/* How far each card behind the active one translates upward (px). */
const STACK_OFFSET = 16;
/* Tab height (px) — decoupled from STACK_OFFSET so tabs stay
   legible even when the cards stack tightly. */
const TAB_HEIGHT = 36;

/* Animation timing for tab clicks.
   Slower + smoother than the previous overshoot keyframe so the
   motion reads as someone carefully picking a folder up, holding
   it briefly, and placing it down — not a spring-loaded snap. */
const PULL_DURATION = 1000;
const SHIFT_DURATION = 720;
/* Ease-in-out with a deliberate hold at the apex: the curve
   accelerates gently out of rest, holds the middle, then settles
   into place without overshoot. */
const PULL_EASING = "cubic-bezier(0.45, 0.05, 0.25, 1.0)";
const SHIFT_EASING = "cubic-bezier(0.4, 0.0, 0.2, 1.0)";

/* Pull-out keyframe parameters. The selected card lifts forward
   (translateZ) and down (translateY) at the apex with a slight
   forward rotation, then settles at the front. Lift values are
   gentler than the previous version so the motion feels measured
   rather than thrown. */
const PULL_LIFT_Y = 22;
const PULL_LIFT_Z = 56;
const PULL_TILT = -7; // deg around X axis

export default function ReferencesSection() {
  const total = references.length;
  const [active, setActive] = useState(0);

  /* Refs to each card element + the most recent animation per
     card. We use the Web Animations API for movement (richer
     keyframes than CSS transitions) and cancel the in-flight
     animation per card before starting a new one to avoid the
     WAAPI default of layering animations on top of each other. */
  const cardRefs = useRef(new Map());
  const cardAnimsRef = useRef(new Map());
  const prevActiveRef = useRef(active);

  useEffect(() => {
    const prevActive = prevActiveRef.current;
    if (prevActive === active) {
      /* Initial mount or no actual change. Nothing to animate. */
      prevActiveRef.current = active;
      return;
    }

    references.forEach((_, i) => {
      const el = cardRefs.current.get(i);
      if (!el) return;

      const prevDepth = (i - prevActive + total) % total;
      const newDepth = (i - active + total) % total;
      if (prevDepth === newDepth) return;

      const fromY = prevDepth * -STACK_OFFSET;
      const toY = newDepth * -STACK_OFFSET;
      const isBecomingActive = newDepth === 0;

      /* Cancel any in-flight animation on this card so the new
         one starts from a clean state. */
      const prevAnim = cardAnimsRef.current.get(i);
      if (prevAnim) prevAnim.cancel();

      const keyframes = isBecomingActive
        ? [
            /* Start at this card's stack position. */
            {
              transform: `translate3d(0, ${fromY}px, 0) rotateX(0deg)`,
              offset: 0,
            },
            /* Lift forward (translateZ) and tilt — like the
               folder is being picked up out of the stack. */
            {
              transform: `translate3d(0, ${PULL_LIFT_Y}px, ${PULL_LIFT_Z}px) rotateX(${PULL_TILT}deg)`,
              offset: 0.35,
            },
            /* Hold the lifted position briefly. Same transform as
               offset 0.35 — the duplicate keyframe creates a
               visible pause where the folder hovers, mid-air,
               before being lowered into place. */
            {
              transform: `translate3d(0, ${PULL_LIFT_Y}px, ${PULL_LIFT_Z}px) rotateX(${PULL_TILT}deg)`,
              offset: 0.55,
            },
            /* Carefully lower into the front position. */
            {
              transform: "translate3d(0, 0px, 0) rotateX(0deg)",
              offset: 1,
            },
          ]
        : [
            /* Other cards just slide to their new depth. */
            { transform: `translate3d(0, ${fromY}px, 0)` },
            { transform: `translate3d(0, ${toY}px, 0)` },
          ];

      const anim = el.animate(keyframes, {
        duration: isBecomingActive ? PULL_DURATION : SHIFT_DURATION,
        easing: isBecomingActive ? PULL_EASING : SHIFT_EASING,
        fill: "forwards",
      });
      cardAnimsRef.current.set(i, anim);
    });

    prevActiveRef.current = active;
  }, [active, total]);

  /* Equalise card heights in the folder-tab stack. Cards are bottom-
     anchored and each tab sits at its card's top edge, so a shorter card
     (a shorter quote) would drop its tab below the staircase. Measuring
     the tallest card and matching the rest keeps every tab on the same
     16px step, and adapts per viewport (quotes wrap more when narrower).
     Skipped below 881px where the layout is a flat list. */
  useEffect(() => {
    const measure = () => {
      const cards = [...cardRefs.current.values()];
      if (!cards.length) return;
      const stack = cards[0].parentElement;
      cards.forEach((c) => {
        c.style.minHeight = "";
      });
      if (stack) {
        stack.style.minHeight = "";
        stack.style.height = "";
      }
      if (window.innerWidth < 881) return;
      let max = 0;
      cards.forEach((c) => {
        max = Math.max(max, c.offsetHeight);
      });
      cards.forEach((c) => {
        c.style.minHeight = `${max}px`;
      });
      /* Size the stack to the tallest card + the tab peek + 12px, so the
         top tab sits ~40px below the section subheading (28px head margin
         + 12px) instead of floating below a fixed-height block. */
      if (stack) {
        const peek = (total - 1) * STACK_OFFSET + TAB_HEIGHT;
        stack.style.minHeight = "0px";
        stack.style.height = `${max + peek + 12}px`;
      }
    };
    measure();
    window.addEventListener("resize", measure);
    /* Re-measure once webfonts load, since they change wrap height. */
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [total]);

  return (
    <section
      id="references"
      className={styles.section}
      aria-label="References"
    >
      <div className="section__head">
        <span className="section__label">References</span>
        <span className="section__rule" aria-hidden="true" />
        {/* Count removed — the row of tabs already advertises how
            many references there are. */}
      </div>

      <div
        className={styles.stack}
        style={{
          "--stack-offset": `${STACK_OFFSET}px`,
          /* Peek room above the active card = cumulative stack
             offset for the deepest card + one tab height so the
             deepest card's tab fits inside the section bounds. */
          "--stack-peek": `${(total - 1) * STACK_OFFSET + TAB_HEIGHT}px`,
          "--tab-h": `${TAB_HEIGHT}px`,
        }}
      >
        {references.map((r, i) => {
          /* Depth = position behind the active card. */
          const depth = (i - active + total) % total;
          const isActive = depth === 0;

          /* Tabs lay out in a row across the card's top edge: each
             tab takes 1/total of the card width. With the card's
             outline drawn via inset box-shadow (not `border`),
             absolute positioning is now relative to the border-box,
             so left:0 / width:100% align with the card edges
             pixel-perfectly. Tabs 2..n still extend 1 px to the
             left so adjacent left/right "borders" share a single
             pixel column (no doubled-up 2 px seam between them). */
          const naturalX = `${(i * 100) / total}%`;
          const naturalW = `${100 / total}%`;
          const tabX = i === 0 ? naturalX : `calc(${naturalX} - 1px)`;
          const tabW = i === 0 ? naturalW : `calc(${naturalW} + 1px)`;
          return (
            <article
              key={r.name}
              ref={(el) => {
                if (el) cardRefs.current.set(i, el);
                else cardRefs.current.delete(i);
              }}
              className={`${styles.card}${isActive ? " " + styles.cardActive : ""}`}
              style={{
                "--depth": depth,
                "--tab-x": tabX,
                "--tab-w": tabW,
                zIndex: total - depth,
              }}
              aria-current={isActive ? "true" : undefined}
            >
              <button
                type="button"
                className={styles.tab}
                aria-pressed={isActive}
                aria-label={
                  isActive
                    ? `${r.name} (active reference)`
                    : `Show reference from ${r.name}`
                }
                onClick={() => setActive(i)}
              >
                <span className={styles.tabText}>{r.name}</span>
              </button>

              <div className={styles.body}>
                {/* Square avatar — only rendered once a real portrait is
                    supplied via r.avatar. The placeholder is intentionally
                    hidden for now (portraits to be added later). */}
                {r.avatar && (
                  <figure className={styles.avatar} aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.avatar} alt="" className={styles.avatarImg} />
                  </figure>
                )}
                <p className={styles.meta}>
                  {r.role && <span className={styles.role}>{r.role}</span>}
                  <span className={styles.company}>{r.company}</span>
                </p>
                <p className={styles.quote}>&ldquo;{r.quote}&rdquo;</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
