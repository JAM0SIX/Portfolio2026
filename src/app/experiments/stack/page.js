import StackCarousel from "@/components/StackCarousel/StackCarousel";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("stack");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function StackExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      <StackCarousel />
    </main>
  );
}
