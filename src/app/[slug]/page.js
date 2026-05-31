import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/projects";
import AbilityCard from "@/components/AbilityCard/AbilityCard";
import ProjectLayers from "@/components/ProjectLayers/ProjectLayers";
import Orbit from "@/components/Orbit/Orbit";
import SidePanel from "@/components/SidePanel/SidePanel";
import Narrative from "@/components/Narrative/Narrative";

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

/* Each text section: title + two paragraphs + two image placeholders.
   Content is intentionally generic so the layout is reviewable before
   real copy + visuals land. */
function CaseStudySection({ id, title, paragraphs }) {
  return (
    <section id={id} className="case-study__section">
      <h2 className="case-study__section-title">{title}</h2>
      {paragraphs.map((p, i) => (
        <p key={i} className="case-study__paragraph">{p}</p>
      ))}
      <div className="case-study__image" aria-hidden="true" />
      <div className="case-study__image" aria-hidden="true" />
    </section>
  );
}

const METHODOLOGY_LEAD_FALLBACK =
  "Placeholder for how I approached the work: research, framing, prototyping, validation. Replace with a short narrative of the actual process used here.";

/* Section definitions: id + title + fallback paragraphs. Real copy lives
   per-project on `project.sectionBodies[id]` (an array of paragraph
   strings) and falls back to these placeholders when missing. */
const SECTIONS = [
  {
    id: "what-i-owned",
    title: "What I owned",
    fallback: [
      "Placeholder copy describing the scope of my responsibility on this engagement: the surfaces I shaped, the decisions I drove, and the teams I worked alongside.",
      "A second paragraph that gives a sense of the operating context and constraints I worked within: collaborators, cadence, and where my work sat in the wider product.",
    ],
  },
  {
    id: "what-it-does",
    title: "What it does",
    fallback: [
      "Placeholder describing what the shipped product or experience does: what problem it solves and the moment it intervenes for the user.",
      "A second paragraph covering the surfaces, the flows, and the way it composes into the user's broader workflow.",
    ],
  },
  {
    id: "why-it-matters",
    title: "Why it matters",
    fallback: [
      "Placeholder explaining the impact: for users, for the business, for the field. Replace with the change this work created.",
      "A second paragraph covering the lasting takeaways or what this engagement made possible next.",
    ],
  },
];

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const outcomes = (p.metrics ?? []).slice(0, 3);

  /* Projects that opt into the block-based narrative skip the legacy
     hero/outcomes/sections scaffolding entirely — Narrative owns the
     full body. The meta dl (Role / Year / Tags) is still rendered
     above so the sidebar TOC and the page header stay consistent. */
  if (p.narrative) {
    return (
      <main className="page">
        <article className="col case-study">
          <div className="case-study__meta">
            <dl><dt>Role</dt><dd>{p.role}</dd></dl>
            <dl><dt>Year</dt><dd>{p.date}</dd></dl>
          </div>
          <Narrative blocks={p.narrative} tokens={p.tokens} />
        </article>
      </main>
    );
  }

  return (
    <main className="page">
      <article className="col case-study">
        <div className="case-study__eyebrow">Case study · {p.date}</div>
        <h1 className="case-study__title">{p.name}</h1>
        <p className="case-study__lede">{p.blurb}</p>

        <div className="case-study__meta">
          <dl><dt>Role</dt><dd>{p.role}</dd></dl>
          <dl><dt>Year</dt><dd>{p.date}</dd></dl>
        </div>

        {outcomes.length > 0 && (
          <section id="outcomes" className="case-study__outcomes">
            <div className="case-study__outcomes-grid">
              {outcomes.map(([label, value, unit]) => (
                <AbilityCard
                  key={label}
                  title={`${value}${unit ?? ""}`}
                  description={label}
                  variant="metric"
                  tabIndex={0}
                />
              ))}
            </div>
          </section>
        )}

        <div className="case-study__hero-image" aria-hidden="true" />

        {p.projectLayers && (
          <section id="layers" className="case-study__layers">
            <ProjectLayers
              compact
              problem={p.projectLayers.problem}
              value={p.projectLayers.value}
              solution={p.projectLayers.solution}
            />
          </section>
        )}

        {/* What I owned */}
        <CaseStudySection
          id={SECTIONS[0].id}
          title={SECTIONS[0].title}
          paragraphs={p.sectionBodies?.[SECTIONS[0].id] ?? SECTIONS[0].fallback}
        />

        {/* Demo SidePanel — drop one of these wherever a paragraph
            could use a "more detail" affordance. Replace heading/body
            with real content, and use the button label as children. */}
        <SidePanel
          heading="A note on scope"
          body={
            <>
              <p>
                This is a side-panel placeholder. Replace the body with
                whatever extra context you want to surface without
                taking the reader away from the main page.
              </p>
              <p>
                On desktop the panel slides in from the right edge.
                On mobile it expands inline beneath the trigger as an
                accordion.
              </p>
            </>
          }
        >
          Read scope detail
        </SidePanel>


        {/* My methodology — lead-in paragraph + Orbit visualisation. */}
        <section id="my-methodology" className="case-study__section">
          <h2 className="case-study__section-title">My methodology</h2>
          <p className="case-study__paragraph">
            {p.methodologyLead ?? METHODOLOGY_LEAD_FALLBACK}
          </p>
          {p.methodologyOrbits?.length > 0 && (
            <Orbit satellites={p.methodologyOrbits} />
          )}
        </section>

        {/* What it does, Why it matters */}
        {SECTIONS.slice(1).map((s) => (
          <CaseStudySection
            key={s.id}
            id={s.id}
            title={s.title}
            paragraphs={p.sectionBodies?.[s.id] ?? s.fallback}
          />
        ))}
      </article>
    </main>
  );
}
