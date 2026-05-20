import Link from "next/link";
import { projects } from "@/lib/projects";

function ProjectCard({ p }) {
  return (
    <div
      className={`project${p.comingSoon ? " project--coming-soon" : ""}`}
      role="article"
      aria-label={p.name}
      tabIndex={p.comingSoon ? -1 : 0}
    >
      <div className="project__image">
        <div className="project__image-placeholder" aria-hidden="true" />
        {p.badge && (
          <span className="project__badge" data-status={p.badge.toLowerCase().replace(/\s+/g, "-")}>
            {p.badge}
          </span>
        )}
      </div>
      <div className="project__head">
        <h3 className="project__title">{p.name}</h3>
        <span className="project__date">{p.date}</span>
      </div>
      <div className="project__pills">
        {p.tags.map((t) => (
          <span key={t} className="tag"><span>{t}</span></span>
        ))}
      </div>
      <div className="project__reveal">
        <div className="project__reveal-inner">
          <div className="project__reveal-content">
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
        <span className="section__label">Work</span>
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
