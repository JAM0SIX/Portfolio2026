import BookLogExperiment from "@/components/BookLogExperiment/BookLogExperiment";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("booklog");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function BookLogExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      <BookLogExperiment />
    </main>
  );
}
