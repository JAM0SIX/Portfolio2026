import Ripple from "@/components/Ripple/Ripple";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("ripple");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function RippleExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      {/* Fills the embed viewport (chrome is stripped via ?embed=1 in the
          experiment modal); click to ripple. */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <Ripple />
      </div>
    </main>
  );
}
