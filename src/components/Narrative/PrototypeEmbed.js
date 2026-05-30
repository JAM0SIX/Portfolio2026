"use client";

/* PrototypeEmbed — narrative block that drops a live, interactive
   prototype into the case study via an iframe.

   Sizing model
   ------------
   Each embedded prototype is a React/Vite SPA built against a fixed
   "native" viewport (1920x1080 for the 16:9 prototypes, 1440x1080 for
   the 4:3 ones). The React app reads window.innerWidth/innerHeight at
   mount and lays out around those values, so it doesn't reflow into a
   smaller iframe — content ends up positioned far below the visible
   area. The fix is to render the iframe at its native size and then
   CSS-scale the whole thing down to fit the frame.

   The frame's aspect ratio is configurable per block (`aspect`). When
   it matches the native aspect, scaling fits perfectly. When the
   frame aspect differs from native, the iframe is scaled with
   `max(frame/native)` — the cover behaviour — so the frame is fully
   filled and the peripheral edges of the prototype crop off-frame. A
   focus point (default centre) and a zoom multiplier let a block home
   in on a specific region of the prototype.

   In-view gating
   --------------
   Each prototype runs a continuous animated loop on mount. Mounting
   them all on page load would start every loop simultaneously while
   most are off-screen, wasting CPU and (more importantly) putting the
   prototypes out of phase with what the reader is actually looking at
   by the time they scroll to one. We use an IntersectionObserver to
   defer iframe mount until the frame first enters the viewport. A
   poster image (when provided) renders in the meantime as a preview,
   so the reader sees the opening frame of the loop before it starts.
   The gate is one-way — once the iframe has mounted we keep it
   running even after the reader scrolls past, so re-entering the
   section doesn't reset the loop or flicker.

   Reduced-motion handling
   -----------------------
   prefers-reduced-motion swaps the iframe for the same poster image
   permanently. Both that check and the in-view check happen on the
   client; SSR renders the poster (or an empty placeholder when no
   poster is supplied) as the safe initial state. */

import { useEffect, useRef, useState } from "react";
import MediaPlate from "./MediaPlate";
import styles from "./Narrative.module.css";

export default function PrototypeEmbed({
  src,
  caption,
  poster,
  aspect = "16 / 9",
  nativeWidth = 1920,
  nativeHeight = 1080,
  zoom = 1,
  focus,
  /* Optional auto-loop. When set, the iframe is reloaded every N
     seconds so any one-shot mount animation inside (e.g. the
     home page's ScrambleText headline) re-plays from the start.
     Leave undefined for prototypes that already loop themselves. */
  loopSeconds,
  /* When true the figure spans the case study's bleed track —
     full width of the main column — instead of the reading
     column. The "bleed" class is a global hook that .narrative
     routes via subgrid. */
  bleed = false,
  /* Plate backdrop config for bleed heroes. Defaults to a
     blurred copy of the poster. */
  backdrop,
}) {
  const frameRef = useRef(null);
  const iframeRef = useRef(null);
  const [reduced, setReduced] = useState(false);
  /* Whether the frame has been within viewport at least once. Stays
     true once flipped so we never un-mount the iframe on scroll-out
     (which would reset the loop mid-cycle every time the reader
     scrolls back). */
  const [hasEnteredView, setHasEnteredView] = useState(false);

  /* Default the focus point to the centre of the native canvas. We
     resolve it here (rather than at the parameter default) so it
     follows nativeWidth/nativeHeight when those are customised per
     block. */
  const focusX = focus?.[0] ?? nativeWidth / 2;
  const focusY = focus?.[1] ?? nativeHeight / 2;

  /* Track the reduced-motion preference. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  /* Auto-loop. When `loopSeconds` is set and the iframe has been
     mounted, restart it every N seconds by re-assigning src. This
     re-mounts the inner React app so one-shot opening animations
     (the home page's ScrambleText headline) cycle back to the
     start without our needing to add a re-play hook inside the
     embedded page. */
  useEffect(() => {
    if (!hasEnteredView || reduced || !loopSeconds) return;
    const id = setInterval(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      // Re-assigning the same src triggers a full reload.
      // eslint-disable-next-line no-self-assign
      iframe.src = iframe.src;
    }, loopSeconds * 1000);
    return () => clearInterval(id);
  }, [hasEnteredView, reduced, loopSeconds]);

  /* Mount the iframe once the frame intersects the viewport. The
     rootMargin lets us start the loop a touch before the frame is
     fully on screen, so the reader doesn't catch the opening tick
     mid-scroll. The reduced-motion path skips this entirely — the
     poster covers that case. */
  useEffect(() => {
    if (reduced || hasEnteredView) return;
    const frame = frameRef.current;
    if (!frame) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEnteredView(true);
          io.disconnect();
        }
      },
      { rootMargin: "150px 0px" },
    );
    io.observe(frame);
    return () => io.disconnect();
  }, [reduced, hasEnteredView]);

  /* Drive the iframe's transform from the frame's measured size:
     scale to *cover* the frame (so non-native aspect ratios crop
     instead of leaving empty bands), then translate so the focus
     point of the native canvas lands at the frame centre.

     Belt-and-braces triggers: a ResizeObserver, a window resize
     listener, an iframe load listener, and a delayed RAF tick.
     The RAF guards against the case where the effect runs before
     the browser has finished applying the frame's aspect-ratio
     inline style (initial measurement reads a collapsed size and
     no further size change ever happens). The iframe load listener
     re-measures once the inner React app has mounted, which can
     change the frame's effective sizing if the host page's layout
     shifts in response. */
  useEffect(() => {
    if (!hasEnteredView || reduced) return;
    const frame = frameRef.current;
    if (!frame) return;
    const update = () => {
      const iframe = iframeRef.current;
      if (!iframe) return;
      const r = frame.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      const scale =
        Math.max(r.width / nativeWidth, r.height / nativeHeight) * zoom;
      const tx = r.width / 2 - focusX * scale;
      const ty = r.height / 2 - focusY * scale;
      iframe.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    };
    update();
    const rafId = requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    window.addEventListener("resize", update);
    const iframe = iframeRef.current;
    iframe?.addEventListener("load", update);
    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener("resize", update);
      iframe?.removeEventListener("load", update);
    };
  }, [hasEnteredView, reduced, zoom, focusX, focusY, nativeWidth, nativeHeight]);

  /* Three render states:
     1. reduced motion → poster forever (no iframe ever mounts)
     2. !hasEnteredView → poster as preview (iframe not mounted yet)
     3. in view → iframe mounted; poster removed
     States 1 and 2 share the same poster markup so the layout
     doesn't shift on first intersection. */
  const showPoster = reduced || !hasEnteredView;

  const frame = (
    <div
      ref={frameRef}
      className={styles.prototypeFrame}
      style={{ aspectRatio: aspect }}
    >
      {showPoster && poster && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={poster}
          alt={caption || ""}
          className={styles.prototypePoster}
        />
      )}
      {!reduced && hasEnteredView && (
        <iframe
          ref={iframeRef}
          src={src}
          title={caption || "Prototype"}
          sandbox="allow-scripts allow-same-origin"
          allow="autoplay"
          className={styles.prototypeIframe}
          style={{ width: nativeWidth, height: nativeHeight }}
        />
      )}
    </div>
  );

  return (
    <figure className={`${styles.prototypeEmbed}${bleed ? " bleed" : ""}`}>
      {bleed ? (
        <MediaPlate backdrop={backdrop} poster={poster}>{frame}</MediaPlate>
      ) : (
        frame
      )}
      {caption && (
        <figcaption className={styles.imageCaption}>{caption}</figcaption>
      )}
    </figure>
  );
}
