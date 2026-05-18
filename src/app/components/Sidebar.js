"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoMark from "./LogoMark";
import { projects } from "@/lib/projects";
import { ARTICLES } from "@/components/BookLogCarousel/articles";

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

function BackToIndex() {
  return (
    <Link href="/" className="sidebar-back" title="Back to index">
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <line x1="13" y1="8" x2="3" y2="8" />
        <polyline points="7 4 3 8 7 12" />
      </svg>
      <span>Index</span>
    </Link>
  );
}

/* Focused sidebar shown when the user is inside a project or note.
   Just the back link + the doc title + its TOC sections. */
function DocSidebar({ title, href, sections, hash }) {
  return (
    <>
      <BackToIndex />
      <div className="tree">
        <div className="folder-group open">
          <Link href={href} className="row file active doc-title" title={title}>
            <span className="chev" />
            <span className="label">{title}</span>
          </Link>
          {sections && sections.length > 0 && (
            <div className="children">
              {sections.map((s) => (
                <FileRow
                  key={s.id}
                  href={`${href}#${s.id}`}
                  label={s.label}
                  active={hash === s.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* Default sidebar — the full Harry.S file tree. */
function IndexSidebar({ pathname, projectsOpen, notesOpen, setProjectsOpen, setNotesOpen }) {
  const isHome = pathname === "/";
  return (
    <div className="tree" id="sidebar-tree">
      <div className="folder-group open">
        <div className="row folder">
          <Chev />
          <span className="label">Harry.S</span>
        </div>
        <div className="children">
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
            <div className="children">
              {projects.map((p) => (
                <FileRow key={p.slug} href={`/${p.slug}`} label={p.name} active={false} />
              ))}
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
              <span className="label">Notes</span>
            </button>
            <div className="children">
              {ARTICLES.map((a) => (
                <FileRow key={a.id} href={`/reading/${a.id}`} label={a.title} active={false} />
              ))}
            </div>
          </div>

          <FileRow href="/experiments" label="Experiments" active={pathname === "/experiments"} />
          <FileRow href="/about" label="About" active={pathname === "/about"} />
        </div>
      </div>
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

  const [projectsOpen, setProjectsOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const inDocMode = Boolean(activeProject || activeNote);

  return (
    <aside className={`sidebar${mobileOpen ? " is-open" : ""}`} aria-label="Navigation">
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
        ) : (
          <DocSidebar
            title={activeNote.title}
            href={`/reading/${activeNote.id}`}
            sections={activeNote.sections}
            hash={hash}
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
    </aside>
  );
}
