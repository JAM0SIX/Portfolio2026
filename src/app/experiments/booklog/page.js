import BookLogExperiment from "@/components/BookLogExperiment/BookLogExperiment";
import { getExperiment } from "@/lib/experiments";

const exp = getExperiment("booklog");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function BookLogExperimentPage() {
  return (
    <main className="page">
      <header className="experiment-header">
        <div className="case-study__eyebrow">{exp.tag}</div>
        <h1 className="case-study__title">{exp.title}</h1>
        <p className="case-study__lede">{exp.description}</p>
      </header>
      <BookLogExperiment />
    </main>
  );
}
