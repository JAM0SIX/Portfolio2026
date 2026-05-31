"use client";

/* Video — narrative block that renders a looping silent screen
   recording (e.g. the PhilpotPearce live-site hero). In-line
   figures use a square-cornered bordered frame at 16:9; bleed
   (hero) figures sit inside a MediaPlate that provides the
   colored backdrop + drop-shadow "device" treatment.

   Reduced-motion handling
   -----------------------
   prefers-reduced-motion swaps the <video> for a static <img>
   poster. The check runs on the client (matchMedia is undefined
   on the server); SSR renders the video element so first paint
   has the right markup for the common case, and we swap to the
   poster after mount if reduce matches. */

import { useEffect, useRef, useState } from "react";
import MediaPlate from "./MediaPlate";
import styles from "./Narrative.module.css";

export default function Video({
  src,
  caption,
  poster,
  /* Sizing model:
       - In-line figures default to a 16:9 aspect ratio.
       - Bleed (hero) figures default to a fixed 650px plate
         height. The video itself sits inside that plate at 16:9
         with a drop shadow.
     An explicit `aspect` on the block overrides the default and
     restores aspect-ratio sizing for the in-line case too. */
  aspect,
  /* When true the figure spans the case study's bleed track —
     full width of the main column — instead of the reading
     column. Used for hero videos. The "bleed" class is a global
     hook that .narrative routes via subgrid. */
  bleed = false,
  /* Plate backdrop config for bleed heroes. Defaults to a
     blurred copy of the poster, so each hero's own palette
     becomes its backdrop without per-project artwork.
     Pass { src }, { color } or false to override. */
  backdrop,
  /* Per-instance height override for bleed videos — useful when
     a single hero wants a slightly different device size from
     the 650px default (e.g. PhilpotPearce at 680). Ignored when
     `aspect` is set or when the video is in-line (non-bleed). */
  height,
}) {
  const [reduced, setReduced] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Pause the loop when the video scrolls out of view, resume when
     it comes back. Keeps the decode/render cost off the GPU when
     the reader is elsewhere on the page and stops the audio-free
     loop from chewing battery on long case studies.
     Threshold 0.05 means "as soon as a sliver is visible play"; the
     guard against the reduced-motion / poster fallback means we
     don't try to play() on an <img>. */
  useEffect(() => {
    if (reduced) return; // poster is rendered instead — nothing to gate
    const el = videoRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            /* play() returns a promise that can reject when the
               element is already paused/aborted — swallow it. */
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  /* The actual media element — same JSX whether bleed or in-line.
     For bleed it sits inside the MediaPlate wrapper; for in-line
     it sits directly in the bordered frame. */
  const media = reduced && poster ? (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img src={poster} alt={caption || ""} className={styles.videoMedia} />
  ) : (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="metadata"
      className={styles.videoMedia}
      aria-hidden={caption ? undefined : true}
    />
  );

  /* Bleed (hero) heights default to 650px so heroes land at the
     same size they did before MediaPlate was introduced. `height`
     overrides that default per-instance; `aspect` overrides both
     and restores aspect-ratio sizing. */
  const bleedFrameStyle =
    bleed && !aspect
      ? { height: height ?? 650 }
      : { aspectRatio: aspect ?? "16 / 9" };

  return (
    <figure className={`${styles.videoEmbed}${bleed ? " bleed" : ""}`}>
      {bleed ? (
        <MediaPlate backdrop={backdrop} poster={poster}>
          <div className={styles.videoFrame} style={bleedFrameStyle}>
            {media}
          </div>
        </MediaPlate>
      ) : (
        <div
          className={styles.videoFrame}
          style={{ aspectRatio: aspect ?? "16 / 9" }}
        >
          {media}
        </div>
      )}
      {caption && (
        <figcaption className={styles.imageCaption}>{caption}</figcaption>
      )}
    </figure>
  );
}
