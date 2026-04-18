# Phase 1: Foundation + Home Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Astro project with the brand system, build the home page to match the approved mockup, and deploy it live to a Cloudflare Pages staging URL. At the end of this phase, you can share a link with the team that shows a working, high-Lighthouse home page.

**Architecture:** Astro 5 static site with TypeScript strict mode, Tailwind CSS v4 with brand tokens, self-hosted Fraunces + Inter fonts, Content Collections (Zod-validated Markdown) for team/partner/program/stats data. Deploy via GitHub → Cloudflare Pages auto-deploy. No backend.

**Tech Stack:** Node 20 · Astro 5 · TypeScript (strict) · Tailwind CSS v4 · Vitest · Playwright · axe-core · @fontsource · Cloudflare Pages

**Spec:** `docs/superpowers/specs/2026-04-18-expedition-reading-redesign-design.md`

**Out of scope for Phase 1:** pages other than `/`, contact forms, DNS cutover, legal pages, Lighthouse CI in GitHub Actions, OG images. All covered in Phase 2 / 3.

---

## File structure (by end of Phase 1)

```
package.json
astro.config.mjs
tsconfig.json
tailwind.config.ts              (v4 config-as-CSS is preferred; see Task 3)
src/
  content.config.ts             # Content Collections + Zod schemas
  styles/
    global.css                  # Tailwind directives + font faces + brand tokens
  content/
    stats.json
    team/                       # 6 md files (Phase 2 fills them; Phase 1 just scaffolds one for typing)
    partners/                   # 5 md files (Phase 2)
    programs/                   # 3 md files (seeded in Task 10)
    values/values.json
  components/
    Button.astro
    Nav.astro
    Footer.astro
    StatBlock.astro
    SectionHeader.astro
    ProgramCard.astro
    CtaSection.astro
    SEO.astro
  layouts/
    BaseLayout.astro
  pages/
    index.astro                 # Home page
  lib/
    site.ts                     # SITE config constants (name, url, etc.)
tests/
  unit/
    Button.test.ts
    site.test.ts
  e2e/
    home.spec.ts                # Playwright smoke + axe
playwright.config.ts
vitest.config.ts
.github/workflows/ci.yml
.nvmrc
README.md  (already exists — updated in Task 1)
CLAUDE.md  (already exists)
.gitignore (already exists)
```

---

## Task 1: Initialize Astro project with TypeScript strict

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.nvmrc`, `public/favicon.svg`
- Create: `src/env.d.ts` (Astro auto-creates, but confirmed)
- Modify: `README.md` (add dev commands section)

- [ ] **Step 1: Initialize git repo**

```bash
git init
git add .gitignore CLAUDE.md README.md docs/
git commit -m "chore: seed repo with CLAUDE.md, README, gitignore, and spec"
```

- [ ] **Step 2: Create `.nvmrc`**

```
20
```

- [ ] **Step 3: Create `package.json`**

```json
{
  "name": "expedition-reading-website",
  "type": "module",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check && tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "test:e2e:install": "playwright install --with-deps chromium"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@fontsource/fraunces": "^5.1.0",
    "@fontsource/inter": "^5.1.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "@playwright/test": "^1.49.0",
    "@tailwindcss/vite": "^4.0.0",
    "@types/node": "^22.10.0",
    "@axe-core/playwright": "^4.10.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  },
  "engines": {
    "node": ">=20"
  }
}
```

- [ ] **Step 4: Install dependencies**

Run: `npm install`
Expected: creates `node_modules/` and `package-lock.json` with no errors.

- [ ] **Step 5: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["astro/client"]
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 6: Create `astro.config.mjs`**

```js
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://expeditionreading.org",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
});
```

- [ ] **Step 7: Create a minimal `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#E8A93B"/><text x="16" y="22" font-family="Georgia,serif" font-size="18" font-weight="700" text-anchor="middle" fill="#2B1D14">E</text></svg>
```

- [ ] **Step 8: Create a placeholder `src/pages/index.astro`** so the build succeeds

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Expedition Reading</title></head>
  <body><h1>Expedition Reading</h1></body>
</html>
```

- [ ] **Step 9: Verify the build**

Run: `npm run build`
Expected: `dist/index.html` exists; exit code 0.

- [ ] **Step 10: Append a Development section to `README.md`**

Replace the existing `## Quick links (once implemented)` section with:

```markdown
## Development

Requires Node 20+.

```bash
npm install          # install dependencies
npm run dev          # start dev server on http://localhost:4321
npm run build        # production build to dist/
npm run preview      # preview the production build
npm run check        # TypeScript + Astro type check
npm test             # unit tests (Vitest)
npm run test:e2e     # end-to-end tests (Playwright + axe)
```

## Quick links

- Design spec: `docs/superpowers/specs/`
- Implementation plans: `docs/superpowers/plans/`
- Content: `src/content/`
- Deploy: Cloudflare Pages, auto-deploys from `main`
```

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat: scaffold Astro + TypeScript project with sitemap + Tailwind Vite plugin"
```

---

## Task 2: Add the Tailwind v4 brand token stylesheet

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/pages/index.astro` (import global.css)

- [ ] **Step 1: Create `src/styles/global.css` with brand tokens and font imports**

```css
@import "tailwindcss";
@import "@fontsource/fraunces/400.css";
@import "@fontsource/fraunces/600.css";
@import "@fontsource/fraunces/700.css";
@import "@fontsource/inter/400.css";
@import "@fontsource/inter/500.css";
@import "@fontsource/inter/600.css";
@import "@fontsource/inter/700.css";

@theme {
  /* Palette — "Warm Editorial" from the spec */
  --color-gold: #E8A93B;
  --color-teal: #2A9D8F;
  --color-brown: #2B1D14;
  --color-cream: #FAF6EC;
  --color-paper: #FFFFFF;
  --color-muted-brown: #5B4B3E;
  --color-border-cream: #E8DDC5;
  --color-red-accent: #C23F35;
  --color-sky-accent: #4FA3D1;

  /* Typography */
  --font-serif: "Fraunces", Georgia, "Times New Roman", serif;
  --font-sans: "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;

  /* Type scale (from spec) */
  --text-xs: 0.75rem;   /* 12 */
  --text-sm: 0.875rem;  /* 14 */
  --text-base: 1rem;    /* 16 */
  --text-lg: 1.125rem;  /* 18 */
  --text-xl: 1.375rem;  /* 22 */
  --text-2xl: 1.75rem;  /* 28 */
  --text-3xl: 2.25rem;  /* 36 */
  --text-4xl: 3rem;     /* 48 */
  --text-5xl: 4rem;     /* 64 */

  /* Spacing (from spec) */
  --spacing-1: 0.25rem; /* 4 */
  --spacing-2: 0.5rem;  /* 8 */
  --spacing-4: 1rem;    /* 16 */
  --spacing-6: 1.5rem;  /* 24 */
  --spacing-10: 2.5rem; /* 40 */
  --spacing-16: 4rem;   /* 64 */
  --spacing-24: 6rem;   /* 96 */

  /* Radius */
  --radius-card: 0.5rem;
  --radius-pill: 999px;
}

@layer base {
  html {
    font-family: var(--font-sans);
    color: var(--color-brown);
    background: var(--color-cream);
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-serif);
    font-weight: 700;
    color: var(--color-brown);
    line-height: 1.15;
  }

  :focus-visible {
    outline: 2px solid var(--color-brown);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    background: var(--color-brown);
    color: var(--color-cream);
    padding: 0.75rem 1rem;
    z-index: 100;
  }
  .skip-link:focus {
    left: 0;
  }
}
```

- [ ] **Step 2: Import the stylesheet from `src/pages/index.astro`**

```astro
---
import "@/styles/global.css";
---
<html lang="en">
  <head><meta charset="utf-8" /><title>Expedition Reading</title></head>
  <body><h1>Expedition Reading</h1></body>
</html>
```

- [ ] **Step 3: Verify the build and dev server**

Run: `npm run build`
Expected: exit 0, no warnings.

Run: `npm run dev` (in a second terminal or detached)
Open: http://localhost:4321
Expected: page shows "Expedition Reading" in Fraunces serif on a cream background.

Stop the dev server (Ctrl-C).

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add brand tokens, fonts, and global styles"
```

---

## Task 3: Create the site config module (`src/lib/site.ts`) with a failing test

This is the first real TDD task — it establishes a single source of truth for site-wide constants.

**Files:**
- Create: `src/lib/site.ts`
- Create: `tests/unit/site.test.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
  },
});
```

- [ ] **Step 2: Write the failing test at `tests/unit/site.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { SITE } from "@/lib/site";

describe("SITE config", () => {
  it("exposes the canonical site URL without a trailing slash", () => {
    expect(SITE.url).toBe("https://expeditionreading.org");
  });

  it("exposes the organization name", () => {
    expect(SITE.name).toBe("Expedition Reading");
  });

  it("exposes the tagline", () => {
    expect(SITE.tagline).toBe("Every child deserves a chance to learn.");
  });

  it("exposes the contact email", () => {
    expect(SITE.contactEmail).toBe("contact@expeditionreading.org");
  });

  it("exposes a nav array with the five primary pages in order", () => {
    expect(SITE.nav.map((n) => n.href)).toEqual([
      "/about",
      "/what-we-do",
      "/impact",
      "/partners",
      "/get-involved",
    ]);
  });
});
```

- [ ] **Step 3: Run the test — it should fail (module doesn't exist)**

Run: `npm test`
Expected: FAIL — "Failed to resolve import '@/lib/site'" or similar.

- [ ] **Step 4: Create `src/lib/site.ts` with the minimal implementation**

```ts
export const SITE = {
  name: "Expedition Reading",
  tagline: "Every child deserves a chance to learn.",
  description:
    "A 501(c)(3) nonprofit placing books in the hands of children from birth onward.",
  url: "https://expeditionreading.org",
  contactEmail: "contact@expeditionreading.org",
  socials: {
    instagram: "https://www.instagram.com/expeditionreading",
  },
  nav: [
    { href: "/about", label: "About" },
    { href: "/what-we-do", label: "What We Do" },
    { href: "/impact", label: "Impact" },
    { href: "/partners", label: "Partners" },
    { href: "/get-involved", label: "Get Involved" },
  ],
} as const;

export type SiteConfig = typeof SITE;
```

- [ ] **Step 5: Run the test — it should pass**

Run: `npm test`
Expected: PASS, 5 tests green.

- [ ] **Step 6: Commit**

```bash
git add src/lib/site.ts tests/unit/site.test.ts vitest.config.ts
git commit -m "feat: add SITE config with unit tests"
```

---

## Task 4: Define Content Collection schemas for stats, programs, team, partners, values

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/stats.json`
- Create: `src/content/values/values.json`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection, z } from "astro:content";
import { file, glob } from "astro/loaders";

const stats = defineCollection({
  loader: file("src/content/stats.json"),
  schema: z.object({
    id: z.string(),
    booksDelivered: z.number().int().positive(),
    schools: z.number().int().positive(),
    volunteerHours: z.number().int().positive(),
    asOf: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
});

// Per-entry schema (Astro's file() loader applies the schema to each entry, not the array).
const values = defineCollection({
  loader: file("src/content/values/values.json"),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    order: z.number().int(),
  }),
});

const programs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/programs" }),
  schema: z.object({
    name: z.string(),
    summary: z.string(),
    accentColor: z.enum(["gold", "teal", "red"]),
    order: z.number().int(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    bio: z.string(),
    order: z.number().int(),
    photo: z.string().optional(),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/partners" }),
  schema: z.object({
    name: z.string(),
    url: z.string().url().optional(),
    blurb: z.string(),
    order: z.number().int(),
  }),
});

export const collections = { stats, values, programs, team, partners };
```

- [ ] **Step 2: Seed `src/content/stats.json`** (wrapped in an array — Astro's `file()` loader treats each array element as one entry)

```json
[
  {
    "id": "current",
    "booksDelivered": 5000,
    "schools": 20,
    "volunteerHours": 200,
    "asOf": "2026-04-18"
  }
]
```

- [ ] **Step 3: Seed `src/content/values/values.json`**

```json
[
  { "id": "access", "name": "Access", "description": "Remove barriers to reading in underserved areas.", "order": 1 },
  { "id": "equity", "name": "Equity", "description": "Meet each child's unique needs fairly.", "order": 2 },
  { "id": "joy", "name": "Joy", "description": "Foster warmth and wonder around reading.", "order": 3 },
  { "id": "partnership", "name": "Partnership", "description": "Collaborate with nonprofits, schools, and hospitals.", "order": 4 },
  { "id": "future", "name": "Future", "description": "Invest in the lifelong benefits of literacy.", "order": 5 },
  { "id": "stewardship", "name": "Stewardship", "description": "Use our resources responsibly and efficiently.", "order": 6 }
]
```

- [ ] **Step 4: Verify the build picks up schemas**

Run: `npm run check`
Expected: exit 0, no type errors. (Astro will generate types for the collections.)

Run: `npm run build`
Expected: exit 0. May show "0 page(s) built" — that's fine; we still have only `index.astro`.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/
git commit -m "feat: define content collections (stats, values, programs, team, partners)"
```

---

## Task 5: Seed the three programs as markdown

**Files:**
- Create: `src/content/programs/hospital-bassinet-books.md`
- Create: `src/content/programs/school-partnerships.md`
- Create: `src/content/programs/community-drives.md`

- [ ] **Step 1: Create `src/content/programs/hospital-bassinet-books.md`**

```markdown
---
name: Hospital Bassinet Books
summary: A book in every newborn's going-home bag — partnering with hospitals to reach families at day one.
accentColor: gold
order: 1
---

We work with labor-and-delivery units to ensure every family leaving the hospital brings home a book — a tangible signal that reading is part of health from the start.
```

- [ ] **Step 2: Create `src/content/programs/school-partnerships.md`**

```markdown
---
name: School Partnerships
summary: Classroom libraries and home-reading kits for Title I schools in our network.
accentColor: teal
order: 2
---

Through partnerships with Marietta City Schools and others, we stock classroom libraries and send books home with students — especially over summer and winter breaks when reading gaps widen.
```

- [ ] **Step 3: Create `src/content/programs/community-drives.md`**

```markdown
---
name: Community Drives
summary: Anyone can host a drive. We provide the toolkit, signage, and pickup.
accentColor: red
order: 3
---

Corporate offices, faith communities, youth sports leagues — anyone with a waiting-room corner or a lobby can run a drive. We ship you the signage and a book donation bin, and we handle pickup when you're done.
```

- [ ] **Step 4: Verify**

Run: `npm run check`
Expected: no schema errors. If any program's frontmatter is malformed, the check fails loudly — that's by design.

- [ ] **Step 5: Commit**

```bash
git add src/content/programs/
git commit -m "feat: seed three programs as markdown content"
```

---

## Task 6: Build the `<Button />` component (TDD)

**Files:**
- Create: `src/components/Button.astro`
- Create: `tests/unit/Button.test.ts`

Astro components can't be unit-tested directly with Vitest, but we can test the class-resolution logic by extracting it into a plain function.

- [ ] **Step 1: Write the failing test**

```ts
// tests/unit/Button.test.ts
import { describe, it, expect } from "vitest";
import { buttonClasses } from "@/components/button-classes";

describe("buttonClasses", () => {
  it("returns primary variant classes by default", () => {
    const cls = buttonClasses({});
    expect(cls).toContain("bg-gold");
    expect(cls).toContain("text-brown");
  });

  it("returns secondary variant with brown outline", () => {
    const cls = buttonClasses({ variant: "secondary" });
    expect(cls).toContain("border-brown");
    expect(cls).not.toContain("bg-gold");
  });

  it("returns ghost variant with no border or background", () => {
    const cls = buttonClasses({ variant: "ghost" });
    expect(cls).not.toContain("bg-gold");
    expect(cls).not.toContain("border-brown");
  });

  it("always applies pill radius and padding", () => {
    const cls = buttonClasses({});
    expect(cls).toMatch(/rounded-\[999px\]|rounded-full/);
  });
});
```

- [ ] **Step 2: Run — should fail (module missing)**

Run: `npm test`
Expected: FAIL with "Failed to resolve import '@/components/button-classes'".

- [ ] **Step 3: Create `src/components/button-classes.ts`**

```ts
export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonOptions {
  variant?: ButtonVariant;
}

const BASE = "inline-flex items-center justify-center gap-2 font-semibold text-sm px-6 py-3 rounded-full transition-colors";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-gold text-brown hover:bg-gold/90",
  secondary: "border-[1.5px] border-brown text-brown hover:bg-brown hover:text-cream",
  ghost: "text-brown hover:underline",
};

export function buttonClasses({ variant = "primary" }: ButtonOptions = {}): string {
  return `${BASE} ${VARIANTS[variant]}`;
}
```

- [ ] **Step 4: Run — should pass**

Run: `npm test`
Expected: PASS, all 4 tests green.

- [ ] **Step 5: Create the Astro component `src/components/Button.astro`**

```astro
---
import { buttonClasses, type ButtonVariant } from "./button-classes";

interface Props {
  variant?: ButtonVariant;
  href?: string;
  type?: "button" | "submit";
  class?: string;
}

const { variant = "primary", href, type = "button", class: className = "" } = Astro.props;
const classes = `${buttonClasses({ variant })} ${className}`.trim();
---

{href ? (
  <a href={href} class={classes}><slot /></a>
) : (
  <button type={type} class={classes}><slot /></button>
)}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ tests/unit/Button.test.ts
git commit -m "feat: add Button component with variant tests"
```

---

## Task 7: Build the `<SEO />` component and `<BaseLayout />`

**Files:**
- Create: `src/components/SEO.astro`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/components/SEO.astro`**

```astro
---
import { SITE } from "@/lib/site";

interface Props {
  title?: string;
  description?: string;
  canonical?: string;
}

const {
  title = SITE.name,
  description = SITE.description,
  canonical,
} = Astro.props;

const fullTitle = title === SITE.name ? SITE.name : `${title} — ${SITE.name}`;
const canonicalUrl = canonical ?? new URL(Astro.url.pathname, SITE.url).toString();
---

<title>{fullTitle}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonicalUrl} />

<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:url" content={canonicalUrl} />
<meta property="og:type" content="website" />
<meta property="og:site_name" content={SITE.name} />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import "@/styles/global.css";
import SEO from "@/components/SEO.astro";
import Nav from "@/components/Nav.astro";
import Footer from "@/components/Footer.astro";

interface Props {
  title?: string;
  description?: string;
}

const { title, description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#FAF6EC" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <SEO title={title} description={description} />
  </head>
  <body class="bg-cream text-brown">
    <a href="#main" class="skip-link">Skip to main content</a>
    <Nav />
    <main id="main"><slot /></main>
    <Footer />
  </body>
</html>
```

(Nav and Footer are created in the next tasks — the build will temporarily fail until Task 9 is done. That's fine; we commit layout and SEO first.)

- [ ] **Step 3: Commit**

```bash
git add src/components/SEO.astro src/layouts/BaseLayout.astro
git commit -m "feat: add SEO component and BaseLayout"
```

---

## Task 8: Build the `<Nav />` component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Create `src/components/Nav.astro`**

```astro
---
import { SITE } from "@/lib/site";
import Button from "./Button.astro";

const pathname = Astro.url.pathname;
const isActive = (href: string) => pathname === href || pathname === `${href}/`;
---

<header class="border-b border-border-cream bg-cream">
  <nav class="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-5" aria-label="Primary">
    <a href="/" class="flex items-center gap-2 font-semibold text-brown no-underline">
      <span class="flex h-9 w-9 items-center justify-center rounded-md bg-gold font-bold text-brown">ER</span>
      <span class="hidden sm:inline text-[15px] tracking-[0.02em]">{SITE.name}</span>
    </a>
    <ul class="hidden items-center gap-6 md:flex text-sm text-brown list-none m-0 p-0">
      {SITE.nav.map((item) => (
        <li>
          <a
            href={item.href}
            class={`no-underline hover:underline ${isActive(item.href) ? "font-semibold" : ""}`}
            aria-current={isActive(item.href) ? "page" : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
    <Button href="/get-involved#donate" variant="primary">Donate</Button>
  </nav>
</header>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: add Nav component with active-link highlighting"
```

---

## Task 9: Build the `<Footer />` component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create `src/components/Footer.astro`**

```astro
---
import { SITE } from "@/lib/site";

const year = new Date().getFullYear();
---

<footer class="bg-brown text-cream">
  <div class="mx-auto grid max-w-[1200px] gap-10 px-6 py-16 md:grid-cols-4">
    <div>
      <div class="flex items-center gap-2">
        <span class="flex h-9 w-9 items-center justify-center rounded-md bg-gold font-bold text-brown">ER</span>
        <span class="font-semibold tracking-[0.02em]">{SITE.name}</span>
      </div>
      <p class="mt-4 max-w-xs text-sm leading-relaxed text-cream/80">
        A single book can open a lifetime of possibility. We exist to make that first book accessible to every child.
      </p>
    </div>

    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-gold">Site</p>
      <ul class="mt-4 space-y-2 text-sm list-none p-0">
        {SITE.nav.map((item) => (
          <li><a href={item.href} class="no-underline text-cream/90 hover:text-cream hover:underline">{item.label}</a></li>
        ))}
      </ul>
    </div>

    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-gold">Legal</p>
      <ul class="mt-4 space-y-2 text-sm list-none p-0">
        <li><a href="/privacy" class="no-underline text-cream/90 hover:text-cream hover:underline">Privacy Policy</a></li>
        <li><a href="/terms" class="no-underline text-cream/90 hover:text-cream hover:underline">Terms &amp; Conditions</a></li>
        <li><a href="/disclaimer" class="no-underline text-cream/90 hover:text-cream hover:underline">Disclaimer</a></li>
      </ul>
    </div>

    <div>
      <p class="text-xs uppercase tracking-[0.18em] text-gold">Contact</p>
      <ul class="mt-4 space-y-2 text-sm list-none p-0">
        <li><a href={`mailto:${SITE.contactEmail}`} class="no-underline text-cream/90 hover:text-cream hover:underline">{SITE.contactEmail}</a></li>
        <li><a href={SITE.socials.instagram} class="no-underline text-cream/90 hover:text-cream hover:underline" rel="noopener noreferrer" target="_blank">Instagram</a></li>
      </ul>
    </div>
  </div>

  <div class="border-t border-cream/10 px-6 py-6 text-center text-xs text-cream/70">
    <p>© 2022–{year} {SITE.name}, Inc. · 501(c)(3) nonprofit organization.</p>
    <p class="mt-1 mx-auto max-w-3xl leading-relaxed">
      Donations are voluntary and generally non-refundable. Online donations are processed securely via PayPal and subject to PayPal's terms.
      Use of this website constitutes acceptance of our Terms &amp; Conditions and Privacy Policy.
    </p>
  </div>
</footer>
```

- [ ] **Step 2: Verify the build succeeds now that Nav and Footer exist**

Run: `npm run build`
Expected: exit 0. (Index page still uses placeholder, but imports resolve.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add Footer component"
```

---

## Task 10: Build the `<StatBlock />`, `<SectionHeader />`, `<ProgramCard />`, and `<CtaSection />` components

**Files:**
- Create: `src/components/StatBlock.astro`
- Create: `src/components/SectionHeader.astro`
- Create: `src/components/ProgramCard.astro`
- Create: `src/components/CtaSection.astro`

- [ ] **Step 1: Create `src/components/StatBlock.astro`**

```astro
---
interface Props {
  value: string;
  label: string;
  color?: "gold" | "teal" | "brown";
}

const { value, label, color = "brown" } = Astro.props;

const COLOR_CLASS: Record<NonNullable<Props["color"]>, string> = {
  gold: "text-gold",
  teal: "text-teal",
  brown: "text-brown",
};
---

<div class="text-center">
  <div class={`font-serif text-4xl leading-none font-bold ${COLOR_CLASS[color]}`}>{value}</div>
  <div class="mt-2 text-sm text-muted-brown">{label}</div>
</div>
```

- [ ] **Step 2: Create `src/components/SectionHeader.astro`**

```astro
---
interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  eyebrowColor?: "gold" | "teal" | "brown";
  align?: "left" | "center";
}

const {
  eyebrow,
  title,
  description,
  eyebrowColor = "brown",
  align = "center",
} = Astro.props;

const EYEBROW_COLOR: Record<NonNullable<Props["eyebrowColor"]>, string> = {
  gold: "text-gold",
  teal: "text-teal",
  brown: "text-brown",
};

const alignClass = align === "center" ? "text-center mx-auto" : "";
---

<div class={`max-w-[700px] ${alignClass}`}>
  {eyebrow && (
    <p class={`text-xs font-semibold tracking-[0.18em] uppercase ${EYEBROW_COLOR[eyebrowColor]}`}>
      {eyebrow}
    </p>
  )}
  <h2 class="mt-3 text-2xl md:text-3xl leading-tight text-brown">{title}</h2>
  {description && <p class="mt-4 text-base leading-relaxed text-muted-brown font-serif">{description}</p>}
</div>
```

- [ ] **Step 3: Create `src/components/ProgramCard.astro`**

```astro
---
interface Props {
  name: string;
  summary: string;
  accentColor: "gold" | "teal" | "red";
}

const { name, summary, accentColor } = Astro.props;

const BORDER_COLOR: Record<Props["accentColor"], string> = {
  gold: "border-t-gold",
  teal: "border-t-teal",
  red: "border-t-[#C23F35]",
};
---

<article class={`rounded-lg bg-cream p-6 border-t-[3px] ${BORDER_COLOR[accentColor]}`}>
  <h3 class="text-lg font-bold text-brown">{name}</h3>
  <p class="mt-2 text-sm leading-relaxed text-muted-brown font-serif">{summary}</p>
</article>
```

- [ ] **Step 4: Create `src/components/CtaSection.astro`**

```astro
---
import Button from "./Button.astro";

interface Props {
  title: string;
  subtitle?: string;
  ctaLabel: string;
  ctaHref: string;
}

const { title, subtitle, ctaLabel, ctaHref } = Astro.props;
---

<section class="bg-brown text-cream py-16 px-6 text-center">
  <h2 class="text-2xl md:text-3xl font-bold text-cream">{title}</h2>
  {subtitle && <p class="mx-auto mt-3 max-w-xl text-base font-serif text-cream/80">{subtitle}</p>}
  <div class="mt-8">
    <Button variant="primary" href={ctaHref}>{ctaLabel}</Button>
  </div>
</section>
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add StatBlock, SectionHeader, ProgramCard, CtaSection components"
```

---

## Task 11: Build the home page

**Files:**
- Create (replace placeholder): `src/pages/index.astro`
- Create: `public/images/.gitkeep` (directory marker; real photos added later)

- [ ] **Step 1: Create `public/images/` directory**

```bash
mkdir -p public/images
touch public/images/.gitkeep
```

- [ ] **Step 2: Replace `src/pages/index.astro` with the full home page**

```astro
---
import { getCollection, getEntry } from "astro:content";
import BaseLayout from "@/layouts/BaseLayout.astro";
import Button from "@/components/Button.astro";
import StatBlock from "@/components/StatBlock.astro";
import SectionHeader from "@/components/SectionHeader.astro";
import ProgramCard from "@/components/ProgramCard.astro";
import CtaSection from "@/components/CtaSection.astro";

const statsEntry = await getEntry("stats", "current");
if (!statsEntry) throw new Error("stats:current content missing");
const stats = statsEntry.data;

const programs = (await getCollection("programs")).sort(
  (a, b) => a.data.order - b.data.order,
);

const partners = [
  "Book Nook Marietta",
  "Helping Mamas",
  "Marietta City Schools",
  "Moxie Burger",
  "Creating Space",
];
---

<BaseLayout
  title="Expedition Reading"
  description="A 501(c)(3) nonprofit placing books into the hands of children from birth onward, in partnership with hospitals, schools, and community organizations."
>
  {/* HERO */}
  <section class="bg-gradient-to-b from-cream to-[#F5EEDC] px-6 py-16 md:py-24">
    <div class="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.15fr_1fr] md:items-center">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B4B2E]">
          A 501(c)(3) Nonprofit · Atlanta, GA
        </p>
        <h1 class="mt-4 text-4xl md:text-5xl font-bold leading-[1.05] text-brown">
          Every child deserves a chance to learn.
        </h1>
        <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted-brown font-serif">
          We place books into the hands of children who need them most — from hospital bassinets to classrooms, from birth onward.
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <Button variant="primary" href="/get-involved#donate">Donate books &amp; funds →</Button>
          <Button variant="secondary" href="/partners">Partner with us</Button>
        </div>
      </div>
      <div class="relative">
        <div class="aspect-[4/3] w-full rounded-xl bg-[#D9D0B8] flex items-center justify-center text-[#8A7A5E] italic text-sm">
          <span>Photo: kids reading / book drive</span>
        </div>
      </div>
    </div>
  </section>

  {/* IMPACT STATS */}
  <section class="bg-paper border-t border-border-cream px-6 py-16">
    <div class="mx-auto max-w-[1200px]">
      <p class="text-center text-xs font-semibold uppercase tracking-[0.18em] text-teal">
        Our Impact So Far
      </p>
      <div class="mx-auto mt-8 grid max-w-[800px] grid-cols-1 gap-10 sm:grid-cols-3">
        <StatBlock value={`${stats.booksDelivered.toLocaleString()}+`} label="books delivered" color="gold" />
        <StatBlock value={`${stats.schools}+`} label="schools & communities" color="teal" />
        <StatBlock value={`${stats.volunteerHours}+`} label="volunteer hours" color="brown" />
      </div>
    </div>
  </section>

  {/* WHY EARLY LITERACY */}
  <section class="bg-cream px-6 py-16">
    <SectionHeader
      eyebrow="Why Early Literacy"
      title="Reading changes everything — and it starts earlier than you think."
      description="1 in 4 children in the U.S. grow up without learning to read. 90% of brain development happens before age 5. Early literacy interventions return 7–10× their cost in lifetime outcomes."
    />
  </section>

  {/* WHAT WE DO */}
  <section class="bg-paper border-t border-border-cream px-6 py-16">
    <div class="mx-auto max-w-[1200px]">
      <SectionHeader
        eyebrow="What We Do"
        title="Three programs, one mission"
      />
      <div class="mt-10 grid gap-5 md:grid-cols-3">
        {programs.map((p) => (
          <ProgramCard name={p.data.name} summary={p.data.summary} accentColor={p.data.accentColor} />
        ))}
      </div>
    </div>
  </section>

  {/* PARTNERS */}
  <section class="bg-cream px-6 py-10 text-center">
    <p class="text-xs font-semibold uppercase tracking-[0.18em] text-[#6B4B2E]">
      Trusted Partners
    </p>
    <div class="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-muted-brown font-serif italic opacity-70">
      {partners.map((p) => <span>{p}</span>)}
    </div>
  </section>

  {/* FINAL CTA */}
  <CtaSection
    title="One book opens a lifetime."
    subtitle="$20 puts a book in a child's hands. $100 equips a classroom shelf."
    ctaLabel="Donate now →"
    ctaHref="/get-involved#donate"
  />
</BaseLayout>
```

- [ ] **Step 3: Verify dev server renders the page correctly**

Run: `npm run dev`
Open: http://localhost:4321

Expected visual checks:
- Header with "ER" logo mark, five nav items on md+, gold "Donate" pill
- Hero with eyebrow, large serif headline, subhead, two buttons, placeholder photo box
- Three stats with gold / teal / brown numbers
- "Why Early Literacy" section with centered editorial paragraph
- Three program cards with gold / teal / red top borders
- Partner names in italic serif
- Dark brown final CTA with gold button
- Dark brown footer with four columns

Stop the dev server.

- [ ] **Step 4: Verify the production build**

Run: `npm run build`
Expected: exit 0. Should produce `dist/index.html` plus CSS/font assets.

Run: `npm run preview`
Open: http://localhost:4321
Expected: same visual as dev.

Stop the preview server.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro public/images/
git commit -m "feat: build home page matching approved design"
```

---

## Task 12: Add Playwright + axe-core smoke test for the home page

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/home.spec.ts`
- Modify: `.gitignore` (add test artifacts)

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4321",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
```

- [ ] **Step 2: Create `tests/e2e/home.spec.ts`**

```ts
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe("home page", () => {
  test("loads with the tagline H1 and both hero CTAs", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { level: 1, name: /every child deserves a chance to learn/i }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: /donate books.*funds/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /partner with us/i })).toBeVisible();
  });

  test("renders all three impact stats", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/5,000\+/)).toBeVisible();
    await expect(page.getByText(/20\+/)).toBeVisible();
    await expect(page.getByText(/200\+/)).toBeVisible();
  });

  test("renders all three program cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Hospital Bassinet Books" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "School Partnerships" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Community Drives" })).toBeVisible();
  });

  test("Donate buttons in nav and final CTA link to /get-involved#donate", async ({ page }) => {
    await page.goto("/");
    const donateLinks = page.getByRole("link", { name: /donate/i });
    const count = await donateLinks.count();
    expect(count).toBeGreaterThanOrEqual(2);
    for (let i = 0; i < count; i++) {
      const href = await donateLinks.nth(i).getAttribute("href");
      expect(href).toContain("/get-involved");
    }
  });

  test("emits no console errors on load", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(String(err)));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  test("has no serious/critical axe violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
```

- [ ] **Step 3: Update `.gitignore` to exclude Playwright artifacts**

Append to `.gitignore`:

```
# Testing
test-results/
playwright-report/
playwright/.cache/
```

- [ ] **Step 4: Install Playwright browsers**

Run: `npm run test:e2e:install`
Expected: downloads Chromium; exit 0.

- [ ] **Step 5: Build once so preview works**

Run: `npm run build`
Expected: exit 0.

- [ ] **Step 6: Run the e2e tests**

Run: `npm run test:e2e`
Expected: all 6 tests pass. If axe finds serious violations, the test prints them — fix before proceeding.

- [ ] **Step 7: Commit**

```bash
git add playwright.config.ts tests/e2e/ .gitignore
git commit -m "test: add Playwright smoke + axe a11y tests for home page"
```

---

## Task 13: Add GitHub Actions CI for type check, unit tests, and e2e tests

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    name: Type check & unit tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm test

  e2e:
    name: E2E + accessibility
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

- [ ] **Step 2: Commit**

```bash
git add .github/
git commit -m "ci: run type check, unit tests, and Playwright e2e on every PR"
```

---

## Task 14: Create the GitHub repo and push (user-assisted step)

**Files:** none

- [ ] **Step 1: Confirm with the user that the GitHub org/user is decided**

Ask the user: "Where should this repo live on GitHub? E.g., `expedition-reading/website` (under a new org) or `arjun-bansal/expedition-reading-website` (under your personal account)?"

- [ ] **Step 2: Create the repo via `gh` CLI**

Assuming the answer is `expedition-reading/website`:

```bash
gh repo create expedition-reading/website --private --source=. --remote=origin --description "Expedition Reading nonprofit website"
```

Expected: repo created; `origin` remote added.

- [ ] **Step 3: Push `main`**

```bash
git branch -M main
git push -u origin main
```

Expected: push succeeds; CI workflow starts.

- [ ] **Step 4: Confirm CI passes on the remote**

Run: `gh run list --limit 1`
Then: `gh run watch` to stream the latest run.
Expected: "check" and "e2e" jobs both succeed.

If either fails, fix locally, push, and watch again.

---

## Task 15: Deploy to Cloudflare Pages (staging) (user-assisted step)

**Files:** none (configuration done in Cloudflare dashboard + one repo file)
- Create: `public/_headers`

- [ ] **Step 1: Create `public/_headers`** with basic security headers

```
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

- [ ] **Step 2: Commit and push**

```bash
git add public/_headers
git commit -m "chore: add baseline security headers for Cloudflare Pages"
git push
```

- [ ] **Step 3: Guide the user through Cloudflare Pages setup**

Tell the user to perform these steps in the Cloudflare dashboard:

1. Go to **Workers & Pages → Create → Pages → Connect to Git**
2. Select the `expedition-reading/website` GitHub repo
3. Framework preset: **Astro**
4. Build command: `npm run build`
5. Build output directory: `dist`
6. Production branch: `main`
7. Environment variables: none needed for Phase 1
8. Click **Save and Deploy**

Expected: first deploy takes 2–3 min. Cloudflare assigns a URL like `expedition-reading.pages.dev` or similar.

- [ ] **Step 4: Verify the staging URL renders the home page**

Open the Cloudflare-provided URL.
Expected: home page looks identical to local `npm run preview`, with working fonts and images.

- [ ] **Step 5: Run Lighthouse in Chrome DevTools on the staging URL**

Expected: all four scores 95+ on mobile emulation. If any score drops below 95, investigate before advancing to Phase 2 — usually fixable with image optimization or an unused-CSS audit.

---

## Task 16: Phase 1 wrap-up

- [ ] **Step 1: Update `CLAUDE.md` Status and add the staging URL**

Edit `CLAUDE.md`:
- Change Status line to: `**Phase:** Phase 1 complete — home page live on staging. Phase 2 (remaining pages) pending.`
- Add under Status: `**Staging URL:** <paste Cloudflare Pages URL>`

- [ ] **Step 2: Commit the update**

```bash
git add CLAUDE.md
git commit -m "docs: mark Phase 1 complete, add staging URL"
git push
```

- [ ] **Step 3: Share the staging URL with the user**

Tell the user: "Phase 1 is complete. Home page is live at <URL>. Review it with the team, flag anything you want changed, and when you're ready say 'Phase 2' to plan the remaining 9 pages."

---

## Done criteria for Phase 1

Before marking this plan complete, verify every one of the below:

- `npm test` passes (all unit tests)
- `npm run test:e2e` passes (all Playwright + axe tests)
- `npm run check` passes (no TypeScript errors)
- `npm run build` produces a working `dist/` folder
- `npm run preview` shows the home page matching the approved mockup
- GitHub Actions CI is green on `main`
- The Cloudflare Pages staging URL serves the home page with no console errors
- Lighthouse (mobile) scores 95+ across all four categories on the staging URL
- No decorative "floating shapes" — all sections have deliberate content (per the spec's guardrails)
