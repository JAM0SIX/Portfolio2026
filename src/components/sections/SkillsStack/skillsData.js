/* Skills / Stack — bento grid content.
   ─────────────────────────────────────
   Four cards arranged as a pinwheel bento (1 + 2 / 2 + 1 on a 3-col
   grid). Each card has a 3D wireframe shape icon (shape-icons.js /
   ShapeCanvas), a status badge seated in the icon tile's slanted notch,
   a title, and a short description in a recessed paper bubble.

   Fields
     · title  — the capability name (card heading)
     · badge  — short label seated in the icon tile's TL notch
     · shape  — key from SHAPE_KEYS in shape-icons.js:
                cubes, bars, torus, octahedron, tetra, icosa, dodeca,
                sphere, helix, pyramid, knot, gem
     · wide   — true → 2-col tile with the icon beside the text;
                false → 1-col tile with the icon stacked above the text
     · blurb  — the card description

   Source order packs the pinwheel under grid-auto-flow: dense —
   compact, wide, wide, compact. */

export const BENTO = [
  {
    title: "Designing in Codebases",
    badge: "New",
    shape: "cubes",
    wide: false,
    blurb:
      "A unified workflow bridging the gap between design tokens and production code. This system embeds design systems directly into engineering pipelines, enabling designers to ship production-ready components with absolute visual fidelity and zero handoff loss.",
  },
  {
    title: "AI Product Frameworks",
    badge: "Framework",
    shape: "tetra",
    wide: true,
    blurb:
      "Structuring the cognitive architecture of agentic systems. This framework defines how multi-agent pipelines collaborate, manage state, and handle uncertainty, translating complex machine learning capabilities into predictable, high-value user experiences.",
  },
  {
    title: "Research & Measurement",
    badge: "Case Study",
    shape: "bars",
    wide: true,
    blurb:
      "GWI's internal data system. Redesigned to make the research process radically more efficient and save the business significant money.",
  },
  {
    title: "Designing AI Interfaces",
    badge: "System",
    shape: "torus",
    wide: false,
    blurb:
      "Crafting the next generation of human-machine collaboration. Moving beyond static layouts to dynamic, context-aware interfaces that adapt in real-time to user intent, system confidence, and multi-modal inputs.",
  },
];
