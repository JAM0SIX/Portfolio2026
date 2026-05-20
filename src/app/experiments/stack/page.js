import StackCarousel from "@/components/StackCarousel/StackCarousel";

export const metadata = {
  title: "Stack carousel — experiments — Harry Spawforth",
  description:
    "Cover-Flow / slide-projector style stacked card carousel with mirrored reflections and a liquid-glass button.",
};

export default function StackExperimentPage() {
  return (
    <main className="page" style={{ padding: 0 }}>
      <StackCarousel />
    </main>
  );
}
