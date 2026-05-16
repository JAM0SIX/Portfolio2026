import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.name} — Harry Spawforth`,
    description: p.blurb,
  };
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  return (
    <main className="page">
      <article className="col case-study">
        <div className="case-study__eyebrow">Case study · {p.date}</div>
        <h1 className="case-study__title">{p.name}</h1>
        <p className="case-study__lede">{p.blurb}</p>

        <div className="case-study__meta">
          <dl>
            <dt>Role</dt>
            <dd>{p.role}</dd>
          </dl>
          <dl>
            <dt>Year</dt>
            <dd>{p.date}</dd>
          </dl>
          <dl>
            <dt>Tags</dt>
            <dd>{p.tags.join(" · ")}</dd>
          </dl>
        </div>

        <section id="getting-started">
          <h2>Getting started</h2>
          <p>
            Placeholder content for the {p.name} case study. Hand me the real
            narrative and visuals and I&apos;ll port them in.
          </p>
        </section>

        <section id="methodology">
          <h2>Methodology</h2>
          <p>Process, decisions, and the trade-offs that shaped the work.</p>
        </section>

        <section id="outcome">
          <h2>Outcome</h2>
          <p>What shipped and what it changed.</p>
        </section>
      </article>
    </main>
  );
}
