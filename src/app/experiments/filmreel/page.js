import { FilmReelView } from "@/components/FilmReelModal/FilmReelModal";
import { REEL_IMAGES } from "@/components/FilmReelModal/reelImages";
import { getExperiment } from "@/lib/experiments";
import ExperimentHeader from "../ExperimentHeader";

const exp = getExperiment("filmreel");

export const metadata = {
  title: `${exp.title} — experiments — Harry Spawforth`,
  description: exp.description,
};

export default function FilmReelExperimentPage() {
  return (
    <main className="page">
      <ExperimentHeader exp={exp} />
      {/* Fills the embed viewport (chrome stripped via ?embed=1 in the modal);
          scroll inside the reel to feed it. Background tracks the theme. */}
      <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
        <FilmReelView images={REEL_IMAGES} background="var(--paper)" />
      </div>
    </main>
  );
}
