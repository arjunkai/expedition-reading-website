# Expedition Reading — Website Redesign Spec

**Date:** 2026-04-18
**Status:** Approved, pending implementation
**Source of truth for:** tech stack, information architecture, brand system, content model, deployment, and acceptance criteria

## 1. Goal

Rebuild https://expeditionreading.org from scratch to:

1. **Establish credibility** with grant committees, school districts, and hospital partners. The current site looks amateur (broken rendering, decorative squiggles, empty gray bands) and actively harms the organization's positioning.
2. **Enable donations** as a clear secondary action on every page.
3. **Be editable without a developer** — content in Markdown, updated via GitHub web UI.
4. **Deploy and host for $0/month** on Cloudflare Pages.

Credibility is primary. Donations secondary. Volunteer/partner recruitment tertiary.

## 2. Non-goals

- A CMS UI (Sanity, Decap, WordPress) — not needed at this scale; adds ongoing cost and complexity.
- Custom donation processing — PayPal is already set up and handles tax receipts.
- A blog / news section at launch — can be added later if the team commits to publishing cadence.
- Multi-language support.
- User accounts, member portals, or gated content.
- Migrating any code, HTML, or styles from the current WordPress site. This is a ground-up rebuild.

## 3. Audience & jobs-to-be-done

| Audience | Job when visiting |
|---|---|
| Grant committee reviewer | Verify the org is legitimate, measure impact, understand programs |
| Hospital / school administrator | Evaluate whether to partner; understand the program offered |
| Prospective donor (individual) | Confirm 501(c)(3) status, feel the mission, donate in < 60 seconds |
| Prospective volunteer | Find out how to get involved and sign up |
| Local book-drive host | Download a toolkit and commit to hosting |
| Existing partner / press | Find contact info, logo downloads, stats for reports |

## 4. Information architecture

Seven primary pages plus three legal pages:

```
/                   Home — hero, impact stats, why early literacy, programs, partners, CTA
/about              Mission, origin story, six values, team (six people), 501(c)(3) info
/what-we-do         Three programs in depth
/impact             Stats + 3-4 story cards + annual snapshot
/partners           Partner logos + one-paragraph story each + "Become a partner" CTA
/get-involved       Donate · Host a Drive · Volunteer (three columns)
/contact            Email + form + mailing address + social

/privacy            Legal: privacy policy
/terms              Legal: terms and conditions
/disclaimer         Legal: website disclaimer
```

Navigation: About · What We Do · Impact · Partners · Get Involved, plus "Donate" pill in the header.
Footer: sitemap, legal links, contact, social, 501(c)(3) statement.

## 5. Brand system

### Palette — "Warm Editorial" (derived from logo)

| Token | Hex | Use |
|---|---|---|
| `gold` (primary) | `#E8A93B` | Buttons, accents, stat numbers, brand marks |
| `teal` (secondary) | `#2A9D8F` | Labels, secondary stats, partnership sections |
| `brown` (text / dark bg) | `#2B1D14` | Body text, footers, final CTA section |
| `cream` (background) | `#FAF6EC` | Default page background |
| `paper` (content bg) | `#FFFFFF` | Content cards, alternating sections |
| `muted-brown` (body text soft) | `#5B4B3E` | Secondary text |
| `border-cream` | `#E8DDC5` | Dividers on cream |
| `red` (reserved) | `#C23F35` | Illustration accents only — NOT for UI/CTAs |
| `sky` (reserved) | `#4FA3D1` | Illustration accents only — NOT for UI/CTAs |

Red and sky exist in the logo but are reserved for illustration accents so the UI feels calm and cohesive.

### Typography

- **Headings:** Fraunces (Google Fonts). Editorial serif, warm, high contrast.
- **Body & UI:** Inter (Google Fonts). Clean, highly legible at body sizes.
- **Self-host via `@fontsource/fraunces` and `@fontsource/inter`** for performance and privacy.
- Type scale (px): 12, 14, 16, 18, 22, 28, 36, 48, 64. No others.
- Line-height: 1.15 for display, 1.35 for headings, 1.55 for body.

### Spacing & layout

- Spacing scale (px): 4, 8, 16, 24, 40, 64, 96. No others.
- Max content width: 1200px. Prose max-width: 720px.
- Radius: 8px (cards), 999px (buttons / pills).
- Buttons: Primary = gold bg + brown text. Secondary = brown outline. Ghost = no border.
- Dark sections (footer, final CTA): brown bg + cream text.

### Brand guardrails — don't reintroduce old-site problems

- **No decorative floating shapes** — no `gw-svg-a` / `gw-svg-b` style squiggles.
- **No huge empty gradient bands** — every section has deliberate content.
- **No WordPress / Elementor artifacts** — do not port HTML from old site.
- **No more than two accent colors on a single page.**

### Voice & tone

Warm but credible. Grown-up nonprofit, not corporate, not cutesy. Short sentences. Lead with the child, not the org. Active voice. No buzzwords ("synergy", "empower", "unlock potential").

Example — the tagline: "Every child deserves a chance to learn." (Works.)
Counter-example: "Empowering tomorrow's leaders through literacy synergy." (Doesn't.)

## 6. Homepage structure (approved mockup)

Sections top-to-bottom:

1. **Nav bar** — logo, links, Donate pill
2. **Hero** — eyebrow ("A 501(c)(3) NONPROFIT · ATLANTA, GA"), headline, subhead, two CTAs (Donate / Partner), photo
3. **Impact stats** — 5,000+ books, 20+ schools, 200+ volunteer hours
4. **Why early literacy** — the three stats (1-in-4, 90%, 7–10x) as a single editorial paragraph
5. **What we do** — three program cards, each with a distinct color accent on the top border
6. **Partners strip** — partner names in italic serif
7. **Final CTA** — dark brown section with "One book opens a lifetime" + donation tier copy + gold button

## 7. Tech stack

| Layer | Choice | Reasoning |
|---|---|---|
| Framework | Astro 5 | Island architecture, ~0 JS by default, best-in-class DX for content sites |
| Language | TypeScript (strict) | Type-safe content schemas via Astro Content Collections |
| Styling | Tailwind CSS v4 | With tokens matching the brand palette; no ad-hoc styles |
| Content | Astro Content Collections (Markdown + frontmatter) | Typed, no CMS needed |
| Images | Astro `<Image />` / Sharp pipeline | Auto WebP, responsive srcsets |
| Forms | Cloudflare Pages Forms | Free, email-notification, no backend |
| Analytics | Cloudflare Web Analytics | Privacy-friendly, free, no cookie banner |
| Hosting | Cloudflare Pages | Free, GitHub-integrated, preview deploys per PR |
| DNS | Cloudflare | Free, one-click SSL |
| Donations | PayPal (existing) | Already issues tax receipts — don't rebuild |

## 8. Content model

All content lives in Markdown / JSON under `src/content/` with typed schemas. Non-technical team members edit via the GitHub web UI.

```
src/content/
├── stats.json              # { booksDelivered: 5000, schools: 20, volunteerHours: 200, asOf: "2026-04-18" }
├── team/
│   ├── mickey-bansal.md    # frontmatter: name, role, bio, photo, order
│   ├── alexina-mehta.md
│   ├── zenobia-jonesfoster.md
│   ├── arjun-bansal.md
│   ├── seniya-jonesfoster.md
│   └── nasani-jonesfoster.md
├── partners/
│   ├── book-nook-marietta.md
│   ├── helping-mamas.md
│   ├── marietta-city-schools.md
│   ├── moxie-burger.md
│   └── creating-space.md
├── programs/
│   ├── hospital-bassinet-books.md
│   ├── school-partnerships.md
│   └── community-drives.md
├── values/values.json      # [{ name, description, icon-key }] × 6
└── stories/*.md            # future: impact stories (empty at launch)
```

**Content collection schemas (Zod) enforce the shape** so a missing photo or misspelled role field fails the build loudly, not silently.

## 9. Pages & components

### Shared components

- `<Nav />` — sticky, logo + links + Donate pill
- `<Footer />` — sitemap, legal, contact, social, 501(c)(3) statement
- `<Button variant="primary|secondary|ghost" />`
- `<StatBlock number label accentColor />`
- `<SectionHeader eyebrow title description />`
- `<PersonCard person />` — name, role, bio, photo
- `<ProgramCard program accentColor />`
- `<PartnerRow partner />`
- `<CtaSection />` — dark brown final-CTA section
- `<SEO title description ogImage />` — head metadata per page

### Page components

One `.astro` file per route. Each pulls from Content Collections; no hardcoded copy.

## 10. Deployment & ops

- **Repo:** GitHub (new repo, `expedition-reading/website`)
- **Cloudflare Pages project:** connected to `main` branch
- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **Preview deploys:** auto-created on every PR
- **Custom domain:** `expeditionreading.org` + `www.expeditionreading.org` (redirect to apex)
- **DNS:** Cloudflare, nameservers updated at current registrar
- **SSL:** automatic via Cloudflare
- **Forms:** Cloudflare Pages Forms, submissions go to `contact@expeditionreading.org`
- **Analytics:** Cloudflare Web Analytics snippet on all pages
- **Robots / sitemap:** `@astrojs/sitemap` integration auto-generates `sitemap-index.xml`

## 11. Accessibility & performance targets

- **WCAG 2.1 AA** — verified with axe-core in CI
- **Lighthouse (mobile emulation):** 95+ on performance, accessibility, best practices, SEO (home + about + get-involved, measured by Lighthouse CI in GitHub Actions on every PR)
- **Core Web Vitals:** LCP < 1.5s, CLS < 0.05, INP < 200ms on 4G
- **Total home-page weight:** < 500KB excluding photos; photos lazy-loaded, WebP, responsive
- **Keyboard nav:** visible focus states on every interactive element
- **Skip-to-content link** at the top of every page
- **Semantic HTML** — `<main>`, `<nav>`, `<article>`, headings in order

## 12. Testing strategy

- **Content validation:** Zod schemas on Content Collections — build fails on shape violations.
- **Component tests:** Vitest + Testing Library for any component with branching logic (buttons with variants, nav with active state, stat blocks with formatting).
- **Visual regression / smoke:** Playwright test that loads every route, asserts the H1 exists, the Donate button is present, and no console errors.
- **Accessibility:** axe-core integrated in Playwright tests — zero serious violations.
- **Lighthouse CI:** runs on PR, asserts score thresholds above.

The project is mostly static content, so heavy unit testing would be busywork. Focus tests on: (a) content schemas, (b) any component with variants or state, (c) end-to-end smoke that every page renders.

## 13. SEO

- Per-page `<title>` and `<meta description>` via frontmatter + `<SEO />` component
- Open Graph + Twitter Card metadata with a branded OG image (gold bg + logo + tagline)
- JSON-LD `Organization` schema on home page (name, url, logo, sameAs socials, 501(c)(3))
- JSON-LD `NGO` schema on about page
- Sitemap + robots.txt auto-generated

## 14. Migration / cutover plan

1. Build new site on a staging subdomain (Cloudflare Pages default URL like `expedition-reading.pages.dev`).
2. Team review, content corrections, photo additions.
3. Schedule 15-min cutover window:
   - Export current WordPress legal pages (privacy / terms / disclaimer) as reference.
   - Move DNS nameservers to Cloudflare.
   - Attach `expeditionreading.org` to Cloudflare Pages project.
   - Verify SSL active, all routes 200.
   - Redirect old WordPress URLs to new routes via `_redirects` file:
     ```
     /about-us          /about       301
     /what-we-do        /what-we-do  301
     /privacy-policy-2  /privacy     301
     /terms-and-conditions /terms    301
     /website-disclaimer /disclaimer 301
     ```
4. Keep old WordPress host paid and accessible for 30 days post-cutover (do not delete data). DNS can't be trivially rolled back once nameservers move, so the rollback path is "restore a subdomain and re-point DNS", which needs the old host intact.
5. Cancel old hosting after 30 days of clean analytics and no team objections.

## 15. Post-launch polish (tracked, not in scope)

- Run the user's `/polish` skill (location TBD) once the build is live.
- Commission real photography (kids reading, book drives, hospital partnerships) — until then, use the 4 photos from the old site.
- Add impact stories as they accumulate.
- Consider adding a News/Blog if the team commits to monthly posts.

## 16. Acceptance criteria (how we know we're done)

- All 10 routes render with real content, not lorem ipsum.
- Lighthouse scores ≥ 95 on home / about / get-involved.
- Zero axe-core serious violations on all routes.
- Donate button reaches PayPal checkout successfully.
- Contact / volunteer / host-a-drive form submissions arrive at `contact@expeditionreading.org`.
- `expeditionreading.org` resolves via Cloudflare, SSL green.
- GitHub → main push triggers auto-deploy, live in < 2 min.
- All five old WordPress URLs 301-redirect to their new counterparts.
- Arjun (COO) can edit a team member's bio via the GitHub web UI without developer help.
