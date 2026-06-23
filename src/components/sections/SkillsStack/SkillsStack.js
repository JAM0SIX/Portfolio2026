"use client";

/* Skills / Stack — pinwheel bento grid.
   ──────────────────────────────────────
   Four cards on a 3-col grid (1 + 2 / 2 + 1). Each card borrows the
   homepage project / problem card vocabulary:

     · a recessed --paper-deep frame with a hairline border + resting
       drop-shadow (no hover states),
     · a blue icon tile whose top-left corner is carved with the same
       slanted notch the project images use, with a status badge seated
       in the cleared notch,
     · an animated 3D wireframe shape icon (ShapeCanvas → shape-icons.js),
     · a title, and the description in a recessed paper bubble with an
       inset shadow (the problem-card "stepContent" treatment).

   Wide cards lay the icon beside the text; compact cards stack it above.
   The notch is sized in JS from the measured badge, exactly as
   ProjectsGrid does. */

import { useLayoutEffect, useRef } from "react";
import styles from "./SkillsStack.module.css";
import ShapeCanvas from "./ShapeCanvas";
import { BENTO } from "./skillsData";

/* Breathing room inside the notch (right + below the badge) and the
   slant compensation — matched to the project cards. */
const TAB_PADDING = 14;
const NOTCH_SLANT_PX = 10;

/* Drive the icon tile's TL notch from the measured badge so each notch
   fits its own label ("New" vs "Case Study"). Lifted from ProjectsGrid —
   same slant-aware fillet maths. */
function useNotch(badge) {
  const frameRef = useRef(null);
  const badgeRef = useRef(null);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const el = badgeRef.current;
      if (!el) {
        frame.style.setProperty("--notch-tl-w", "0px");
        frame.style.setProperty("--notch-tl-h", "0px");
        return;
      }
      const w = el.offsetWidth + TAB_PADDING + NOTCH_SLANT_PX;
      const h = el.offsetHeight + TAB_PADDING;
      frame.style.setProperty("--notch-tl-w", `${w}px`);
      frame.style.setProperty("--notch-tl-h", `${h}px`);

      const cs = getComputedStyle(frame);
      const slant = parseFloat(cs.getPropertyValue("--notch-slant")) || 0;
      const radius = parseFloat(cs.getPropertyValue("--notch-radius")) || 0;

      if (slant > 0 && h > 0 && radius > 0) {
        const wallLen = Math.hypot(slant, h);
        const theta = Math.acos(-slant / wallLen);
        const d = radius / Math.tan(theta / 2);
        const dx = (d * slant) / wallLen;
        const dy = (d * h) / wallLen;
        frame.style.setProperty("--notch-corner-d", `${d}px`);
        frame.style.setProperty("--notch-corner-dx", `${dx}px`);
        frame.style.setProperty("--notch-corner-dy", `${dy}px`);
      } else {
        frame.style.setProperty("--notch-corner-d", `${radius}px`);
        frame.style.setProperty("--notch-corner-dx", "0px");
        frame.style.setProperty("--notch-corner-dy", `${radius}px`);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    if (badgeRef.current) ro.observe(badgeRef.current);
    return () => ro.disconnect();
  }, [badge]);

  return { frameRef, badgeRef };
}

function BentoCard({ item }) {
  const { frameRef, badgeRef } = useNotch(item.badge);

  return (
    <article
      className={`${styles.card} ${item.wide ? styles.wide : styles.compact}`}
      aria-label={item.title}
    >
      <div className={styles.iconFrame} ref={frameRef}>
        <span
          ref={badgeRef}
          className={styles.badge}
          data-status={item.badge.toLowerCase().replace(/\s+/g, "-")}
        >
          {item.badge}
        </span>
        <div className={styles.iconStage}>
          <ShapeCanvas
            shape={item.shape}
            radius={0}
            interactive={false}
            className={styles.iconCanvas}
          />
        </div>
      </div>

      <div className={styles.textCol}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardBlurb}>{item.blurb}</p>
      </div>
    </article>
  );
}

export default function SkillsStack() {
  return (
    <section
      id="skills"
      className={styles.section}
      aria-label="Skills and stack"
    >
      <div className="section__head">
        <span className="section__label">Skills / Stack</span>
        <span className="section__rule" aria-hidden="true" />
      </div>

      <div className={styles.bento}>
        {BENTO.map((item) => (
          <BentoCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
