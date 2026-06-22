import Hero from "./components/Hero";
import ProjectsGrid from "./components/ProjectsGrid";
import BookLogSection from "@/components/sections/BookLogSection/BookLogSection";
import SkillsStack from "@/components/sections/SkillsStack/SkillsStack";
import ReferencesSection from "@/components/sections/ReferencesSection/ReferencesSection";
import ExperimentsCarousel from "./components/ExperimentsCarousel";
import { EXPERIMENTS } from "@/lib/experiments";

/* The Experiments carousel is fed from the experiments index (single source of
   truth). Each card shows the experiment's preview; clicking it opens the live
   experiment in the modal (via its href + ?embed=1), matching /experiments. */
const EXPERIMENT_IMAGES = EXPERIMENTS.map((e) => ({
  src: e.image,
  srcDark: e.imageDark,
  alt: e.title,
  title: e.title,
  href: e.href,
  slug: e.slug,
  meta: e.meta,
  note: e.note,
}));

export default function Home() {
  return (
    <main className="page">
      <div className="col">
        <Hero />
        <ProjectsGrid />
        <BookLogSection />

        {/* Experiments — full-bleed orbiting carousel (spans the bleed
            track, clear of the left nav). The "Experiments" label is
            rendered inside the carousel's pinned stage, so it's part of
            the scene and stays in view while the ring is up — it's a
            static heading, not a sticky element. */}
        <section id="experiments" className="bleed" aria-label="Freelance work and experiments">
          <ExperimentsCarousel
            images={EXPERIMENT_IMAGES}
            background="transparent"
            label={
              <div className="section__head">
                <span className="section__label">Freelance work and experiments</span>
                <span className="section__rule" aria-hidden="true" />
              </div>
            }
          />
        </section>

        <SkillsStack />
        <ReferencesSection />
      </div>
    </main>
  );
}
