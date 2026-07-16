# Explorer Homes and Properties — Website

A static marketing site for **Explorer Homes and Properties Limited**, a real estate
company in Lagos/Ogun State, Nigeria. Built with semantic HTML partials, Tailwind CSS
(compiled via the Tailwind CLI — no CDN/Play build), and vanilla JavaScript.

## Structure

```
ehp-site/
├── .github/workflows/deploy.yml  # GitHub Actions: build + deploy dist/ to Pages
├── .gitignore                # ignores node_modules/ and generated dist/
├── package.json              # tailwindcss v4 + @tailwindcss/cli (no config file)
├── public/                   # static passthrough assets, copied into dist/ as-is
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── site.webmanifest
│   └── images/favicon.svg
│   # (add a CNAME file here later if/when you set up a custom domain — see below)
├── src/
│   ├── input.css             # Tailwind v4 CSS-first config: @theme tokens, @source, @layer components
│   ├── index.template.html   # page shell with <!--@include file.html--> markers
│   ├── build.js              # assembles partials -> dist/index.html, copies public/ -> dist/
│   ├── js/main.js            # menu, filters, FAQ accordion, testimonial slider, reveal-on-scroll
│   └── partials/
│       ├── head.html         # SEO meta, Open Graph, Twitter cards, JSON-LD (RealEstateAgent + FAQPage)
│       ├── header.html
│       ├── hero.html
│       ├── intro.html
│       ├── properties.html   # "Our Estates" filterable grid
│       ├── projects.html
│       ├── agents.html
│       ├── testimonials.html
│       ├── faq.html
│       ├── cta.html
│       └── footer.html
└── dist/                     # generated output (git-ignored) — deploy this folder as-is
    ├── index.html
    ├── css/output.css
    ├── js/main.js
    ├── images/favicon.svg
    ├── robots.txt
    ├── sitemap.xml
    └── site.webmanifest
```

## Tailwind CSS v4 — no config file

This project uses **Tailwind CSS v4**, which replaces `tailwind.config.js` with
CSS-native configuration directly in `src/input.css`:

- `@import "tailwindcss";` replaces the old `@tailwind base/components/utilities;` trio.
- `@theme { ... }` defines all brand design tokens (forest green / gold / cream
  palette, fonts, shadows, animations) as CSS custom properties — these
  automatically generate matching utility classes (e.g. `--color-forest-700`
  → `bg-forest-700`, `text-forest-700`, etc.).
- `@source "./partials";` (and similar lines) explicitly tell Tailwind's
  automatic content scanner where to look for class names, since the partials
  live in a few different directories.
- `@utility` defines small custom utilities (`max-w-8xl`, `tracking-widest2`)
  that don't map to a theme token.
- `@plugin "@tailwindcss/typography";` loads the typography plugin — no
  `plugins: []` array needed.
- The CLI itself now ships as the separate `@tailwindcss/cli` package (the
  `tailwindcss` package is the engine only), both installed as devDependencies.

There is no `tailwind.config.js` or `postcss.config.js` in this project —
everything Tailwind needs lives in `src/input.css`.

## Deploying to GitHub Pages

`dist/` is a **generated** folder (it's git-ignored), so GitHub Pages can't just
serve it off the `main` branch directly — Pages needs files at the repo root,
in `/docs`, or on a `gh-pages` branch. The included workflow
(`.github/workflows/deploy.yml`) handles this automatically:

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages → Build and deployment → Source**
   and choose **GitHub Actions** (not "Deploy from a branch").
3. Push to `main` (or run the workflow manually from the **Actions** tab).
   The workflow runs `npm ci && npm run build`, then uploads `dist/` as the
   Pages artifact and deploys it — no manual copying of files needed.
4. Your site will be live at `https://<username>.github.io/<repo>/` (or your
   custom domain, see below).

**Asset paths:** all CSS/JS/image references use **relative paths**
(`css/output.css`, `js/main.js`, `images/favicon.svg`, etc.), so the site works
correctly out of the box on a GitHub *project page*
(`https://<username>.github.io/<repo>/`) with no custom domain needed.

### Adding a custom domain later

When you're ready to point a real domain (e.g. `www.explorerhomesandproperties.com`)
at this site, the relative asset paths above need no changes — only these steps:

1. Add a `CNAME` file to `public/CNAME` containing just your domain, e.g.:
   ```
   www.explorerhomesandproperties.com
   ```
   (`build.js` copies everything in `public/` into `dist/` automatically, so it
   will be included in the next deploy.)
2. At your DNS provider, add either:
   - a `CNAME` record for `www` → `<username>.github.io`, or
   - `A` records for the apex domain pointing to GitHub's Pages IPs
     (`185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`),
   per [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. In the repo's **Settings → Pages**, enter the custom domain and enable
   **Enforce HTTPS** once DNS has propagated.
4. Update the absolute URLs that reference the production domain — the
   `canonical`, Open Graph/Twitter `og:url`/`og:image` tags and JSON-LD in
   `src/partials/head.html`, plus `public/robots.txt` and `public/sitemap.xml`
   — so they point at your live domain rather than the placeholder
   `explorerhomesandproperties.com` URLs currently in place.

## Build

```bash
npm install
npm run build       # assembles partials + compiles/minifies Tailwind CSS into dist/
```

During development:

```bash
npm run dev          # rebuilds HTML once, then watches & recompiles CSS
```

Then serve `dist/` with any static file server, e.g. `npx serve dist`.

## Editing content

Edit the relevant file in `src/partials/`, then re-run `npm run build`. The
build script (`src/build.js`) replaces each `<!--@include name.html-->` marker
in `src/index.template.html` with the matching partial and writes the result
to `dist/index.html` — no templating framework required.

## SEO notes

- Unique `<title>` and meta description, canonical URL, Open Graph + Twitter
  card tags, and `robots` directives live in `src/partials/head.html`.
- Structured data: `RealEstateAgent` (organization/address/service area) and
  `FAQPage` (mirrors the on-page FAQ accordion) JSON-LD blocks.
- `dist/sitemap.xml` and `dist/robots.txt` are included; update the domain if
  you deploy elsewhere.
- All images use descriptive `alt` text; decorative images use empty `alt`.
- Semantic landmarks (`header`, `main`, `footer`, `nav`) and a skip-to-content
  link are included for accessibility, which also benefits SEO crawlability.

## Placeholders to replace before launch

- Phone number, email and office address in `header.html` / `footer.html` / `head.html` JSON-LD.
- Team member photos/names in `agents.html` (currently representative placeholders).
- Hero, estate and project photography (currently Unsplash stock placeholders) —
  swap in real site/estate photography.
- Social links (Facebook/Instagram/YouTube) in `footer.html`.
