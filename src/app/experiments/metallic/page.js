import MetallicCards from "@/components/MetallicCards/MetallicCards";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("metallic");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function MetallicCardsExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      <MetallicCards />
    </main>
  );
}
