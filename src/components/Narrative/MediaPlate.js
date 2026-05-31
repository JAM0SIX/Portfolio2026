"use client";

/* MediaPlate — wraps a hero media element (video, image, iframe) in
   a sidebar-tall plate with a soft backdrop, so the media reads as
   a "device" floating on a coloured ground (à la the Vodafone
   reference). Used by the bleed branches of Video, ImagePlaceholder
   and PrototypeEmbed.

   Backdrop sources (opt-in via the `backdrop` prop):
     - backdrop.src      → an image
     - backdrop.color    → a flat colour
     - backdrop.unicorn  → a Unicorn.Studio project ID (animated
                           shader/gradient). Loads the unicorn
                           runtime once per page, then mounts the
                           embed div the runtime hydrates.
   With none of those the plate is just a tall transparent band.

   `backdrop.blur` — explicit on/off override. Images default to
   blurred (so a photo reads as ambience, not content); unicorn
   embeds default to no blur (the embed is the artwork). */

import { useEffect } from "react";
import styles from "./Narrative.module.css";

/* The Unicorn.Studio loader is idempotent — it stores a flag on
   window so calling init() repeatedly is safe. We replicate the
   official snippet here so MediaPlate doesn't need a global
   <Script> in layout.js; the loader only runs when a unicorn
   backdrop is actually mounted. */
function ensureUnicornStudio() {
  if (typeof window === "undefined") return;
  const u = window.UnicornStudio;
  if (u && u.init) {
    u.init();
    return;
  }
  window.UnicornStudio = { isInitialized: false };
  const existing = document.querySelector(
    'script[data-mediaplate-unicorn-loader="1"]'
  );
  if (existing) return; // another MediaPlate already kicked the loader off
  const s = document.createElement("script");
  s.src =
    "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.12/dist/unicornStudio.umd.js";
  s.dataset.mediaplateUnicornLoader = "1";
  s.onload = () => {
    if (window.UnicornStudio && window.UnicornStudio.init) {
      window.UnicornStudio.init();
    }
  };
  document.head.appendChild(s);
}

export default function MediaPlate({
  children,
  backdrop,
  poster,
  /* Padding on left + right so the backdrop shows as a frame
     around the device. Vertical centering is by flex (the plate
     itself is sized to the sidebar height in CSS). */
  inset = 100,
}) {
  const explicitSrc = backdrop?.src;
  const explicitColor = backdrop?.color;
  const unicornId = backdrop?.unicorn;
  /* Default blur differs by backdrop type: photos read better as
     soft ambience, animated unicorn embeds are themselves the
     visual so they shouldn't be blurred unless asked. */
  const blurDefault = !unicornId;
  const blurBackdrop = backdrop?.blur ?? blurDefault;

  useEffect(() => {
    if (unicornId) ensureUnicornStudio();
  }, [unicornId]);

  const blurredClass = blurBackdrop ? ` ${styles.mediaPlateBackdropBlurred}` : "";

  return (
    <div
      className={styles.mediaPlate}
      style={{ paddingLeft: inset, paddingRight: inset }}
    >
      {explicitSrc && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className={`${styles.mediaPlateBackdrop}${blurredClass}`}
          src={explicitSrc}
          alt=""
        />
      )}
      {explicitColor && (
        <div
          className={styles.mediaPlateBackdrop}
          style={{ background: explicitColor }}
        />
      )}
      {unicornId && (
        <div
          className={`${styles.mediaPlateBackdrop}${blurredClass}`}
          data-us-project={unicornId}
          aria-hidden="true"
        />
      )}
      <div className={styles.mediaPlateInner}>{children}</div>
    </div>
  );
}
