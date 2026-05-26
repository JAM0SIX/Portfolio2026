/* Single source of truth for the experiments index. Used by:
   - /experiments/page.js (the hub list)
   - each /experiments/<slug>/page.js (header copy)
   - Sidebar.js (doc-mode title + back link when on a /experiments/<slug> route) */

export const EXPERIMENTS = [
  {
    slug: "metallic",
    href: "/experiments/metallic",
    tag: "Shader",
    title: "Metallic cards",
    meta: "React · Motion · WebGL",
    description:
      "A scroll-pinned 3D Coverflow where each card is a WebGL liquid-metal shader. Scrolling rotates the carousel and the active card's shader animates while in focus.",
  },
  {
    slug: "stack",
    href: "/experiments/stack",
    tag: "Interface",
    title: "Stack carousel",
    meta: "React · Motion",
    description:
      "A Cover Flow / slide-projector style stack. Three cards visible, back two tilted on the Y axis and receding. Front card flips and dissolves toward the camera as the stack advances.",
  },
  {
    slug: "booklog",
    href: "/experiments/booklog",
    tag: "Interface",
    title: "BookLog carousel",
    meta: "React · CSS modules",
    description:
      "A utility/HUD-style horizontal carousel for a fictional book magazine. Active card pulses; peeks desaturate. A major/minor scalebar acts as the index.",
  },
  {
    slug: "notebook",
    href: "/experiments/notebook",
    tag: "Interface",
    title: "Notebook",
    meta: "React · CSS-in-JS",
    description:
      "A shelf of articles dressed as books. Category drives the colour; smart abbreviation drives the spine title; opening a book reveals a magazine-style two-column accordion below. Books fade in from line-drawings to colour as you visit them.",
  },
  {
    slug: "dial",
    href: "/experiments/dial",
    tag: "Interface",
    title: "Portfolio dial",
    meta: "React · Motion",
    description:
      "A utility/HUD dial. Six projects orbit near 3 o'clock; the active heading expands inline with tags and CTAs. Arrow keys, click arrows, and touch swipe all rotate the dial.",
  },
  {
    slug: "sounds",
    href: "/experiments/sounds",
    tag: "Sound",
    title: "Computer-analog hover sounds",
    meta: "Web Audio · sandbox",
    description:
      "Six tactile hover sounds synthesised live in the browser — soft ticks, warm blips, a bell pluck, a modem chirp, a relay click, and a low saw tail.",
  },
  {
    slug: "comet",
    href: "/experiments/comet",
    tag: "Motion",
    title: "Border comet",
    meta: "React · SVG",
    description:
      "A bright head with a tapered trail tracing the perimeter of a box at constant speed. Stacked SVG rect strokes, ResizeObserver-fit, no corner stretch. Originally lived on the side panel; lifted out so any container can host it.",
  },
];

export function getExperiment(slug) {
  return EXPERIMENTS.find((e) => e.slug === slug);
}
