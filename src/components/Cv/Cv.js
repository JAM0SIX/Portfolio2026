/* Cv — Harry's CV reproduced word-for-word from his Pages document
   (email removed at his request), shown inside CvLink's read-only
   overlay. Styling lives in CvLink.module.css. Edit the data below to
   update the CV. */

import styles from "./CvLink.module.css";

const SUMMARY =
  "Multi-award-winning AI-native product designer leading end-to-end design for AI-powered products across start-ups, scale-ups and enterprise businesses. Recently at GWI, designing agent platforms and directing design operations through OOUX and AI feature workflows that designers can implement themselves. Previously design lead for LexisNexis's flagship AI search tool, Nexis+AI, partnering with OpenAI and cross-functional teams to turn complex technology into successful, trustworthy products. Proven impact through AI frameworks, design systems, and data-driven iteration, including a +89% response-quality uplift and a 90% increase in ideal-scenario outcomes.";

const CORE_SKILLS = [
  {
    label: "AI & Product",
    items:
      "Human-AI Interaction, Agent Platform Design, AI Feature Matchmaking, RAG-Grounded Workflow Design, AI Design Frameworks, Prompt Engineering, Model Response Testing, AI Answer-Quality Testing, AI Explainability & Trust Patterns",
  },
  {
    label: "Design Systems & Craft",
    items:
      "Design Systems Architecture, Component Libraries & Tokens, Scalable Design Patterns, OOUX, Multi-Surface Product Design",
  },
  {
    label: "Strategy & Leadership",
    items:
      "Product Strategy & Vision, Product Discovery, Cross-Functional Leadership, Stakeholder & Executive Alignment, DesignOps, Mentoring",
  },
  {
    label: "Stack",
    items: "Figma, Framer, Cursor, Claude Code, Codex, GitHub, Vercel, Paper, FloraAI",
  },
];

const ACHIEVEMENTS = [
  "BIMA Awards - Rising Star",
  "Best Innovation in Generative AI - Nexis+AI",
  "Great British Entrepreneur Awards - Disruptor of the Year (Winner)",
];

const EXPERIENCE = [
  {
    company: "GWI",
    role: "Senior Product Design Lead",
    dates: "December 2025 – June 2026",
    bullets: [
      "Defined and led the product vision for GWI's AI-native data platform, owning strategy through to delivery and building the business case for an agentic redesign a direction projected to save £750k/year and open new commercial revenue lines.",
      "Architected an agentic operating model with a continuous AI agent that automates research operations and absorbs the mundane work, reducing clicks-to-insight 6× while reserving high-stakes judgement for researchers.",
      "Reframed a fragmented six-tool stack into a single AI-orchestrated source of truth, de-risking the silent data-quality failures that threatened client trust and the integrity of GWI's commercial product.",
      "Set the strategy to bring outsourced spend in-house, deploying RAG-grounded survey drafting and an automated translation pipeline to displace third-party agencies and reduce platform dependencies such as Qualtrics.",
      "Secured executive buy-in for a new product direction by leading research across the business and de-risking the vision with a working sandbox prototype, moving leadership on from legacy ways of working.",
    ],
  },
  {
    company: "PhilpotPearce",
    role: "Freelance Senior Product Design Lead",
    dates: "December 2025 – March 2026",
    bullets: [
      "Led brand and product strategy for an industrial design launch, shaping positioning with the founders and shipping the identity and site as one coherent expression of the studio's values.",
      "Translated worldview into architecture, structuring the IA around the golden circle so navigation itself signals the studio's thinking, underpinned by a disciplined editorial design system that scales without exception.",
    ],
  },
  {
    company: "LexisNexis",
    role: "Product Design Lead, Nexis+AI",
    dates: "October 2023 – December 2025",
    bullets: [
      "Lead designer for Nexis+AI, a flagship AI search tool built on 12,000+ publishers; partnered with OpenAI, engineers and data scientists to craft trustworthy, insightful experiences.",
      "Impact: +89% increase in AI response quality; 100% improvement in search effectiveness; accelerated team throughput via ways-of-working and design frameworks; supported major new-business opportunities with the likes of EY, ABC and KPMG.",
      "Defined and executed product-level design strategy aligned to business goals and technical constraints; shipped a market-fit product on time to an international audience.",
      "Established AI experimentation with Research & Analytics; hands-on user validation refined scope and priority to de-risk the north-star journey.",
      "Led AI-centric strategy initiatives that identify AI-driven solutions, and published AI frameworks and processes adopted by product teams company-wide to speed up AI concept creation.",
    ],
  },
  {
    company: "eVenturing",
    role: "Freelance Designer & Webflow Developer",
    dates: "July 2024 – December 2024",
    bullets: [
      "Rebranded and rebuilt their website end-to-end (strategy → UX/UI → Webflow development), optimising IA, messaging and conversion paths.",
      "Impact: +250% leads, 100% SEO uplift, +90% increase in users achieving ideal outcomes.",
    ],
  },
  {
    company: "Sina",
    role: "Co-Founder & Product Designer",
    dates: "April 2020 – October 2022",
    bullets: [
      "Co-founded an MSK injury diagnostics & rehab app; collaborated with clinicians and engineers to design and ship a full working product that went on to win multiple awards.",
      "Built a bespoke design system enabling rapid scale; pitched to investors and won 5 grant awards.",
    ],
  },
  {
    company: "MMT",
    role: "UX/UI Designer",
    dates: "June 2021 – September 2023",
    bullets: [
      "Designed user experiences for 5 client projects across finance, technology and consultancies while mentoring placement designers.",
      "Acted as Vodafone design-system guardian, helping define global DS guidelines and components.",
    ],
  },
];

const EDUCATION = [
  {
    name: "Loughborough University",
    detail: "2:1 BSc User-Centred Design",
    dates: "September 2017 – July 2021",
  },
];

export default function Cv() {
  return (
    <article className={styles.cv}>
      <header className={styles.cvHeader}>
        <h2 className={styles.cvName}>Harry Spawforth</h2>
        <p className={styles.cvTitle}>Senior AI-Native Product Designer</p>
        <ul className={styles.cvContact} aria-label="Contact">
          <li>London, UK</li>
          <li>
            LinkedIn:{" "}
            <a href="https://www.linkedin.com/in/harry-spawforth" target="_blank" rel="noopener noreferrer">
              linkedin.com/in/harry-spawforth
            </a>
          </li>
        </ul>
      </header>

      <p className={styles.cvSummary}>{SUMMARY}</p>

      <section className={styles.cvSection}>
        <h3 className={styles.cvSectionTitle}>Core Skills</h3>
        <div className={styles.cvSkills}>
          {CORE_SKILLS.map((s) => (
            <p key={s.label} className={styles.cvSkillLine}>
              <strong>{s.label}:</strong> {s.items}
            </p>
          ))}
        </div>
      </section>

      <section className={styles.cvSection}>
        <h3 className={styles.cvSectionTitle}>Achievements</h3>
        <ul className={styles.cvBullets}>
          {ACHIEVEMENTS.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      <section className={styles.cvSection}>
        <h3 className={styles.cvSectionTitle}>Experience</h3>
        {EXPERIENCE.map((job) => (
          <div key={job.company} className={styles.cvEntry}>
            <div className={styles.cvEntryHead}>
              <p className={styles.cvRole}>
                <span className={styles.cvCompany}>{job.company}</span>, {job.role}
              </p>
              <p className={styles.cvDates}>{job.dates}</p>
            </div>
            <ul className={styles.cvBullets}>
              {job.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className={styles.cvSection}>
        <h3 className={styles.cvSectionTitle}>Education</h3>
        {EDUCATION.map((e) => (
          <div key={e.name} className={styles.cvEntry}>
            <div className={styles.cvEntryHead}>
              <p className={styles.cvRole}>
                <span className={styles.cvCompany}>{e.name}</span> {e.detail}
              </p>
              <p className={styles.cvDates}>{e.dates}</p>
            </div>
          </div>
        ))}
      </section>
    </article>
  );
}
