# bento

> **HTML output for documents humans will read carefully.**
> Some outputs are conversational and ephemeral — Markdown is the right tool for those.
> Others deserve typographic care, structure, charts, callouts — content the reader is going to sit with, return to, share, or print. **bento is for those.**

bento accepts a deliberate token premium over plain Markdown in exchange for what Markdown can't give: consistent typography, structured visual components (charts, callouts, comparison tables, KPI tiles, mermaid diagrams), responsive multi-column layouts, and a reading rhythm that holds up in a browser, in print, and across rereads. The AI writes near-vanilla semantic HTML using a small class vocabulary; all visual heavy-lifting lives in a CDN-hosted CSS/JS framework loaded with two tags.

Like a real bento, each compartment is neatly framed and the whole tray composes into something that looks intentional, not improvised.

**When to use, when not to use** — see `skills/bento/SKILL.md`. The short version: use bento when a human will read the document carefully; use Markdown when the reader will skim once, or when the consumer is another LLM.

## Repository layout

```
bento/
├── .claude-plugin/        # plugin / marketplace manifests
├── skills/bento/
│   ├── SKILL.md           # the instruction Claude reads
│   ├── writing-style.md   # prose discipline: AI-tells to avoid (EN + JA)
│   ├── readability.md     # document discipline: structure, hierarchy, component choice
│   ├── token.md           # cost discipline: shortcut catalogue, when to skip bento
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

Once installed, the `bento` skill auto-activates when you ask Claude for "a pretty HTML report", "美しい資料", a shareable doc, a dashboard summary, etc.

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
