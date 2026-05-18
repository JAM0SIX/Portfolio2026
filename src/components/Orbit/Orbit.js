"use client";

/* Orbit — methodology visualisation.
   N nested full circles, all sharing a common tangent point at the
   TOP. The smallest circle sits highest in the composition (its
   bottom is closest to the top tangent); each subsequent circle is
   larger and expands downwards, with the largest circle's bottom
   near the bottom of the viewBox. Each circle's label is positioned
   just below the bottom of its arc and sits on top of any larger
   circle's fill thanks to a higher z-index. Scroll-driven: the
   active stage advances through the indices, highlighting that
   circle + label and cross-fading its body copy below. */

import { useEffect, useMemo, useRef } from "react";
import styles from "./Orbit.module.css";

const VB = 100;                  // SVG viewBox is 0-100
const TOP_Y = 5;                 // common tangent y of every circle
const MAX_R = 38;                // radius of the largest (outermost) circle
const MIN_R = 8;                 // radius of the smallest (innermost) circle
const LABEL_OFFSET_VB = 1;       // gap between arc bottom and label baseline, in viewBox %

export default function Orbit({ satellites = [] }) {
  const sceneRef = useRef(null);
  const circleRefs = useRef([]);
  const labelRefs = useRef([]);
  const n = satellites.length;

  /* Pre-compute the geometry. Index 0 = smallest (sits at the top
     of the composition); index n-1 = largest (expands to the bottom). */
  const circles = useMemo(
    () =>
      satellites.map((s, i) => {
        const r =
          n > 1 ? MIN_R + (i / (n - 1)) * (MAX_R - MIN_R) : (MAX_R + MIN_R) / 2;
        const cx = VB / 2;
        const cy = TOP_Y + r;
        const bottomY = TOP_Y + 2 * r;
        return {
          ...s,
          idx: i,
          r,
          cx,
          cy,
          bottomY,
          labelTopPct: ((bottomY + LABEL_OFFSET_VB) / VB) * 100,
        };
      }),
    [satellites, n],
  );

  /* Scroll-driven active state. The .scene is 320vh tall and sticky-
     pins the diagram while the user scrolls. As scroll progresses
     0..1, the active index cycles 0..n-1. */
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || n === 0) return;

    const updateActive = () => {
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const stage = Math.min(n - 1, Math.floor(progress * n));
      if (scene.dataset.active !== String(stage)) {
        scene.dataset.active = String(stage);
      }
      /* Bring the active circle to the END of its SVG parent so it
         paints on top of every other circle. Without this the
         smaller-on-top paint order means a larger active circle
         would be visually obscured by the smaller circles in front
         of it, and its "active" highlight wouldn't read. */
      const activeCircle = circleRefs.current[stage];
      if (activeCircle && activeCircle.parentNode && activeCircle !== activeCircle.parentNode.lastElementChild) {
        activeCircle.parentNode.appendChild(activeCircle);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateActive();
          ticking = false;
        });
        ticking = true;
      }
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActive);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActive);
    };
  }, [n]);

  if (n === 0) return null;

  return (
    <section
      ref={sceneRef}
      className={styles.scene}
      data-active="0"
      aria-label="Methodology"
    >
      <div className={styles.sticky}>
        <div className={styles.diagram}>
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            className={styles.svg}
            aria-hidden="true"
          >
            {/* Group 1: methodology circles. Rendered LARGEST first
                and SMALLEST last so the smaller circles paint on top
                (SVG honours paint order, not z-index). */}
            <g>
              {[...circles].reverse().map((c) => (
                <circle
                  key={`c-${c.idx}`}
                  ref={(el) => { circleRefs.current[c.idx] = el; }}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  className={styles.circle}
                  data-idx={c.idx}
                />
              ))}
            </g>

            {/* Group 2: ripples. Each circle has a matching invisible
                ripple that animates a single sonar pulse when its
                stage becomes active. Drawn in a separate <g> after
                the main circles so the pulse always paints above
                everything. */}
            <g>
              {circles.map((c) => (
                <circle
                  key={`r-${c.idx}`}
                  cx={c.cx}
                  cy={c.cy}
                  r={c.r}
                  className={styles.ripple}
                  data-idx={c.idx}
                />
              ))}
            </g>
          </svg>

          {/* HTML labels — positioned just below each arc's bottom,
              sitting on top of any larger circles' fills via z-index. */}
          {circles.map((c) => (
            <div
              key={`l-${c.idx}`}
              ref={(el) => { labelRefs.current[c.idx] = el; }}
              className={styles.label}
              style={{ top: `${c.labelTopPct}%` }}
              data-idx={c.idx}
            >
              {c.label}
            </div>
          ))}
        </div>

        {/* Body area — subheading + body cross-fade in unison as the
            scroll-driven active stage changes. */}
        <div className={styles.bodyArea}>
          {circles.map((c) => (
            <div
              key={`b-${c.idx}`}
              className={styles.bodyItem}
              data-idx={c.idx}
            >
              <h3 className={styles.bodyHeading}>{c.label}</h3>
              <div className={styles.body}>{c.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
