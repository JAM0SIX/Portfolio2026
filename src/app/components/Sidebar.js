"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LogoMark from "./LogoMark";
import { projects } from "@/lib/projects";

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
    <Link href={href} className={`row file${active ? " active" : ""}`}>
      <span className="chev" />
      <span className="label">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const [caseStudiesOpen, setCaseStudiesOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = pathname === "/";
  const activeSlug = pathname?.startsWith("/") ? pathname.slice(1) : "";

  return (
    <aside className={`sidebar${mobileOpen ? " is-open" : ""}`} aria-label="File tree">
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

      <div className="tree" id="sidebar-tree">
        <div className="folder-group open">
          <div className="row folder">
            <Chev />
            <span className="label">Harry.S</span>
          </div>
          <div className="children">
            <FileRow href="/" label="profile" active={isHome} />

            <div className={`folder-group${caseStudiesOpen ? " open" : ""}`}>
              <button
                type="button"
                className="row folder"
                onClick={() => setCaseStudiesOpen((v) => !v)}
                aria-expanded={caseStudiesOpen}
              >
                <Chev />
                <span className="label">case-studies</span>
              </button>
              <div className="children">
                {projects.map((p) => (
                  <FileRow
                    key={p.slug}
                    href={`/${p.slug}`}
                    label={p.name}
                    active={activeSlug === p.slug}
                  />
                ))}
              </div>
            </div>

            <FileRow href="/experiments" label="experiments" active={pathname === "/experiments"} />
            <FileRow href="/about" label="about" active={pathname === "/about"} />
          </div>
        </div>
      </div>
    </aside>
  );
}
