---
# ────────────────────────────────────────────────────────────────────────
# Project metadata. Drives the home-page card, the sidebar entry, and the
# case-study page header. Strings can be quoted or use YAML block scalars
# (| keeps line breaks, > folds them into spaces).
# ────────────────────────────────────────────────────────────────────────
slug: gwi
name: GWI
initial: G
date: 2025-ongoing
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
    scope: >
      I owned the end-to-end design of GWI's internal data system, from
      interviews and synthesis through strategy, architecture, and
      engineering handoff. The system runs the research and data
      pipeline that produces the insights GWI sells to clients like
      FIFA, Meta, Amazon, and Omnicom.

  - kind: lede
    paragraphs:
      - >
        The goal was to make the data process radically more efficient
        and save the business significant money: collect larger
        quantities of data, faster and at lower cost, giving
        researchers the ability to do more with less.

  - kind: imagePlaceholder
    caption: Hero image

  - kind: outcomes
    items:
      - ["Saved per year", "£750,000", ""]
      - ["Fewer clicks to insights", "6", "x"]
      - ["Increase in researcher capacity", "40", "%"]

  # 02 · The problem
  - kind: sectionHeader
    chapter: "02"
    title: The problem
  - kind: prose
    paragraphs:
      - >
        Research operators at GWI worked across seven systems to run a
        single project: Qualtrics, Jira, Confluence, Slack, spreadsheets,
        Salesforce, and an internal data tool. Each tool worked. The
        connective tissue between them didn't.
      - >
        The cost wasn't any single tool. It was the re-typing of context
        at every handover, institutional knowledge being blocked from
        moving downstream, and the silent failure modes hiding between
        systems that nobody owned.
  - kind: quote
    body: >
      There's so many platforms and so many steps and so many different
      things to remember… the fact that everything lives in a different
      place is really frustrating.
    source: Research operator, GWI
  - kind: prose
    paragraphs:
      - >
        The question I carried out of every interview was the same: how
        do we do more with less?
  - kind: subsectionHeader
    title: What I actually saw
  - kind: imagePlaceholder
    caption: Quote wall screenshot
  - kind: prose
    paragraphs:
      - >
        I ran interviews with research operators across project setup,
        fieldwork, and delivery. Quotes clustered into five distinct
        failure modes.
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
  - kind: prose
    paragraphs:
      - >
        I paired these with a data stream map of the full project
        lifecycle, surfacing the business risks and inefficiencies that
        no individual operator could see because each one only lived
        inside their slice of the process. The same problem kept
        appearing under different names: the operator was the
        integration layer.

  # 03 · The value
  - kind: sectionHeader
    chapter: "03"
    title: The value
  - kind: subsectionHeader
    title: For the business
  - kind: prose
    paragraphs:
      - >
        The headline outcome is £750,000 a year reclaimed from the stack
        of third-party tools the platform replaces. The first surface
        alone ended GWI's reliance on Qualtrics, and the architecture
        is sequenced so every following surface chips further away at
        outside spend.
  - kind: subsectionHeader
    title: For the researcher
  - kind: prose
    paragraphs:
      - >
        At the keyboard, the change is the one that's easiest to feel:
        one working surface instead of seven, 6x fewer clicks to reach
        an insight, and 40% more capacity to do the analysis they were
        actually hired to do.
  - kind: imagePlaceholder
    caption: The value

  # 04 · The strategic move
  - kind: sectionHeader
    chapter: "04"
    title: The strategic move
  - kind: prose
    paragraphs:
      - >
        If the operator is the integration layer, the platform isn't
        fixing anything by adding a better tool. It's fixing things by
        becoming the integration layer itself.
      - >
        That meant one canonical record underneath everything: every
        project, survey, wave, and fieldwork status lives in a single
        place that every other system reads from and writes to. Not a
        new tool in the stack. A replacement for the stack's seams.
      - >
        Three pillars sit on top of the shared state: a Project Hub
        that holds the world, a Drafting workflow that changes it, and
        Fieldwork that runs it. An agent layer sits across all three,
        not a fourth pillar, but the membrane that gives the platform
        continuous context from project creation to data delivery.
  - kind: pillarScroll
    eyebrow: The architecture
    pillars:
      - title: Project Hub
        body: >
          Holds the world: every project, survey, wave, and fieldwork
          state in one canonical place. Replaces the spread of
          Confluence pages, spreadsheets, and Salesforce records that
          operators currently re-type into each other.
      - title: Drafting workflow
        body: >
          Changes the world: where surveys are authored, translated,
          and approved. The agent sits on the same canvas as the draft
          so authorship and AI suggestions stay legible.
      - title: Fieldwork
        body: >
          Runs the world: in-field monitoring, quota management, and
          respondent-facing survey delivery. Built for navigation and
          intervention, not passive dashboards.
    membrane:
      label: Agent layer · cross-cutting context
  - kind: subsectionHeader
    title: How I got there
  - kind: imagePlaceholder
    caption: JTBD ecosystem mapping
  - kind: prose
    paragraphs:
      - >
        I mapped the operator journey across the six stages of a
        research project, then ran a JTBD synthesis to extract the
        jobs the platform needed to do, not the features it needed to
        have. The outputs clustered into the three pillars and the
        cross-cutting agent layer.
      - >
        One JTBD insight shaped the architecture more than any other:
        operators don't move through the workflow linearly. They jump
        into the process at different stages and rarely start at the
        beginning and end at the end in one session. That meant the
        platform had to design entry points for every single job, not
        a single happy path.
      - >
        I also chose to build on, not replace. GWI had existing
        platform foundations (NDP) doing useful work in survey
        generation and fieldwork monitoring. The new architecture
        extends them rather than starting from zero.

  # 05 · What I designed
  - kind: sectionHeader
    chapter: "05"
    title: What I designed
  - kind: prose
    paragraphs:
      - >
        The interesting work wasn't deciding what the pillars were. It
        was deciding where the operator's attention should go inside
        each one.
  - kind: decisionList
    decisions:
      - name: Homepage as orientation, not dashboard
        summary: Critical information, organised signals, ranked order of activities.
        image:
          caption: Homepage as orientation
        body:
          - >
            Most operator tools open into a wall of charts. I designed
            the homepage to surface only critical information, the
            signals that need a human decision today.
          - >
            Multiple signals from across the pillars are organised into
            one ranked order of activities, so the operator opens the
            day with a single ordered list of where their attention
            should go. The promise: if it isn't on this screen, it
            doesn't need you.
      - name: Drafting backed by RAG and synthetic data
        summary: RAG for question and translation consistency, synthetic data for survey coverage.
        image:
          caption: Drafting with RAG + synthetic data
        body:
          - >
            A RAG system grounds every drafting suggestion in GWI's
            own question library and translation corpus, so consistency
            is enforced across questions and across the languages each
            survey ships in.
          - >
            Synthetic data acts as a stress test on top: the platform
            runs the draft against simulated respondents to identify
            gaps in question coverage, optimise the spread, and surface
            where the survey will fail before it goes out.
      - name: Agent that surfaces, supports, and acts
        summary: Surfaces critical information, keeps the user in control, carries out the mundane.
        image:
          caption: Agent surface
        body:
          - >
            The agent surfaces critical information the moment it
            matters: a stalled quota, an unanswered approval, an error
            that needs eyes. The operator keeps control of every
            decision.
          - >
            It also recommends and carries out the mundane work on the
            user's behalf: chasing approvals, reformatting exports,
            queuing reminders. Trust comes from the agent's scope being
            visible, not assumed.
      - name: Translation kept inside the tool
        summary: Automated first pass, human review focused only on questions that need judgement.
        image:
          caption: In-tool translation flow
        body:
          - >
            Survey translation was going to third parties at significant
            per-project cost and turnaround time. I designed an in-tool
            translation flow with an automated first pass and human
            review focused only on the questions that needed judgement.
      - name: Fieldwork architecture for navigation, not monitoring
        summary: Wayfinding over reporting, the agent watches, the operator moves.
        image:
          caption: Fieldwork wayfinding
        body:
          - >
            The fieldwork surface isn't a dashboard. Operators don't
            need to watch, they need to get to the right project fast.
          - >
            I designed the IA around search, filtering, and data
            visualisations that act as wayfinding rather than reporting.
            The agent does the watching; the operator does the moving.
    closer: >
      The common thread: every decision is about where to put the
      human's attention. The platform doesn't ask the operator to look
      at more, it asks them to look at less, more precisely.
  - kind: subsectionHeader
    title: The agent as connective tissue
  - kind: imagePlaceholder
    caption: Screen of agent surface
  - kind: prose
    paragraphs:
      - >
        The agent isn't a fourth pillar, it's the membrane. One agent
        with continuous context across the Hub, drafting, and fieldwork.
        It carries what it learned during drafting into fieldwork
        monitoring, and what it sees in fieldwork into the Hub's status
        model.
      - >
        Its authority is bounded by reversibility times confidence.
        Cheap and certain, it acts and notifies. Expensive or uncertain,
        it escalates. The user trusts the agent because its scope is
        visible, not assumed.
  - kind: subsectionHeader
    title: Inside each pillar
  - kind: imagePlaceholder
    caption: Project Hub
  - kind: prose
    paragraphs:
      - >
        The canonical state of every research project. Status, owners,
        waves, fieldwork health, and risks all live here and feed
        everything downstream. Replaces the spread of Confluence pages,
        Salesforce records, and ad-hoc spreadsheets the team used to
        reconcile by hand.
  - kind: imagePlaceholder
    caption: Drafting
  - kind: prose
    paragraphs:
      - >
        Survey authoring with the agent on the same canvas as the
        draft. Every change the agent makes is attributable line by
        line, and every suggestion shows the source it pulled from.
        Translation runs in-tool with human review only where judgement
        is needed.
  - kind: imagePlaceholder
    caption: Fieldwork
  - kind: prose
    paragraphs:
      - >
        In-field monitoring, quota management, and respondent delivery
        built for navigation rather than passive watching. The IA is
        search-first, with visualisations that act as wayfinding so an
        operator can move from alert to intervention in seconds.

  # 06 · A decision worth telling
  - kind: sectionHeader
    chapter: "06"
    title: A decision worth telling
  - kind: prose
    paragraphs:
      - >
        Leadership initially wanted to extend the legacy tool. I argued
        the legacy tool was a symptom of the stack problem, not a
        foundation to build on.
      - >
        The evidence backed it up. The existing tool was a Frankenstein
        of features layered on year after year, most of them unmanaged,
        undocumented, and patched into corners of the code nobody on
        the current team had touched. That accumulation, on its own,
        was a significant reason the business needed this
        transformation: every new requirement had to fight the weight
        of the old one.
      - >
        I made the case with a working prototype rather than a deck.
        Using an AI sandbox, I built a rough version of the agent
        membrane operating across mock project, draft, and fieldwork
        states. The point wasn't the UI, it was getting leadership to
        submerge themselves in the flow and architecture before they
        could start picking at the surface. By the time the
        conversation came back to interface, the foundation question
        was already settled.
  - kind: imagePlaceholder
    caption: Sandbox prototype

  # 07 · Where the work is
  - kind: sectionHeader
    chapter: "07"
    title: Where the work is
  - kind: prose
    paragraphs:
      - >
        The thesis is the deliverable. The architecture is the bet.
        The build is sequenced, and it's underway.
  - kind: statusList
    items:
      - state: Live
        title: Respondent-facing survey question UI
        description: >
          The surface that ends GWI's reliance on Qualtrics. The fastest
          path to cutting third-party spend, and the first proof that
          the platform can replace the stack one surface at a time.
      - state: Designed
        title: Project Hub, Drafting workflow, Fieldwork architecture
        description: >
          IA, key flows, and the design system foundations are in
          place. Engineering is building against them now.
      - state: Bought-in
        title: The thesis as shared language
        description: >
          I wrote the platform's value proposition document, the
          framing the business now uses to talk about itself, and it
          was adopted across leadership. The Director of Product
          accepted the concept; my architecture and site map confirmed
          the new-foundation proposal during the build-approach
          discussion. I'm now kick-starting the engineering process
          against the work.

  # 08 · What I'd do differently
  - kind: sectionHeader
    chapter: "08"
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
