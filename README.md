# bento

> **Beautifully compartmentalized HTML output for Claude Code.**
> AI writes minimal semantic HTML; a pre-built CSS/JS framework — loaded from CDN — does all the visual polish.

The motivation: Markdown is the de-facto for AI ↔ human document conversation because it's readable and cheap in tokens, but it tops out fast on charts, comparison cards, hero layouts, etc. HTML+CSS+JS handles all of that, yet writing it inline burns a lot of tokens. **bento** flips this: the AI emits ~Markdown-sized HTML using a small class vocabulary, and the heavy assets live in this repo and are served via jsDelivr.

Like a real bento, each compartment is neatly framed and the whole tray composes into something that looks intentional, not improvised.

## Repository layout

```
bento/
├── .claude-plugin/        # plugin / marketplace manifests
├── skills/bento/
│   ├── SKILL.md           # the instruction Claude reads
│   ├── writing-style.md   # prose discipline: AI-tells to avoid (EN + JA)
│   ├── assets/
│   │   ├── bento.css      # core framework (typography, cards, callouts, stats, ...)
│   │   ├── bento.js       # lazy-loads mermaid / chart.js / highlight.js / katex
│   │   └── themes/        # editorial / mono / playful (dark lives inside bento.css)
│   ├── templates/
│   │   └── starter.html
│   └── examples/
│       ├── report.html         # full feature showcase — open this first
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

then wrapping its content in `<body class="bento"><main class="bento-doc">…</main></body>`.

## Themes

```html
<body class="bento" data-theme="dark">       <!-- built-in -->
<body class="bento" data-theme="editorial">  <!-- loads themes/editorial.css -->
<body class="bento" data-theme="mono">
<body class="bento" data-theme="playful">
```

To use one of the optional themes, also include its stylesheet:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/themes/editorial.css">
```

## Customizing on the fly

Every visual aspect is a CSS custom property. Override in a single `<style>` block:

```html
<style>
  .bento {
    --bento-accent: #d23669;
    --bento-bg: #fffaf3;
    --bento-font-sans: "Hiragino Sans", system-ui, sans-serif;
    --bento-max-width: 80ch;
    --bento-radius: 0;
  }
</style>
```

Full token list at the top of `skills/bento/assets/bento.css`.

## Components at a glance

| Class | Purpose |
| --- | --- |
| `.bento-doc` | reading column wrapper |
| `.bento-hero` + `.bento-lead` | document header |
| `.bento-grid` + `.bento-card` | card layouts (2–6 columns, auto-responsive) |
| `.bento-split` | 2-column side-by-side |
| `.bento-sidebar` (`data-side`, `data-ratio`) | asymmetric narrow+wide for editors / palettes |
| `.bento-stat` | KPI tile |
| `.bento-badge--*` | inline labels (primary/success/warn/danger/muted) |
| `.bento-callout--*` | info/note/tip/success/warn/danger |
| `.bento-steps` | numbered procedure list |
| `.bento-timeline` | event timeline with date markers |
| `.bento-compare` table | comparison table with checkmark styling |
| `.bento-toc` (empty `<nav>`) | auto-built table of contents |
| `.bento-xref`, `.bento-related` | inline jump links and "see also" blocks (auto-fill from headings) |
| `.bento-btn` (`--primary/--danger/--ghost`, `--sm/--lg`) | opt-in button styling |
| `<input>`, `<select>`, `<textarea>`, `<fieldset>` | styled out of the box — no class needed |
| `.bento-field` | label + control + help-text group |
| `.bento-illust` | SVG wrapper; `currentColor` follows the theme accent |
| `.bento-copy` | "Copy as X" button (`data-copy-from="#id"` or `data-copy-text=…`) |
| `.bento-mermaid` | mermaid diagram block (auto-rendered) |
| `.bento-chart` (data-* driven) | bar / line / doughnut / radar (Chart.js) |
| `<pre><code class="language-…">` | auto-highlighted (highlight.js) |
| `\(…\)` `\[…\]` | LaTeX math (KaTeX) |

See `skills/bento/SKILL.md` for the full reference Claude uses, and `skills/bento/examples/report.html` for live examples of everything.

## Token math

A typical Markdown report ≈ N tokens. The same report rendered through bento:

- HTML skeleton (head + body wrappers + `<link>` + `<script>`): ~70 tokens, one-time per document
- Per-component overhead: 0–8 tokens (mostly `<div class="bento-…">` vs `<p>`)
- All visual definitions: **0 tokens** (in CDN-cached external files)

In practice the AI emits roughly the same number of tokens as a Markdown version while producing a fully styled, charted, navigable HTML document.

## License

MIT
