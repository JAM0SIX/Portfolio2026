import SidePanel from "@/components/SidePanel/SidePanel";
import { narrativeTOC } from "@/components/Narrative/Narrative";

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

// ─── Nexis+AI narrative (block-based case study) ──────────────────────
const nexisNarrative = [
  // 01 · Hook
  {
    kind: "hook",
    headline: "Signal in the noise",
    scope:
      "I led product design for Nexis+AI, an AI research platform built for consultants at firms like KPMG and EY. The work covered product strategy, interaction design, design systems, research, and art direction. My task was to surface the signals that matter from inside an overwhelming amount of news, filings, and reports, so consultants can move faster and decide better.",
  },
  {
    kind: "lede",
    paragraphs: [
      "The goal was to turn an overwhelming volume of news, filings, and reports into the few signals consultants actually need, surfaced fast and traceable back to a real source.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Hero image" },
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

  // 03 · The value
  { kind: "sectionHeader", chapter: "03", title: "The value" },
  { kind: "subsectionHeader", title: "For the business" },
  {
    kind: "prose",
    paragraphs: [
      "For LexisNexis, the product is the next chapter of a research business that already serves the consulting world. The bet is that AI deepens that relationship rather than erodes it: 12,000 vetted publishers most generic AI tools will never see, paired with a design layer that makes the trust in the answer visible. 80% of users said they'd reach for Nexis+AI over ChatGPT for professional work.",
    ],
  },
  { kind: "subsectionHeader", title: "For the consultant" },
  {
    kind: "prose",
    paragraphs: [
      "At the desk, the change is the one that matters most: less time wading through noise, more confidence in the signal, and recommendations a consultant can put their name on.",
    ],
  },
  { kind: "imagePlaceholder", caption: "The value" },

  // 04 · Directing business strategy
  { kind: "sectionHeader", chapter: "04", title: "Directing business strategy" },
  { kind: "subsectionHeader", title: "Shaping product direction" },
  {
    kind: "prose",
    paragraphs: [
      "Before any design moved, I set out the roadmap of work the team needed to do to identify the real problem, the gaps consultants were hitting, and the areas where the tool could grow. That sequencing turned a vague brief into a series of decisions the business could fund and the team could deliver against.",
      "From there, every design decision was informed by data. The Trust and Transparency guidelines, the Co-Designed Ideal Response, the North Star designs across three months, six to twelve, and multi-year horizons, all of them traced back to what the research and the numbers were telling us, not what the loudest voice in the room thought looked right.",
    ],
  },
  { kind: "subsectionHeader", title: "A philosophy as the design contract" },
  {
    kind: "richProse",
    paragraphs: [
      (
        <>
          To articulate and shape the north star, I built a set of principles:
          different ways of approaching and tackling the problem and a way to
          sell the idea to the business. They became the foundation every
          design that followed had to build on:{" "}
          <PrincipleLink name="Landscape of Data" />,{" "}
          <PrincipleLink name="Progressive Disclosure" />,{" "}
          <PrincipleLink name="Search Paths" />,{" "}
          <PrincipleLink name="Skeuomorphism" />, and{" "}
          <PrincipleLink name="Connective Tissue" />.
        </>
      ),
    ],
  },
  { kind: "imagePlaceholder", caption: "The five principles in practice" },
  { kind: "subsectionHeader", title: "Partnering with the ML team" },
  {
    kind: "prose",
    paragraphs: [
      "The behaviour I wanted from the product couldn't be designed at the screen layer alone. It had to come from the model. I partnered with data science to translate user intent into model directives: what counts as a good source, what counts as a good answer, how to handle uncertainty. That moved prompt engineering and search settings out of \"engineering decisions\" and into shared decisions, because user intent lives there too.",
    ],
  },

  // 05 · Features that moved the needle
  { kind: "sectionHeader", chapter: "05", title: "Features that moved the needle" },
  {
    kind: "prose",
    paragraphs: [
      "There were more features than these, but four did the heavy lifting. Each one elevates the consultant's search ability, cutting through the noise and surfacing the signals they need, faster.",
    ],
  },

  { kind: "subsectionHeader", title: "Branching" },
  { kind: "imagePlaceholder", caption: "Branching" },
  {
    kind: "prose",
    paragraphs: [
      "Consultants don't search linearly. They follow a thread, spot something worth chasing, and need to investigate without losing where they were. Branching lets them spin off a sub-search from any point in the main thread into its own page, dive as deep as they want, and return to the parent search untouched. The branch structure doubles as a record of how the user thinks.",
    ],
  },

  { kind: "subsectionHeader", title: "Elaboration" },
  { kind: "imagePlaceholder", caption: "Elaboration" },
  {
    kind: "prose",
    paragraphs: [
      "Re-prompting an AI to expand on a point breaks the user's flow and forces them to pick the right words. Action buttons elaborate on the selected part of a response in one click. It widens the net on the existing search rather than starting a new one. This pattern shipped in Nexis+AI before Claude later popularised the same idea in their consumer interface.",
    ],
  },

  { kind: "subsectionHeader", title: "Contextual agentic search" },
  { kind: "imagePlaceholder", caption: "Contextual agentic search" },
  {
    kind: "prose",
    paragraphs: [
      "Natural language search lowers the barrier to entry but falls apart for professionals doing specific analysis. A competitor analysis needs sources, structure, and weighting different to a market analysis. Contextual search lets users dial in those conditions explicitly, so the same query returns a meaningfully different answer depending on the lens.",
    ],
  },

  { kind: "subsectionHeader", title: "Sources and Time to Validation" },
  { kind: "imagePlaceholder", caption: "Sources and Time to Validation" },
  {
    kind: "prose",
    paragraphs: [
      "Surfacing a signal is half the job; confirming it's real is the other half. Every signal is anchored to a source the user can drill into. I introduced Time to Validation, the metric that measures the seconds between reading an answer and trusting it enough to use, and tuned the interaction patterns around it: inline citations, drill-down on hover, source weighting visible in the result.",
    ],
  },

  // 06 · How I knew it worked
  { kind: "sectionHeader", chapter: "06", title: "How I knew it worked" },
  {
    kind: "prose",
    paragraphs: [
      "Two pieces of research carried the methodology, and the numbers backed them up.",
    ],
  },
  { kind: "imagePlaceholder", caption: "How I knew it worked" },
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

  // 07 · Decisions worth telling
  { kind: "sectionHeader", chapter: "07", title: "Decisions worth telling" },
  { kind: "subsectionHeader", title: "When the user perspective surfaced the real problem" },
  {
    kind: "prose",
    paragraphs: [
      "Early on, the AI responses weren't hitting the quality bar. The team was working hard on the model and the engineering, optimising for technical correctness. The breakthrough came when I went under the hood with a user-centric lens. The prompt engineering and search settings had issues that weren't visible from a model-quality view alone: source weighting wasn't tuned to consultant tasks, prompts weren't shaped around user intent, defaults weren't matched to consultant jobs.",
      "I ran experiments and A/B tested the changes. The numbers proved the case. What looked like a model problem was a user-intent problem expressed through model configuration, and surfacing it was design work.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Before / after" },
  // 08 · What I'd do differently
  { kind: "sectionHeader", chapter: "08", title: "What I'd do differently" },
  {
    kind: "prose",
    paragraphs: [
      "A lot of my collaboration with data science involved running experiments and assumptions in parallel, sometimes without realising it. Different intuitions, same questions. Data scientists work from technical intuition; I work from behaviour and systems. We communicate through diagrams, observations, flow charts, and outcomes.",
      "For every collaborator there is a shared language. Find it, and you've found the key. I'd invest in that language earlier and more explicitly on every cross-functional project I lead.",
    ],
  },
];

const philpotpearceProjectLayers = {
  problem: { body: "An ambitious product design agency just starting out, trying to establish their brand and reach their target audience." },
  value:   { body: "With a clear vision for the future of the studio, the two co-founders were looking to scale and establish themselves as a leading London-based studio." },
  solution:{ body: "A website that felt synonymous with the studio and their beliefs — a reflection of the studio and their work." },
};

// ─── PhilpotPearce narrative (block-based case study) ─────────────────
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

function PhilpotPrincipleLink({ name }) {
  return (
    <SidePanel variant="inline" heading={name} body={philpotpearcePrincipleBodies[name]}>
      {name}
    </SidePanel>
  );
}

const philpotpearceDecisions = [
  {
    name: "Restraint as the brand",
    summary: "The visual system as a statement of values, not decoration.",
    image: { caption: "Brand system" },
    body: [
      "Most agencies dress up their identities. PhilpotPearce strips back. Every visual decision, every word on the site, every component had to earn its place.",
      "The studio's value proposition is in what they don't do as much as what they do. The brand reads as a piece of evidence for that, not a slogan about it.",
    ],
  },
  {
    name: "Navigation as thesis statement",
    summary: "The golden circle as information architecture.",
    image: { caption: "IA as thesis" },
    body: [
      "Most agency sites lead with a service checklist. We led with worldview. The IA borrows from the golden circle (Why, How, What) so the navigation itself communicates how the studio thinks.",
      "By the time the visitor reaches the work, they've already absorbed the studio's philosophy. The work doesn't have to justify itself, it just has to land.",
    ],
  },
  {
    name: "Work as the hero",
    summary: "Project pages built to showcase, not narrate.",
    image: { caption: "Work showcase" },
    body: [
      "Project pages are designed as exhibitions. Large imagery, sparing captions, no marketing scaffolding around the work. The visitor's job is to look; the studio's job is to give them something worth looking at.",
      "This is the moment where the brand has to disappear and the work has to carry the weight.",
    ],
  },
  {
    name: "Editorial typography",
    summary: "A single rhythm from hero to component states.",
    image: { caption: "Type system" },
    body: [
      "One typographic system runs from hero through navigation through body copy through component states. There are no exceptions and no overrides. That consistency does most of the work that decoration usually has to.",
      "The system was designed so new pages ship without new CSS exceptions, which keeps the studio's site as disciplined as its work.",
    ],
  },
];

const philpotpearceNarrative = [
  // 01 · Hook
  {
    kind: "hook",
    headline: "A studio that speaks for itself",
    scope:
      "I designed the brand identity and website for PhilpotPearce, an independent product design consultancy in London. The work covered brand strategy, visual identity, information architecture, art direction, and the web design and build. My task was to give a sharp practice a public face that matched the work, with restraint as the loudest signal.",
  },
  {
    kind: "lede",
    paragraphs: [
      "The goal was to land the studio as a credible practice from the first visit and let the work do the talking from the second click on.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Hero image" },
  {
    kind: "outcomes",
    items: [
      ["Lighthouse perf.", "98", "/100"],
      ["Pages shipped", "12", ""],
      ["CSS exceptions", "0", ""],
    ],
  },

  // 02 · The problem
  { kind: "sectionHeader", chapter: "02", title: "The problem" },
  {
    kind: "prose",
    paragraphs: [
      "Two co-founders, both senior product designers, were starting a studio with the right work and the wrong shopfront. Their practice was sharp; their public presence was nothing. Without a brand and a site, they were invisible to the clients they wanted and indistinguishable from the agencies they didn't.",
      "The market was already full of agencies talking loudly about themselves. Any new studio that joined the noise would lose. The opening had to come from somewhere quieter.",
    ],
  },
  { kind: "imagePlaceholder", caption: "The problem" },

  // 03 · The value
  { kind: "sectionHeader", chapter: "03", title: "The value" },
  { kind: "subsectionHeader", title: "For the business" },
  {
    kind: "prose",
    paragraphs: [
      "PhilpotPearce launched with a brand the founders could carry into pitches, into press, and into commercial conversations. The site became their primary acquisition channel, designed to filter for clients who valued craft and outcomes over service-list shopping.",
    ],
  },
  { kind: "subsectionHeader", title: "For the visitor" },
  {
    kind: "prose",
    paragraphs: [
      "In thirty seconds, a visitor reads the studio's worldview from the navigation alone. From there it's a series of clear, restrained pages that put the work in front of them and step out of the way.",
    ],
  },
  { kind: "imagePlaceholder", caption: "The value" },

  // 04 · Directing the studio's voice
  { kind: "sectionHeader", chapter: "04", title: "Directing the studio's voice" },
  {
    kind: "prose",
    paragraphs: [
      "Restraint as the brand. Most agencies dress up their identities; PhilpotPearce strips back. Every visual decision, every word on the site, every component had to earn its place. The studio's value proposition is in what they don't do as much as what they do.",
    ],
  },
  { kind: "subsectionHeader", title: "Five principles" },
  {
    kind: "richProse",
    paragraphs: [
      (
        <>
          The work was anchored by five principles the founders and I argued
          features in or out against:{" "}
          <PhilpotPrincipleLink name="Synonymous brand language" />,{" "}
          <PhilpotPrincipleLink name="Outcome centric" />,{" "}
          <PhilpotPrincipleLink name="The golden circle" />,{" "}
          <PhilpotPrincipleLink name="Less is more" />, and{" "}
          <PhilpotPrincipleLink name="Portfolio architecture" />. Each came
          from how the founders actually wanted the studio to operate, not
          from how an agency website is supposed to look.
        </>
      ),
    ],
  },

  // 05 · What I designed
  { kind: "sectionHeader", chapter: "05", title: "What I designed" },
  {
    kind: "prose",
    paragraphs: [
      "Four design moves did the heavy lifting. Each is the moment the principles met a real decision on the page.",
    ],
  },
  { kind: "decisionList", decisions: philpotpearceDecisions },

  // 06 · A decision worth telling
  { kind: "sectionHeader", chapter: "06", title: "A decision worth telling" },
  {
    kind: "prose",
    paragraphs: [
      "The founders' instinct, like most studios opening a website, was to start with Work / About / Services. I argued the studio's whole positioning would collapse if the navigation looked like every other agency's navigation, no matter how good the work behind it was.",
      "The golden circle, Why before How before What, gave the IA a thesis. Once the founders saw the first round of pages built on that structure, the conversation moved from \"is this navigable\" to \"this is the studio.\" The IA became the brand, and the brand became the IA.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Navigation as thesis" },

  // 07 · What I'd do differently
  { kind: "sectionHeader", chapter: "07", title: "What I'd do differently" },
  {
    kind: "prose",
    paragraphs: [
      "I'd have shipped a writing system alongside the visual one. Restraint is a much harder discipline in copy than in design, and a couple of pages where the words drift would undo the work the type and layout do silently. Next time, a tone-of-voice spec sits inside the design system, not next to it.",
    ],
  },
];

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


// ─── GWI narrative (block-based case study) ───────────────────────────
const gwiFailureModes = [
  {
    quote: "Everything lives in a different place",
    label: "Seams: context lives between tools, not in them",
  },
  {
    quote: "Everything is manual right now… there is no automation at all",
    label: "Labour: humans doing what systems should",
  },
  {
    quote: "Tonnage can be finicky… an extra space and it fails… error messages aren't very helpful",
    label: "Brittleness: high-cost failures from low-stakes inputs",
  },
  {
    quote: "Quotas are not connected to each other… one could block the whole fieldwork without noticing",
    label: "Silent failure: no shared state, no shared awareness",
  },
  {
    quote: "No clean way to have a contract addendum… it's a hacky system… makes the audit significantly harder",
    label: "Business risk: workarounds compound into audit liability",
  },
];

const gwiDecisions = [
  {
    name: "Homepage as orientation, not dashboard",
    summary: "Critical information, organised signals, ranked order of activities.",
    image: { caption: "Homepage as orientation" },
    body: [
      "Most operator tools open into a wall of charts. I designed the homepage to surface only critical information, the signals that need a human decision today.",
      "Multiple signals from across the pillars are organised into one ranked order of activities, so the operator opens the day with a single ordered list of where their attention should go. The promise: if it isn't on this screen, it doesn't need you.",
    ],
  },
  {
    name: "Drafting backed by RAG and synthetic data",
    summary: "RAG for question and translation consistency, synthetic data for survey coverage.",
    image: { caption: "Drafting with RAG + synthetic data" },
    body: [
      "A RAG system grounds every drafting suggestion in GWI's own question library and translation corpus, so consistency is enforced across questions and across the languages each survey ships in.",
      "Synthetic data acts as a stress test on top: the platform runs the draft against simulated respondents to identify gaps in question coverage, optimise the spread, and surface where the survey will fail before it goes out.",
    ],
  },
  {
    name: "Agent that surfaces, supports, and acts",
    summary: "Surfaces critical information, keeps the user in control, carries out the mundane.",
    image: { caption: "Agent surface" },
    body: [
      "The agent surfaces critical information the moment it matters: a stalled quota, an unanswered approval, an error that needs eyes. The operator keeps control of every decision.",
      "It also recommends and carries out the mundane work on the user's behalf: chasing approvals, reformatting exports, queuing reminders. Trust comes from the agent's scope being visible, not assumed.",
    ],
  },
  {
    name: "Translation kept inside the tool",
    summary: "Automated first pass, human review focused only on questions that need judgement.",
    image: { caption: "In-tool translation flow" },
    body: [
      "Survey translation was going to third parties at significant per-project cost and turnaround time. I designed an in-tool translation flow with an automated first pass and human review focused only on the questions that needed judgement.",
    ],
  },
  {
    name: "Fieldwork architecture for navigation, not monitoring",
    summary: "Wayfinding over reporting, the agent watches, the operator moves.",
    image: { caption: "Fieldwork wayfinding" },
    body: [
      "The fieldwork surface isn't a dashboard. Operators don't need to watch, they need to get to the right project fast.",
      "I designed the IA around search, filtering, and data visualisations that act as wayfinding rather than reporting. The agent does the watching; the operator does the moving.",
    ],
  },
];

const gwiPillars = [
  {
    title: "Project Hub",
    body: "Holds the world: every project, survey, wave, and fieldwork state in one canonical place. Replaces the spread of Confluence pages, spreadsheets, and Salesforce records that operators currently re-type into each other.",
  },
  {
    title: "Drafting workflow",
    body: "Changes the world: where surveys are authored, translated, and approved. The agent sits on the same canvas as the draft so authorship and AI suggestions stay legible.",
  },
  {
    title: "Fieldwork",
    body: "Runs the world: in-field monitoring, quota management, and respondent-facing survey delivery. Built for navigation and intervention, not passive dashboards.",
  },
];

const gwiNarrative = [
  // 01 · Hook
  {
    kind: "hook",
    headline: "Agentic data system",
    scope:
      "I owned the end-to-end design of GWI's internal data system, from interviews and synthesis through strategy, architecture, and engineering handoff. The system runs the research and data pipeline that produces the insights GWI sells to clients like FIFA, Meta, Amazon, and Omnicom.",
  },
  {
    kind: "lede",
    paragraphs: [
      "The goal was to make the data process radically more efficient and save the business significant money: collect larger quantities of data, faster and at lower cost, giving researchers the ability to do more with less.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Hero image" },
  {
    kind: "outcomes",
    items: [
      ["Saved per year", "£750,000", ""],
      ["Fewer clicks to insights", "6", "x"],
      ["Increase in researcher capacity", "40", "%"],
    ],
  },

  // 02 · The problem
  { kind: "sectionHeader", chapter: "02", title: "The problem" },
  {
    kind: "prose",
    paragraphs: [
      "Research operators at GWI worked across seven systems to run a single project: Qualtrics, Jira, Confluence, Slack, spreadsheets, Salesforce, and an internal data tool. Each tool worked. The connective tissue between them didn't.",
      "The cost wasn't any single tool. It was the re-typing of context at every handover, institutional knowledge being blocked from moving downstream, and the silent failure modes hiding between systems that nobody owned.",
    ],
  },
  {
    kind: "quote",
    body: "There's so many platforms and so many steps and so many different things to remember… the fact that everything lives in a different place is really frustrating.",
    source: "Research operator, GWI",
  },
  {
    kind: "prose",
    paragraphs: [
      "The question I carried out of every interview was the same: how do we do more with less?",
    ],
  },
  { kind: "subsectionHeader", title: "What I actually saw" },
  { kind: "imagePlaceholder", caption: "Quote wall screenshot" },
  {
    kind: "prose",
    paragraphs: [
      "I ran interviews with research operators across project setup, fieldwork, and delivery. Quotes clustered into five distinct failure modes.",
    ],
  },
  { kind: "quoteWall", items: gwiFailureModes },
  {
    kind: "prose",
    paragraphs: [
      "I paired these with a data stream map of the full project lifecycle, surfacing the business risks and inefficiencies that no individual operator could see because each one only lived inside their slice of the process. The same problem kept appearing under different names: the operator was the integration layer.",
    ],
  },

  // 03 · The value
  { kind: "sectionHeader", chapter: "03", title: "The value" },
  { kind: "subsectionHeader", title: "For the business" },
  {
    kind: "prose",
    paragraphs: [
      "The headline outcome is £750,000 a year reclaimed from the stack of third-party tools the platform replaces. The first surface alone ended GWI's reliance on Qualtrics, and the architecture is sequenced so every following surface chips further away at outside spend.",
    ],
  },
  { kind: "subsectionHeader", title: "For the researcher" },
  {
    kind: "prose",
    paragraphs: [
      "At the keyboard, the change is the one that's easiest to feel: one working surface instead of seven, 6x fewer clicks to reach an insight, and 40% more capacity to do the analysis they were actually hired to do.",
    ],
  },
  { kind: "imagePlaceholder", caption: "The value" },

  // 04 · The strategic move
  { kind: "sectionHeader", chapter: "04", title: "The strategic move" },
  {
    kind: "prose",
    paragraphs: [
      "If the operator is the integration layer, the platform isn't fixing anything by adding a better tool. It's fixing things by becoming the integration layer itself.",
      "That meant one canonical record underneath everything: every project, survey, wave, and fieldwork status lives in a single place that every other system reads from and writes to. Not a new tool in the stack. A replacement for the stack's seams.",
      "Three pillars sit on top of the shared state: a Project Hub that holds the world, a Drafting workflow that changes it, and Fieldwork that runs it. An agent layer sits across all three, not a fourth pillar, but the membrane that gives the platform continuous context from project creation to data delivery.",
    ],
  },
  {
    kind: "pillarScroll",
    eyebrow: "The architecture",
    pillars: gwiPillars,
    membrane: { label: "Agent layer · cross-cutting context" },
  },
  { kind: "subsectionHeader", title: "How I got there" },
  { kind: "imagePlaceholder", caption: "JTBD ecosystem mapping" },
  {
    kind: "prose",
    paragraphs: [
      "I mapped the operator journey across the six stages of a research project, then ran a JTBD synthesis to extract the jobs the platform needed to do, not the features it needed to have. The outputs clustered into the three pillars and the cross-cutting agent layer.",
      "One JTBD insight shaped the architecture more than any other: operators don't move through the workflow linearly. They jump into the process at different stages and rarely start at the beginning and end at the end in one session. That meant the platform had to design entry points for every single job, not a single happy path.",
      "I also chose to build on, not replace. GWI had existing platform foundations (NDP) doing useful work in survey generation and fieldwork monitoring. The new architecture extends them rather than starting from zero.",
    ],
  },

  // 05 · What I designed
  { kind: "sectionHeader", chapter: "05", title: "What I designed" },
  {
    kind: "prose",
    paragraphs: [
      "The interesting work wasn't deciding what the pillars were. It was deciding where the operator's attention should go inside each one.",
    ],
  },
  {
    kind: "decisionList",
    decisions: gwiDecisions,
    closer:
      "The common thread: every decision is about where to put the human's attention. The platform doesn't ask the operator to look at more, it asks them to look at less, more precisely.",
  },
  { kind: "subsectionHeader", title: "The agent as connective tissue" },
  { kind: "imagePlaceholder", caption: "Screen of agent surface" },
  {
    kind: "prose",
    paragraphs: [
      "The agent isn't a fourth pillar, it's the membrane. One agent with continuous context across the Hub, drafting, and fieldwork. It carries what it learned during drafting into fieldwork monitoring, and what it sees in fieldwork into the Hub's status model.",
      "Its authority is bounded by reversibility times confidence. Cheap and certain, it acts and notifies. Expensive or uncertain, it escalates. The user trusts the agent because its scope is visible, not assumed.",
    ],
  },
  { kind: "subsectionHeader", title: "Inside each pillar" },
  { kind: "imagePlaceholder", caption: "Project Hub" },
  {
    kind: "prose",
    paragraphs: [
      "The canonical state of every research project. Status, owners, waves, fieldwork health, and risks all live here and feed everything downstream. Replaces the spread of Confluence pages, Salesforce records, and ad-hoc spreadsheets the team used to reconcile by hand.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Drafting" },
  {
    kind: "prose",
    paragraphs: [
      "Survey authoring with the agent on the same canvas as the draft. Every change the agent makes is attributable line by line, and every suggestion shows the source it pulled from. Translation runs in-tool with human review only where judgement is needed.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Fieldwork" },
  {
    kind: "prose",
    paragraphs: [
      "In-field monitoring, quota management, and respondent delivery built for navigation rather than passive watching. The IA is search-first, with visualisations that act as wayfinding so an operator can move from alert to intervention in seconds.",
    ],
  },

  // 06 · A decision worth telling
  { kind: "sectionHeader", chapter: "06", title: "A decision worth telling" },
  {
    kind: "prose",
    paragraphs: [
      "Leadership initially wanted to extend the legacy tool. I argued the legacy tool was a symptom of the stack problem, not a foundation to build on.",
      "The evidence backed it up. The existing tool was a Frankenstein of features layered on year after year, most of them unmanaged, undocumented, and patched into corners of the code nobody on the current team had touched. That accumulation, on its own, was a significant reason the business needed this transformation: every new requirement had to fight the weight of the old one.",
      "I made the case with a working prototype rather than a deck. Using an AI sandbox, I built a rough version of the agent membrane operating across mock project, draft, and fieldwork states. The point wasn't the UI, it was getting leadership to submerge themselves in the flow and architecture before they could start picking at the surface. By the time the conversation came back to interface, the foundation question was already settled.",
    ],
  },
  { kind: "imagePlaceholder", caption: "Sandbox prototype" },

  // 07 · Where the work is
  { kind: "sectionHeader", chapter: "07", title: "Where the work is" },
  {
    kind: "prose",
    paragraphs: [
      "The thesis is the deliverable. The architecture is the bet. The build is sequenced, and it's underway.",
    ],
  },
  {
    kind: "statusList",
    items: [
      {
        state: "Live",
        title: "Respondent-facing survey question UI",
        description:
          "The surface that ends GWI's reliance on Qualtrics. The fastest path to cutting third-party spend, and the first proof that the platform can replace the stack one surface at a time.",
      },
      {
        state: "Designed",
        title: "Project Hub, Drafting workflow, Fieldwork architecture",
        description:
          "IA, key flows, and the design system foundations are in place. Engineering is building against them now.",
      },
      {
        state: "Bought-in",
        title: "The thesis as shared language",
        description:
          "I wrote the platform's value proposition document, the framing the business now uses to talk about itself, and it was adopted across leadership. The Director of Product accepted the concept; my architecture and site map confirmed the new-foundation proposal during the build-approach discussion. I'm now kick-starting the engineering process against the work.",
      },
    ],
  },

  // 08 · What I'd do differently
  { kind: "sectionHeader", chapter: "08", title: "What I'd do differently" },
  {
    kind: "prose",
    paragraphs: [
      "I'd have challenged the existing ways of working earlier. Some operators are so embedded in the current process they can't see a simpler one exists until you show them, and the longer the legacy ways are the baseline, the harder it is to argue for new foundations. The sandbox prototype eventually moved leadership; I should have built it sooner and shown it wider.",
    ],
  },
];

// ─── Projects ─────────────────────────────────────────────────────────
export const projects = [
  {
    slug: "gwi",
    name: "GWI",
    initial: "G",
    date: "2025-ongoing",
    role: "Senior Product Designer · Internal data system",
    tags: ["Agents", "Data", "Efficiency"],
    blurb:
      "GWI's internal data system. Redesigned to make the research process radically more efficient and save the business significant money, so researchers can do more with less.",
    badge: "New",
    metrics: [
      ["Saved per year", "£750,000", ""],
      ["Fewer clicks to insights", "6", "x"],
      ["Increase in researcher capacity", "40", "%"],
    ],
    narrative: gwiNarrative,
    sections: narrativeTOC(gwiNarrative),
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
    slug: "philpotpearce",
    name: "PhilpotPearce",
    initial: "P",
    date: "2024",
    role: "Brand identity & website · Independent consultancy",
    tags: ["Identity", "Web", "Brand"],
    blurb: "Visual identity and web presence for a creative consultancy — balancing editorial craft with a clear, confident voice.",
    badge: "Shipped",
    liveUrl: "#",
    metrics: [
      ["Lighthouse perf.", "98", "/100"],
      ["Pages shipped", "12", ""],
      ["CSS exceptions", "0", ""],
    ],
    narrative: philpotpearceNarrative,
    sections: narrativeTOC(philpotpearceNarrative),
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
