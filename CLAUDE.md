# Expedition Reading — Website Redesign

Rebuild of https://expeditionreading.org from scratch. Nonprofit (501(c)(3)) founded 2022, mission: place books in the hands of children from birth onward.

## Status

**Phase:** Phase 1 deployed — site live at https://expeditionreading.org (apex + www, SSL enabled via Cloudflare Pages).
**Next steps:** Phase 2 — content + polish pass on the remaining pages (about, impact, what-we-do, get-involved, partners, contact are scaffolded).
**Live URL:** https://expeditionreading.org

Phase 1 delivers: working home page (bg-cream, gold/teal/brown editorial palette, all content from Content Collections), Playwright + axe e2e tests passing, GitHub Actions CI green locally, WCAG AA contrast compliant.

## Tech Stack (locked, implemented)

- **Framework:** Astro 5.18.1 + TypeScript (strict) + Tailwind CSS v4
- **Hosting:** Cloudflare Pages (static) — via `public/_headers` for security headers
- **Content:** Astro Content Collections (Zod-validated) under `src/content/`
- **Fonts:** Self-hosted Fraunces (serif, headings) + Inter (sans, UI) via `@fontsource`
- **Testing:** Vitest (unit) + Playwright + `@axe-core/playwright` (e2e + a11y)
- **CI:** GitHub Actions (`.github/workflows/ci.yml`) — runs type check, unit, e2e + axe
- **Deploy:** Cloudflare Pages, auto-deploys from `main`
- **Donations:** PayPal (existing, linked from `/get-involved#donate`)
- **DNS:** Cloudflare (to be configured in Phase 3 cutover)

## Commands

```bash
npm run dev          # http://localhost:4321 with HMR
npm run build        # static output to dist/
npm run preview      # serve dist/ at localhost:4321
npm run check        # astro check + tsc --noEmit
npm test             # Vitest unit tests
npm run test:e2e     # Playwright + axe (requires prior build)
npm run test:e2e:install   # install Playwright Chromium (one-time)
```

## Brand (locked)

- **Palette:** "Warm Editorial" direction — derived from logo
  - Gold primary: `#E8A93B` (buttons, accents, dark-bg text)
  - Teal secondary: `#2A9D8F` (accents, dark-bg text)
  - Dark brown (text / nav / dark sections): `#2B1D14`
  - Cream background: `#FAF6EC`
  - White for content sections: `#FFFFFF`
- **Accessibility-safe text variants** (WCAG AA on light backgrounds):
  - `text-gold-text` = `#8A5F1C` (5.55:1 on white) — use for text on white/cream
  - `text-teal-text` = `#1E7265` (4.79:1 on white) — use for text on white/cream
  - The bright brand gold/teal remain for buttons, dark sections, and decorative fills only
- **Typography:** Serif headings (Georgia-family or similar), sans for UI/navigation
- **Voice:** Warm but credible — grown-up nonprofit, not corporate, not cutesy

## Critical guardrails — don't reintroduce old-site problems

- **No decorative floating shapes** (the old site scattered `gw-svg-a.png` / `gw-svg-b.png` squiggles that looked amateur)
- **No huge empty gradient bands** (the old home page had 800px+ gray blocks where sections failed to render)
- **No WordPress/Elementor artifacts** (we're rebuilding in Astro; do not port HTML scraped from the old site verbatim)
- **Every section earns its place** — if it's on the page, it's deliberate

## Team (for about-page content)

- Dr. Mickey Bansal — CEO, Co-Founder (physician)
- Dr. Alexina Mehta — CFO, Co-Founder (physician, health-equity focus)
- Dr. Zenobia JonesFoster — Co-Founder (hospital medicine physician)
- Arjun Bansal — COO, Co-Founder (high-school junior) **← user**
- Seniya JonesFoster — Director, Co-Founder (9th grade)
- Nasani JonesFoster — Assistant Director, Co-Founder (7th grade)

## Partners (for partners page)

Book Nook Marietta · Helping Mamas · Marietta City Schools · Moxie Burger · Creating Space

## Impact stats (as of scrape, 2026-04-18)

- 5,000+ books delivered
- 200+ volunteer hours
- 20+ schools & communities reached

Update these in one place (`src/content/stats.json` or similar) so copy changes don't require code changes.

## Working directories

- `.assets/` — downloaded logos & reference images from old site (gitignored)
- `.screenshots/` — screenshots of current site for reference (gitignored)
- `.superpowers/` — brainstorming session state, visual mockups (gitignored)
- `.firecrawl/` — if we use firecrawl later (gitignored)
- `.playwright-mcp/` — Playwright MCP state (gitignored)
- `docs/superpowers/specs/` — design spec (source of truth once written)
- `docs/superpowers/plans/` — implementation plan

## Commands (will be added when project scaffolded)

- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build
- `npm run check` — Astro + TypeScript check
- Deploy: automatic via Cloudflare Pages on push to `main`

## Conventions (to be enforced once codebase exists)

- Content in Markdown under `src/content/` — never hardcode page copy in components
- One component = one file, co-located with tests when present
- Use Tailwind tokens, not ad-hoc `style=` values, except for one-off marketing flourishes
- Images optimized via Astro's `<Image />` — no raw `<img>` for content photos
- Accessibility: semantic HTML, skip-to-content link, visible focus states, WCAG AA contrast

## External references

- Old site (reference only, not a rebuild target): https://expeditionreading.org
- Logo source: `.assets/ER_header_logo.png`
- Brainstorming visual companion: check `.superpowers/brainstorm/*/state/server-info` for URL if a session is running

## Pitfalls specific to Windows / this environment

- Shell is bash, but OS is Windows — use forward slashes in paths, `/dev/null` not `NUL`
- Background processes: pass `run_in_background: true` on the Bash tool, don't rely on `&`
