import { EXPERIMENTS } from "@/lib/experiments";
import ExperimentsList from "./ExperimentsList";

export const metadata = {
  title: "Experiments — Harry Spawforth",
  description: "A scratchpad of things I'm building and shipping on the side.",
};

/* Page-specific ordering: BookLog + Notebook sit at the bottom of the list
   here. The shared EXPERIMENTS order (used by the landing carousel) is left
   untouched. */
const BOTTOM = ["booklog", "notebook"];
const ORDERED_EXPERIMENTS = [
  ...EXPERIMENTS.filter((e) => !BOTTOM.includes(e.slug)),
  ...EXPERIMENTS.filter((e) => BOTTOM.includes(e.slug)),
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

        <ExperimentsList experiments={ORDERED_EXPERIMENTS} />
      </article>
    </main>
  );
}
