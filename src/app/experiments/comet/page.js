import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";
import Comet from "@/components/Comet/Comet";
import styles from "./page.module.css";

const exp = getExperiment("comet");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

/* Three demo hosts let the visitor see how the comet adapts to
   different aspect ratios and accent colours. Each host
   establishes its own containing block (position: relative) so
   the absolutely-positioned Comet sizes to the host's pixel
   bounds via ResizeObserver. */
const DEMOS = [
  {
    label: "Default",
    note: "var(--accent), 110 px/s",
    aspect: "16 / 9",
  },
  {
    label: "Square · faster",
    note: "180 px/s",
    aspect: "1 / 1",
    speed: 180,
  },
  {
    label: "Tall · slower, warmer",
    note: "60 px/s, ember",
    aspect: "3 / 4",
    speed: 60,
    color: "#d28a3a",
  },
];

export default function CometExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      <section className={styles.grid}>
        {DEMOS.map((d) => (
          <figure key={d.label} className={styles.cell}>
            <div
              className={styles.host}
              style={{ aspectRatio: d.aspect }}
            >
              <Comet
                {...(d.speed != null ? { speed: d.speed } : null)}
                {...(d.color ? { color: d.color } : null)}
              />
            </div>
            <figcaption className={styles.caption}>
              <span className={styles.captionLabel}>{d.label}</span>
              <span className={styles.captionNote}>{d.note}</span>
            </figcaption>
          </figure>
        ))}
      </section>
      <section className={styles.notes}>
        <h2 className={styles.notesTitle}>How it works</h2>
        <p>
          The comet is a stack of SVG &lt;rect&gt; strokes, each tracing
          the host&apos;s perimeter at the same speed but offset by a
          tiny fraction of the path. Opacity and stroke-width
          interpolate from the head down to the tail, so the eye reads
          the stack as one continuous tapering line rather than fifty
          discrete bars.
        </p>
        <p>
          Because every segment shares one duration and the strokes are
          rectangles (not paths with mitred corners), the perimeter
          speed stays constant — no slow-down at the corners and no
          visible stretching of the trail.
        </p>
      </section>
    </main>
  );
}
