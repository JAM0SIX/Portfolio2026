import ScrambleText from "@/components/ScrambleText/ScrambleText";

/* Shared header for each /experiments/<slug> page — eyebrow tag,
   scramble-on-load h1, and the experiment's description lede. */
export default function ExperimentHeader({ exp }) {
  return (
    <header className="experiment-header">
      <div className="case-study__eyebrow">{exp.tag}</div>
      <h1 className="case-study__title">
        <ScrambleText text={exp.title} as="text" />
      </h1>
      <p className="case-study__lede">{exp.description}</p>
    </header>
  );
}
