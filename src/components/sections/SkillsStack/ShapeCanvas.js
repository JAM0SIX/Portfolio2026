"use client";

/* ShapeCanvas — React wrapper around the zero-dependency ShapeIcon class
   (shape-icons.js). Mounts an animated 3D wireframe icon into a slot and
   tears it down on unmount. The class owns its own canvas, rAF loop, and
   resize handling; we just give it a host element and a few options.

   `style` is forwarded verbatim to ShapeIcon's per-instance style override
   (e.g. to retheme the blue stage). `radius` matches the card's inner
   radius so the stage's rounded corners sit flush inside the cell. */

import { useEffect, useRef } from "react";
import { ShapeIcon } from "./shape-icons.js";

export default function ShapeCanvas({
  shape = "torus",
  autospin = true,
  speed = 1,
  interactive = true,
  radius = 10,
  iconStyle,
  className,
}) {
  const slotRef = useRef(null);

  useEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const icon = new ShapeIcon(slot, {
      shape,
      autospin,
      speed,
      interactive,
      radius,
      ...(iconStyle ? { style: iconStyle } : {}),
    });
    return () => icon.destroy();
    // iconStyle is intentionally not a dep — pass a stable object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shape, autospin, speed, interactive, radius]);

  return <div ref={slotRef} className={className} aria-hidden="true" />;
}
