# Portfolio

Personal portfolio site for a backend engineer. A static, content-driven site built with
[Astro](https://astro.build/), styled with plain CSS. All content lives in local Markdown
files, so adding a project or a job means creating a file — no code changes required.

The site ships zero JavaScript by default; the only script is the small inline snippet that
handles the light/dark theme toggle.

## Requirements

- Node.js `18.20.8`, `^20.3.0`, or `>=22.0.0` — this is the range Astro 5.18 declares and it
  will refuse to run outside it (developed against v24)
- pnpm 7.1.0 or newer

## Getting started

```bash
pnpm install
pnpm dev
```

The dev server runs at <http://localhost:4321/portfolio/>. Edits to pages, styles, and
Markdown content hot-reload in the browser.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server with hot reload |
| `pnpm build` | Build the static site into `dist/` |
| `pnpm preview` | Serve the built `dist/` locally to check the production output |

The CI workflow pins `package-manager: pnpm@latest` on the `withastro/action` step, so the
runner does not have to guess which manager to use.

## Project structure

```
src/
  content/
    experience/       one Markdown file per role
    projects/         one Markdown file per project
  layouts/
    Layout.astro      page shell: head, header, nav, footer, theme script
  pages/
    index.astro       the single page: hero, experience, projects
    projects/
      [slug].astro    one detail page per project, generated at build time
  styles/
    global.css        CSS custom properties, both themes, all layout rules
  content.config.ts   content collection schemas (Zod)
public/               static assets, served as-is (images, video)
.github/workflows/    GitHub Pages deployment
```

## Editing content

### Adding a project

Create a new `.md` file in `src/content/projects/`. The filename becomes the entry ID.

```markdown
---
title: "Distributed Task Queue"
description: "A lightweight, in-memory task queue built with Go and Redis."
image: "/assets/projects/task-queue.png"
stack: ["Go", "Redis", "Docker"]
github: "https://github.com/yourusername/task-queue"
demo: "https://example.com"
---
Everything below the `---` is the detail-page body. Write as much as you want:
headings, lists, code blocks, links. It is never shown on the card.
```

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Card heading and detail page title |
| `description` | yes | Card body text, and the intro line on the detail page |
| `image` | no | Path relative to `public/`. Use a leading slash, e.g. `/assets/projects/foo.png` |
| `video` | no | Same convention. Renders as a looping, muted, autoplaying `<video>` |
| `stack` | no | List of tech names, rendered as monospace chips on the detail page |
| `github` | no | Renders a "GitHub" link on both card and detail page |
| `demo` | no | Renders a "Demo" link on the card, "Live demo" on the detail page |

Put image and video files under `public/assets/projects/` and reference them as
`/assets/projects/<filename>`. The build prefixes the deployment base path automatically, so
use the leading slash even though the deployed URL includes the repository name.

Project cards are sorted alphabetically by `title`.

Each project also gets its own page at `/projects/<filename>/`, generated at build time from
the markdown body. Clicking a card's thumbnail or title opens it. The body is rendered with
syntax highlighting disabled — code blocks inherit the site's light/dark colors from
`src/styles/global.css` rather than a fixed editor theme.

### Adding a job

Create a new `.md` file in `src/content/experience/`:

```markdown
---
title: "Backend Engineer"
company: "Acme Corp"
start: "2023"
end: "Present"
description: "Built and maintained Go microservices handling 2M+ requests per day."
---
```

All five fields are required. Entries are sorted by `start` in descending order, so the most
recent role appears first. `start` and `end` are free-form strings — `"2023"`, `"Mar 2023"`,
and `"Present"` all render as written. Keep them zero-padded and consistent if you use
month numbers, since sorting is a plain string comparison.

The schema is enforced at build time: a missing required field or a typo in a field name
fails the build with the offending file named.

## Customizing

**Name and links.** Your name, GitHub, and LinkedIn URLs are declared as constants at the top
of two files and must be kept in sync:

- `src/layouts/Layout.astro` — header monogram, footer copyright, footer icons
- `src/pages/index.astro` — hero headline, hero icons

**Hero copy.** The `subtitle` paragraph in `src/pages/index.astro`.

**Colors and fonts.** All colors are CSS custom properties in `src/styles/global.css`. Light
mode lives on `:root`; dark mode overrides are under `[data-theme="dark"]`. The accent color
is `--accent`. Fonts are Inter (sans) and JetBrains Mono (mono), loaded from Google Fonts in
`src/layouts/Layout.astro`; system fallbacks are already in the font stacks if the CDN is
unreachable.

**Site URL and base path.** `site` and `base` in `astro.config.mjs`. `base` must match the
repository name for project pages (`https://<user>.github.io/<repo>/`). Set `base: "/"` if you
deploy to a user or organization page or a custom domain.

## Theme

The site follows the visitor's operating system preference by default. Clicking the toggle in
the header overrides that choice and stores it in `localStorage` under the key `theme`. The
override wins on subsequent visits. Clearing site data returns the site to the system
preference.

The theme is applied by a blocking inline script in `<head>`, before the body renders, so
there is no flash of the wrong theme on load.

## Deployment

`.github/workflows/deploy.yml` builds and deploys the site to GitHub Pages on every push to
`main` or `master`, and can also be triggered manually from the Actions tab.

One-time setup:

1. In `astro.config.mjs`, set `site` to your Pages URL.
2. Push the repository to GitHub.
3. In the repository, go to **Settings → Pages** and set **Source** to **GitHub Actions**.

The site is then published at `https://<username>.github.io/<repo>/`.

Note that this workflow uses the `withastro/action` + `deploy-pages` path, where Pages is
served directly from an Actions deployment rather than from a `gh-pages` branch. There is no
`gh-pages` branch to manage.

## License

Personal project. All rights reserved.
