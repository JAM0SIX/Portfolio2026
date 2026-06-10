---
slug: philpotpearce
name: PhilpotPearce
initial: P
date: "2026"
role: "Brand identity & website"
tags:
  - Brand
  - UI
blurb: >
  Visual identity and web presence for a creative consultancy, balancing
  editorial craft with a clear, confident voice.
badge: Shipped
liveUrl: "https://philpottpearce.com"
narrative:
  # 01 · Hook
  - kind: hook
    headline: A studio that speaks for itself
    company:
      name: PhilpotPearce
    clients:
      - name: PhilpotPearce
        logo: /projects/philpotpearce/logos/philpotpearce.png
    scope: >
      I designed in collaboration with the founders, guiding them through
      how users will flow through their space, how visual hierarchy can
      effectively communicate their message and of course the web design
      and build.
  # Hero, looping silent capture of the live philpottpearce.com
  # site. Sits directly under the first body paragraph (the hook's
  # scope) so it reads as the visual answer to the question the
  # scope poses. Poster is the first frame, also used as the
  # reduced-motion fallback.
  - kind: video
    src: /projects/philpotpearce/hero.mov
    poster: /projects/philpotpearce/hero-poster.png
    bleed: true
    # 10px shorter than the 650px bleed default, only the device
    # changes; the plate keeps its sidebar-matched height.
    height: 640
    backdrop:
      src: /projects/philpotpearce/plate-bg.png

  # 02 · The problem
  - kind: sectionHeader
    chapter: "02"
    title: The problem
  - kind: prose
    paragraphs:
      - >
        The founders had recently started their own studio. They didn't
        know how to successfully pull off a build that could match their
        identity. They needed a way to stand out from all the noise.
  # 03 · What I designed
  - kind: sectionHeader
    chapter: "03"
    title: What I designed
  - kind: prose
    paragraphs:
      - >
        Four design moves did the heavy lifting. Each is the moment
        the principles met a real decision on the page.
  - kind: decisionList
    decisions:
      - name: Restraint as the brand
        summary: The visual system as a statement of values, not decoration.
        images:
          - src: /projects/philpotpearce/restraint-1.png
            wide: true
            # Aspect tuned so the wide cell lands ~30px taller than
            # the default 16:9 at reading-column width (576/354).
            aspect: 576 / 354
            alt: Restraint in the brand system, overview frame
          - src: /projects/philpotpearce/restraint-2.png
            square: true
            alt: Restraint in the brand system, square detail
          - src: /projects/philpotpearce/restraint-3.png
            square: true
            alt: Restraint in the brand system, second square detail
        body:
          - >
            Most agencies dress up their identities. PhilpotPearce strips
            back. Every visual decision, every word on the site, every
            component had to earn its place.
          - >
            The studio's value proposition is in what they don't do as
            much as what they do. The brand reads as a piece of evidence
            for that, not a slogan about it.
      - name: Navigation as thesis statement
        summary: The golden circle as information architecture.
        image:
          src: /projects/philpotpearce/navigation.gif
          caption: IA as thesis
          alt: Navigation menu following the golden circle structure
        body:
          - >
            Most agency sites lead with a service checklist. We led with
            worldview. The IA borrows from the golden circle (Why, How,
            What) so the navigation itself communicates how the studio
            thinks.
          - >
            By the time the visitor reaches the work, they've already
            absorbed the studio's philosophy. The work doesn't have to
            justify itself, it just has to land.
      - name: Editorial typography
        summary: A single rhythm from hero to component states.
        images:
          - src: /projects/philpotpearce/editorial-1.png
            wide: true
            # ~20px taller than the wide default at reading-column
            # width (576/344 vs 576/324 for the stock 16:9).
            aspect: 576 / 344
            alt: Editorial typography running through the whole site
          - src: /projects/philpotpearce/editorial-4.png
            wide: true
            # Pin the crop to the left edge, the meaningful detail
            # in this image sits on the left, and the default
            # centre-anchored object-fit was hiding it.
            position: left center
            alt: Editorial typography, second detail
          - src: /projects/philpotpearce/editorial-6.png
            wide: true
            # Anchor the crop to the left so the meaningful detail
            # stays visible (same fix as editorial-4).
            position: left center
            alt: Editorial typography, third detail
        body:
          - >
            One typographic system runs from hero through navigation
            through body copy through component states. There are no
            exceptions and no overrides. That consistency does most of
            the work that decoration usually has to.
          - >
            The system was designed so new pages ship without new CSS
            exceptions, which keeps the studio's site as disciplined as
            its work.
      - name: Work as the hero
        summary: Project pages built to showcase, not narrate.
        images:
          - src: /projects/philpotpearce/work-as-hero.gif
            wide: true
            # ~20px taller than the wide default (576/344 vs 576/324).
            aspect: 576 / 344
            alt: Project pages designed to put the work first
          - src: /projects/philpotpearce/work-as-hero-1.png
            wide: true
            alt: Project page detail
        body:
          - >
            Project pages are designed as exhibitions. Large imagery,
            sparing captions, no marketing scaffolding around the work.
            The visitor's job is to look; the studio's job is to give
            them something worth looking at.
          - >
            This is the moment where the brand has to disappear and the
            work has to carry the weight.
---

# PhilpotPearce

Brand identity and web presence for an independent product design consultancy.
The narrative for this page is built from the structured `narrative` array in
the frontmatter above.
