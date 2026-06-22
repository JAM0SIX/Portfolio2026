/* Scenario: a rack of utility-tech tools — infrastructure and developer
   utilities. Demo data so the dial has something to render. */

export const PROJECTS = [
  {
    id: "util-1",
    title: "Ledger",
    role: "Encrypted CLI vault",
    year: "2026",
    tags: ["Security", "CLI"],
    summary:
      "A keychain for the terminal — secrets, tokens and SSH keys encrypted at rest, unlocked with a single passphrase.",
  },
  {
    id: "util-2",
    title: "Conduit",
    role: "API gateway",
    year: "2025",
    tags: ["Infra", "Routing"],
    summary:
      "Routes, rate-limits and authenticates traffic across services from one config file, with metrics out of the box.",
  },
  {
    id: "util-3",
    title: "Beacon",
    role: "Uptime monitor",
    year: "2025",
    tags: ["Observability", "Alerts"],
    summary:
      "Pings your endpoints from a dozen regions and pages you the moment something drifts — before users notice.",
  },
  {
    id: "util-4",
    title: "Forge",
    role: "Build pipeline",
    year: "2024",
    tags: ["CI/CD", "DevOps"],
    summary:
      "Caches aggressively and runs jobs in parallel so a green build lands in seconds, not minutes.",
  },
  {
    id: "util-5",
    title: "Relay",
    role: "Webhook router",
    year: "2024",
    tags: ["Events", "Integration"],
    summary:
      "Catches, retries and fans out webhooks, with a replay log so a failed delivery is never lost.",
  },
  {
    id: "util-6",
    title: "Switchboard",
    role: "Internal admin console",
    year: "Coming soon",
    tags: ["Ops", "Tools"],
    summary:
      "One console for feature flags, support tools and the back-office tasks the whole team can reach.",
    comingSoon: true,
  },
];
