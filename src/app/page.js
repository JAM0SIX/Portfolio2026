import Hero from "./components/Hero";
import ProjectsGrid from "./components/ProjectsGrid";
import BookLogSection from "@/components/sections/BookLogSection/BookLogSection";
import SkillsStack from "@/components/sections/SkillsStack/SkillsStack";
import ReferencesSection from "@/components/sections/ReferencesSection/ReferencesSection";

export default function Home() {
  return (
    <main className="page">
      <div className="col">
        <Hero />
        <ProjectsGrid />
        <BookLogSection />
        <SkillsStack />
        <ReferencesSection />
      </div>
    </main>
  );
}
