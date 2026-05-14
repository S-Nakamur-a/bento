# bento

> **Reader-perspective documents, in HTML or Markdown.**
> The plugin's job is to write *for someone specific* with the prose discipline of a careful writer.
> The output format follows: HTML when the reader will open it in a browser and sit with it; Markdown when the reader will paste it into a wiki, a README, or another LLM.

Two slash commands share the same researcher, the same reader-perspective profiles, and the same writing-style / readability discipline. They differ only in the final author:

- **`/bento:html`** writes a self-contained `.html` file using the bento CSS/JS framework (loaded from a CDN). Token premium over Markdown, paid back in typography, callouts, charts, comparison tables, mermaid diagrams, multi-column layouts, and reading rhythm in the browser and in print.
- **`/bento:markdown`** writes a plain `.md` file. No HTML, no framework, no component classes — just BLUF, parallel headings, well-shaped paragraphs, and Markdown tables / blockquotes / code fences where the brief asks for visual structure.

Like a real bento, each compartment is neatly framed and the whole tray composes into something that looks intentional, not improvised — whether it lands as HTML or Markdown.

**When to pick which** — see the "When to pick which" section below, or `skills/bento/SKILL.md` for the longer HTML-side reasoning.

## Repository layout

```
bento/
├── .claude-plugin/        # plugin / marketplace manifests
├── commands/
│   ├── html.md            # /bento:html      — HTML orchestrator
│   └── markdown.md        # /bento:markdown  — plain-Markdown orchestrator
├── agents/
│   ├── bento-researcher.md       # produces the format-agnostic content brief
│   ├── bento-html-author.md      # writes the final HTML
│   └── bento-markdown-author.md  # writes a plain .md (no HTML, no components)
├── skills/bento/
│   ├── SKILL.md           # HTML component catalogue + skeleton (HTML path only)
│   ├── writing-style.md   # prose discipline: AI-tells to avoid (EN + JA)
│   ├── readability.md     # document discipline: structure, hierarchy, component choice
│   ├── token.md           # cost discipline: shortcut catalogue, when to skip bento (HTML)
│   ├── perspectives/      # reader-profile presets (engineer / product / executive / newcomer / customer)
│   ├── assets/
│   │   ├── bento.css      # core framework (typography, cards, callouts, stats, ...)
│   │   ├── bento.js       # lazy-loads marked / mermaid / chart.js / highlight.js / katex
│   │   └── themes/        # editorial / mono / playful (dark lives inside bento.css)
│   ├── templates/
│   │   └── starter.html
│   └── examples/
│       ├── report.html         # full feature showcase — open this first
│       ├── compact-forms.html  # every token-efficient shortcut in one document
│       ├── writing-style.html  # cross-references (xref / related) in action
│       └── playground.html     # Custom Editing Interface: form + sidebar + copy
└── README.md
```

## Install

### As a Claude Code plugin (recommended)

```
/plugin marketplace add S-Nakamur-a/bento
/plugin install bento
```

Once installed, you have two commands:

```
/bento:html      <topic> [for <audience>]   # styled, single-file HTML
/bento:markdown  <topic> [for <audience>]   # plain Markdown (.md)
```

Both share the same orchestration: parse the topic and the reader, dispatch the researcher, then the format-specific author.

- `bento-researcher` reads the writing-style and readability guides plus the chosen perspective profile, gathers material from any sources you pass, and returns a Markdown content brief. The brief is format-agnostic — its visual suggestions use bento class names as shorthand for shapes (`bx-compare` table, `bx-callout` blockquote, `bx-mermaid` flow).
- `bento-html-author` turns the brief into a single self-contained `.html` file using the bento CSS/JS framework, the skeleton, and the component vocabulary.
- `bento-markdown-author` turns the same brief into a `.md` file using only the writing-style and readability discipline — no HTML, no bento classes. It translates the brief's bento-shape shorthand to Markdown equivalents: tables, blockquotes, fenced `mermaid` code blocks, numbered lists.

Example calls:

```
/bento:html リポジトリ概要 for engineers
/bento:html Q3 status for executives
/bento:markdown 新人向けのオンボーディングメモ for newcomers
/bento:markdown release notes for customers
```

If you instead ask for a pretty HTML report in normal conversation (`美しい資料を作って`, `give me a shareable HTML report on X`), the `bento` skill auto-activates and runs the HTML flow inline. The Markdown path is slash-command only — it does not auto-activate.

### When to pick which

- **`/bento:html`** — the reader will open the file in a browser, share it, print it, return to it. Worth the token premium (skeleton, framework links, component wrappers) when typography, charts, callouts, and layout do real work for the reader.
- **`/bento:markdown`** — the output goes into a wiki, a GitHub README, a Notion page, a chat, or feeds another LLM. The visual framework would be pure overhead; what you want is the BLUF, the heading hierarchy, the perspective-shaped prose, in portable Markdown.

### Reader perspectives

bento ships five built-in reader profiles under `skills/bento/perspectives/`:

| Slug | For |
| --- | --- |
| `engineer` | developers, SRE, platform engineers |
| `product` | PMs, designers, business stakeholders |
| `executive` | leadership, sponsors |
| `newcomer` | new joiners, onboarding readers |
| `customer` | external users, paying customers |

Each profile sets `preferred_components`, `tone_notes`, and an example opening so the researcher and author know what shape of output lands for that reader. Profiles are shared between `/bento:html` and `/bento:markdown`: the HTML author reads `preferred_components` as bento classes; the Markdown author reads them as shape hints (`bx-compare` → Markdown table, `bx-callout` → blockquote). When either command runs with a new audience that does not match a profile, the researcher drafts a new one and the command offers to save it as `perspectives/<slug>.md` for future runs.

### Manual / one-shot use

Any HTML file can opt in by adding two lines:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.css">
<script src="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.js" defer></script>
```

then wrapping its content in `<body class="bx"><main class="bx-doc">…</main></body>`.

## Themes

```html
<body class="bx" data-theme="dark">       <!-- built-in -->
<body class="bx" data-theme="editorial">  <!-- loads themes/editorial.css -->
<body class="bx" data-theme="mono">
<body class="bx" data-theme="playful">
```

To use one of the optional themes, also include its stylesheet:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/themes/editorial.css">
```

## Per-project preferences

Drop a `.claude/bento.local.md` at your project root and bento reads it before every generation, treating its contents as the highest-priority style overrides. YAML frontmatter holds structured preferences (theme, voice, language, em-dash tolerance, preferred/avoided components), markdown body holds free-form rules.

```markdown
---
theme: editorial
voice: terse
em_dash: 0
avoided_visuals: [bx-mermaid]
---

- 結論を最初に出してほしい
- emoji は使わない
```

When you give the skill stylistic feedback (e.g. "もっと短く", "em-dash やめて"), it offers once to save the rule into this file. See `skills/bento/SKILL.md` → `## Preferences` for the full spec.

## Customizing on the fly

Every visual aspect is a CSS custom property. Override in a single `<style>` block:

```html
<style>
  .bx {
    --bx-accent: #d23669;
    --bx-bg: #fffaf3;
    --bx-font-sans: "Hiragino Sans", system-ui, sans-serif;
    --bx-max-width: 80ch;
    --bx-radius: 0;
  }
</style>
```

Full token list at the top of `skills/bento/assets/bento.css`.

## Components at a glance

| Class | Purpose |
| --- | --- |
| `.bx-doc` | reading column wrapper |
| `.bx-hero` + `.bx-lead` | document header |
| `.bx-grid` + `.bx-card` | card layouts (2–6 columns, auto-responsive) |
| `.bx-split` | 2-column side-by-side |
| `.bx-sidebar` (`data-side`, `data-ratio`) | asymmetric narrow+wide for editors / palettes |
| `.bx-stat` | KPI tile |
| `.bx-badge--*` | inline labels (primary/success/warn/danger/muted) |
| `.bx-callout--*` | info/note/tip/success/warn/danger |
| `.bx-steps` | numbered procedure list |
| `.bx-timeline` | event timeline with date markers |
| `.bx-compare` table | comparison table with checkmark styling |
| `.bx-toc` (empty `<nav>`) | auto-built table of contents |
| `.bx-xref`, `.bx-related` | inline jump links and "see also" blocks (auto-fill from headings) |
| `.bx-btn` (`--primary/--danger/--ghost`, `--sm/--lg`) | opt-in button styling |
| `<input>`, `<select>`, `<textarea>`, `<fieldset>` | styled out of the box — no class needed |
| `.bx-field` | label + control + help-text group |
| `.bx-illust` | SVG wrapper; `currentColor` follows the theme accent |
| `.bx-copy` | "Copy as X" button (`data-copy-from="#id"` or `data-copy-text=…`) |
| `.bx-mermaid` | mermaid diagram block (auto-rendered) |
| `.bx-chart` (data-* driven) | bar / line / doughnut / radar (Chart.js) |
| `<pre><code class="language-…">` | auto-highlighted (highlight.js) |
| `\(…\)` `\[…\]` | LaTeX math (KaTeX) |

See `skills/bento/SKILL.md` for the full reference Claude uses, and `skills/bento/examples/report.html` for live examples of everything.

## The token trade-off

bento is not free. Compared to plain Markdown:

- The skill itself costs tokens to load (one-time per session; cached on subsequent turns)
- Each document carries a skeleton (doctype, framework `<link>`/`<script>`, body wrappers)
- Each visual component carries some shell markup
- All visual definitions live in CDN-cached files (**0 output tokens**)

That premium buys typography, structured visuals, responsive layout, and reading rhythm Markdown can't give. The trade is worth it **when a human will read carefully** — and only then. For ephemeral or LLM-bound output, plain Markdown is the right call; see `skills/bento/SKILL.md` for the when-to-use list.

For the documents that do earn the tokens, the framework keeps the markup tax small with a few shortcuts:

- **Markdown islands**: `<section data-md>…markdown…</section>` lets you write prose-heavy regions as plain Markdown
- **Semantic-attribute components**: `<aside data-tone="info">`, `<span data-tone="primary">`, `<button data-variant="primary">` replace the longer BEM classes
- **Bare `<article>`** inside `.bx-grid` is styled as a card
- **Compact chart data**: `data-labels="A,B,C"` works alongside JSON arrays
- **Modifier-only classes**: `bx-callout--info` works without also writing `bx-callout`
- **Bare `<main>`** directly inside `<body class="bx">` (no need for `class="bx-doc"`)

See `skills/bento/token.md` for the full catalogue, the dial-down hierarchy, and (most importantly) when to skip bento entirely. Token savings serve the reader; they are not the goal.

## License

MIT
