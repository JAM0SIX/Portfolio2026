"use client";

/* MediaPlate — wraps a hero media element (video, image, iframe) in
   a fixed-height plate with a soft backdrop and inset shadow, so the
   media reads as a "device" floating on a colored ground (à la the
   Vodafone reference). Used by the bleed branches of Video,
   ImagePlaceholder and PrototypeEmbed.

   Backdrop sources, in priority order:
     1. backdrop.src   — explicit image
     2. backdrop.color — flat colour
     3. poster         — fallback: a blurred copy of the media's
                         poster (so each hero's own palette becomes
                         its plate without needing a separate asset)
     4. neutral gradient — last resort when nothing else is available

   The blurred-poster fallback is the most common path. Filter +
   scale produce a soft color smear of the hero's own palette, so
   the plate matches the media without needing per-project artwork. */

import styles from "./Narrative.module.css";

export default function MediaPlate({
  children,
  backdrop,
  poster,
  /* Padding on all four sides of the device so the backdrop
     shows as a frame around it. Same value on every edge keeps
     the device centred. */
  inset = 100,
}) {
  /* Decide what the backdrop layer looks like. Explicit src wins;
     a flat colour is a one-line override; otherwise blur the
     poster. If none of those are available we render nothing at
     all (no gradient fallback) — the plate just becomes a tall
     transparent band that lets the page background show. */
  const explicitSrc = backdrop?.src;
  const explicitColor = backdrop?.color;
  const blurredPoster = !explicitSrc && !explicitColor ? poster : null;

  return (
    <div
      className={styles.mediaPlate}
      style={{ paddingLeft: inset, paddingRight: inset }}
    >
      {explicitSrc && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img className={styles.mediaPlateBackdrop} src={explicitSrc} alt="" />
      )}
      {explicitColor && (
        <div
          className={styles.mediaPlateBackdrop}
          style={{ background: explicitColor }}
        />
      )}
      {blurredPoster && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          className={`${styles.mediaPlateBackdrop} ${styles.mediaPlateBackdropBlurred}`}
          src={blurredPoster}
          alt=""
        />
      )}
      <div className={styles.mediaPlateInner}>{children}</div>
    </div>
  );
}
