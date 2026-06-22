/* Single source of truth for the experiments index. Used by:
   - /experiments/page.js (the hub list)
   - each /experiments/<slug>/page.js (header copy)
   - Sidebar.js (doc-mode title + back link when on a /experiments/<slug> route) */

export const EXPERIMENTS = [
  {
    slug: "stack",
    href: "/experiments/stack",
    image: "/experiments/ring/stack.png",
    imageDark: "/experiments/ring/stack-dark.png",
    tag: "Interface",
    title: "Stack carousel",
    meta: "React · Motion",
    note: "I wanted to design my own take on Apple's old gallery UI style. It's a lovely, smooth way of transitioning through multiple images.",
    description:
      "A Cover Flow / slide-projector style stack. Three cards visible, back two tilted on the Y axis and receding. Front card flips and dissolves toward the camera as the stack advances.",
  },
  {
    slug: "booklog",
    href: "/experiments/booklog",
    image: "/experiments/ring/booklog.png",
    imageDark: "/experiments/ring/booklog-dark.png",
    tag: "Interface",
    title: "Notebook",
    meta: "React · CSS modules",
    note: "Just a fun exploration of flicking through notes.",
    description:
      "A utility/HUD-style horizontal carousel for a fictional book magazine. Active card pulses; peeks desaturate. A major/minor scalebar acts as the index.",
  },
  {
    slug: "notebook",
    href: "/experiments/notebook",
    image: "/experiments/ring/notebook.png",
    imageDark: "/experiments/ring/notebook-dark.png",
    tag: "Interface",
    title: "Bookshelf",
    meta: "React · CSS-in-JS",
    description:
      "A shelf of articles dressed as books. Category drives the colour; smart abbreviation drives the spine title; opening a book reveals a magazine-style two-column accordion below. Books fade in from line-drawings to colour as you visit them.",
  },
  {
    slug: "dial",
    href: "/experiments/dial",
    image: "/experiments/ring/dial.png",
    imageDark: "/experiments/ring/dial-dark.png",
    tag: "Interface",
    title: "Dial",
    meta: "React · Motion",
    note: "I love Xbox's old menu screen — it's a bit of a classic, and if you haven't seen it I'd highly suggest you take a look. I've leaned into the dial style as it matches the user's mental model of turning a dial to highlight a new item.",
    description:
      "A utility/HUD dial. Six tools orbit near 3 o'clock; the active heading expands inline with tags and CTAs. Arrow keys, click arrows, and touch swipe all rotate the dial.",
  },
  {
    slug: "ripple",
    href: "/experiments/ripple",
    image: "/experiments/ripple.svg",
    tag: "Motion",
    title: "Ripple effect",
    meta: "Canvas · RAF",
    note: "I'm a fan of textures, and even though this was relatively simple, I find it aesthetically pleasing to watch.",
    description:
      "A grid of accent dots that ripple outward in soft Gaussian wavefronts. Click anywhere to send a pulse from that point; ambient pulses fire on their own. Lifted out of the first-visit loading sequence.",
  },
  {
    slug: "filmreel",
    href: "/experiments/filmreel",
    image: "/experiments/ring/filmreel.png",
    imageDark: "/experiments/ring/filmreel-dark.png",
    tag: "WebGL",
    title: "Film reel",
    meta: "Three.js · GLSL",
    note: "I've recently been getting into experimenting with WebGL, and in this case I wanted to explore what it's like to wind a film reel.",
    description:
      "One continuous photo strip bent across its own surface — flat in the middle, receding left, ballooning toward the viewer on the right. Scroll inside the box to feed the reel through the bend.",
  },
];

export function getExperiment(slug) {
  return EXPERIMENTS.find((e) => e.slug === slug);
}
