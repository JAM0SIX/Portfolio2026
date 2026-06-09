/* Skills / Stack — carousel content.
   ───────────────────────────────────
   Two rows: STACK (tools / tech) on top, SKILLS (capabilities)
   underneath. Each row scrolls horizontally in opposite directions.

   `icon` is a filename inside /public/icons/skills/. Drop matching
   SVG (or PNG) files there and they appear automatically; until then
   the pill renders label-only (the <img> hides itself on load error).
   Add / remove / reorder freely — the marquee re-measures itself. */

export const STACK = [
  { name: "Claude Code", icon: "claude-code.png" },
  { name: "Cursor", icon: "cursor.png" },
  { name: "Vercel", icon: "vercel.svg" },
  { name: "Paper", icon: "paper.png" },
  { name: "Unicorn Studio", icon: "unicorn-studio.png" },
  { name: "Figma", icon: "figma.png" },
  { name: "Framer", icon: "framer.webp" },
  { name: "Next.js", icon: "nextjs.png" },
  { name: "v0", icon: "v0.svg" },
  { name: "GitHub", icon: "github.svg" },
  { name: "Codex", icon: "codex.png" },
  { name: "FloraAI", icon: "flora-ai.png" },
];

export const SKILLS = [
  { name: "Product Strategy", icon: "product-strategy.svg" },
  { name: "Interaction Design", icon: "interaction-design.svg" },
  { name: "Design Systems", icon: "design-systems.svg" },
  { name: "Design Engineering", icon: "design-engineering.svg" },
  { name: "UX Research", icon: "ux-research.svg" },
  { name: "AI-agent workflows", icon: "ai-agent-workflows.svg" },
  { name: "AI-Native Design", icon: "ai-native-design.svg" },
  { name: "End-to-end ownership", icon: "end-to-end-ownership.svg" },
  { name: "Behavioural product thinking", icon: "behavioural-product-thinking.svg" },
  { name: "Psychological problem solving", icon: "psychological-problem-solving.svg" },
  { name: "Human-AI interface design", icon: "human-ai-interface-design.svg" },
  { name: "Vibe coder", icon: "vibe-coder.svg" },
];
