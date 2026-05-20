import MetallicCards from "@/components/MetallicCards/MetallicCards";

export const metadata = {
  title: "Metallic cards — experiments — Harry Spawforth",
  description:
    "A scroll-pinned 3D Coverflow with WebGL liquid-metal shader cards.",
};

export default function MetallicCardsExperimentPage() {
  return (
    <main className="page" style={{ padding: 0 }}>
      <MetallicCards />
    </main>
  );
}
