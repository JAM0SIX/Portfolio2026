"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { projects } from "@/lib/projects";

/* Breathing room inside the notch — extra cleared space to the
   right and below the badge so it doesn't crowd the slanted
   wall. The badge is anchored to the frame's top-left corner;
   this padding only appears on the *image side* of the badge. */
const TAB_PADDING = 16;
/* Must match --notch-slant in CSS (.project__image-frame). The
   slanted right wall narrows the notch toward the bottom — at
   y = notch-h the wall sits `slant` pixels to the left of the
   top breakpoint. We add this to the notch width so the BOTTOM
   of the notch is still wide enough to leave TAB_PADDING of
   visible space to the right of the badge. */
const NOTCH_SLANT_PX = 10;

function ProjectCard({ p }) {
  const frameRef = useRef(null);
  const badgeRef = useRef(null);

  /* Drive the image's TL clip-path notch size from the measured
     width/height of the badge so each card's notch fits its own
     status text exactly (e.g. "NEW" vs. "COMING SOON"). The BR
     corner is sharp — only TL gets a carved notch now. */
  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const el = badgeRef.current;
      if (!el) {
        frame.style.setProperty("--notch-tl-w", "0px");
        frame.style.setProperty("--notch-tl-h", "0px");
        frame.style.setProperty("--notch-corner-d", "0px");
        frame.style.setProperty("--notch-corner-dx", "0px");
        frame.style.setProperty("--notch-corner-dy", "0px");
        return;
      }
      /* Notch is sized to: badge + TAB_PADDING on the right and
         bottom + NOTCH_SLANT_PX extra width to compensate for the
         slanted wall narrowing the notch toward its bottom edge.
         Badge anchors top-left of the notch; the padding shows on
         the image side (right + below the badge). */
      const w = el.offsetWidth + TAB_PADDING + NOTCH_SLANT_PX;
      const h = el.offsetHeight + TAB_PADDING;
      frame.style.setProperty("--notch-tl-w", `${w}px`);
      frame.style.setProperty("--notch-tl-h", `${h}px`);

      /* Slant-corner arc tangent offsets. CSS can't compute these
         because they involve sqrt() of the wall length. Both the
         inside corner and the top corner are mirror-symmetric and
         share the same interior angle, so we compute one set:
            wallLen      = √(slant² + h²)
            θ            = interior angle of the L corner
                         = acos(-slant / wallLen)
            d            = tangent offset along the straight edge
                         = R / tan(θ/2)
            dx, dy       = tangent offsets along the wall, decomposed
                         = (d × slant / wallLen, d × h / wallLen)
         Read R and slant from CSS so they stay editable in one
         place (the .project__image-frame rule). */
      const cs = getComputedStyle(frame);
      const slant = parseFloat(cs.getPropertyValue("--notch-slant")) || 0;
      const radius = parseFloat(cs.getPropertyValue("--notch-radius")) || 0;

      if (slant > 0 && h > 0 && radius > 0) {
        const wallLen = Math.hypot(slant, h);
        const theta = Math.acos(-slant / wallLen);
        const d = radius / Math.tan(theta / 2);
        const dx = (d * slant) / wallLen;
        const dy = (d * h) / wallLen;
        frame.style.setProperty("--notch-corner-d", `${d}px`);
        frame.style.setProperty("--notch-corner-dx", `${dx}px`);
        frame.style.setProperty("--notch-corner-dy", `${dy}px`);
      } else {
        /* No slant or no notch — top + inside corners collapse to
           a 90° join, no extra offset needed. */
        frame.style.setProperty("--notch-corner-d", `${radius}px`);
        frame.style.setProperty("--notch-corner-dx", "0px");
        frame.style.setProperty("--notch-corner-dy", `${radius}px`);
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(frame);
    if (badgeRef.current) ro.observe(badgeRef.current);
    return () => ro.disconnect();
  }, [p.badge]);

  return (
    <div
      className={`project${p.comingSoon ? " project--coming-soon" : ""}`}
      role="article"
      aria-label={p.name}
      tabIndex={p.comingSoon ? -1 : 0}
    >
      {/* Image frame holds the image (clipped with a TL notch for
          the badge only — the BR corner is sharp now) and the
          status badge that sits in the carved TL space. Tags and
          date have moved out of the image area. */}
      <div className="project__image-frame" ref={frameRef}>
        <div className="project__image" aria-hidden="true">
          <div className="project__image-placeholder" />
        </div>
        {p.badge && (
          <span
            ref={badgeRef}
            className="project__badge"
            data-status={p.badge.toLowerCase().replace(/\s+/g, "-")}
          >
            {p.badge}
          </span>
        )}
      </div>
      <div className="project__head">
        <h3 className="project__title">{p.name}</h3>
        {/* Tags now sit where the date used to: right-aligned next
            to the project title. Capped at 2 on the card; the full
            tag list is still available on the case-study page. */}
        {p.tags?.length > 0 && (
          <div className="project__tags-row">
            {p.tags.slice(0, 2).map((t) => (
              <span key={t} className="tag"><span>{t}</span></span>
            ))}
          </div>
        )}
      </div>
      <div className="project__reveal">
        <div className="project__reveal-inner">
          <div className="project__reveal-content">
            {/* Date moves into the hover-reveal stack — sits on
                top of the project description, left-aligned. Only
                visible while the card is hovered/focused. */}
            <span className="project__date">{p.date}</span>
            <p className="project__desc">{p.blurb}</p>
            {!p.comingSoon && (
              <div className="project__actions">
                <Link href={`/${p.slug}`} className="btn btn-primary">
                  View case
                </Link>
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    className="btn btn-secondary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live site
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsGrid() {
  const left = projects.filter((_, i) => i % 2 === 0);
  const right = projects.filter((_, i) => i % 2 === 1);

  return (
    <section className="projects-section" id="work">
      <div className="section__head">
        <span className="section__label">Recent work</span>
        <span className="section__rule" aria-hidden="true" />
        <span className="section__count">{projects.length} projects</span>
      </div>
      <div className="projects-grid">
        <div className="projects-col">
          {left.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
        <div className="projects-col">
          {right.map((p) => <ProjectCard key={p.slug} p={p} />)}
        </div>
      </div>
    </section>
  );
}
