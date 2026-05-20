"use client";

/* PillarScroll — scroll-pinned scene that introduces three pillars
   one at a time, then sweeps a "membrane" band across all three
   to represent a cross-cutting layer (e.g. an agent layer).
   Stages 0..3 driven by scroll progress through the 220vh scene.

   Props:
     eyebrow?  short label above the stage
     pillars   [{ title, body }]   exactly three
     membrane  { label }           the membrane's label */

import { useEffect, useRef } from "react";
import styles from "./PillarScroll.module.css";

export default function PillarScroll({ eyebrow, pillars = [], membrane }) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    /* 4 stages (0..3). Pillars reveal at stages 1, 2, 3; the agent
       membrane reveals at stage 3 alongside the final pillar so it
       lands last in the sequence. */
    const update = () => {
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;
      const stage = Math.min(3, Math.floor(progress * 4));
      if (scene.dataset.stage !== String(stage)) {
        scene.dataset.stage = String(stage);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sceneRef}
      className={styles.scene}
      data-stage="0"
      aria-label="Strategic move: three pillars and a cross-cutting layer"
    >
      <div className={styles.sticky}>
        {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
        <div className={styles.stage}>
          <div className={styles.membrane} aria-hidden="true">
            {membrane?.label && (
              <span className={styles.membraneLabel}>{membrane.label}</span>
            )}
          </div>
          {pillars.slice(0, 3).map((p, i) => (
            <article key={i} className={styles.pillar} data-idx={i}>
              <div className={styles.pillarInner}>
                <span className={styles.pillarIndex}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={styles.pillarTitle}>{p.title}</h3>
                <p className={styles.pillarBody}>{p.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
