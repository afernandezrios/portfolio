import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://afernandezrios.github.io/",
  base: "/portfolio/",
  // Shiki bakes a single theme's colors in at build time, which cannot follow
  // the site's data-theme switch. Plain <pre><code> is styled from CSS vars.
  markdown: { syntaxHighlight: false },
});
