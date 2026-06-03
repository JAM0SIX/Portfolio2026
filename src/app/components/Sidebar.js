"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoMark from "./LogoMark";
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

function BackToIndex({ to = "/", label = "Home" }) {
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
function DocSidebar({ title, href, sections, hash, backTo = "/", backLabel = "Home" }) {
  const sectionIds = sections ? sections.map((s) => s.id) : [];
  const spyId = useActiveSection(sectionIds);
  const activeId = spyId || hash;
  /* Doc-title is active only when no section is currently in view.
     At the top of the page (before scroll-spy picks up the first
     section) and after scrolling back above the first section, the
     project name is highlighted. Once the user scrolls into any
     section, the doc-title drops back to its resting state and the
     matching section row picks up the active styling instead. */
  const titleActive = !activeId;

  return (
    <>
      <BackToIndex to={backTo} label={backLabel} />
      <div className="tree">
        <div className="folder-group open">
          <Link
            href={href}
            className={`row file doc-title${titleActive ? " active" : ""}`}
            title={title}
          >
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

/* Default sidebar — the full file tree, flat at the top level.
   Used on every page. When the user is on a project / note /
   experiment, the matching row picks up the active state and the
   parent folder is highlighted as well; the rest of the menu
   stays put so the reader keeps the same navigational frame as
   the landing page. */
function IndexSidebar({
  pathname,
  activeProjectSlug,
  activeNoteId,
  isExperimentsRoute,
  projectsOpen,
  notesOpen,
  setProjectsOpen,
  setNotesOpen,
}) {
  const isHome = pathname === "/";
  return (
    <div className="tree" id="sidebar-tree">
      <FileRow href="/" label="Home" active={isHome} />

      <div className={`folder-group${projectsOpen ? " open" : ""}`}>
        {/* Folder shows the active state only when (a) a project is
            the active route AND (b) the folder is collapsed — i.e.
            the matching child row is hidden. When the folder is
            open the child row carries the active state on its own,
            so we don't double-highlight. */}
        <button
          type="button"
          className={`row folder${activeProjectSlug && !projectsOpen ? " active" : ""}`}
          onClick={() => setProjectsOpen((v) => !v)}
          aria-expanded={projectsOpen}
        >
          <Chev />
          <span className="label">Work</span>
        </button>
        {/* .children is the grid container (grid-template-rows transitions
            from 0fr to 1fr); .children-list is the single grid row whose
            intrinsic height gets interpolated. Smooth content-aware
            collapse without the max-height jank. */}
        <div className="children">
          <div className="children-list">
            {projects
              .filter((p) => !p.excludeFromMenu)
              .map((p) => (
                <FileRow
                  key={p.slug}
                  href={`/${p.slug}`}
                  label={p.name}
                  active={p.slug === activeProjectSlug}
                />
              ))}
          </div>
        </div>
      </div>

      <div className={`folder-group${notesOpen ? " open" : ""}`}>
        {/* Same single-active-row rule as the Work folder above. */}
        <button
          type="button"
          className={`row folder${activeNoteId && !notesOpen ? " active" : ""}`}
          onClick={() => setNotesOpen((v) => !v)}
          aria-expanded={notesOpen}
        >
          <Chev />
          <span className="label">Thoughts</span>
        </button>
        <div className="children">
          <div className="children-list">
            {ARTICLES.map((a) => (
              <FileRow
                key={a.id}
                href={`/reading/${a.id}`}
                label={a.title}
                active={a.id === activeNoteId}
              />
            ))}
          </div>
        </div>
      </div>

      <FileRow
        href="/experiments"
        label="Experiments"
        active={isExperimentsRoute}
      />
      <FileRow href="/about" label="About" active={pathname === "/about"} />
    </div>
  );
}

export default function Sidebar() {
  const pathname = usePathname() || "/";

  /* Work out which row should carry the active state. The sidebar
     itself doesn't change shape — it stays the same global menu on
     every page — but rows it can match get highlighted. */
  const activeProject = projects.find((p) => pathname === `/${p.slug}`);
  const activeNote =
    pathname.startsWith("/reading/")
      ? ARTICLES.find((a) => a.id === pathname.replace("/reading/", ""))
      : null;
  const isExperimentsRoute = pathname.startsWith("/experiments");

  /* Auto-open the folder that contains the active row so the user
     can see where they are without having to expand the section
     manually. The user can still toggle these afterwards — folders
     re-open on navigation rather than locking. */
  const [projectsOpen, setProjectsOpen] = useState(Boolean(activeProject));
  const [notesOpen, setNotesOpen] = useState(Boolean(activeNote));
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (activeProject) setProjectsOpen(true);
    if (activeNote) setNotesOpen(true);
  }, [activeProject, activeNote]);

  /* Collapse the mobile/tablet menu whenever the route changes, so
     tapping a nav row closes the overlay and reveals the page the
     user just navigated to. */
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <aside className={`sidebar${mobileOpen ? " is-open" : ""}`} aria-label="Navigation">
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

        <IndexSidebar
          pathname={pathname}
          activeProjectSlug={activeProject?.slug || null}
          activeNoteId={activeNote?.id || null}
          isExperimentsRoute={isExperimentsRoute}
          projectsOpen={projectsOpen}
          notesOpen={notesOpen}
          setProjectsOpen={setProjectsOpen}
          setNotesOpen={setNotesOpen}
        />
      </div>
    </aside>
  );
}
