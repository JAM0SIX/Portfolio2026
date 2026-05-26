"use client";

/* Comet — animated comet on a rectangular border.
   -------------------------------------------------
   Renders an SVG overlay sized exactly to its host's pixel bounds
   (measured via ResizeObserver) so a rectangle stroke perfectly
   traces the host's outline. The comet is drawn as a series of
   contiguous SVG <rect> strokes, each sharing the same animation
   but offset slightly along the path so they form one continuous
   tapering line. The head is bright and slightly thicker; both
   opacity and stroke-width interpolate down toward the tail. All
   segments move at the same rate, so the trail length stays
   constant and the speed around the perimeter is uniform (no
   slow-down or stretch at the corners).

   Originally lived on the side panel (`SidebarComet`). Lifted into
   a standalone component so the experiments page can host it on an
   arbitrary box. The host must be `position: relative` (or
   otherwise establish a containing block) and the Comet renders
   absolutely-positioned on top.

   Props:
     speed       perimeter px/sec; bigger = faster lap (default 110)
     color       CSS color for the stroke (default var(--accent))
     segments    trail segment count (default 50; more = smoother)
     segmentLen  per-segment length in px along the path (default 1.6)
     headWidth   stroke width at the head in px (default 2.4)
     tailWidth   stroke width at the tail in px (default 0.3)
     tailEase    1 = linear fade, >1 concentrates weight at head
*/

import { useEffect, useRef, useState } from "react";
import styles from "./Comet.module.css";

const DEFAULTS = {
  speed: 110,
  segments: 50,
  segmentLen: 1.6,
  headWidth: 2.4,
  tailWidth: 0.3,
  headOpacity: 1.0,
  tailOpacity: 0.0,
  tailEase: 1.4,
};

function buildSegments({ segments, segmentLen, headWidth, tailWidth, headOpacity, tailOpacity, tailEase }) {
  return Array.from({ length: segments }, (_, i) => {
    const t = i / segments;
    const fade = Math.pow(t, tailEase);
    return {
      len: segmentLen,
      gap: i * segmentLen,
      width: headWidth - (headWidth - tailWidth) * fade,
      opacity: headOpacity - (headOpacity - tailOpacity) * fade,
    };
  });
}

export default function Comet({
  speed = DEFAULTS.speed,
  color = "var(--accent)",
  segments = DEFAULTS.segments,
  segmentLen = DEFAULTS.segmentLen,
  headWidth = DEFAULTS.headWidth,
  tailWidth = DEFAULTS.tailWidth,
  tailEase = DEFAULTS.tailEase,
}) {
  /* hostRef is on the placeholder span we render pre-mount; we
     measure its parentElement via ResizeObserver so the SVG sizes
     to whatever the consumer wrapped us in. */
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
  const dur = perimeter / speed;

  const TRAIL_SEGMENTS = buildSegments({
    segments,
    segmentLen,
    headWidth,
    tailWidth,
    headOpacity: DEFAULTS.headOpacity,
    tailOpacity: DEFAULTS.tailOpacity,
    tailEase,
  });

  return (
    <svg
      ref={hostRef}
      className={styles.svg}
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
          stroke={color}
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
