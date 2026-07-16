# Explorer Homes and Properties — Website

A static marketing site for **Explorer Homes and Properties Limited**, a real estate
company in Lagos/Ogun State, Nigeria. Built with semantic HTML partials, Tailwind CSS
(compiled via the Tailwind CLI — no CDN/Play build), and vanilla JavaScript.

## Structure

```
ehp-site/
├── package.json              # tailwindcss v4 + @tailwindcss/cli (no config file)
├── src/
│   ├── input.css             # Tailwind v4 CSS-first config: @theme tokens, @source, @layer components
│   ├── index.template.html   # page shell with <!--@include file.html--> markers
│   ├── build.js              # assembles partials -> dist/index.html
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
└── dist/                     # generated output — deploy this folder as-is
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
