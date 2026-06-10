/* Cv — on-brand HTML rendering of Harry's CV, shown inside CvLink's
   read-only overlay. Pure content + structure; styling lives in
   CvLink.module.css. Edit the data arrays below to update the CV. */

import styles from "./CvLink.module.css";

const EXPERIENCE = [
  {
    role: "Senior Product Designer",
    company: "GWI",
    meta: "AI-native internal data platform",
    dates: "2025 – Present",
    bullets: [
      "Defined and led the product vision for GWI's AI-native internal data platform, owning strategy through to delivery; a redesign projected to save the business £750k a year and open new commercial revenue lines.",
      "Architected an agentic operating model across three layers (Project Hub, Drafting, Fieldwork) with a continuous AI agent that automates research operations, reducing clicks-to-insight 6x while reserving high-stakes judgement for researchers.",
      "Reframed a fragmented six-tool legacy stack into a single AI-orchestrated source of truth, de-risking the silent data-quality failures that threatened client trust.",
      "Set the strategy to bring outsourced spend in-house with RAG-grounded survey drafting and an automated translation pipeline, displacing third-party agencies and reducing platform dependencies such as Qualtrics.",
      "Secured executive buy-in for a new product direction by leading research across the business and de-risking the vision with a working sandbox prototype.",
    ],
  },
  {
    role: "Product Designer",
    company: "LexisNexis",
    meta: "Nexis+AI · AI research platform",
    dates: "2023 – 2025",
    bullets: [
      "Designed Nexis+AI, an AI research platform that turns 12,000 vetted publishers into cited, conversational answers business consultants can trust.",
      "Worked across product strategy, interaction design, design systems, research and art direction as the platform's lead designer.",
      "Re-engineered the AI search prompts through a UX lens, delivering an 89% lift in response quality, with 80% of users preferring it over ChatGPT for professional work.",
    ],
  },
];

const PROJECTS = [
  {
    name: "PhilpotPearce",
    meta: "Brand identity & website · 2026",
    body: "Designed and shipped the brand identity and website for a creative consultancy (philpottpearce.com), translating the founders' restraint-over-decoration values into a disciplined editorial design system.",
  },
  {
    name: "SoundTrends",
    meta: "Music intelligence platform",
    body: "Identifying the key performing sounds on TikTok and explaining, step by step, how creators can use them to boost engagement, by triangulating key data points and mapping a sound's trending life cycle.",
  },
  {
    name: "eVenturing",
    meta: "Brand & website",
    body: "Brand and web presence for a consultancy, built around a diagnostic-led journey that qualifies and converts leads.",
  },
];

const SKILLS = [
  {
    group: "Design",
    items: [
      "Product strategy",
      "Interaction design",
      "Design systems",
      "UX research",
      "Human-AI interface design",
      "Art direction",
    ],
  },
  {
    group: "AI & automation",
    items: [
      "AI-native design",
      "AI-agent workflows",
      "RAG & prompt design",
      "Behavioural product thinking",
      "Automation strategy",
    ],
  },
  {
    group: "Build",
    items: ["Next.js", "React", "CSS", "Figma", "Framer", "Cursor", "Claude Code", "v0"],
  },
];

export default function Cv() {
  return (
    <article className={styles.cv}>
      <header className={styles.cvHeader}>
        <h2 className={styles.cvName}>Harry Spawforth</h2>
        <p className={styles.cvTitle}>Senior Product Designer · AI &amp; automation</p>
        <ul className={styles.cvContact} aria-label="Contact">
          <li>London</li>
          <li>
            <a href="mailto:harryspawforth@gmail.com">harryspawforth@gmail.com</a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/harry-spawforth" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </header>

      <p className={styles.cvSummary}>
        AI-native product designer who owns problems end to end, from strategy
        and research to interface design and build. I turn complex, data-rich
        systems into tools that make people measurably faster, with a particular
        focus on AI and automation. I believe the future belongs to designers
        who can build.
      </p>

      <section className={styles.cvSection}>
        <h3 className={styles.cvSectionTitle}>Experience</h3>
        {EXPERIENCE.map((job) => (
          <div key={job.company} className={styles.cvEntry}>
            <div className={styles.cvEntryHead}>
              <p className={styles.cvRole}>
                {job.role}, <span className={styles.cvCompany}>{job.company}</span>
              </p>
              <p className={styles.cvDates}>{job.dates}</p>
            </div>
            {job.meta && <p className={styles.cvEntryMeta}>{job.meta}</p>}
            <ul className={styles.cvBullets}>
              {job.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.cvSection}>
        <h3 className={styles.cvSectionTitle}>Selected projects</h3>
        {PROJECTS.map((p) => (
          <div key={p.name} className={styles.cvEntry}>
            <div className={styles.cvEntryHead}>
              <p className={styles.cvRole}>{p.name}</p>
              <p className={styles.cvDates}>{p.meta}</p>
            </div>
            <p className={styles.cvProjectBody}>{p.body}</p>
          </div>
        ))}
      </section>

      <section className={styles.cvSection}>
        <h3 className={styles.cvSectionTitle}>Skills</h3>
        <div className={styles.cvSkills}>
          {SKILLS.map((s) => (
            <div key={s.group} className={styles.cvSkillGroup}>
              <p className={styles.cvSkillLabel}>{s.group}</p>
              <p className={styles.cvSkillItems}>{s.items.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
