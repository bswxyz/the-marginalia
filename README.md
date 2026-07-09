# The Marginalia

**Live:** https://bswxyz.github.io/the-marginalia/ · **Build notes:** https://bswxyz.github.io/the-marginalia/guide/

An independent literary magazine where the margin is the interface — live, scroll-synced margin
notes beside every essay. Part of the [Parable 25 design showcase](https://bswxyz.github.io/fable-hub/).

---

## The concept

The Marginalia is a quarterly of essays, criticism and letters built on one editorial principle:
the best readers write back. The site elevates the margin note to the product itself. Every essay
is set in a wide-margined, long-read layout where the authors' asides and the editor's corrections
live in the outer margin and *wake up* as their anchor paragraph scrolls into the reading band.
The homepage is Issue № 14: a masthead with its own margin note, an interactive table of contents
that previews each essay's opening line in the margin, a featured pull with a drop cap, letters
to the editor, a colophon, and a subscribe card whose fine print sits — where else — in the margin.

## Design system

- **Palette (warm paper):** `--bg:#efe9dd` paper · `--ink:#201c17` · `--dim:#5c5346` ·
  `--faint:#8d857a` (decorative only) · `--oxblood:#7a2233` the single accent (8.2:1 on paper,
  AAA for body text) · `--line:rgba(32,28,23,.14)`. Paper texture is an SVG `feTurbulence`
  data-URI multiply-blended at 6%, inside a fixed hairline frame — the whole site sits on a
  printed page. No images anywhere; the texture is typographic.
- **Type:** `Fraunces` Black at high optical size (display, tight leading) · `Spectral` for essay
  body at ~1.2rem/1.72 · `IBM Plex Mono` for folios, bylines, rubrics and issue numbers.
- **Signature easing:** `--ease-page: cubic-bezier(.3,.86,.34,1)` — a page turn that lands softly.
- **Details:** drop caps (`initial-letter` with a `::first-letter` float fallback), the classical
  reference-mark sequence (* † ‡ § ‖ ¶), a 2px oxblood reading-progress hairline, an end-of-essay
  asterism (⁂).

## Stack

- **[Astro 5](https://astro.build)** with a typed content collection — the five essays are
  markdown files in `src/content/essays/` with a zod schema (title, dek, section, reading time,
  opening line, and the margin notes keyed by id). `[[noteId]]` anchors in the body attach each
  note to its sentence; a ~50-line renderer (`src/lib/essay.ts`) turns paragraphs into grid rows
  that carry their notes beside them. Chosen because this is the most content-native site of the
  set: one layout, five entries, zero client framework — Astro ships it as pure HTML/CSS plus
  ~2 KB of vanilla JS for the sync, the TOC rail and the progress bar.
- Google Fonts (Fraunces, Spectral, IBM Plex Mono). No other dependencies.

## Running it locally

```bash
git clone https://github.com/bswxyz/the-marginalia
cd the-marginalia
npm install
npm run dev        # dev server at localhost:4321/the-marginalia/
npm run build      # static build into ./docs
```

## Structure

```
astro.config.mjs              site/base/outDir — GitHub Pages serves main + /docs
src/content.config.ts         essay schema (incl. margin notes as a typed record)
src/content/essays/*.md       Issue № 14 — five essays with [[note]] anchors
src/lib/essay.ts              paragraph/anchor renderer (the marginalia engine)
src/layouts/Base.astro        paper background, header, footer, reveal observer
src/pages/index.astro         the issue: masthead · TOC + rail · featured · letters · subscribe
src/pages/essays/[slug].astro essay layout: margin notes, drop cap, progress, pager
src/pages/guide.astro         how it was built, with the real code
src/styles/global.css         all tokens and styling — design tokens in :root at the top
docs/                         the built site (committed, served by Pages)
```

## Demo vs. real — what a production version would need

This is an intentionally-scoped demo. What's **fictional/mocked** today:

- **The magazine itself is fictional.** Issue № 14, all five essays, every author, both letters
  and the colophon are invented for the showcase (each essay is a real 3-paragraph opening, not
  lorem — but there is no rest-of-essay behind it).
- **Subscribe is an intercepted form.** Nothing is sent; a real magazine needs a payments/
  fulfilment stack (Stripe + a subscriber CRM) and a transactional email path.
- **No CMS.** Essays are markdown in the repo — fine for a small masthead, but a production
  editorial flow wants drafts, roles and scheduling (a headless CMS feeding the same collection
  schema would slot in cleanly).
- **No search, no archive.** One issue exists; a real quarterly needs an issue index, tag/author
  archives (both easy wins for Astro's content layer) and full-text search.
- **No comments/annotation by actual readers** — ironically. A real Marginalia might let
  subscribers leave margin notes; that's accounts, moderation and a database.

What's **real** and reusable as-is: the entire margin-note system (schema → anchors → grid rows →
IntersectionObserver sync → mobile footnote fold with correct ARIA), the typographic system, the
TOC rail preview, the progress hairline, and the full responsive/reduced-motion/keyboard layer.

## License

[MIT](LICENSE). Design & build by **Parable** (Anthropic's Claude). All essays, authors and
correspondence are fictional; any resemblance to real magazines, living or defunct, is affection.
