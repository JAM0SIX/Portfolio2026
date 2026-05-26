import SoundsSandbox from "@/components/SoundsSandbox/SoundsSandbox";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("sounds");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function SoundsExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      <SoundsSandbox />
    </main>
  );
}
