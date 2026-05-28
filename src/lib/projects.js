import SidePanel from "@/components/SidePanel/SidePanel";
import { narrativeTOC } from "@/components/Narrative/Narrative";
import { loadProjectMarkdown } from "./loadProjectMarkdown";

/* GWI is sourced from /content/projects/gwi.md — proof-of-concept
   for the markdown CMS. The .md file's YAML frontmatter holds the
   metadata + the full narrative block array. Other projects still
   live inline in this file because they include JSX components
   (inline SidePanel triggers) that aren't expressible in YAML yet. */
const gwiFromMarkdown = loadProjectMarkdown("gwi");
const philpotpearceFromMarkdown = loadProjectMarkdown("philpotpearce");

// ─── Methodology stage presets (one set per project) ──────────────────
// Each project's case study renders a radial Methodology diagram. The
// stages are short interactive nodes around a circle; clicking one
// opens its body in the side panel.

/* (gwiMethodologyStages removed — GWI now sources from
   /content/projects/gwi.md and the narrative drives the page.) */

const lexisnexisMethodologyStages = [
  {
    id: "discover",
    label: "Strategy",
    title: "Marrying user needs to business goals",
    body:
      "To design strategically, I partnered with product leaders to clarify the business objectives like release dates, adoption, and retention. This collaboration ensured that my design work was not only user centered but also aligned with measurable business impact.",
    metaLabel: "Primary insight",
    metaBody: "Users trust citations before summaries.",
    href: "#",
  },
  {
    id: "define",
    label: "Philosophy",
    title: "I design therefore I am",
    body:
      "Business consultants face a unique challenge: they must process vast amounts of data to make informed decisions, yet showing all the information at once quickly clutters the screen. I applied progressive disclosure principles — structuring information in tier levels and enabling users to drill down only where needed.",
    metaLabel: "Design north star",
    metaBody: "Evidence first, explanation second.",
    href: "#",
  },
  {
    id: "prototype",
    label: "AI",
    title: "New design frontier",
    body:
      "Early in development, I noticed that our AI search responses weren't improving at the pace we expected. I identified an opportunity to contribute from a design perspective by examining how prompts were structured. By re-engineering them through a UX lens, I aligned outputs more closely with the language of consultants.",
    metaLabel: "Validation focus",
    metaBody: "Can lawyers verify claims in seconds?",
    href: "#",
  },
  {
    id: "ship",
    label: "Research",
    title: "Flagship investigative initiative",
    body:
      "I introduced Answer Quality Testing and led the first round, creating a framework to monitor how well responses met user needs. When I later rewrote the underlying prompts, AQT revealed a significant uplift in response quality.",
    metaLabel: "Rollout strategy",
    metaBody: "Cohort rollout with measurable checkpoints.",
    href: "#",
  },
  {
    id: "iterate",
    label: "Business",
    title: "Capabilities + Context = Concept",
    body:
      "Traditional design thinking frameworks, like the double diamond, often fall short when applied to AI. Drawing on research from leading academics, I adopted a new framework: Capabilities + Context = Concept. This shifts focus toward identifying what AI can reliably do and where it fits naturally into user workflows.",
    metaLabel: "Iteration loop",
    metaBody: "Weekly review + monthly redesign spikes.",
    href: "#",
  },
];

const philpotpearceMethodologyStages = [
  {
    id: "discover",
    label: "Branding",
    title: "Synonymous brand language",
    body:
      "Albert Einstein is famously reported to have said, 'If I had an hour to solve a problem I'd spend 55 minutes thinking about the problem and five minutes thinking about solutions.' This is how I spent most of my time with the founders — deeply exploring the core challenges before jumping into any design solutions.",
    metaLabel: "Primary insight",
    metaBody: "Credibility lives in restraint, not decoration.",
    href: "#",
  },
  {
    id: "define",
    label: "Identity",
    title: "Outcome centric",
    body:
      "The founders wanted their work to speak for itself and so the core focus of the website was to showcase what they are capable of and what they have achieved.",
    metaLabel: "Design north star",
    metaBody: "One rhythm from hero to component states.",
    href: "#",
  },
  {
    id: "prototype",
    label: "IA",
    title: "The golden circle",
    body:
      "The IA led menu functions as a thesis statement. A visitor reads the navigation and already knows the studio prioritises philosophy and craft over service-checklist selling.",
    metaLabel: "Validation focus",
    metaBody: "Do new pages ship without new CSS exceptions?",
    href: "#",
  },
  {
    id: "ship",
    label: "Rams",
    title: "Less is more",
    body:
      "Every element on the page feels as if it earns its place, which allows their work to speak for itself.",
    metaLabel: "Rollout strategy",
    metaBody: "Launch as static export with CI checks on scores.",
    href: "#",
  },
  {
    id: "iterate",
    label: "Atelier",
    title: "Portfolio architecture",
    body:
      "The site is deliberately designed to be a showcase of the studio's work and not just a portfolio. It acts as both agency and design house — a cultural practice whose exhibitions, objects, writing, and commerce are all expressions of the same point of view.",
    metaLabel: "Iteration loop",
    metaBody: "Fortnightly token audits + chromatic thresholds.",
    href: "#",
  },
];

const eventuringMethodologyStages = [
  {
    id: "discover",
    label: "Scaling",
    title: "New leads",
    body:
      "The framework of the website was designed to funnel potential clients through a journey that would lead to contacting the consultancy.",
    metaLabel: "Primary insight",
    metaBody: "Perceived polish and narrative clarity gate enterprise conversations.",
    href: "#",
  },
  {
    id: "define",
    label: "Touchpoints",
    title: "Journey-mapped services",
    body:
      "I mapped out the customer journey into the services they offer so as a founder or business owner they can see their own lifecycle reflected back at them. Building trust and credibility within their offerings.",
    metaLabel: "Design north star",
    metaBody: "One confident story from hero to contact.",
    href: "#",
  },
  {
    id: "prototype",
    label: "Trust",
    title: "Playing in the big leagues",
    body:
      "I added in layers of credibility signals to persuade potential leads of eVenturing's credibility and expertise.",
    metaLabel: "Validation focus",
    metaBody: "Could a cold visitor explain what eVenturing does in one pass?",
    href: "#",
  },
  {
    id: "ship",
    label: "Diagnostics",
    title: "Diagnostic-led capture",
    body:
      "The premise is that a buyer trusts a seller who diagnoses before prescribing — just as a patient trusts a doctor who examines before recommending treatment. The assessment is simultaneously a qualification tool.",
    metaLabel: "Rollout strategy",
    metaBody: "Launch with analytics on scroll depth, CTA clicks, and form starts.",
    href: "#",
  },
  {
    id: "iterate",
    label: "Branding",
    title: "Out with the old",
    body:
      "This wasn't just about designing and building a website — it was about developing a brand that hadn't been given any love. I worked closely with eVenturing's CEO and senior members to help communicate how the brand should be represented.",
    metaLabel: "Iteration loop",
    metaBody: "Monthly pass on top exit pages and CRM-reported objections.",
    href: "#",
  },
];

const sinaMethodologyStages = [
  {
    id: "discover",
    label: "Mimic",
    title: "Mirroring physio's diagnostic process",
    body:
      "In collaboration with doctors and physiotherapists, I designed a dynamic AI-powered app that mirrors the way a physio naturally diagnoses injuries.",
    metaLabel: "Primary insight",
    metaBody: "Access and trust matter as much as the exercise prescription.",
    href: "#",
  },
  {
    id: "define",
    label: "Trust",
    title: "Making users feel in control",
    body:
      "A difficult challenge was making users feel they could trust our diagnosis. Weaving in layers of credibility signals to prove our diagnosis was correct and trusted by leading physiotherapists.",
    metaLabel: "Design north star",
    metaBody: "Clinical credibility first; automation supports, never replaces, judgment.",
    href: "#",
  },
  {
    id: "prototype",
    label: "Start-up",
    title: "Being a co-founder",
    body:
      "Being a designer co-founder means treating design as a strategic lever, not a service function. You shape the product's vision alongside the business model, using rapid prototyping and user research to de-risk decisions before code gets written.",
    metaLabel: "Validation focus",
    metaBody: "Could users follow a plan without feeling surveilled or rushed?",
    href: "#",
  },
  {
    id: "ship",
    label: "Decisions",
    title: "Decision tree mapping",
    body:
      "The decision tree is used to calculate potential diagnoses. Each outcome is derived systematically from the structured pathways within the tree.",
    metaLabel: "Rollout strategy",
    metaBody: "Phased rollout with clinician review on high-risk pathways.",
    href: "#",
  },
  {
    id: "iterate",
    label: "Triaging",
    title: "Receiving feedback",
    body:
      "By factoring in injury severity, type, and user data, we generate a customised recovery plan. The approach provides flexibility while supporting a structured path to recovery.",
    metaLabel: "Iteration loop",
    metaBody: "Fortnightly design spikes on top friction themes from support and telemetry.",
    href: "#",
  },
];

const draftMethodologyStages = [
  { id: "discover", label: "Discovery", title: "Frame the problem space", body: "Stakeholder interviews, desk research, and competitive passes to align on users, constraints, and what success means before pixels.", metaLabel: "Primary insight", metaBody: "Replace with the insight that steered the roadmap.", href: "#" },
  { id: "define", label: "Strategy", title: "Synthesise principles and scope", body: "Turned research into principles, journey maps, and a phased scope so teams could decide what to ship first without losing the long arc.", metaLabel: "Design north star", metaBody: "Add the north-star statement for this engagement.", href: "#" },
  { id: "prototype", label: "Design", title: "Prototype and test critical flows", body: "High-fidelity flows for the riskiest assumptions, moderated or unmoderated tests, and fast iteration on copy, density, and affordances.", metaLabel: "Validation focus", metaBody: "Name the risk you tested and what changed after.", href: "#" },
  { id: "ship", label: "Delivery", title: "Ship with engineering and analytics", body: "Specs, edge states, and launch instrumentation so releases stay measurable — adoption, task success, or efficiency.", metaLabel: "Rollout strategy", metaBody: "Describe the launch slice or flag strategy.", href: "#" },
  { id: "iterate", label: "Impact", title: "Learn from usage and iterate", body: "Post-ship reviews with product and research, backlog grooming from telemetry, and design spikes on the top themes users still hit.", metaLabel: "Iteration loop", metaBody: "How often the team revisits the experience together.", href: "#" },
];


// ─── Project layers presets (Problem / Value / Solution) ──────────────
/* (gwiProjectLayers removed — GWI now sources from
   /content/projects/gwi.md.) */

const lexisnexisProjectLayers = {
  problem: { body: "Consultants in M&A, strategy and advisory are judged on the quality of their evidence. Generic AI tools sound confident, but fall apart in a partner review. There's no way to trace where the answer came from, or how much of it to trust." },
  value:   { body: "LexisNexis already had the moat: 12,000 vetted publishers most AI tools will never see. The opportunity was to turn that library into a workflow consultants would actually use, and trust." },
  solution:{ body: "Nexis+AI. Conversational search that reads user intent, pulls signal from 12,000 publishers, and cites every claim back to a source the user can drill into. Built so verifying an answer feels like part of the work, not a chore on top of it." },
};

const lexisnexisSectionBodies = {
  "what-i-owned": [
    "Nexis+AI was a six-discipline job: product strategy, human interface design, interaction design, design systems, research, art direction. I worked across all of them. That meant I wasn't handed a brief, I shaped one. From defining what \"good\" looked like with leadership and data science, through to the interaction patterns, the component library that held it together, and the visual language that made a tool with 12,000 sources feel calm rather than overwhelming.",
    "My day-to-day sat between three groups that rarely speak the same language: business stakeholders chasing market position, data scientists tuning the model, and the consultants at firms like KPMG and EY who'd actually use the thing. A lot of the work was translation, finding the shared vocabulary that let us argue about the right things, and making the trade-offs visible enough that leadership could decide.",
  ],
  "what-it-does": [
    "Nexis+AI reads what a consultant is actually trying to learn, not just the words in the search box. A conversational layer parses intent, runs the question across 12,000 vetted publishers, and returns a structured answer with every claim cited back to its source. Consultants can drill into any sentence and see the article it came from, or push the model to elaborate on the signals worth chasing.",
    "The same engine powers document analysis and drafting. Pull a 200-page filing in and surface the parts that matter, or use a source-grounded answer as the seed for a first draft. It's not a chatbot bolted onto a database, it's a research workflow where the AI and the source library work as one thing.",
  ],
  "why-it-matters": [
    "The headline numbers tell the trust story: an 89% lift in response quality versus the previous research flow, and 80% of users said they'd reach for Nexis+AI over ChatGPT for professional work. That second number is the one I care about. It means the tool didn't just work, it earned the kind of trust that survives a partner review.",
    "The lasting takeaway is a positioning one: the winning AI products won't be the ones that sound most confident, they'll be the ones that can show their work. That's a design problem more than a model problem, and it's the bet I'd make again on every AI tool I touch.",
  ],
};

const lexisnexisMethodologyLead =
  "Most AI tools optimise for impressive answers; the work here was to design for defensible ones. I anchored the methodology on a metric I introduced, Time to Validation: the seconds between a user reading a generated answer and trusting it enough to use. From there the work spread across five tracks: philosophy, strategy, AI behaviour, product, and research. Each one tied back to that single question of trust.";

const philosophyPrincipleBodies = {
  "Landscape of Data": (
    <p>
      Consultants work between zoom levels constantly. One moment they&apos;re
      looking at a company&apos;s quarterly filing line by line, the next they
      need to see how that company sits in its sector. The principle borrows
      from maps: you should be able to pull back for the territory or push in
      for the street, and the design should make the altitude obvious at all
      times. Every screen had to answer &ldquo;where am I in the data?&rdquo;
      before it answered anything else.
    </p>
  ),
  "Progressive Disclosure": (
    <p>
      Showing everything at once is the easiest way to make a powerful tool
      feel useless. Information is structured in tiers, with each tier
      earning the right to the next. The reader sees the answer first, then
      the supporting evidence, then the source, only when they ask for it.
      The result is a calm interface that still rewards depth.
    </p>
  ),
  "Search Paths": (
    <p>
      Research isn&apos;t a straight line. Consultants chase a thread, hit a
      dead end, double back, branch into a related question. The principle
      treats every search as a tree of mini threads the user can fork,
      prune, and return to. It keeps the investigative shape of the work
      visible instead of flattening it into a chat log.
    </p>
  ),
  "Skeuomorphism": (
    <p>
      Two uses. The first is borrowing the visual language of industry
      reports consultants already trust, so the output feels familiar at
      first glance and earns less suspicion. The second is the pyramid:
      executive summary on top, the consultant&apos;s working layer in the
      middle, the specialist&apos;s deep evidence underneath. One artefact,
      three audiences, no rewriting.
    </p>
  ),
  "Connective Tissue": (
    <p>
      Search isn&apos;t a screen, it&apos;s the hub the rest of the product
      hangs off. Saved searches feed dashboards, dashboards link back to
      the source documents, document analysis seeds the next query. The
      principle is that no feature should be a dead end. Every output is a
      starting point for the next piece of work.
    </p>
  ),
};

function PrincipleLink({ name }) {
  return (
    <SidePanel variant="inline" heading={name} body={philosophyPrincipleBodies[name]}>
      {name}
    </SidePanel>
  );
}

const lexisnexisMethodologyOrbits = [
  {
    label: "Philosophy",
    body: (
      <>
        Design without a worldview is just decoration. I built five principles
        that every decision in Nexis+AI had to earn its place against:{" "}
        <PrincipleLink name="Landscape of Data" />,{" "}
        <PrincipleLink name="Progressive Disclosure" />,{" "}
        <PrincipleLink name="Search Paths" />,{" "}
        <PrincipleLink name="Skeuomorphism" />, and{" "}
        <PrincipleLink name="Connective Tissue" />. Each came from a specific
        bet about how consultants actually move through information, and gave
        the team a shared yardstick when the trade-offs got tight.
      </>
    ),
  },
  {
    label: "Strategy",
    body: "I joined a team without a clear direction and built one. A vision statement, Trust and Transparency guidelines that became the AI design contract, and North Star designs across three horizons: three months for delivery, six to twelve for PMs, multi-year for executives pitching to clients. Workshops kept it honest. Every feature traced back to a real consultant Job to be Done.",
  },
  {
    label: "AI & Technology",
    body: "Most of the design that mattered happened inside the model. I re-engineered prompts through a UX lens, defined intent directives the data scientists could implement, and treated error states as design surfaces, not technical debt. The line I held: AI behaviour is design work, not engineering work that design responds to.",
  },
  {
    label: "Business & Product",
    body: "Post-launch, I built the feedback loop. Usage analytics paired with NPS to find the patterns the team should prioritise, and a framework I introduced called Capabilities + Context = Concept, which replaced traditional design thinking for AI features. It anchored every workshop in what the model could reliably do, not what we wished it could.",
  },
  {
    label: "Research",
    body: "I introduced Answer Quality Testing, a way to measure whether the AI was actually getting better, not just sounding better. The Co-Designed North Star pulled consultants into the design itself: interviews, role mapping, then designing ideal responses with the participants in the room. Every design decision on this project can be traced back to a consultant's words.",
  },
];

// ─── Nexis+AI narrative (block-based case study) ──────────────────────
const nexisNarrative = [
  // 01 · Hook
  {
    kind: "hook",
    headline: "Signals within the noise",
    company: { name: "LexisNexis" },
    clients: [
      { name: "KPMG" },
      { name: "EY" },
      { name: "Deloitte" },
    ],
    scope: [
      "Nexis+AI is a conversational research tool that identifies the nuanced signals from the noise. Through specialised intent detection, contextually aware responses leveraged on user attributes and innovative navigation techniques, users gain an elevated experience that EY, KPMG and more use.",
      "I led product design for Nexis+AI, an AI research platform built for consultants at firms like KPMG and EY. The work covered product strategy, interaction design, design systems, research, and art direction. My task was to surface the signals that matter from inside an overwhelming amount of news, filings, and reports, so consultants can move faster and decide better.",
    ],
    heroImage: { caption: "Hero image" },
  },
  {
    kind: "outcomes",
    items: [
      ["Global publishers", "12,000", ""],
      ["Preferred over ChatGPT", "80", "%"],
      ["Search effectiveness", "+100", "%"],
    ],
  },

  // 02 · The problem
  { kind: "sectionHeader", chapter: "02", title: "The problem" },
  {
    kind: "prose",
    paragraphs: [
      "Consultants are paid to identify root causes to business problems and make big calls. Whether the task is competitive intelligence, M&A, market analysis, or strategy and advisory, the work turns on the same thing: pulling the few signals that matter out of a vast and growing wall of news, filings, and reports, then shaping them into a recommendation that holds up in a partner review.",
      "The generic AI chat interfaces consultants were already leaning on limit that work in two specific ways. They flatten a depth-of-research task into a single confident answer, so the user loses the ability to scope, weight, and shape their own investigation. And they hide the sources behind the answer, which for a consultant whose recommendation will be acted on is not a usability complaint, it's a serious concern.",
    ],
  },
  { kind: "imagePlaceholder", caption: "The problem" },

  // 03 · The experience I built
  {
    kind: "sectionHeader",
    chapter: "03",
    title: "The experience I built",
    subtitle:
      "Independent product design — research, interaction, art direction, and design system are all my own contribution.",
  },
  {
    kind: "prose",
    paragraphs: [
      "Four features did the heavy lifting. Each one answers a question consultants have about doing depth-of-research work inside an AI tool — and each one elevates their search ability past what a generic chat interface can offer.",
    ],
  },

  { kind: "subsectionHeader", title: "How can consultants tailor a search to their specific tasks?" },
  {
    kind: "prose",
    paragraphs: [
      "With explicit context dials. A competitor analysis needs different sources, structure, and weighting from a market analysis. Contextual search lets users set those conditions explicitly, so the same question returns a meaningfully different answer depending on the lens.",
    ],
  },
  {
    kind: "outcomeNote",
    text:
      "Search shapes itself to the consultant's job — not the other way around.",
  },
  { kind: "imagePlaceholder", caption: "Contextual agentic search" },

  { kind: "subsectionHeader", title: "How can consultants elaborate on a response without typing?" },
  {
    kind: "prose",
    paragraphs: [
      "By selecting any part of a response and clicking elaborate. The platform widens the net on the existing search rather than starting a new one — no need to re-prompt, no need to pick the right words. This pattern shipped in Nexis+AI before Claude later popularised the same idea in their consumer interface.",
    ],
  },
  {
    kind: "outcomeNote",
    text:
      "Consultants drill into a specific point in seconds, without losing the thread they were already on.",
  },
  { kind: "imagePlaceholder", caption: "Elaboration" },

  { kind: "subsectionHeader", title: "How can consultants explore rabbit holes with confidence?" },
  {
    kind: "prose",
    paragraphs: [
      "By branching. From any point in the main search, the consultant spins off a sub-search into its own page, follows the rabbit hole as deep as they want, and returns to the parent thread untouched. The branch structure doubles as a record of how the consultant thinks.",
    ],
  },
  {
    kind: "outcomeNote",
    text:
      "Consultants chase tangents without losing context — the investigation stays one continuous trail of thought.",
  },
  { kind: "imagePlaceholder", caption: "Branching" },

  { kind: "subsectionHeader", title: "How can consultants verify an answer before they use it?" },
  {
    kind: "prose",
    paragraphs: [
      "By anchoring every signal to a source the consultant can drill into. I introduced Time to Validation — the seconds between reading an answer and trusting it enough to use — as a design metric, and tuned inline citations, hover drill-downs, and visible source weighting around it.",
    ],
  },
  {
    kind: "outcomeNote",
    text:
      "Recommendations make it through partner review because every claim is one click from its source.",
  },
  { kind: "imagePlaceholder", caption: "Sources and Time to Validation" },

  // 04 · Philosophy
  { kind: "sectionHeader", chapter: "04", title: "Philosophy" },
  {
    kind: "prose",
    paragraphs: [
      "Before any pixels moved I built a set of principles: ways of approaching the problem that every following design had to earn its place against. They turned the brief from \"build an AI search tool\" into \"design for defensible answers, not impressive ones\" — and gave the team a shared yardstick when the trade-offs got tight.",
    ],
  },
  {
    /* Three bespoke canvas scenes, one per principle, each picked to
       mirror how the principle actually behaves inside Nexis+AI:
       a constellation the user can re-connect for new patterns, a
       branching search tree, and a calm helix that earns each turn. */
    kind: "philosophyVisuals",
    items: [
      {
        variant: "constellation",
        label: "Constellation of data",
        eyebrow: "Principle 01",
        title: "Constellation of Data",
        body:
          "The same field of data points, read differently. How those points get connected is what tells the story — competitive intelligence draws one constellation, M&A draws another, market sizing draws a third. The interface makes those connections legible instead of collapsing them into a single confident answer.",
      },
      {
        variant: "search-paths",
        label: "Search paths",
        eyebrow: "Principle 02",
        title: "Search Paths",
        body:
          "Research isn't a straight line. From a single question, the consultant branches into sub-threads, follows the rabbit holes that look promising, prunes the ones that don't. Every search is a tree the user can fork, return to, and shape — the investigative work stays legible rather than flattening into a chat log.",
      },
      {
        variant: "helix",
        label: "Progressive disclosure",
        eyebrow: "Principle 03",
        title: "Progressive Disclosure",
        body:
          "Answer first. Evidence second. Source on demand. Each turn of the helix earns the next — the consultant sees the recommendation, then the supporting points, then the citation, only when they ask for it. The interface stays calm at the top and still rewards the consultant who wants to go all the way down.",
      },
    ],
  },

  // 05 · Success benchmarks
  { kind: "sectionHeader", chapter: "05", title: "Success benchmarks" },
  {
    kind: "prose",
    paragraphs: [
      "Two pieces of research carried the methodology, and the numbers backed them up.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Success benchmarks" },
  { kind: "subsectionHeader", title: "Answer Quality Testing" },
  {
    kind: "prose",
    paragraphs: [
      "I introduced AQT as a framework to measure response quality systematically. After I identified the prompt-engineering and source-weighting issues and the design fixes landed, AQT showed an 89% lift in response quality. The numbers anchored the case that design had moved the model, not just the screen.",
    ],
  },
  { kind: "subsectionHeader", title: "Ideal Response (Co-Designed North Star)" },
  {
    kind: "prose",
    paragraphs: [
      "To set the north star, I co-designed the ideal AI response with consultants in the room. Interviews, role mapping, then designing target answers alongside the participants. The artefact gave the team a sharable definition of \"good\" and became the language leadership used to align around the product's future.",
    ],
  },

  // 06 · What I'd do differently
  { kind: "sectionHeader", chapter: "06", title: "What I'd do differently" },
  {
    kind: "prose",
    paragraphs: [
      "A lot of my collaboration with data science involved running experiments and assumptions in parallel, sometimes without realising it. Different intuitions, same questions. Data scientists work from technical intuition; I work from behaviour and systems. We communicate through diagrams, observations, flow charts, and outcomes.",
      "For every collaborator there is a shared language. Find it, and you've found the key. I'd invest in that language earlier and more explicitly on every cross-functional project I lead.",
    ],
  },
];

/* (philpotpearceProjectLayers removed — unused dead code.) */

// ─── PhilpotPearce principle bodies (token registry) ──────────────────
/* These stay in JS (not markdown) because the principle bodies are
   JSX with semantic <p> wrappers. The narrative in
   /content/projects/philpotpearce.md references each principle via
   a `{{principle:Name}}` token; Narrative looks the body up here at
   render time. */
const philpotpearcePrincipleBodies = {
  "Synonymous brand language": (
    <p>
      The brand language had to be the studio. Type, palette, pace, and
      voice were all designed to match how the founders actually work:
      considered, calm, restrained. Anything ornamental was the wrong
      answer; credibility lives in restraint, not decoration.
    </p>
  ),
  "Outcome centric": (
    <p>
      The founders wanted their work to speak for itself, so the core
      focus of the website was to showcase what they are capable of and
      what they have achieved. Every page was designed to put the work
      in front of the visitor and step out of the way.
    </p>
  ),
  "The golden circle": (
    <p>
      The IA-led menu functions as a thesis statement. A visitor reads
      the navigation and already knows the studio prioritises philosophy
      and craft over service-checklist selling. Why before What before
      How: the golden circle structure carried directly into the
      information architecture.
    </p>
  ),
  "Less is more": (
    <p>
      Every element on the page feels as if it earns its place, which
      allows the work to speak for itself. The system is closer to a
      Dieter Rams pared-back instrument than a contemporary agency site,
      and that's exactly the point.
    </p>
  ),
  "Portfolio architecture": (
    <p>
      The site is deliberately designed to be a showcase of the studio's
      work, not just a portfolio. It acts as both agency and design
      house: a cultural practice whose exhibitions, objects, writing,
      and commerce are all expressions of the same point of view.
    </p>
  ),
};

/* (PhilpotPrincipleLink removed — Narrative now resolves
   {{principle:Name}} tokens against the tokens.principle map
   passed via the project record.) */


const eventuringProjectLayers = {
  problem: { body: "eVenturing's previous website didn't convey their brand and created an unprofessional look for the company. Potential clients were put off; engagement and deals dropped as a result." },
  value:   { body: "As eVenturing was growing they were trying to land more reputable brands and needed a website to match." },
  solution:{ body: "A guided experience that moves the user through the website building eVenturing's narrative, identifying key touch points and opportunities for engagement." },
};

const sinaProjectLayers = {
  problem: { body: "Access to effective sports recovery support is not equal." },
  value:   { body: "Lowering the barrier to entry for athletes to receive effective recovery support." },
  solution:{ body: "In collaboration with doctors and physiotherapists, I designed a dynamic AI-powered app that mirrors the way physios naturally diagnose injuries." },
};

const soundtrendsProjectLayers = {
  problem: { body: "A long-running music discovery app with a loyal but ageing user base struggled to feel fresh; navigation and daily rituals had not kept pace with how people listen today." },
  value:   { body: "Re-engage listeners with audio-first flows, clearer discovery signals, and daily mixtape rituals that reward return visits without notification fatigue." },
  solution:{ body: "Native iOS rethink: audio-native gestures and stacks, signal-first ranking and empty states, and a typography pass — shaping an experience tuned for retention and longer sessions." },
};


// ─── Doc-mode sidebar TOC sections ────────────────────────────────────
// Anchor list shown under the project title in the doc-mode sidebar.
// Ids must match the section `id`s rendered in src/app/[slug]/page.js
// so the in-page jump links resolve.
const defaultSections = [
  { id: "what-i-owned",   label: "What I owned" },
  { id: "my-methodology", label: "My methodology" },
  { id: "what-it-does",   label: "What it does" },
  { id: "why-it-matters", label: "Why it matters" },
];

// ─── Methodology orbit satellites (compass-rose visualisation) ────────
// 3-5 categories per project that describe the methodology dimensions.
// Each has a short label and a 3-4 sentence body. Replace per-project
// with real categories when content is ready.
const defaultMethodologyOrbits = [
  {
    label: "Manufacturing",
    body:
      "Placeholder body for the first methodology category. Replace with three or four sentences describing what this dimension of the work looked like, the decisions it covered, and the artefacts it produced.",
  },
  {
    label: "Commerce",
    body:
      "Placeholder body for the second methodology category. Use this slot for the commercial framing of the work — how I tied design decisions to revenue, retention, or whichever business metric mattered most.",
  },
  {
    label: "Marketing",
    body:
      "Placeholder body for the third methodology category. Describe how positioning, story, or narrative work threaded through the engagement and connected to the broader brand.",
  },
  {
    label: "Fostering",
    body:
      "Placeholder body for the fourth methodology category. Cover team-shaped work — how I coached, partnered, or built capability around the engagement so the team could keep moving once I rolled off.",
  },
];


/* (gwiFailureModes, gwiDecisions, gwiPillars, and gwiNarrative removed
   — GWI's narrative now lives in /content/projects/gwi.md and is
   loaded via loadProjectMarkdown at the top of this file.) */


// ─── Projects ─────────────────────────────────────────────────────────
export const projects = [
  {
    /* GWI sourced from /content/projects/gwi.md. The .md file's
       frontmatter spreads in: slug, name, initial, date, role,
       tags, blurb, badge, metrics, narrative. The sections array
       is derived from the narrative's sectionHeader blocks. */
    ...gwiFromMarkdown,
    sections: narrativeTOC(gwiFromMarkdown.narrative),
  },
  {
    slug: "lexisnexis",
    name: "Nexis+AI",
    initial: "N",
    date: "2023-2025",
    role: "Product design · AI research platform",
    tags: ["AI", "Convo search", "Enterprise"],
    blurb: "An AI research tool for business consultants at firms like KPMG and EY. Built to surface the signals that matter from 12,000 publishers worth of noise.",
    badge: "Shipped",
    liveUrl: "https://www.lexisnexis.com/en-gb/products/research-insights/nexis-plus-ai",
    metrics: [
      ["Global publishers", "12,000", ""],
      ["Preferred over ChatGPT", "80", "%"],
      ["Search effectiveness", "+100", "%"],
    ],
    narrative: nexisNarrative,
    sections: narrativeTOC(nexisNarrative),
  },
  {
    /* PhilpotPearce sourced from /content/projects/philpotpearce.md.
       The principle bodies stay in JS as the token registry because
       they're JSX; the narrative references them via
       `{{principle:Name}}` tokens that Narrative resolves at render. */
    ...philpotpearceFromMarkdown,
    sections: narrativeTOC(philpotpearceFromMarkdown.narrative),
    tokens: { principle: philpotpearcePrincipleBodies },
  },
  {
    slug: "soundtrends",
    name: "SoundTrends",
    initial: "S",
    date: "Coming soon",
    role: "Music intelligence platform",
    tags: ["Data", "Music", "Web design"],
    blurb: "A music intelligence platform — turning streaming data into clear, useful signals for artists, labels, and curators.",
    badge: "Coming soon",
    comingSoon: true,
    /* Visual-only on the home grid — hidden from the sidebar
       menu because the case-study page isn't ready yet. */
    excludeFromMenu: true,
    metrics: [],
    projectLayers: soundtrendsProjectLayers,
    methodologyStages: draftMethodologyStages,
    sections: defaultSections,
    methodologyOrbits: defaultMethodologyOrbits,
  },
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
