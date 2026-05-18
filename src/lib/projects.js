import SidePanel from "@/components/SidePanel/SidePanel";

// ─── Methodology stage presets (one set per project) ──────────────────
// Each project's case study renders a radial Methodology diagram. The
// stages are short interactive nodes around a circle; clicking one
// opens its body in the side panel.

const gwiMethodologyStages = [
  {
    id: "discover",
    label: "Strategy",
    title: "Framing the problem",
    body:
      "I was willing to change the fundamentals of our internal processes based on the potential risks I identified. I was able to establish a foundation based on evidence that pointed the way for the design approach that matched our users' mental models. This required an expert level of user comprehension and problem solving, until I was able to formulate a north star that key stakeholders could get behind.",
    metaLabel: "Primary insight",
    metaBody: "Calm defaults beat feature density for adoption.",
    href: "#",
  },
  {
    id: "define",
    label: "Philosophy",
    title: "Orientation, surfacing data and actioning",
    body:
      "The tool I designed operated more like a cockpit than a traditional dashboard — built for users maintaining constant awareness across multiple workflows, from drafting surveys and managing translations to monitoring quotas in fieldwork and beyond. The design ensured that users could quickly orient themselves, assess a range of critical information, and stay focused without becoming overwhelmed.",
    metaLabel: "Design north star",
    metaBody: "Same encodings, same interactions, depth on demand.",
    href: "#",
  },
  {
    id: "prototype",
    label: "Data",
    title: "Code-based sandbox",
    body:
      "AI coding tools such as Claude Code and Cursor were integral to my prototyping workflow. Leveraging these tools, I was able to design, build, and present interactive prototypes to the product team within short windows. This enabled us to rapidly evaluate architecture, flows, and features in a real sandbox environment. While still considered prototypes, these coded designs helped ground stakeholders and communicate the purpose and value of our solutions far more effectively than traditional mockups.",
    metaLabel: "Validation focus",
    metaBody: "Could a new analyst reach a defensible read in one sitting?",
    href: "#",
  },
  {
    id: "ship",
    label: "Agents",
    title: "Automate task triage and action assignment",
    body:
      "Designing systems and pipelines is increasingly central for designers—understanding information flow and knowing how and when to surface it are now core skills. For agent-driven experiences, this is even more critical. I approached the agent not as a typical chat interface, but as a 'lieutenant' that proactively lowered the cost of taking action below the cost of manual investigation.",
    metaLabel: "Rollout strategy",
    metaBody: "Cohort flags plus weekly readouts on task success.",
    href: "#",
  },
  {
    id: "iterate",
    label: "Business",
    title: "Success metrics and ROI",
    body:
      "Collaborated with PMs and data science to connect user feedback and behavioral insights to key business metrics—ensuring that refinements to ranking, copy, and alerting balanced real user needs with measurable business impact.",
    metaLabel: "Iteration loop",
    metaBody: "Fortnightly design spikes on top friction themes.",
    href: "#",
  },
];

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
const gwiProjectLayers = {
  problem: { body: "GWI's internal tool for collecting data was significantly out of date, compounded by years of technical and design debt meant our process to gain our data — the essence of what we sell — was syphoning money to 3rd parties to keep us ticking over." },
  value:   { body: "My goal was to reinvent our internal processes through a combination of efficiency, communication and cost savings." },
  solution:{ body: "Making the transfer of information efficient. Automate monotonous tasks. Give users the capability to deliver greater outputs." },
};

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

const philpotpearceProjectLayers = {
  problem: { body: "An ambitious product design agency just starting out, trying to establish their brand and reach their target audience." },
  value:   { body: "With a clear vision for the future of the studio, the two co-founders were looking to scale and establish themselves as a leading London-based studio." },
  solution:{ body: "A website that felt synonymous with the studio and their beliefs — a reflection of the studio and their work." },
};

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


// ─── Projects ─────────────────────────────────────────────────────────
export const projects = [
  {
    slug: "gwi",
    name: "GWI",
    initial: "G",
    date: "2024",
    role: "Founding designer · Consumer insights platform",
    tags: ["SaaS", "Insights", "Product"],
    blurb: "Designing the next generation of consumer insights tooling — making complex audience data approachable for marketers and strategists.",
    badge: "New",
    metrics: [
      ["Adoption uplift", "+38", "%"],
      ["Time to insight", "−42", "%"],
      ["Active workspaces", "1.2", "k"],
    ],
    projectLayers: gwiProjectLayers,
    methodologyStages: gwiMethodologyStages,
    sections: defaultSections,
    methodologyOrbits: defaultMethodologyOrbits,
  },
  {
    slug: "lexisnexis",
    name: "Nexis+AI",
    initial: "N",
    date: "2023",
    role: "Product design · AI research platform",
    tags: ["AI", "Research", "Enterprise"],
    blurb: "An AI research tool for business consultants at firms like KPMG and EY, grounded in 12,000 publishers and designed so every answer can be defended.",
    liveUrl: "https://www.lexisnexis.com/en-gb/products/research-insights/nexis-plus-ai",
    metrics: [
      ["Response quality", "+89", "%"],
      ["Preferred over ChatGPT", "80", "%"],
      ["Search effectiveness", "+100", "%"],
    ],
    projectLayers: lexisnexisProjectLayers,
    methodologyStages: lexisnexisMethodologyStages,
    sections: defaultSections,
    sectionBodies: lexisnexisSectionBodies,
    methodologyLead: lexisnexisMethodologyLead,
    methodologyOrbits: lexisnexisMethodologyOrbits,
  },
  {
    slug: "philpotpearce",
    name: "PhilpotPearce",
    initial: "P",
    date: "2024",
    role: "Brand identity & website · Independent consultancy",
    tags: ["Identity", "Web", "Brand"],
    blurb: "Visual identity and web presence for a creative consultancy — balancing editorial craft with a clear, confident voice.",
    badge: "Recently",
    liveUrl: "#",
    metrics: [
      ["Lighthouse perf.", "98", "/100"],
      ["Pages shipped", "12", ""],
      ["CSS exceptions", "0", ""],
    ],
    projectLayers: philpotpearceProjectLayers,
    methodologyStages: philpotpearceMethodologyStages,
    sections: defaultSections,
    methodologyOrbits: defaultMethodologyOrbits,
  },
  {
    slug: "soundtrends",
    name: "SoundTrends",
    initial: "S",
    date: "Coming soon",
    role: "Music intelligence platform",
    tags: ["Data", "Music", "Web"],
    blurb: "A music intelligence platform — turning streaming data into clear, useful signals for artists, labels, and curators.",
    badge: "Coming soon",
    comingSoon: true,
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
