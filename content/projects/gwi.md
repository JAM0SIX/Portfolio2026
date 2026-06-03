---
# ────────────────────────────────────────────────────────────────────────
# Project metadata. Drives the home-page card, the sidebar entry, and the
# case-study page header. Strings can be quoted or use YAML block scalars
# (| keeps line breaks, > folds them into spaces).
# ────────────────────────────────────────────────────────────────────────
slug: gwi
name: GWI
initial: G
date: "2025-2026"
role: Senior Product Designer · Internal data system
tags: [Agents, Data, Efficiency]
blurb: >
  GWI's internal data system. Redesigned to make the research process
  radically more efficient and save the business significant money, so
  researchers can do more with less.
badge: New
metrics:
  - ["Saved per year", "£750,000", ""]
  - ["Fewer clicks to insights", "6", "x"]
  - ["Increase in researcher capacity", "40", "%"]

# ────────────────────────────────────────────────────────────────────────
# Narrative — the block-based case-study body. Each entry has a `kind`
# that maps to a component in the Narrative renderer.
#
# Supported kinds:
#   hook              - eyebrow + headline + scope (the opener)
#   lede              - larger emphasis prose between hook and hero
#   sectionHeader     - numbered chapter ("02 · The problem")
#   subsectionHeader  - quieter inline tier inside a section
#   prose             - paragraphs of body copy
#   quote             - pull-quote with source line
#   quoteWall         - two-column rows of {quote, label}
#   decisionList      - heading + named decisions (inline SidePanels)
#   pillarScroll      - 3 pillars + cross-cutting agent membrane
#   layers            - Problem / Value / Solution stack
#   orbit             - 3-5 satellites
#   statusList        - Live / Designed / Bought-in
#   outcomes          - metric callout cards
#   imagePlaceholder  - chamfered image slot
# ────────────────────────────────────────────────────────────────────────
narrative:

  # 01 · Hook
  - kind: hook
    headline: Agentic data system
    company:
      name: GWI
    clients:
      - name: Amazon
        logo: /projects/gwi/logos/amazon.png
      - name: Meta
        logo: /projects/gwi/logos/meta.png
      - name: FIFA
        logo: /projects/gwi/logos/fifa.png
      - name: Uber
        logo: /projects/gwi/logos/uber.png
      - name: TikTok
        logo: /projects/gwi/logos/tiktok.png
    scope:
      - >
        An agentic platform that takes the mundane work off
        researchers and gives them the leverage to increase output
        and efficiency.
      - >
        GWI's core product is selling data as insights with clients
        including Meta, Amazon, Omnicom and Chelsea FC. I owned the
        end to end product experience for GWI's internal data tools
        and systems. From research and synthesis to identifying the
        business risks and inefficiencies to designing the whole new
        internal product tool and finally managing the development
        of the tool itself.
  # Hero — full-width bleed device above the first body paragraph.
  # Shows the GWI homepage / agent-draw concept; sits inside the
  # MediaPlate at the project's standard hero height.
  - kind: imagePlaceholder
    caption: Hero image
    bleed: true
    # Fixed desktop hero height; below 721px the slot reverts to the
    # aspect-ratio below so the mobile hero scales with the viewport.
    height: 640
    # Device aspect matches the source PNG (3456 × 2234 ≈ 1.55)
    # so the image fills the frame exactly with no letterbox.
    aspect: 3456 / 2234
    image:
      src: /projects/gwi/landing-page.png
      alt: GWI landing page
    backdrop:
      # Static designed background for the hero plate ground —
      # shown crisp (it's the artwork, not ambience).
      src: /projects/gwi/plate-bg.png
      blur: false

  - kind: lede
    paragraphs:
      - >
        The goal: save the business £750,000 per year and open new
        revenue opportunities through innovation. Make the data
        process radically more efficient, collect larger quantities
        of data faster, and give researchers the capacity to do more
        with less.

  - kind: outcomes
    items:
      - ["Saved per year", "£750,000", ""]
      - ["Fewer clicks to insights", "6", "x"]
      - ["Increase in researcher capacity", "40", "%"]

  # 02 · The problem
  - kind: sectionHeader
    chapter: "02"
    title: The problem
  - kind: subsectionHeader
    title: "Problem 1 · current tool has become a Frankenstein"
  - kind: prose
    paragraphs:
      - >
        As GWI scaled, RMP grew features and tools the business
        demanded without enough thought for how they fit together.
        The result is a tool with no cohesion. Researchers carry
        the load of that incoherence, and it causes human error —
        a misplaced step in one feature breaks something three
        screens later, and the platform doesn't tell anyone.
      - >
        {{strong:The business risk}}: errors leak into the data
        GWI sells. Insight quality erodes silently, client trust
        takes the hit, and engineering capacity is spent patching
        legacy instead of building forward.
  - kind: subsectionHeader
    title: "Problem 2 · No communication between tools"
  - kind: prose
    paragraphs:
      - >
        The other six systems don't talk to each other and they
        don't talk to RMP. Data doesn't move downstream — researchers
        re-type context at every handover, institutional knowledge
        gets blocked between stages, and the failure modes hide in
        the gaps.
      - >
        {{strong:The business risk}}: dropped context shapes the
        deliverable before anyone catches it. Bad data lands with
        the client, and what should be insight becomes liability.
  - kind: quote
    body: >
      There's so many platforms and so many steps and so many different
      things to remember… the fact that everything lives in a different
      place is really frustrating.
    source: Research operator, GWI
  - kind: quoteWall
    items:
      - quote: Everything lives in a different place
        label: "Seams: context lives between tools, not in them"
      - quote: Everything is manual right now… there is no automation at all
        label: "Labour: humans doing what systems should"
      - quote: >
          Tonnage can be finicky… an extra space and it fails… error
          messages aren't very helpful
        label: "Brittleness: high-cost failures from low-stakes inputs"
      - quote: >
          Quotas are not connected to each other… one could block the
          whole fieldwork without noticing
        label: "Silent failure: no shared state, no shared awareness"
      - quote: >
          No clean way to have a contract addendum… it's a hacky system…
          makes the audit significantly harder
        label: "Business risk: workarounds compound into audit liability"

  # 03 · Philosophy
  - kind: sectionHeader
    chapter: "03"
    title: Philosophy
  - kind: prose
    paragraphs:
      - >
        Three pillars sit on top of the shared state: a Project Hub
        that holds the world, a Drafting workflow that changes it, and
        Fieldwork that runs it. An agent layer sits across all three,
        not a fourth pillar, but the membrane that gives the platform
        continuous context from project creation to data delivery.
  - kind: philosophyLayers
    pillars:
      - title: Project Hub
        body: >
          Holds the world. Every project, survey, wave, and fieldwork
          state lives in one canonical place. The other tools read
          from it and write back into it.
        deepBody:
          - >
            The Hub is the canonical source of truth that the rest of
            the stack reads from and writes to. Every project,
            survey, wave, and fieldwork status lives here, replacing
            the spread of Confluence pages, Salesforce records, and
            ad-hoc spreadsheets the team used to reconcile by hand.
          - >
            The homepage opens into a ranked list of activities — only
            the signals that need a human decision today. If it isn't
            on this screen, it doesn't need you. The promise: the Hub
            holds the world so researchers don't have to.
      - title: Drafting workflow
        body: >
          Changes the world. Where surveys are authored, translated,
          and approved. The agent sits on the same canvas as the
          draft so authorship and AI suggestions stay legible.
        deepBody:
          - >
            Drafting is grounded by RAG against GWI's own question
            library and translation corpus, so consistency is
            enforced across both questions and the languages each
            survey ships in. Synthetic data layers on top as a
            stress test: the platform runs drafts against simulated
            respondents to find coverage gaps before fieldwork.
          - >
            Translation runs in-tool with an automated first pass
            and human review focused only on the questions that
            need judgement — replacing the third-party translation
            agencies that previously ran every project.
      - title: Fieldwork
        body: >
          Runs the world. In-field monitoring, quota management, and
          respondent-facing delivery. Built for navigation and
          intervention, not passive dashboards.
        deepBody:
          - >
            Fieldwork is where the work runs and the survey reaches
            respondents. The IA is search-first; visualisations act
            as wayfinding rather than reporting. An operator should
            be able to move from alert to intervention in seconds.
            The agent does the watching; the operator does the moving.
          - >
            Includes quota management, in-field monitoring, and the
            respondent-facing survey delivery that ends GWI's
            reliance on Qualtrics.
    membrane:
      title: Agent membrane
      body: >
        Across all three. One agent with continuous context that
        carries learning between the Hub, drafting, and fieldwork —
        not a fourth pillar but the layer that connects them.
      deepBody:
        - >
          The membrane isn't a fourth pillar. It's one agent with
          continuous context that flows between the Hub, Drafting,
          and Fieldwork — carrying what it learned during drafting
          into fieldwork monitoring, and what it sees in fieldwork
          back into the Hub's status model.
        - >
          Authority is bounded by reversibility × confidence. Cheap
          and certain, it acts and notifies. Expensive or uncertain,
          it escalates. The user trusts the agent because its scope
          is visible, not assumed.
        - >
          Its job is to surface critical information the moment it
          matters, support the operator's decisions, and carry out
          the mundane work — chasing approvals, reformatting
          exports, queuing reminders.

  # 04 · The experience I built
  - kind: sectionHeader
    chapter: "04"
    title: The experience I built
    subtitle: >
      Independent design work — research, design decisions, and UI
      are all my own contribution.
  - kind: prose
    paragraphs:
      - >
        Five questions shaped where the researcher's attention
        should go inside the platform. Each one led to a different
        surface.

  - kind: subsectionHeader
    title: "How do researchers want to identify issues and act on them?"
  - kind: prose
    paragraphs:
      - >
        By opening into a ranked list of activities — only the
        signals that need a human decision today. Critical
        information surfaces at the top of the homepage and each
        item is one click from resolution; if it isn't on this
        screen, it doesn't need them.
  - kind: outcomeNote
    text: >
      Researchers open their day knowing exactly where their
      attention is needed — and can act on it without leaving the
      homepage.
  # Q1 loop — fixed 1280×800 desktop prototype, native-sized and
  # CSS-scaled to fit. Capped at the 600px reading measure; mounts
  # only once it scrolls into view (IntersectionObserver in
  # PrototypeEmbed), so the four loops don't all boot at once.
  - kind: prototypeEmbed
    src: /prototypes/gwi-prototype/index.html?flow=q1
    aspect: 1280 / 800
    nativeWidth: 1280
    nativeHeight: 800
    maxWidth: 600px
    caption: "Q1 · Identify & act on issues"

  - kind: subsectionHeader
    title: "What is an agentic architecture that fits user needs?"
  - kind: prose
    paragraphs:
      - >
        The agent handles the mundane: chasing approvals,
        formatting exports, surfacing alerts. The researcher
        holds the judgement calls — the decisions that shape
        the data and the recommendation. Agent authority is
        bounded by reversibility × confidence: cheap and
        certain, it acts; expensive or uncertain, it escalates.
  - kind: outcomeNote
    text: >
      The line of responsibility is clear — the agent does the
      work, the researcher owns the decisions.
  - kind: subsectionHeader
    title: "How data flows through the system"
  # Live data-pipeline diagram — vertical, self-contained SVG widget.
  # Auto-heights via its channel; fills the reading column up to a
  # 600px max width.
  - kind: htmlEmbed
    src: /prototypes/gwi-data-pipeline/data-pipeline-flow.html
    title: Data pipeline — agent and MCPs
    channel: gwi-data-pipeline:height
    aspect: 560 / 1040
    maxWidth: 600px
    caption: >-
      How project data flows through the system — sources feed the RAG
      store and the agent in parallel, and the agent dispatches automation
      tasks built on that context.
  - kind: subsectionHeader
    title: "Designing agentic data flow"
  # Live architecture diagram — a self-contained, responsive SVG widget
  # embedded via iframe. Auto-heights via its channel; the 720×820 canvas
  # plus wrap padding renders ~690px tall in the reading column.
  - kind: htmlEmbed
    src: /prototypes/gwi-agent-flow/agent-architecture-flow.html
    title: Agent architecture flow
    channel: gwi-agent-flow:height
    aspect: 1 / 1.05
    caption: >-
      An interactive view of the agent's runtime loop — automated flows in
      green, user-driven flows in black, MCP tool channels in amber.

  - kind: subsectionHeader
    title: "How do operators move from alert to action?"
  - kind: prose
    paragraphs:
      - >
        Fieldwork is built for navigation, not monitoring.
        Search-first IA, with visualisations that act as
        wayfinding rather than reporting. The agent does the
        watching; the operator does the moving.
  - kind: outcomeNote
    text: >
      Operators intervene in seconds rather than discovering
      problems hours after they've started costing money.
  # Q3 loop — same bundle, ?flow=q3.
  - kind: prototypeEmbed
    src: /prototypes/gwi-prototype/index.html?flow=q3
    aspect: 1280 / 800
    nativeWidth: 1280
    nativeHeight: 800
    maxWidth: 600px
    caption: "Q3 · Alert to action"

  - kind: subsectionHeader
    title: "How do researchers want to handle surveys?"
  - kind: prose
    paragraphs:
      - >
        With every draft grounded in GWI's own question library
        (RAG) so consistency is enforced across questions and
        languages, and stress-tested against simulated
        respondents (synthetic data) to catch coverage gaps
        before fieldwork.
  - kind: outcomeNote
    text: >
      Drafts catch their own gaps before fieldwork starts —
      fewer late-stage rewrites, less stress at the deadline.
  # Q5 loop — trimmed loop.html shell, ?flow=q5.
  - kind: prototypeEmbed
    src: /prototypes/gwi-prototype/loop.html?flow=q5
    aspect: 1280 / 800
    nativeWidth: 1280
    nativeHeight: 800
    maxWidth: 600px
    caption: "Q5 · Create & draft a survey"

  - kind: subsectionHeader
    title: "How can we save the business money?"
  - kind: prose
    paragraphs:
      - >
        By bringing the work GWI currently pays third parties
        for back in-house. Translation is the clearest example:
        an automated first pass handles the bulk, with human
        review focused only on the questions that need judgement.
        Every surface in the platform is sequenced to replace
        another piece of outside spend.
  - kind: outcomeNote
    text: >
      Translation moves from a multi-day third-party bottleneck
      to a routine step inside the draft — and the same pattern
      repeats across the stack.
  # Q4 loop — trimmed loop.html shell, ?flow=q4.
  - kind: prototypeEmbed
    src: /prototypes/gwi-prototype/loop.html?flow=q4
    aspect: 1280 / 800
    nativeWidth: 1280
    nativeHeight: 800
    maxWidth: 600px
    caption: "Q4 · Coverage & translations"

  # 05 · What I'd do differently
  - kind: sectionHeader
    chapter: "05"
    title: What I'd do differently
  - kind: prose
    paragraphs:
      - >
        I'd have challenged the existing ways of working earlier. Some
        operators are so embedded in the current process they can't see
        a simpler one exists until you show them, and the longer the
        legacy ways are the baseline, the harder it is to argue for new
        foundations. The sandbox prototype eventually moved leadership;
        I should have built it sooner and shown it wider.
---
