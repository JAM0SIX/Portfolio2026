import Notebook from "@/components/Notebook/Notebook";
import { getExperiment } from "@/lib/experiments";

const exp = getExperiment("notebook");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function NotebookExperimentPage() {
  return (
    <main className="page">
      <header className="experiment-header">
        <div className="case-study__eyebrow">{exp.tag}</div>
        <h1 className="case-study__title">{exp.title}</h1>
        <p className="case-study__lede">{exp.description}</p>
      </header>
      <Notebook />
    </main>
  );
}
