"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoMark from "./LogoMark";
import SidebarComet from "./SidebarComet";
import { projects } from "@/lib/projects";
import { ARTICLES } from "@/components/BookLogCarousel/articles";
import { EXPERIMENTS } from "@/lib/experiments";

function Chev() {
  return (
    <span className="chev">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4l4 4-4 4" />
      </svg>
    </span>
  );
}

function FileRow({ href, label, active }) {
  return (
    <Link href={href} className={`row file${active ? " active" : ""}`} title={label}>
      <span className="chev" />
      <span className="label">{label}</span>
    </Link>
  );
}

/* Reflects the URL fragment so the active section row updates as the
   user clicks through TOC entries. */
function useHash() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash.slice(1));
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

/* Scroll-spy. Given the section ids in the page TOC, returns the id of
   the section whose top has most recently crossed an anchor line at
   ~25% from the top of the viewport. The result is recomputed on
   scroll and resize. */
function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return;

    const update = () => {
      const anchor = window.innerHeight * 0.25;
      let current = "";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top - anchor <= 0) current = id;
      }
      setActiveId(current);
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [sectionIds]);

  return activeId;
}

function BackToIndex({ to = "/", label = "Index" }) {
  return (
    <Link href={to} className="sidebar-back" title={`Back to ${label}`}>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="13" y1="8" x2="3" y2="8" />
        <polyline points="7 4 3 8 7 12" />
      </svg>
      <span>{label}</span>
    </Link>
  );
}

/* Focused sidebar shown when the user is inside a project or note.
   Just the back link + the doc title + its TOC sections. The active
   row is whichever section the user is currently reading (scroll-spy),
   falling back to the URL hash on first paint. */
function DocSidebar({ title, href, sections, hash, backTo = "/", backLabel = "Index" }) {
  const sectionIds = sections ? sections.map((s) => s.id) : [];
  const spyId = useActiveSection(sectionIds);
  const activeId = spyId || hash;

  return (
    <>
      <BackToIndex to={backTo} label={backLabel} />
      <div className="tree">
        <div className="folder-group open">
          <Link href={href} className="row file active doc-title" title={title}>
            <span className="chev" />
            <span className="label">{title}</span>
          </Link>
          {sections && sections.length > 0 && (
            <div className="children">
              <div className="children-list">
                {sections.map((s) => (
                  <FileRow
                    key={s.id}
                    href={`${href}#${s.id}`}
                    label={s.label}
                    active={activeId === s.id}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* Default sidebar — the full file tree, flat at the top level. */
function IndexSidebar({ pathname, projectsOpen, notesOpen, setProjectsOpen, setNotesOpen }) {
  const isHome = pathname === "/";
  return (
    <div className="tree" id="sidebar-tree">
      <FileRow href="/" label="Home" active={isHome} />

      <div className={`folder-group${projectsOpen ? " open" : ""}`}>
        <button
          type="button"
          className="row folder"
          onClick={() => setProjectsOpen((v) => !v)}
          aria-expanded={projectsOpen}
        >
          <Chev />
          <span className="label">Projects</span>
        </button>
        {/* .children is the grid container (grid-template-rows transitions
            from 0fr to 1fr); .children-list is the single grid row whose
            intrinsic height gets interpolated. Smooth content-aware
            collapse without the max-height jank. */}
        <div className="children">
          <div className="children-list">
            {projects.map((p) => (
              <FileRow key={p.slug} href={`/${p.slug}`} label={p.name} active={false} />
            ))}
          </div>
        </div>
      </div>

      <div className={`folder-group${notesOpen ? " open" : ""}`}>
        <button
          type="button"
          className="row folder"
          onClick={() => setNotesOpen((v) => !v)}
          aria-expanded={notesOpen}
        >
          <Chev />
          <span className="label">Writing</span>
        </button>
        <div className="children">
          <div className="children-list">
            {ARTICLES.map((a) => (
              <FileRow key={a.id} href={`/reading/${a.id}`} label={a.title} active={false} />
            ))}
          </div>
        </div>
      </div>

      <FileRow href="/experiments" label="Experiments" active={pathname === "/experiments"} />
      <FileRow href="/about" label="About" active={pathname === "/about"} />
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname() || "/";
  const hash = useHash();

  const activeProject = projects.find((p) => pathname === `/${p.slug}`);
  const activeNote =
    pathname.startsWith("/reading/")
      ? ARTICLES.find((a) => a.id === pathname.replace("/reading/", ""))
      : null;
  const activeExperiment =
    pathname.startsWith("/experiments/")
      ? EXPERIMENTS.find((e) => pathname === e.href)
      : null;

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const inDocMode = Boolean(activeProject || activeNote || activeExperiment);

  return (
    <aside className={`sidebar${mobileOpen ? " is-open" : ""}`} aria-label="Navigation">
      {/* SidebarComet draws the SVG perimeter comet behind the
          panel content. sidebar-inner sits above it (z-index) and
          handles scrolling. */}
      <SidebarComet />
      <div className="sidebar-inner">
      <div className="sidebar-header">
        <LogoMark />
        <button
          type="button"
          className="sidebar-header__slot"
          aria-label="Toggle navigation"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        />
      </div>

      {inDocMode ? (
        activeProject ? (
          <DocSidebar
            title={activeProject.name}
            href={`/${activeProject.slug}`}
            sections={activeProject.sections}
            hash={hash}
          />
        ) : activeNote ? (
          <DocSidebar
            title={activeNote.title}
            href={`/reading/${activeNote.id}`}
            sections={activeNote.sections}
            hash={hash}
          />
        ) : (
          <DocSidebar
            title={activeExperiment.title}
            href={activeExperiment.href}
            sections={null}
            hash={hash}
            backTo="/experiments"
            backLabel="Experiments"
          />
        )
      ) : (
        <IndexSidebar
          pathname={pathname}
          projectsOpen={projectsOpen}
          notesOpen={notesOpen}
          setProjectsOpen={setProjectsOpen}
          setNotesOpen={setNotesOpen}
        />
      )}
      </div>
    </aside>
  );
}
