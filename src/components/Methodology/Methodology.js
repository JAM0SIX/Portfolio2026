"use client";

/* Methodology — radial diagram of n stages arranged around a circle.
   Click a stage label or node to activate; the highlight arc rotates,
   the dot field tilts in sync, and the side panel updates. Below 900px
   the radial UI is hidden and replaced by an accordion list. Ported
   from the source ProjectDetail/Methodology component. */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./Methodology.module.css";

const VIEWBOX = 720;
const CX = VIEWBOX / 2;
const CY = VIEWBOX / 2;
const NODE_R = 220;
const KNOB_R = 100;
const LABEL_OFFSET = 12;
const DOT_RINGS = [
  [120, 32],
  [160, 56],
  [200, 80],
];

const SEG_COUNT = 2;
const INK_LIGHT = 0.22;
const INK_DARK = 0.82;

function r3(n) {
  return Math.round(n * 1000) / 1000;
}

function shortestAngle(delta) {
  return Math.atan2(Math.sin(delta), Math.cos(delta));
}

function shortestStep(from, to, n) {
  let d = (((to - from) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
}

function dotFill(angle, peak, bandHalf) {
  const diff = Math.abs(shortestAngle(angle - peak));
  if (diff >= bandHalf) {
    return `rgba(26, 24, 21, ${INK_LIGHT.toFixed(3)})`;
  }
  const t = 1 - diff / bandHalf;
  const alpha = INK_LIGHT + (INK_DARK - INK_LIGHT) * t;
  return `rgba(26, 24, 21, ${alpha.toFixed(3)})`;
}

const ALIGN_CLASS = {
  top: "alignTop",
  topRight: "alignTopRight",
  topLeft: "alignTopLeft",
  right: "alignRight",
  left: "alignLeft",
  bottom: "alignBottom",
  bottomRight: "alignBottomRight",
  bottomLeft: "alignBottomLeft",
};

function labelAlign(angleRad) {
  const deg = ((angleRad * 180) / Math.PI + 360) % 360;
  if (Math.abs(deg - 270) < 1) return "top";
  if (Math.abs(deg - 90) < 1) return "bottom";
  if (deg < 22.5 || deg >= 337.5) return "right";
  if (deg < 90) return "bottomRight";
  if (deg < 157.5) return "bottomLeft";
  if (deg < 202.5) return "left";
  if (deg < 270) return "topLeft";
  return "topRight";
}

function buildStageLayouts(stages) {
  const n = stages.length;
  if (n === 0) return [];
  return stages.map((s, i) => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const labelX = CX + Math.cos(angle) * (NODE_R + LABEL_OFFSET);
    const labelY = CY + Math.sin(angle) * (NODE_R + LABEL_OFFSET);
    return {
      ...s,
      idx: i,
      angle,
      x: r3(CX + Math.cos(angle) * NODE_R),
      y: r3(CY + Math.sin(angle) * NODE_R),
      align: labelAlign(angle),
      labelLeft: `${r3((labelX / VIEWBOX) * 100)}%`,
      labelTop: `${r3((labelY / VIEWBOX) * 100)}%`,
    };
  });
}

function buildDotField(n) {
  if (n === 0) return [];
  const peak = -Math.PI / 2;
  const bandHalf = (2 * Math.PI) / n;
  return DOT_RINGS.flatMap(([radius, count]) => {
    const out = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * 2 * Math.PI;
      out.push({
        x: r3(CX + Math.cos(a) * radius),
        y: r3(CY + Math.sin(a) * radius),
        fill: dotFill(a, peak, bandHalf),
      });
    }
    return out;
  });
}

const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x"];
function rowLetter(i) { return ROMAN[i] ?? String(i + 1); }

export default function Methodology({ stages, compact = false }) {
  const n = stages.length;
  const stageLayouts = useMemo(() => buildStageLayouts(stages), [stages]);
  const dots = useMemo(() => buildDotField(n), [n]);

  const circ = 2 * Math.PI * NODE_R;
  const seg = n > 0 ? circ / n : 0;
  const arcSpan = n > 0 ? SEG_COUNT * seg : 0;
  const arcGap = n > 0 ? circ - arcSpan : 0;
  const arcSpanR = r3(arcSpan);
  const arcGapR = r3(arcGap);
  const segDeg = n > 0 ? 360 / n : 1;
  const arcRotation = n > 0 ? -90 - (SEG_COUNT * segDeg) / 2 : 0;

  const [activeIdx, setActiveIdx] = useState(0);
  const [openId, setOpenId] = useState(() => stages[0]?.id ?? null);
  const stepCountRef = useRef(0);
  const prevIdxRef = useRef(0);

  const activate = useCallback((idx) => {
    setActiveIdx((current) => {
      if (n === 0 || idx === current) return current;
      const delta = shortestStep(prevIdxRef.current, idx, n);
      stepCountRef.current += delta;
      prevIdxRef.current = idx;
      return idx;
    });
  }, [n]);

  useEffect(() => {
    if (n === 0) return;
    setActiveIdx(0);
    setOpenId(stages[0]?.id ?? null);
    stepCountRef.current = 0;
    prevIdxRef.current = 0;
  }, [stages, n]);

  const active = stageLayouts[activeIdx] ?? stageLayouts[0];
  const dotsGroupRef = useRef(null);
  const arcActiveRef = useRef(null);
  const labelRefs = useRef([]);

  useEffect(() => {
    if (n === 0) return;
    const dotsEl = dotsGroupRef.current;
    const arc = arcActiveRef.current;
    const step = stepCountRef.current;
    if (dotsEl) {
      dotsEl.setAttribute("transform", `rotate(${(step * 360) / n} ${CX} ${CY})`);
    }
    if (arc) {
      arc.setAttribute("stroke-dashoffset", String(r3(-step * seg)));
    }
  }, [activeIdx, n, seg]);

  const onLabelKey = useCallback((e, idx) => {
    if (n === 0) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      activate(idx);
      return;
    }
    const delta =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 :
      e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const nextIdx = (idx + delta + n) % n;
    activate(nextIdx);
    labelRefs.current[nextIdx]?.focus();
  }, [activate, n]);

  const toggleAccordion = useCallback((id) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  if (n === 0 || !active) return null;

  const diagramAria = `Process diagram, ${n} stages around a circle`;

  return (
    <section className={`${styles.root}${compact ? " " + styles.rootCompact : ""}`}>
      <div className={styles.grid}>
        <div className={styles.header}>
          <h4 className={styles.heading}>
            How I approached the problem,
            <br />
            <span className={styles.headingMuted}>and the people around it.</span>
          </h4>
        </div>

        <div className={styles.stage}>
          <div className={styles.diagram} role="group" aria-label={diagramAria}>
            <svg className={styles.diagramSvg} viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} aria-hidden="true">
              <circle cx={CX} cy={CY} r={220} className={styles.dotsBackdrop} />
              <g ref={dotsGroupRef} className={styles.dotsGroup}>
                {dots.map((d, i) => (
                  <circle key={i} cx={d.x} cy={d.y} r={1.3} fill={d.fill} />
                ))}
              </g>

              <circle cx={CX} cy={CY} r={KNOB_R} fill="var(--paper-deep)" stroke="var(--ink-22)" strokeWidth={0.5} />
              <circle cx={CX} cy={CY} r={NODE_R} className={styles.ring} />
              <circle cx={CX} cy={CY} r={NODE_R} className={styles.arcTrack} />
              <circle
                ref={arcActiveRef}
                cx={CX}
                cy={CY}
                r={NODE_R}
                className={styles.arcActive}
                strokeDasharray={`${arcSpanR} ${arcGapR}`}
                strokeDashoffset={0}
                transform={`rotate(${arcRotation} ${CX} ${CY})`}
              />

              <g>
                {stageLayouts.map((s) => {
                  const isActive = s.idx === activeIdx;
                  return (
                    <g
                      key={s.id}
                      className={styles.nodeGroup + (isActive ? " " + styles.isActive : "")}
                      onClick={() => activate(s.idx)}
                      style={{ cursor: "pointer" }}
                    >
                      <circle cx={s.x} cy={s.y} r={32} className={styles.nodeHit} />
                      <circle cx={s.x} cy={s.y} r={20} className={styles.nodeRing} />
                      <circle cx={s.x} cy={s.y} r={10} className={styles.nodeDot} />
                    </g>
                  );
                })}
              </g>
            </svg>

            <div
              className={styles.labelLayer}
              role="group"
              aria-label="Methodology stages — use arrow keys to navigate, Enter to activate"
            >
              {stageLayouts.map((s) => {
                const isActive = s.idx === activeIdx;
                return (
                  <div
                    key={s.id}
                    ref={(el) => { labelRefs.current[s.idx] = el; }}
                    className={
                      styles.label + " " +
                      styles[ALIGN_CLASS[s.align]] +
                      (isActive ? " " + styles.isActive : "")
                    }
                    style={{ left: s.labelLeft, top: s.labelTop }}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isActive}
                    aria-label={`${s.label}, stage ${s.idx + 1} of ${n}`}
                    onClick={() => activate(s.idx)}
                    onKeyDown={(e) => onLabelKey(e, s.idx)}
                  >
                    <span className={styles.labelName}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <aside className={styles.panel} aria-live="polite">
            <p className={styles.panelStageLabel}>{active.label}</p>
            <h4 className={styles.panelTitle}>{active.title}</h4>
            <p className={styles.panelBody}>{active.body}</p>
          </aside>
        </div>

        <div className={styles.list}>
          {stages.map((s, i) => {
            const isOpen = openId === s.id;
            return (
              <div key={s.id} className={styles.row + (isOpen ? " " + styles.isOpen : "")}>
                <button
                  type="button"
                  className={styles.summary}
                  aria-expanded={isOpen}
                  aria-controls={`method-body-${s.id}`}
                  onClick={() => toggleAccordion(s.id)}
                >
                  <span className={styles.rowLetter}>{rowLetter(i)}</span>
                  <span className={styles.rowTitle}>{s.label}</span>
                  <span className={styles.toggle} aria-hidden="true">
                    <svg viewBox="0 0 12 12" className={styles.toggleSvg}>
                      <line className={styles.toggleStroke} x1="2" y1="6" x2="10" y2="6" />
                      <line className={styles.toggleStroke + " " + styles.toggleStrokeV} x1="6" y1="2" x2="6" y2="10" />
                    </svg>
                  </span>
                </button>
                <div id={`method-body-${s.id}`} className={styles.bodyWrap + (isOpen ? " " + styles.isOpen : "")}>
                  <div className={styles.bodyInner}>
                    <div className={styles.body}>
                      <p>{s.body}</p>
                      <div className={styles.bodyMeta}>
                        <span className={styles.panelMetaLabel}>{s.metaLabel}</span>
                        <span className={styles.panelMetaBody}>{s.metaBody}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
