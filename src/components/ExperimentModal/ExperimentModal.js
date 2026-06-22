"use client";

/* ExperimentModal — the live-experiment dialog. An embedded iframe of the
   experiment (chrome stripped via ?embed=1) plus a caption: the tech it's
   built with and a short note on why I made it. Shared by the experiments
   page list and the landing carousel ring so both modals match. */

import Modal from "@/components/Modal/Modal";
import styles from "./ExperimentModal.module.css";

export default function ExperimentModal({ experiment, onClose }) {
  if (!experiment) return null;
  const { title, href, meta, note } = experiment;

  return (
    <Modal
      wide
      title={title}
      onClose={onClose}
      description={
        meta || note ? (
          <span className={styles.caption}>
            {meta ? (
              <span className={styles.builtWith}>Built with {meta}</span>
            ) : null}
            {note ? <span className={styles.note}>{note}</span> : null}
          </span>
        ) : null
      }
    >
      <iframe
        src={`${href}?embed=1`}
        title={`${title} — live`}
        className={styles.frame}
        loading="lazy"
      />
    </Modal>
  );
}
