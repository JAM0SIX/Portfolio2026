import Link from "next/link";
import { projects } from "@/lib/projects";

function ProjectCard({ p }) {
  const inner = (
    <>
      <div className="project__image">
        <div className="project__image-placeholder" aria-hidden="true" />
      </div>
      <div className="project__head">
        <h3 className="project__title">{p.name}</h3>
        <span className="project__date">{p.date}</span>
      </div>
      <p className="project__role">{p.role}</p>
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
              <span className="project__cta">
                Open case study<span className="arrow" aria-hidden="true">→</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  if (p.comingSoon) {
    return (
      <div className="project project--coming-soon" role="article" aria-label={`${p.name}, case study coming soon`}>
        {inner}
      </div>
    );
  }
  return (
    <Link href={`/${p.slug}`} className="project" aria-label={`Open case study: ${p.name}`}>
      {inner}
    </Link>
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
