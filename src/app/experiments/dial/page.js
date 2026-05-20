import PortfolioDial from "@/components/PortfolioDial/PortfolioDial";

export const metadata = {
  title: "Portfolio dial — experiments — Harry Spawforth",
  description:
    "A utility/HUD-style dial that orbits six projects near 3 o'clock with an inline accordion for the active item.",
};

export default function DialExperimentPage() {
  return (
    <main className="page" style={{ padding: 0 }}>
      <PortfolioDial />
    </main>
  );
}
