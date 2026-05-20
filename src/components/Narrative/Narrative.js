/* Narrative — block-based case-study renderer.
   ----------------------------------------------
   A project can define `narrative: [...]` as a flat array of block
   objects. Each block has a `kind` that maps to one of the renderers
   below. The case-study page renders the narrative inside a <article>
   alongside the existing eyebrow/title/meta/outcomes header.

   Blocks supported:
     hook              eyebrow + headline + scope (the opener)
     sectionHeader     numbered chapter ("02 · The problem")
     subsectionHeader  ▸ inline tier inside a section
     prose             { paragraphs: string[] }
     quote             { body, source }
     quoteWall         { items: [{ quote, label }] }
     decisionList      { intro?, decisions: [{ name, summary, body }], closer? }
     pillarScroll      { pillars: [...], membrane: {...} }  (delegated)
     orbit             { satellites: [...] }                 (delegated)
     statusList        { items: [{ state, title, description }] }
     layers            { problem, value, solution }           (delegated)
     imagePlaceholder  { caption? }
*/

import AbilityCard from "@/components/AbilityCard/AbilityCard";
import Orbit from "@/components/Orbit/Orbit";
import ProjectLayers from "@/components/ProjectLayers/ProjectLayers";
import SidePanel from "@/components/SidePanel/SidePanel";
import PillarScroll from "@/components/PillarScroll/PillarScroll";
import styles from "./Narrative.module.css";

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function Hook({ eyebrow, headline, scope }) {
  return (
    <header className={styles.hook}>
      {eyebrow && <span className={styles.hookEyebrow}>{eyebrow}</span>}
      <h1 className={styles.hookHeadline}>{headline}</h1>
      {scope && <p className={styles.hookScope}>{scope}</p>}
    </header>
  );
}

function SectionHeader({ chapter, title }) {
  const id = slugify(title);
  return (
    <header id={id} className={styles.sectionHeader}>
      {chapter && <span className={styles.sectionChapter}>{chapter}</span>}
      <h2 className={styles.sectionTitle}>{title}</h2>
    </header>
  );
}

function SubsectionHeader({ title }) {
  return (
    <div className={styles.subsectionHeader}>
      <h3 className={styles.subsectionTitle}>{title}</h3>
    </div>
  );
}

function Prose({ paragraphs }) {
  return (
    <div className={styles.prose}>
      {paragraphs.map((p, i) => (
        <p key={i} className={styles.proseParagraph}>{p}</p>
      ))}
    </div>
  );
}

/* Lede — larger emphasis prose, used for the goal line at the top
   of a case study so the reader can't miss it. */
function Lede({ paragraphs }) {
  return (
    <div className={styles.lede}>
      {paragraphs.map((p, i) => (
        <p key={i} className={styles.ledeParagraph}>{p}</p>
      ))}
    </div>
  );
}

/* Same as Prose but renders each paragraph as a <div> so it can
   contain block-level descendants (e.g. an inline SidePanel whose
   <aside> is portaled on client mount but still SSR'd inline). */
function RichProse({ paragraphs }) {
  return (
    <div className={styles.prose}>
      {paragraphs.map((p, i) => (
        <div key={i} className={styles.proseParagraph}>{p}</div>
      ))}
    </div>
  );
}

function Quote({ body, source }) {
  return (
    <blockquote className={styles.quote}>
      <p className={styles.quoteBody}>&ldquo;{body}&rdquo;</p>
      {source && <span className={styles.quoteSource}>{source}</span>}
    </blockquote>
  );
}

function QuoteWall({ items }) {
  return (
    <ul className={styles.quoteWall}>
      {items.map((it, i) => (
        <li key={i} className={styles.quoteWallRow}>
          <span className={styles.quoteWallQuote}>&ldquo;{it.quote}&rdquo;</span>
          <span className={styles.quoteWallLabel}>{it.label}</span>
        </li>
      ))}
    </ul>
  );
}

/* DecisionList — renders an intro paragraph that names each decision
   inline as a SidePanel trigger. The full body of each decision lives
   in the drawer. Closer paragraph stays inline after the list. */
function DecisionList({ intro, decisions, closer }) {
  /* The intro can be either a single string template containing the
     literal names of the decisions, or a list of paragraphs followed
     by a row of decision names. We render the decisions as a small
     stacked list with each item being a heading-link (SidePanel
     trigger) + a one-line summary. */
  return (
    <div className={styles.decisionList}>
      {intro && (
        <div className={styles.prose}>
          {(Array.isArray(intro) ? intro : [intro]).map((p, i) => (
            <p key={i} className={styles.proseParagraph}>{p}</p>
          ))}
        </div>
      )}
      <div className={styles.decisionRows}>
        {decisions.map((d) => (
          <div key={d.name} className={styles.decisionRow}>
            {d.image && (
              <figure className={styles.imagePlaceholder}>
                <div className={styles.imageSlot} aria-hidden="true" />
                {d.image.caption && (
                  <figcaption className={styles.imageCaption}>{d.image.caption}</figcaption>
                )}
              </figure>
            )}
            <div className={styles.proseParagraph}>
              <SidePanel
                variant="inline"
                heading={d.name}
                body={Array.isArray(d.body) ? (
                  <>{d.body.map((para, i) => <p key={i}>{para}</p>)}</>
                ) : d.body}
              >
                {d.name}
              </SidePanel>
              {d.summary ? <>: {d.summary}</> : null}
            </div>
          </div>
        ))}
      </div>
      {closer && (
        <div className={styles.prose}>
          {(Array.isArray(closer) ? closer : [closer]).map((p, i) => (
            <p key={i} className={styles.proseParagraph}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusList({ items }) {
  return (
    <ul className={styles.statusList}>
      {items.map((it, i) => (
        <li key={i} className={styles.statusRow}>
          <span className={styles.statusBadge} data-state={slugify(it.state)}>
            <span className={styles.statusDot} aria-hidden="true" />
            {it.state}
          </span>
          <div className={styles.statusBody}>
            <h4 className={styles.statusTitle}>{it.title}</h4>
            <p className={styles.statusDescription}>{it.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function ImagePlaceholder({ caption }) {
  return (
    <figure className={styles.imagePlaceholder}>
      <div className={styles.imageSlot} aria-hidden="true" />
      {caption && <figcaption className={styles.imageCaption}>{caption}</figcaption>}
    </figure>
  );
}

function Outcomes({ items = [] }) {
  return (
    <section className="case-study__outcomes" aria-label="Outcomes">
      <div className="case-study__outcomes-grid">
        {items.map(([label, value, unit]) => (
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
  );
}

const RENDERERS = {
  hook: Hook,
  sectionHeader: SectionHeader,
  subsectionHeader: SubsectionHeader,
  prose: Prose,
  richProse: RichProse,
  lede: Lede,
  quote: Quote,
  quoteWall: QuoteWall,
  decisionList: DecisionList,
  statusList: StatusList,
  imagePlaceholder: ImagePlaceholder,
  pillarScroll: PillarScroll,
  outcomes: Outcomes,
  orbit: ({ satellites }) => <Orbit satellites={satellites} />,
  layers: ({ problem, value, solution }) => (
    <ProjectLayers compact problem={problem} value={value} solution={solution} />
  ),
};

export default function Narrative({ blocks = [] }) {
  return (
    <div className={styles.narrative}>
      {blocks.map((block, i) => {
        const Renderer = RENDERERS[block.kind];
        if (!Renderer) return null;
        const { kind, ...props } = block;
        return <Renderer key={i} {...props} />;
      })}
    </div>
  );
}

/* Helper: extract the chapters from a narrative for use in the
   sidebar TOC. Returns [{ id, label }]. */
export function narrativeTOC(blocks = []) {
  return blocks
    .filter((b) => b.kind === "sectionHeader")
    .map((b) => ({
      id: slugify(b.title),
      label: b.chapter ? `${b.chapter} · ${b.title}` : b.title,
    }));
}
