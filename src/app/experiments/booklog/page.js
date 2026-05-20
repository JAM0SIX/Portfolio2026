import BookLogExperiment from "@/components/BookLogExperiment/BookLogExperiment";

export const metadata = {
  title: "BookLog carousel — experiments — Harry Spawforth",
  description:
    "A utility/HUD-style horizontal carousel for a fictional book magazine.",
};

export default function BookLogExperimentPage() {
  return (
    <main className="page" style={{ padding: 0 }}>
      <BookLogExperiment />
    </main>
  );
}
