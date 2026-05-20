import Link from "next/link";
import styles from "./page.module.css";

export const metadata = {
  title: "Experiments — Harry Spawforth",
  description: "A scratchpad of things I'm building and shipping on the side.",
};

/* The list of experiments. Add new entries here — each becomes a
   chamfered card linked to its own page. */
const EXPERIMENTS = [
  {
    href: "/experiments/metallic",
    tag: "Shader",
    title: "Metallic cards",
    meta: "React · Motion · WebGL",
    description:
      "A scroll-pinned 3D Coverflow where each card is a WebGL liquid-metal shader. Scrolling the page rotates the carousel and the active card's shader animates while it's in focus.",
  },
  {
    href: "/experiments/stack",
    tag: "Interface",
    title: "Stack carousel",
    meta: "React · Motion",
    description:
      "A Cover Flow / slide-projector style stack. Three cards visible at once, back two tilted on the Y axis and receding into the upper-left. Front card flips and dissolves toward the camera as the stack advances. Mirrored reflections and a liquid-glass CTA included.",
  },
  {
    href: "/experiments/booklog",
    tag: "Interface",
    title: "BookLog carousel",
    meta: "React · CSS modules",
    description:
      "A utility/HUD-style horizontal carousel for a fictional book magazine. Active card pulses; peeks desaturate. A major/minor scalebar acts as the index, and arrow keys + click peeks + prev/next buttons all rotate focus.",
  },
  {
    href: "/experiments/dial",
    tag: "Interface",
    title: "Portfolio dial",
    meta: "React · Motion",
    description:
      "A utility/HUD-style dial. Six projects orbit near 3 o'clock; the active heading expands inline with tags and CTAs. Arrow keys, click arrows, and touch swipe all rotate the dial.",
  },
  {
    href: "/experiments/sounds",
    tag: "Sound",
    title: "Computer-analog hover sounds",
    meta: "Web Audio · sandbox",
    description:
      "Six tactile hover sounds synthesised live in the browser — soft ticks, warm blips, a bell pluck, a modem chirp, a relay click, and a low saw tail. Built to audition before wiring into real hover surfaces.",
  },
];

export default function ExperimentsPage() {
  return (
    <main className="page">
      <article className="col case-study">
        <div className="case-study__eyebrow">Scratchpad</div>
        <h1 className="case-study__title">Experiments</h1>
        <p className="case-study__lede">
          A landing pad for the half-finished, the just-shipped, and the
          weird-on-purpose. More to come.
        </p>

        <ul className={styles.list}>
          {EXPERIMENTS.map((e) => (
            <li key={e.href}>
              <Link href={e.href} className={styles.entry}>
                <div className={styles.entryHead}>
                  <span className={styles.entryTag}>{e.tag}</span>
                  <h2 className={styles.entryTitle}>{e.title}</h2>
                  {e.meta && <span className={styles.entryMeta}>{e.meta}</span>}
                </div>
                <p className={styles.entryDesc}>{e.description}</p>
                <span className={styles.entryArrow}>
                  Open experiment
                  <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="3" y1="8" x2="13" y2="8" />
                    <polyline points="9 4 13 8 9 12" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </article>
    </main>
  );
}
