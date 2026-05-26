/* Client-safe accessor for project content sourced from markdown.
   --------------------------------------------------------------
   The markdown files under /content/projects/<slug>.md are parsed
   at build time by scripts/buildContent.mjs (wired into the
   `predev` and `prebuild` npm scripts) into
   src/lib/_projectContent.generated.js. That generated module
   exports plain JSON, which is safe to import from both server
   and client bundles — unlike a runtime `fs.readFileSync`, which
   blows up in the browser bundle that Sidebar pulls projects.js
   into.

   If a slug's content hasn't been generated, this throws loudly
   in dev rather than returning undefined — silent missing content
   is the worst possible failure mode for a CMS. */

import { projectContent } from "./_projectContent.generated";

export function loadProjectMarkdown(slug) {
  const data = projectContent[slug];
  if (!data) {
    throw new Error(
      `loadProjectMarkdown: no content for slug "${slug}". ` +
        `Did you add /content/projects/${slug}.md and run \`npm run content\`?`
    );
  }
  return data;
}
