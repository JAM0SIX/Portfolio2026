export const projects = [
  {
    slug: "gwi",
    name: "GWI",
    initial: "G",
    date: "2024",
    role: "Founding designer · Consumer insights platform",
    tags: ["SaaS", "Insights", "Product"],
    blurb: "Designing the next generation of consumer insights tooling — making complex audience data approachable for marketers and strategists.",
    badge: "New",
  },
  {
    slug: "philpotpearce",
    name: "PhilpotPearce",
    initial: "P",
    date: "2024",
    role: "Brand identity & website · Independent consultancy",
    tags: ["Identity", "Web", "Brand"],
    blurb: "Visual identity and web presence for a creative consultancy — balancing editorial craft with a clear, confident voice.",
    badge: "Recently",
  },
  {
    slug: "sina",
    name: "Sina",
    initial: "S",
    date: "2024",
    role: "Product design · Consumer mobile & web",
    tags: ["Mobile", "Web", "Product"],
    blurb: "Product design work shaping a friendly, focused consumer experience — clear flows, deliberate interaction craft, careful attention to detail.",
  },
  {
    slug: "lexisnexis",
    name: "LexisNexis",
    initial: "L",
    date: "2023",
    role: "Product design · Legal research platform",
    tags: ["Legal", "AI", "Search"],
    blurb: "Reimagining legal research workflows with AI-assisted search and summarisation for a global legal information platform.",
  },
  {
    slug: "eventuring",
    name: "eVenturing",
    initial: "e",
    date: "2022",
    role: "Co-founder · AI start-up",
    tags: ["AI", "Co-founder", "Startup"],
    blurb: "Co-founded an AI start-up — shaped the product, brand, and early design system from zero to first customers.",
  },
  {
    slug: "soundtrends",
    name: "SoundTrends",
    initial: "S",
    date: "Coming soon",
    role: "Music intelligence platform",
    tags: ["Data", "Music", "Web"],
    blurb: "A music intelligence platform — turning streaming data into clear, useful signals for artists, labels, and curators.",
    badge: "Coming soon",
    comingSoon: true,
  },
];

export function getProject(slug) {
  return projects.find((p) => p.slug === slug);
}
