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

import { Fragment } from "react";
import AbilityCard from "@/components/AbilityCard/AbilityCard";
import Orbit from "@/components/Orbit/Orbit";
import ProjectLayers from "@/components/ProjectLayers/ProjectLayers";
import PhilosophyVisuals from "@/components/PhilosophyVisuals/PhilosophyVisuals";
import SidePanel from "@/components/SidePanel/SidePanel";
import PillarScroll from "@/components/PillarScroll/PillarScroll";
import ScrambleText from "@/components/ScrambleText/ScrambleText";
import QuoteWall from "./QuoteWall";
import styles from "./Narrative.module.css";

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/* renderText — token-aware text expansion.
   ----------------------------------------
   Paragraphs sourced from markdown frontmatter are plain strings,
   but some case studies need inline interactive elements (a name
   that opens a SidePanel with the principle body). YAML can't
   carry JSX, so the markdown uses a token form like
   `{{principle:Landscape of Data}}` and the renderer swaps it for
   the corresponding component at render time.

   Built-in inline tags (don't need a token map):
     {{strong:text}}  →  <strong>text</strong>
     {{em:text}}      →  <em>text</em>

   `tokens` is shaped { [type]: { [name]: ReactNode } }. Currently
   only the `principle` type is used by consumers; new types can
   be added by the case-study data without touching this helper. */
const TOKEN_RE = /(\{\{[a-z]+:[^}]+\}\})/g;
const TOKEN_PARSE = /^\{\{([a-z]+):(.+)\}\}$/;

function renderText(text, tokens) {
  if (typeof text !== "string") return text;
  const parts = text.split(TOKEN_RE);
  if (parts.length === 1) return text;
  let touched = false;
  const out = parts.map((part, i) => {
    const m = part.match(TOKEN_PARSE);
    if (!m) return part;
    const [, type, name] = m;

    /* Built-in inline tags — render without consulting the tokens
       map. Lets prose hint at emphasis without dragging the whole
       token machinery in for a simple <strong>. */
    if (type === "strong") {
      touched = true;
      return <strong key={i}>{name}</strong>;
    }
    if (type === "em") {
      touched = true;
      return <em key={i}>{name}</em>;
    }

    /* Caller-defined tokens (currently used for SidePanel
       triggers). Falls through if no map was passed. */
    const body = tokens?.[type]?.[name];
    if (!body) return part;
    touched = true;
    return (
      <SidePanel key={i} variant="inline" heading={name} body={body}>
        {name}
      </SidePanel>
    );
  });
  return touched ? out : text;
}

function Hook({ eyebrow, headline, scope, heroImage }) {
  /* `scope` is either a single string (legacy — one paragraph) or
     an array of strings (each rendered as its own <p>). Lets a
     case study lead with a brief "what is this tool" sentence,
     then follow with a "what I did" paragraph.

     `heroImage`, if provided, renders an imagePlaceholder-style
     <figure> *between* the first and subsequent scope paragraphs.
     Useful when the lead sentence should hand off to the visual
     before the longer descriptor — the visual lands as part of
     the introduction rather than as a separate block underneath. */
  const scopeParas = Array.isArray(scope) ? scope : scope ? [scope] : [];
  return (
    <header className={styles.hook}>
      {eyebrow && <span className={styles.hookEyebrow}>{eyebrow}</span>}
      <h1 className={styles.hookHeadline}>
        <ScrambleText text={headline} as="text" />
      </h1>
      {scopeParas.map((p, i) => (
        <Fragment key={i}>
          <p className={styles.hookScope}>{p}</p>
          {/* After the first scope paragraph, drop in the hero
              image if the case study passed one. */}
          {i === 0 && heroImage && (
            <figure className={styles.imagePlaceholder}>
              <div className={styles.imageSlot} aria-hidden="true" />
              {heroImage.caption && (
                <figcaption className={styles.imageCaption}>
                  {heroImage.caption}
                </figcaption>
              )}
            </figure>
          )}
        </Fragment>
      ))}
    </header>
  );
}

function SectionHeader({ chapter, title, subtitle }) {
  const id = slugify(title);
  return (
    <header id={id} className={styles.sectionHeader}>
      {chapter && <span className={styles.sectionChapter}>{chapter}</span>}
      <h2 className={styles.sectionTitle}>{title}</h2>
      {subtitle && (
        <p className={styles.sectionSubtitle}>{subtitle}</p>
      )}
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

function Prose({ paragraphs, tokens }) {
  /* Paragraphs that contain tokens get rendered with a <div>
     wrapper instead of <p>, because the inline SidePanel renders
     an <aside> that is portaled to the body on client mount but
     still SSR'd inline. <p> can't legally contain block-level
     descendants → hydration mismatch. <div> avoids it. */
  return (
    <div className={styles.prose}>
      {paragraphs.map((p, i) => {
        const rendered = renderText(p, tokens);
        const isExpanded = Array.isArray(rendered);
        const Tag = isExpanded ? "div" : "p";
        return (
          <Tag key={i} className={styles.proseParagraph}>
            {isExpanded ? rendered : p}
          </Tag>
        );
      })}
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

/* QuoteWall lives in its own client component because it uses an
   IntersectionObserver to stagger the row flip-in. See ./QuoteWall.js. */

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

/* OutcomeNote — small qualitative-win callout that sits beside a
   prose answer. Used in the Experience section under each Q&A to
   tip the head to the *user* outcome (no numbers, just the
   qualitative shift). Uses the same accent-rule + tint vocabulary
   as the Lede so it reads as a "this is a deliberate aside,"
   smaller and quieter so it doesn't outweigh the prose itself. */
function OutcomeNote({ text, label = "User outcome" }) {
  return (
    <aside className={styles.outcomeNote} aria-label={label}>
      <span className={styles.outcomeNoteLabel}>{label}</span>
      <p className={styles.outcomeNoteText}>{text}</p>
    </aside>
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
  outcomeNote: OutcomeNote,
  pillarScroll: PillarScroll,
  outcomes: Outcomes,
  orbit: ({ satellites }) => <Orbit satellites={satellites} />,
  layers: ({ problem, value, solution }) => (
    <ProjectLayers compact problem={problem} value={value} solution={solution} />
  ),
  /* philosophyLayers — the layered rhombus stack repurposed for the
     philosophy section. Takes 3 pillars + an optional `membrane`
     (the 4th, wrapping layer). Each pillar/membrane can carry a
     `deepBody` which becomes the SidePanel content behind a "Read
     more" link in its slide. */
  philosophyLayers: ({ pillars = [], membrane }) => (
    <ProjectLayers
      problem={pillars[0]}
      value={pillars[1]}
      solution={pillars[2]}
      membrane={membrane}
    />
  ),
  /* philosophyVisuals — bespoke canvas scenes (one per principle)
     paired with copy in an alternating layout. Used in Nexis+AI to
     replace the layered-cuboid metaphor with something closer to
     how each principle actually behaves in the product. */
  philosophyVisuals: ({ items }) => <PhilosophyVisuals items={items} />,
};

export default function Narrative({ blocks = [], tokens }) {
  return (
    <div className={styles.narrative}>
      {blocks.map((block, i) => {
        const Renderer = RENDERERS[block.kind];
        if (!Renderer) return null;
        const { kind, ...props } = block;
        /* Only forward `tokens` to renderers that accept it. The
           ones that take paragraph text (Prose, Lede, RichProse)
           use it; others ignore the extra prop harmlessly via
           rest-spread, but passing it everywhere also keeps the
           door open for new token-aware blocks. */
        return <Renderer key={i} tokens={tokens} {...props} />;
      })}
    </div>
  );
}

/* Helper: extract the chapters from a narrative for use in the
   sidebar TOC. Returns [{ id, label }].

   The label is just the section title — chapter numbers are
   intentionally omitted from the menu so the sidebar reads as a
   plain list of section names. The chapter number still shows in
   the page's section headers themselves (rendered by SectionHeader),
   but it would feel duplicated to repeat it in the menu. */
export function narrativeTOC(blocks = []) {
  return blocks
    .filter((b) => b.kind === "sectionHeader")
    .map((b) => ({
      id: slugify(b.title),
      label: b.title,
    }));
}
