"use client";

/* ExperimentsList — the experiments index. Each entry opens a modal with the
   live experiment running in an iframe (?embed=1 strips the page chrome),
   plus its title and description. */

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import LivePreview from "./LivePreview";
import ExperimentModal from "@/components/ExperimentModal/ExperimentModal";
import Ripple from "@/components/Ripple/Ripple";

export default function ExperimentsList({ experiments }) {
  const [selected, setSelected] = useState(null);
  const sel = selected != null ? experiments[selected] : null;

  /* Theme-aware thumbnails: swap each experiment's ring image to its dark
     variant under onyx (matches the landing carousel). */
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const read = () => setDark(document.documentElement.dataset.theme === "onyx");
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => mo.disconnect();
  }, []);

  return (
    <>
      <ul className={styles.list}>
        {experiments.map((e, i) => (
          <li key={e.slug}>
            <button
              type="button"
              className={styles.entry}
              onClick={() => setSelected(i)}
            >
              <div className={styles.entryGrid}>
                {e.slug === "ripple" ? (
                  /* No static image — show the live ripple (ambient only;
                     the click target is the card itself). */
                  <div className={styles.thumb}>
                    <Ripple interactive={false} />
                  </div>
                ) : (
                  <LivePreview
                    src={dark && e.imageDark ? e.imageDark : e.image}
                    alt={e.title}
                  />
                )}
                <div className={styles.entryBody}>
                  <div className={styles.entryHead}>
                    <h2 className={styles.entryTitle}>{e.title}</h2>
                    {e.meta && <span className={styles.entryMeta}>{e.meta}</span>}
                  </div>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <ExperimentModal experiment={sel} onClose={() => setSelected(null)} />
    </>
  );
}
