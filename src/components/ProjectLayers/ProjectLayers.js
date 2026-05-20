"use client";

/* ProjectLayers — scroll-driven Problem / Value / Solution stack.
   An isometric rhombus stack separates as the user scrolls; each stage
   highlights one layer and fades in its description. */

import { useEffect, useRef } from "react";
import "./ProjectLayers.css";

export default function ProjectLayers({ problem, value, solution, className, compact = false }) {
  const sceneRef = useRef(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const syncLayoutDataset = () => {
      const w = window.innerWidth;
      const layout = w <= 800 ? "stacked" : w <= 1100 ? "medium" : "wide";
      scene.dataset.layout = layout;
    };

    const updateStage = () => {
      syncLayoutDataset();
      const rect = scene.getBoundingClientRect();
      const total = scene.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = total > 0 ? scrolled / total : 0;

      let stage = 0;
      if (progress >= 0.78) stage = 3;
      else if (progress >= 0.52) stage = 2;
      else if (progress >= 0.22) stage = 1;
      else stage = 0;

      if (scene.dataset.stage !== String(stage)) {
        scene.dataset.stage = String(stage);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateStage();
          ticking = false;
        });
        ticking = true;
      }
    };
    const onResize = () => updateStage();
    const onMqChange = () => updateStage();

    syncLayoutDataset();
    updateStage();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const mq800 = window.matchMedia("(max-width: 800px)");
    const mq1100 = window.matchMedia("(max-width: 1100px)");
    mq800.addEventListener("change", onMqChange);
    mq1100.addEventListener("change", onMqChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq800.removeEventListener("change", onMqChange);
      mq1100.removeEventListener("change", onMqChange);
    };
  }, [problem.body, value.body, solution.body]);

  return (
    <section
      ref={sceneRef}
      className={`pl-scene${compact ? " pl-scene--compact" : ""}${className ? ` ${className}` : ""}`}
      data-stage="0"
      data-layout="wide"
      aria-label="Project layers — problem, value, solution"
    >
      <div className="pl-sticky">
        <div className="pl-stage">
          <div className="pl-stack">
            <div className="pl-layer pl-layer--bottom" aria-hidden="true" />
            <div className="pl-layer pl-layer--middle" aria-hidden="true" />
            <div className="pl-layer pl-layer--top" aria-hidden="true" />
          </div>
        </div>

        <div className="pl-panel">
          <div className="pl-slides">
            <article className="pl-slide" data-slide="1">
              <div className="pl-text">
                <h3>{problem.title ?? "Problem"}</h3>
                <p className="pl-body">{problem.body}</p>
              </div>
            </article>
            <article className="pl-slide" data-slide="2">
              <div className="pl-text">
                <h3>{value.title ?? "Business value"}</h3>
                <p className="pl-body">{value.body}</p>
              </div>
            </article>
            <article className="pl-slide" data-slide="3">
              <div className="pl-text">
                <h3>{solution.title ?? "Solution"}</h3>
                <p className="pl-body">{solution.body}</p>
              </div>
            </article>
          </div>
        </div>

        <div className="pl-progress" aria-hidden="true">
          <span className="pl-dot" data-dot="1" />
          <span className="pl-dot" data-dot="2" />
          <span className="pl-dot" data-dot="3" />
        </div>
      </div>
    </section>
  );
}
