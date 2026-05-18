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
   • Each instance manages its own open state — multiple SidePanels
     can live on the page and only the most recently clicked is open
     (closing one another is up to a higher coordinator if you ever
     need it).
   • Desktop (≥ 721px): right-side fixed drawer, slide + fade.
   • Mobile  (≤ 720px): inline accordion below the button.
   • Dismiss: close button inside the panel head only — no backdrop,
     no Esc. (Per design spec.) */

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./SidePanel.module.css";

/* Singleton "only one panel open at a time" coordinator. Each
   SidePanel dispatches a CustomEvent on window when it opens; all
   other instances listen and close themselves if the open id is not
   their own. Cheaper than a context provider and keeps each panel
   self-contained. */
const OPEN_EVENT = "sidepanel:open";

export default function SidePanel({ heading, body, children, variant = "button" }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  /* On desktop we portal the drawer to document.body so it escapes
     any transformed ancestor (which otherwise becomes the containing
     block for position: fixed and traps the drawer inside that
     subtree). On mobile the panel is styled as an inline accordion
     beneath its trigger, so it must stay in place. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 721px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Listen for other panels opening — close ourselves if it's not us. */
  useEffect(() => {
    const onOtherOpen = (e) => {
      if (e.detail !== id) setOpen(false);
    };
    window.addEventListener(OPEN_EVENT, onOtherOpen);
    return () => window.removeEventListener(OPEN_EVENT, onOtherOpen);
  }, [id]);

  const handleTrigger = () => {
    setOpen((v) => {
      const next = !v;
      if (next) {
        window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: id }));
      }
      return next;
    });
  };

  const triggerClass =
    variant === "inline"
      ? `link link--ink ${styles.triggerInline}`
      : `btn btn-secondary ${styles.trigger}`;

  const panel = (
    <aside
      className={`${styles.panel}${open ? " " + styles.isOpen : ""}`}
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
