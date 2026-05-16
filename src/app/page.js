import Hero from "./components/Hero";
import ProjectsGrid from "./components/ProjectsGrid";
import BookLogSection from "@/components/sections/BookLogSection/BookLogSection";

export default function Home() {
  return (
    <main className="page">
      <div className="col">
        <Hero />
        <ProjectsGrid />
      </div>
      <BookLogSection />
    </main>
  );
}
