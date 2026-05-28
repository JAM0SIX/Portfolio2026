"use client";

/* ProjectLayers — scroll-driven isometric rhombus stack.
   --------------------------------------------------------
   Backwards-compatible signatures:

   1. {problem, value, solution}                     — original 3-stage
   2. {problem, value, solution, membrane}           — adds a wrapping
                                                       4th "membrane"
                                                       layer that sits
                                                       BEHIND the three
                                                       pillars and glows
                                                       on stage 4

   Each layer prop may include a `deepBody` (string or string[]) and,
   if present, the slide renders a "Read more" link that opens a
   right-side SidePanel with that text. The short-form `body` is the
   inline paragraph below the title.

   Membrane visual: an outlined, larger rhombus centred under the
   stack. While stages 1–3 highlight one of the three pillars in
   turn, stage 4 dims the pillars to 30% accent and fills the
   membrane in full — reading as "the layer that wraps everything".

   The component also exposes a click affordance: clicking a pillar's
   rhombus or its progress dot jumps the viewport so the matching
   stage scrolls into view, so visitors who don't want to scroll can
   sample the layers directly. */

import { useEffect, useRef } from "react";
import "./ProjectLayers.css";
import SidePanel from "../SidePanel/SidePanel";

/* Stage transition points along the scroll progress (0..1). Indexed
   so the first entry is stage 1's threshold. Stage 0 is "below the
   first threshold" (all layers stacked). */
const THREE_STAGE = [0.22, 0.52, 0.78];
const FOUR_STAGE = [0.19, 0.40, 0.61, 0.82];

export default function ProjectLayers({
  problem,
  value,
  solution,
  membrane,
  className,
  compact = false,
}) {
  const sceneRef = useRef(null);
  const hasMembrane = !!membrane;
  const thresholds = hasMembrane ? FOUR_STAGE : THREE_STAGE;

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
      for (let i = thresholds.length - 1; i >= 0; i--) {
        if (progress >= thresholds[i]) {
          stage = i + 1;
          break;
        }
      }

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
  }, [
    problem?.body,
    value?.body,
    solution?.body,
    membrane?.body,
    hasMembrane,
    thresholds,
  ]);

  return (
    <section
      ref={sceneRef}
      className={`pl-scene${compact ? " pl-scene--compact" : ""}${
        hasMembrane ? " pl-scene--with-membrane" : ""
      }${className ? ` ${className}` : ""}`}
      data-stage="0"
      data-layout="wide"
      aria-label="Project layers"
    >
      <div className="pl-sticky">
        <div className="pl-stage">
          <div className="pl-stack">
            {/* Three isometric rhombi — back to the original vertical
                stack. The layer classes also encode each layer's
                stage offset (--pl-stack-gap up, 0, down). */}
            <div className="pl-layer pl-layer--bottom" aria-hidden="true" />
            <div className="pl-layer pl-layer--middle" aria-hidden="true" />
            <div className="pl-layer pl-layer--top" aria-hidden="true" />

            {/* Membrane (when present) — a 3D wireframe cuboid that
                contains the rhombus stack. Six face divs in a
                preserve-3d parent form the 12 visible edges of a
                transparent box. Faces are borders-only with
                transparent fill, so the result reads as a glass
                cuboid wrapping the layers. */}
            {hasMembrane && (
              <div className="pl-cuboid" aria-hidden="true">
                <div className="pl-cuboid-face pl-cuboid-front" />
                <div className="pl-cuboid-face pl-cuboid-back" />
                <div className="pl-cuboid-face pl-cuboid-east" />
                <div className="pl-cuboid-face pl-cuboid-west" />
                <div className="pl-cuboid-face pl-cuboid-top" />
                <div className="pl-cuboid-face pl-cuboid-bottom" />
              </div>
            )}
          </div>
        </div>

        <div className="pl-panel">
          <div className="pl-slides">
            <Slide n={1} data={problem} fallbackTitle="Problem" />
            <Slide n={2} data={value} fallbackTitle="Business value" />
            <Slide n={3} data={solution} fallbackTitle="Solution" />
            {hasMembrane && (
              <Slide n={4} data={membrane} fallbackTitle="Membrane" />
            )}
          </div>
        </div>

        <div className="pl-progress" aria-hidden="true">
          <span className="pl-dot" data-dot="1" />
          <span className="pl-dot" data-dot="2" />
          <span className="pl-dot" data-dot="3" />
          {hasMembrane && <span className="pl-dot" data-dot="4" />}
        </div>
      </div>
    </section>
  );
}

/* Single slide — title + short body + optional Read-more SidePanel.
   The SidePanel is only rendered when `data.deepBody` exists, so
   slides that don't want a drawer just render as plain text.

   Note: the read-more wrapper is a <div>, not a <p>. SidePanel
   portals its <aside> (which contains an <h3>) to document.body
   only after mount in useEffect — pre-hydration the <aside> is a
   child of whatever wraps the trigger, and <p> can't legally
   contain block-level descendants. <div> sidesteps the hydration
   warning while keeping the same visual block. */
function Slide({ n, data, fallbackTitle }) {
  if (!data) return null;
  const title = data.title ?? fallbackTitle;
  return (
    <article className="pl-slide" data-slide={n}>
      <div className="pl-text">
        <h3>{title}</h3>
        <p className="pl-body">{data.body}</p>
        {data.deepBody && (
          <div className="pl-readmore">
            <SidePanel
              variant="inline"
              heading={title}
              body={renderDeepBody(data.deepBody)}
            >
              Read more
            </SidePanel>
          </div>
        )}
      </div>
    </article>
  );
}

/* Convert markdown-sourced deep body into ReactNodes the SidePanel
   can render. Accepts a single string, an array of paragraph
   strings, or already-rendered JSX (pass-through). */
function renderDeepBody(body) {
  if (typeof body === "string") return <p>{body}</p>;
  if (Array.isArray(body)) {
    return (
      <>
        {body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </>
    );
  }
  return body;
}
