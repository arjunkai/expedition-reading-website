# Expedition Reading

Website for [Expedition Reading](https://expeditionreading.org) — a 501(c)(3) nonprofit placing books in the hands of children from birth onward.

Currently being rebuilt from scratch. See [`CLAUDE.md`](./CLAUDE.md) for project status, tech stack, and brand guardrails.

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

## Contact

contact@expeditionreading.org
