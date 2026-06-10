"use client";

/* CvLink — a footer link that opens a read-only CV in a dismissible
   overlay. No download/print affordance anywhere: the CV is rendered
   as on-brand HTML inside a modal that closes on the X button, Esc, or
   a backdrop click. Portaled to <body> so it overlays the whole page.

   The trigger is a plain <button> styled by the caller (the footer
   passes its socialLink class) so it sits inline with the other footer
   links. */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./CvLink.module.css";
import Cv from "./Cv";

function CvIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
      <line x1="8" y1="9" x2="10" y2="9" />
    </svg>
  );
}

export default function CvLink({ className, label = "CV" }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  /* While open: lock body scroll, close on Esc, and move focus to the
     close button so keyboard users land inside the dialog. */
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const overlay = (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Harry Spawforth, curriculum vitae"
      >
        <button
          type="button"
          ref={closeRef}
          className={styles.close}
          onClick={() => setOpen(false)}
          aria-label="Close CV"
        >
          <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="3" x2="13" y2="13" />
            <line x1="13" y1="3" x2="3" y2="13" />
          </svg>
        </button>
        <Cv />
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        className={className}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <CvIcon />
        <span>{label}</span>
      </button>
      {mounted && open && createPortal(overlay, document.body)}
    </>
  );
}
