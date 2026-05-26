"use client";

/* SidebarComet — animated comet on the side panel's border.
   -----------------------------------------------------------
   Renders an SVG overlay sized exactly to the side panel's pixel
   bounds (measured via ResizeObserver) so a rectangle stroke
   perfectly traces the panel's outline. Multiple stacked <rect>
   strokes share the same animation duration but start at slightly
   different stroke-dashoffset values — the head leads and the
   shorter, dimmer segments behind form a fading trail. All segments
   move at the same rate, so the trail length stays constant and the
   speed around the perimeter is uniform (no slow-down or stretch
   at the corners). */

import { useEffect, useRef, useState } from "react";

/* Total perimeter speed in pixels per second. Bigger = faster lap. */
const SPEED_PX_PER_SEC = 110;

/* The comet is drawn as a series of contiguous SVG <rect> strokes,
   each sharing the same animation but offset slightly along the path
   so they form one continuous tapering line. The head is bright and
   slightly thicker; both opacity and stroke-width interpolate down
   toward the tail. Using many short segments (each SEGMENT_LEN px)
   lets the eye read the trail as a single gradient rather than
   bands. */
const SEGMENT_COUNT = 50;
const SEGMENT_LEN = 1.6;
const HEAD_WIDTH = 2.4;
const TAIL_WIDTH = 0.3;
const HEAD_OPACITY = 1.0;
const TAIL_OPACITY = 0.0;
/* Ease-out curve so brightness/thickness drops away quickly behind
   the head — concentrates the visual weight at the leading edge. */
const TAIL_EASE = 1.4;

const TRAIL_SEGMENTS = Array.from({ length: SEGMENT_COUNT }, (_, i) => {
  const t = i / SEGMENT_COUNT;
  const fade = Math.pow(t, TAIL_EASE);
  return {
    len: SEGMENT_LEN,
    gap: i * SEGMENT_LEN,
    width: HEAD_WIDTH - (HEAD_WIDTH - TAIL_WIDTH) * fade,
    opacity: HEAD_OPACITY - (HEAD_OPACITY - TAIL_OPACITY) * fade,
  };
});

export default function SidebarComet() {
  /* The component renders an empty placeholder pre-mount so the
     parent (.sidebar) can host us and we can measure it. */
  const hostRef = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const host = hostRef.current?.parentElement;
    if (!host || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize((prev) =>
        prev.w !== width || prev.h !== height ? { w: width, h: height } : prev,
      );
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, []);

  if (size.w === 0 || size.h === 0) {
    return <span ref={hostRef} style={{ display: "none" }} aria-hidden="true" />;
  }

  const W = size.w;
  const H = size.h;
  /* Inset the stroke by 0.5px so a 1px line sits on the pixel grid. */
  const INSET = 0.5;
  const innerW = W - 1;
  const innerH = H - 1;
  const perimeter = 2 * (innerW + innerH);
  const dur = perimeter / SPEED_PX_PER_SEC;

  return (
    <svg
      ref={hostRef}
      className="sidebar-comet-svg"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
    >
      {TRAIL_SEGMENTS.map((seg, i) => (
        <rect
          key={i}
          x={INSET}
          y={INSET}
          width={innerW}
          height={innerH}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={seg.width}
          strokeOpacity={seg.opacity}
          strokeLinecap="butt"
          strokeDasharray={`${seg.len} ${perimeter - seg.len}`}
        >
          <animate
            attributeName="stroke-dashoffset"
            from={seg.gap}
            to={seg.gap - perimeter}
            dur={`${dur}s`}
            repeatCount="indefinite"
          />
        </rect>
      ))}
    </svg>
  );
}
