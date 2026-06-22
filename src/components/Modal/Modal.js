"use client";

/* Modal — shared dialog used by the experiments carousel and the experiments
   page. Title, an artefact (image or live iframe) passed as children, and a
   short description. Portalled to <body> so it sits above pinned sections and
   the fixed sidebar. Closes on the ✕ button, Esc, or a backdrop click. */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

export default function Modal({ title, description, onClose, children, wide = false }) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div className={styles.backdrop} role="presentation" onClick={onClose}>
      <div
        className={`${styles.modal}${wide ? " " + styles.modalWide : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shared-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        <h2 id="shared-modal-title" className={styles.title}>
          {title}
        </h2>
        <div className={styles.artefact}>{children}</div>
        {description ? <p className={styles.desc}>{description}</p> : null}
      </div>
    </div>,
    document.body,
  );
}
