import Notebook from "@/components/Notebook/Notebook";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("notebook");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function NotebookExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      <Notebook />
    </main>
  );
}
