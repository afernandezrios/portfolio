## Product &amp; Technical Specification: Minimalist Portfolio

### 1. Overview

A clean, highly responsive, and professional personal portfolio designed specifically for a Backend Engineer. The site serves as a digital resume and project showcase. It is built as a static site for maximum performance and zero maintenance, with all content managed easily via local Markdown files.

### 2. Technology Stack

- **Framework:** **Astro** (Recommended over React + Vite for this specific use case. Astro is designed specifically for content-driven static sites, requires zero JavaScript by default, and has built-in, native support for reading and rendering local Markdown files without extra plugins).
- **Styling:** **Plain CSS3**. Utilizing modern CSS features like Flexbox/Grid for layout and CSS Custom Properties (Variables) for the light/dark theme implementation. No CSS frameworks (e.g., Tailwind, Bootstrap) will be used.
- **Content Management:** Local Markdown (`.md`) files using Frontmatter for metadata.
- **Hosting:** GitHub Pages via GitHub Actions CI/CD.

### 3. Core Features (v1)

- **Responsive UI:** Fluid layouts that adapt seamlessly from mobile devices to large desktop monitors.
- **Theme Toggle:** A native Light/Dark mode switch located in the header. The site will respect the user's system preferences by default (`prefers-color-scheme`) and save manual overrides in `localStorage`.
- **Markdown-Driven Data:** Experiences and Projects are decoupled from the UI code. Adding a new project is as simple as creating a new `.md` file in the project folder.
- **Minimalist Aesthetic:** Focused on typography, whitespace, and content readability—avoiding heavy animations or cluttered layouts.

### 4. Application Structure &amp; Sections

#### Header

- Developer Name / Monogram (Left-aligned).
- Navigation Links: "Experience", "Projects" (Right-aligned, collapsed into a hamburger menu on mobile).
- Theme Toggle Icon (Sun/Moon).

#### Hero Section

- Brief, punchy headline (e.g., "Hi, I'm \[Name\], a Backend Software Engineer.").
- Short subtitle explaining core focus or current status.
- Social Links: Minimalist SVG icons for **GitHub** and **LinkedIn**.

#### Background / Experience Section

- Chronological list of professional roles parsed from Markdown.
- Fields displayed: Job Title, Company, Date Range, and a brief description of responsibilities/achievements.

#### Projects Section

- A responsive grid of project cards parsed from Markdown.
- **Project Card Elements:**
  - Title.
  - Description.
  - Optional Media (Image or short, looping `<video>` without sound).
  - External Links (GitHub repo, live demo if applicable).

#### Footer

- Copyright notice.
- Repeated GitHub/LinkedIn icons.

### 5. Content Architecture (Markdown)

Using Astro's Content Collections or basic Markdown imports, the file structure will look like this:

Plaintext

```
/src
  /content
    /experience
      job-1.md
      job-2.md
    /projects
      project-1.md
      project-2.md
```

**Example Frontmatter (**[`project-1.md`](http://project-1.md)**):**

Markdown

```
---
title: "Distributed Task Queue"
description: "A lightweight, in-memory task queue built with Go and Redis, designed for high-throughput background processing."
image: "/assets/projects/task-queue.png" # Optional
github: "https://github.com/yourusername/task-queue"
---
Built to solve X problem by implementing Y architecture...
```

### 6. Design System Guidelines

- **Typography:**
  - Headers: Clean Sans-Serif (e.g., *Inter* or *System Default*).
  - Accents/Tech Terms: Monospace (e.g., *Fira Code* or *JetBrains Mono*) to reflect the backend engineering identity.
- **Color Palette (CSS Variables):**
  - *Dark Mode:* Deep charcoal/almost black background (`#121212`), off-white text (`#E0E0E0`), subtle grey borders (`#333333`).
  - *Light Mode:* Off-white/light grey background (`#FAFAFA`), dark slate text (`#1A1A1A`), light grey borders (`#EAEAEA`).
  - *Accent Color:* A single, subdued accent color (like steel blue or muted green) used sparingly for links and interactive hover states.

### 7. Deployment Strategy

1. **Repository:** Hosted on GitHub.
2. **CI/CD:** A GitHub Actions workflow (`.github/workflows/deploy.yml`) triggered on pushes to the `main` branch.
3. **Build Step:** The action runs `npm run build` to generate the static HTML/CSS files.
4. **Deployment:** The action pushes the `dist` folder to the `gh-pages` branch, which serves the website globally via GitHub Pages.

