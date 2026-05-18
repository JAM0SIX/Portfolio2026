import styles from "./TechStackSection.module.css";
import { techStack } from "./techStack";

export default function TechStackSection() {
  const totalTools = techStack.reduce(
    (sum, group) => sum + group.items.length,
    0,
  );

  return (
    <section
      id="tech-stack"
      className={styles.section}
      aria-label="Tech stack"
    >
      <div className="section__head">
        <span className="section__label">Tech stack</span>
        <span className="section__rule" aria-hidden="true" />
        <span className="section__count">{totalTools} tools</span>
      </div>

      {techStack.map((group) => (
        <div key={group.category} className={styles.group}>
          <h3 className={styles.category}>{group.category}</h3>
          <div className={styles.grid}>
            {group.items.map((item) => (
              <div key={item.name} className={styles.tile}>
                <span className={styles.name}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
