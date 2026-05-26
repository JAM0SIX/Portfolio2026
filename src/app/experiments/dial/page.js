import PortfolioDial from "@/components/PortfolioDial/PortfolioDial";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("dial");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function DialExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      {/* The dial measures its own container width and sizes itself
          to fit, so wrapping it constrains the whole composition
          inside a column rather than spanning the viewport. */}
      <div
        style={{
          maxWidth: 1080,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <PortfolioDial />
      </div>
    </main>
  );
}
