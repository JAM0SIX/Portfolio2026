"use client";

/* SidePanel — a secondary button + drawer pair.
   ----------------------------------------------
   Usage:
     <SidePanel heading="The brief" body={<>
       <p>First paragraph…</p>
       <p>Second paragraph…</p>
     </>}>
       Read the brief
     </SidePanel>

   • Trigger button (the children prop) uses .btn .btn-secondary
     from the design system.
   • Each instance manages its own open state. A window-level event
     coordinator ensures only one panel is open at a time.
   • Desktop (≥ 721 px): right-side fixed drawer, animated via the
     Web Animations API in four stages — dot → horizontal line →
     full rectangle → chamfered rectangle. Border-as-clip; content
     stays at full size. Close reverses the same stages.
   • If a different trigger is clicked while a panel is already
     open, both the current close and the new open SKIP their
     animations and snap to their final states — the swap reads as
     "the same panel changed its content" rather than two stacked
     reveals.
   • Mobile (≤ 720 px): inline accordion below the button.
   • Dismiss: close button inside the panel head only — no
     backdrop, no Esc. (Per design spec.) */

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SidePanel.module.css";

/* Singleton "only one panel open at a time" coordinator. Each panel
   dispatches a CustomEvent on window when it opens; the rest listen
   and close themselves. */
const OPEN_EVENT = "sidepanel:open";

/* Animation duration in ms. Slower than the original 320 ms so the
   four stages each have time to read distinctly. */
const DURATION = 800;
const EASING = "cubic-bezier(0.4, 0, 0.2, 1)";

/* Clip-path polygons for each stage of the open/close animation.
   All three polygons have exactly 6 vertices so the Web Animations
   API can interpolate between them smoothly. Point-by-point mapping
   (vertex 1 in DOT_CLIP morphs into vertex 1 in LINE_CLIP, etc.)
   keeps the shape transition predictable.

   DOT: a 6×4 px nubbin centred on the panel.
   LINE: a full-width 4 px tall strip at vertical centre.
   CHAMFER: full panel area with top-left + bottom-right cut.

   Note: there's deliberately no "sharp rectangle" stage between
   line and chamfer. Including one would animate the chamfer
   corners IN at the end of the reveal (line → sharp rect → chamfer);
   skipping it means the corners morph straight from their line
   positions to their chamfered positions, so the chamfer is
   present throughout the expansion instead of being cut at the
   final beat. */
const DOT_CLIP =
  "polygon(" +
  "calc(50% - 3px) calc(50% - 2px), " +
  "calc(50% + 3px) calc(50% - 2px), " +
  "calc(50% + 3px) calc(50% + 2px), " +
  "calc(50% + 3px) calc(50% + 2px), " +
  "calc(50% - 3px) calc(50% + 2px), " +
  "calc(50% - 3px) calc(50% - 2px)" +
  ")";
const LINE_CLIP =
  "polygon(" +
  "0% calc(50% - 2px), " +
  "100% calc(50% - 2px), " +
  "100% calc(50% + 2px), " +
  "100% calc(50% + 2px), " +
  "0% calc(50% + 2px), " +
  "0% calc(50% - 2px)" +
  ")";
const CHAMFER_CLIP =
  "polygon(" +
  "var(--chamfer-size) 0%, " +
  "100% 0%, " +
  "100% calc(100% - var(--chamfer-size)), " +
  "calc(100% - var(--chamfer-size)) 100%, " +
  "0% 100%, " +
  "0% var(--chamfer-size)" +
  ")";

export default function SidePanel({ heading, body, children, variant = "button" }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const panelRef = useRef(null);
  /* The in-flight Animation object (if any). Cancelled before
     starting a new one so we never have two running on the same
     element. */
  const animationRef = useRef(null);
  /* When true, the next open/close transition skips the animation
     and snaps to the final state. Set by handleTrigger when the
     user clicks a different trigger while another panel is open
     (a "switch"), and by the cross-panel close listener for the
     panel being switched away from. */
  const skipNextAnimRef = useRef(false);
  /* Avoids running the close animation on initial mount. The
     useEffect that drives animation fires on every change to
     `open`, including the first commit where open is its initial
     false — without this guard, every page load would visibly
     play the close animation backwards into the dot. */
  const hasRunOnceRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Drive the animation whenever `open` flips. */
  useEffect(() => {
    /* Mobile uses a different reveal mechanism (grid-template-rows
       accordion) so the WAAPI path is desktop-only. */
    if (!isDesktop) return;
    const el = panelRef.current;
    if (!el) return;

    /* Initial render — no animation, the CSS resting state already
       has the panel clipped to a dot at opacity 0. */
    if (!hasRunOnceRef.current) {
      hasRunOnceRef.current = true;
      return;
    }

    /* Cancel any animation already in flight so a fast click sequence
       doesn't stack effects. */
    if (animationRef.current) {
      animationRef.current.cancel();
      animationRef.current = null;
    }

    /* "Switch" path — the next state change should be instant. Write
       the destination state to inline style directly and bail. */
    if (skipNextAnimRef.current) {
      skipNextAnimRef.current = false;
      el.style.clipPath = open ? CHAMFER_CLIP : DOT_CLIP;
      el.style.opacity = open ? "1" : "0";
      return;
    }

    /* Animated path — three keyframes for open, three for close.
       Without an intermediate sharp-rectangle stage, the chamfer
       is present throughout the reveal (rather than being cut in
       at the very end).
       - Open: dot (0%) → line (15%) → chamfered rect (100%).
         Fast horizontal expansion at the start (dot to line in
         ~120 ms); the remaining 680 ms reveals the height with
         chamfer corners already in their final positions.
       - Close: reverses — chamfered rect collapses to a line in
         ~680 ms, then line snaps to dot in ~120 ms. */
    const frames = open
      ? [
          { clipPath: DOT_CLIP, opacity: 0, offset: 0 },
          { clipPath: LINE_CLIP, opacity: 1, offset: 0.15 },
          { clipPath: CHAMFER_CLIP, opacity: 1, offset: 1 },
        ]
      : [
          { clipPath: CHAMFER_CLIP, opacity: 1, offset: 0 },
          { clipPath: LINE_CLIP, opacity: 1, offset: 0.85 },
          { clipPath: DOT_CLIP, opacity: 0, offset: 1 },
        ];

    animationRef.current = el.animate(frames, {
      duration: DURATION,
      easing: EASING,
      fill: "forwards",
    });
  }, [open, isDesktop]);

  /* Cross-panel coordinator. When *another* panel opens, this panel
     closes — and skips its close animation so the switch reads as
     content swap. */
  useEffect(() => {
    const onOtherOpen = (e) => {
      if (e.detail === id) return;
      if (open) {
        skipNextAnimRef.current = true;
        setOpen(false);
      }
    };
    window.addEventListener(OPEN_EVENT, onOtherOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOtherOpen);
  }, [id, open]);

  const handleTrigger = () => {
    const next = !open;
    if (next) {
      /* Opening — if any other panel is currently open, this is a
         switch. Mark our open animation to skip so we appear
         instantly in the open state (and the closing panel does
         the same on its end). */
      const anotherOpen = !!document.querySelector(
        `[data-sidepanel-open="true"]`,
      );
      if (anotherOpen) skipNextAnimRef.current = true;
    }
    setOpen(next);
    if (next) {
      /* Dispatch in a microtask so the resulting setOpen(false) on
         other panels doesn't fire inside React's current render
         phase. */
      queueMicrotask(() => {
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
      });
    }
  };

  const triggerClass =
    variant === "inline"
      ? `link link--ink ${styles.triggerInline}`
      : `btn btn-secondary ${styles.trigger}`;

  /* Two-layer structure: an unclipped wrapper that carries the
     drop-shadow, and the inner <aside> that carries the chamfer
     clip-path and the animated reveal.

     Why both layers: CSS applies `filter` BEFORE `clip-path` in
     the rendering pipeline, so putting drop-shadow on a clipped
     element causes the shadow itself to be cut off at the chamfer
     polygon — nothing extends beyond the panel's visible
     silhouette. With the shadow on an unclipped parent, the
     filter sees the inner aside's already-clipped paint and
     casts a shadow of that chamfered shape outward freely. */
  const panel = (
    <div
      className={`${styles.shadowWrap}${open ? " " + styles.isOpen : ""}`}
    >
      <aside
        ref={panelRef}
        className={`${styles.panel}${open ? " " + styles.isOpen : ""}`}
        data-sidepanel-open={open ? "true" : "false"}
        role="dialog"
        aria-modal="false"
        aria-label={typeof heading === "string" ? heading : undefined}
        aria-hidden={!open}
      >
        <div className={styles.shell}>
          <header className={styles.head}>
            <h3 className={styles.heading}>{heading}</h3>
            <button
              type="button"
              className={styles.close}
              onClick={() => setOpen(false)}
              aria-label="Close panel"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <line x1="3" y1="3" x2="13" y2="13" />
                <line x1="13" y1="3" x2="3" y2="13" />
              </svg>
            </button>
          </header>
          <div className={styles.body}>{body}</div>
        </div>
      </aside>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className={triggerClass}
        onClick={handleTrigger}
        aria-expanded={open}
      >
        {children}
      </button>

      {isDesktop ? createPortal(panel, document.body) : panel}
    </>
  );
}
