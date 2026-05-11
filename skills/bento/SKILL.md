---
name: bento
description: Token-efficient beautiful HTML document generation. Use this skill when the user asks for output as a "pretty document", "rich HTML", "美しいドキュメント", "HTMLレポート", "見栄えの良い資料", a shareable report/landing, or when Markdown's expressive limits become a blocker (complex diagrams, charts, comparison cards, callouts). Produces a single self-contained .html file that loads a pre-built CSS/JS framework from CDN — AI only emits minimal semantic HTML, all visual polish comes from the framework.
---

# bento — beautifully compartmentalized HTML output

This skill lets you produce **rich, beautifully styled HTML documents** while emitting only a thin layer of semantic markup. All visual heavy-lifting (typography, layout, callouts, charts, mermaid, math, code highlight) lives in a CDN-hosted CSS/JS framework. You reference it with two `<link>` / `<script>` tags and write near-vanilla HTML.

## When to use

Use bento when ANY of the following apply:

- The user wants a polished report, summary, or landing-page-style output
- The content has charts, comparison tables, callouts, multi-column layout, or progress indicators
- Markdown/mermaid alone would be visually flat or awkward
- The user asks for an "HTML version", "shareable doc", or "資料"

Do NOT use bento when:

- The user explicitly wants Markdown / plain text / a code file
- The output will be consumed by another LLM (HTML wastes tokens vs Markdown there)
- It's a short reply that doesn't need styling

## How to produce output

1. **Create a single `.html` file** (the user will open it in a browser, share it, or print it).
2. **Use the skeleton below verbatim** as the first lines, then write your content inside `<main class="bento-doc">`.
3. **Compose using bento classes** (see catalogue). Don't invent new class names; if you need something not covered, use plain semantic HTML — the framework styles `h1-h6`, `p`, `ul`, `ol`, `blockquote`, `table`, `code`, `pre`, `figure` etc. out of the box.
4. **Don't inline raw CSS unless customizing the theme.** A single `<style>` block at top is fine for overrides; never restyle from scratch.
5. **Token discipline**: prefer semantic HTML over class soup. The framework targets element selectors first, classes second.
6. **Write like a human, not like ChatGPT.** Before drafting any prose, read `writing-style.md` in this directory — beautiful HTML around AI-sounding prose still reads as an AI artifact. The framework dresses the page; your sentences carry the credibility.

### Required skeleton

Replace `@main` with a pinned version tag (e.g. `@v0.1.0`) once the user releases one. `data-theme` is optional; omit for default. See `assets/themes/` for available themes.

```html
<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>YOUR TITLE</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.css">
<script src="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.js" defer></script>
</head>
<body class="bento" data-theme="default">
<main class="bento-doc">
<!-- content -->
</main>
</body>
</html>
```

### Component catalogue

See `assets/bento.css` for full reference; below are the most useful classes.

**Layout**
- `.bento-doc` — main reading column (max-width, comfortable typography). Wrap all content in this.
- `.bento-hero` — large hero band for titles / subtitles. Inside it use `<h1>` and `<p class="bento-lead">`.
- `.bento-grid` — auto-fit grid for cards (`<div class="bento-grid">…<div class="bento-card">…</div></div>`). Default 3-up, collapses to 1 on mobile. Supports `data-cols="2"` … `data-cols="6"` to lock the count.
- `.bento-split` — 2-column side-by-side; children become equal columns.
- `.bento-sidebar` — asymmetric 2-column (narrow + wide). Default places the narrow column on the left. Use `data-side="right"` to flip and `data-ratio="1:2"`, `"1:3"`, or `"1:4"` to widen the main area. Collapses to a single column on mobile. Good for editors, palette + canvas, nav + content.
- `.bento-toc` — auto-generated table of contents (just put an empty `<nav class="bento-toc"></nav>` near top; JS fills it from `h2/h3`).

**Cross-references** — section-to-section jumps. `h2` / `h3` get slug IDs automatically (works with or without a TOC).
- Inline link: `<a class="bento-xref" href="#section-slug">label</a>` — arrow + dashed underline. If the link's text is left empty (`<a class="bento-xref" href="#section-slug"></a>`), the framework fills it with the target heading's text at runtime. Useful inside prose: *"…the typography rules (see <a class='bento-xref' href='#typography'></a>) make this clearer."*
- Related block: `<aside class="bento-related"><strong>Related</strong><ul><li><a href="#a">…</a></li>…</ul></aside>` — compact sidebar listing related sections.
  Shortcut form: `<aside class="bento-related" data-refs="#a, #b"></aside>` (also accepts `data-title="関連する章"` to set the heading). The link list is built at runtime from the target headings' text. Use this at the end of a section to point readers to related ones.

**Cards & callouts**
- `.bento-card` — soft-shadowed card. Children: `<h3>`, `<p>`, optional `<footer>`.
- `.bento-callout` with modifier: `bento-callout--info|--warn|--danger|--success|--tip|--note`. Children: optional `<strong>` title + `<p>`.
- `.bento-stat` — KPI tile: `<div class="bento-stat"><span class="bento-stat-value">42</span><span class="bento-stat-label">…</span></div>`. Combine with `.bento-grid` for dashboards.
- `.bento-badge` — inline label. Modifiers `--primary|--success|--warn|--danger|--muted`.

**Rich content (data-attribute driven)**
- **Mermaid**: `<div class="bento-mermaid">graph TD; A-->B</div>` — JS auto-renders. No need to load mermaid yourself.
- **Charts**: `<div class="bento-chart" data-type="bar" data-labels='["A","B","C"]' data-values='[10,20,30]'></div>`. Types: `bar`, `line`, `doughnut`, `radar`. For multi-series use `data-series='[{"label":"2024","values":[…]},…]'`. JSON in `data-*` must be valid JSON (double quotes).
- **Math (KaTeX)**: inline `\(…\)`, block `\[…\]`. Auto-rendered.
- **Code**: standard `<pre><code class="language-python">…</code></pre>` — highlight.js auto-loads. Add `data-filename="app.py"` on `<pre>` to show a filename strip.
- **Collapsible**: native `<details><summary>…</summary>…</details>` is styled.
- **Steps**: `<ol class="bento-steps"><li>…</li>…</ol>` for numbered procedures with nice step circles.
- **Timeline**: `<ol class="bento-timeline"><li><time>2024-01</time><h4>…</h4><p>…</p></li>…</ol>`.
- **Compare table**: `<table class="bento-compare"><thead>…</thead>…</table>` — adds checkmark/cross styling for `✓` and `✗` cell contents.

**Interactive controls** — for two-way docs (forms, palettes, throwaway editors).
- **Buttons**: opt-in via `.bento-btn` on `<button>` or `<a>`. Modifiers `--primary|--danger|--ghost`, sizes `--sm|--lg`. Raw `<button>` is left alone (so the older `<button class="bento-badge">` pattern still works).
- **Form controls**: `<input>` (text/email/password/search/url/tel/number/date/time/range/color/checkbox/radio), `<select>`, `<textarea>`, `<label>`, `<fieldset>`/`<legend>` are styled out of the box — no class needed. Focus ring, invalid state, and `accent-color` follow the theme.
- **Field group**: wrap label + control with `<div class="bento-field"><label>…</label><input>…</div>`. Add `<span class="bento-field-help">…</span>` for hint text. Modifier `bento-field--inline` puts them on one row.
- **SVG illustration**: wrap an inline `<svg>` in `<figure class="bento-illust">…</figure>` (or apply `class="bento-illust"` directly on `<svg>`). The element's `color` is set to `--bento-accent`, so any path drawn with `stroke="currentColor"` / `fill="currentColor"` follows the theme.
- **Copy to clipboard**: `<button class="bento-btn bento-copy" data-copy-from="#payload">Copy as JSON</button>` copies the target's `value` (for form fields) or `textContent` (anything else) on click. Shows a brief ✓ on success / ✕ on failure. Use this to close the loop on a custom editor — let the reader paste their edits back into another Claude session. `data-copy-text="literal"` also works for fixed strings.

**Utility**
- `.bento-center` `.bento-right` — alignment
- `.bento-muted` `.bento-small` `.bento-mono` — type
- `.bento-hr` — section divider (or just `<hr>`)
- `.bento-print-only` `.bento-screen-only` — visibility per medium

## Use cases

bento covers five families of HTML output. Pick the family first, then the components.

**1. Reports, research, status updates.** Heroes, KPI stats, charts, callouts, timelines, code samples — the dashboard-style document a person reads end to end. Components: `.bento-hero`, `.bento-stat` + `.bento-grid`, `.bento-chart`, `.bento-callout`, `.bento-timeline`, `<pre><code>`. See `examples/report.html`.

**2. Specs, plans, design docs.** Long-form prose with diagrams and decision tables. Components: `.bento-toc` for navigation, `.bento-mermaid` for flow diagrams, `.bento-compare` tables for option matrices, `.bento-related` to point between sections, `<details>` for foldable appendices. Cross-link aggressively — the reader is going to skim and jump.

**3. Code review and explainers.** Show the code AND explain it. Components: `<pre data-filename="…"><code class="language-…">` for syntax-highlighted source, `.bento-callout--note` for inline commentary, `.bento-sidebar` for code + commentary side-by-side, `.bento-illust` with SVG for data-flow diagrams, `.bento-steps` for a walkthrough.

**4. Design and prototype documents.** Visual exploration of UI options. Components: `.bento-grid` (use `data-cols="2"`/`"3"`) for side-by-side variants, `.bento-card` for each variant with caption + `<footer>`, `.bento-illust` for SVG mockups, native form controls inside a card to show interaction. End each variant with a `.bento-callout` describing the tradeoff.

**5. Custom editing interfaces (throwaway editors).** Build a UI to edit one piece of data, then export it back to text. Components: `.bento-sidebar` (controls on the left, preview on the right), form controls (`<input>`/`<select>`/`<textarea>`), `.bento-btn`, a hidden `<textarea id="payload">` that holds the serialized output, and `<button class="bento-btn bento-copy" data-copy-from="#payload">` as the export. The "copy" closes the loop: the user pastes the result back into another Claude session. See `examples/playground.html`.

Pick the family explicitly when starting — it determines whether the document is reading-shaped or interacting-shaped, which changes layout choices significantly.

## Themes

Built-in themes (set via `<body data-theme="…">`): `default`, `dark`, `editorial`, `mono`, `playful`.
See `assets/themes/` for the source.

**Important**: set `data-theme` in the source HTML, not via runtime JS. Mermaid and Chart.js read theme variables once at init and bake colors into the rendered SVG/canvas. Changing `data-theme` after load only restyles plain CSS (typography, callouts, cards) — diagrams keep their initial theme until the page is reloaded.

To customize on the fly, add a `<style>` block in `<head>` after the framework link:

```html
<style>
  .bento {
    --bento-accent: #d23669;
    --bento-bg: #fffaf3;
    --bento-font-sans: "Hiragino Sans", system-ui, sans-serif;
  }
</style>
```

The full variable list lives in `assets/bento.css` at the top under `:where(.bento)`. Common variables:

- `--bento-accent` — primary accent color (links, buttons, focus)
- `--bento-fg` `--bento-bg` `--bento-muted` — base colors
- `--bento-surface` `--bento-border` — cards/borders
- `--bento-radius` — corner roundness
- `--bento-font-sans` `--bento-font-mono` `--bento-font-serif`
- `--bento-max-width` — reading column width

## Templates and examples

- `templates/starter.html` — minimal blank document
- `examples/report.html` — full feature showcase (cards, charts, mermaid, etc.). Read this first if you want to see real usage of every component.
- `examples/playground.html` — Custom Editing Interface demo: sidebar layout, form controls, SVG preview, and a copy-as-JSON export button.
- `examples/writing-style.html` — long-form report that exercises cross-references (`.bento-xref`, `.bento-related`) end to end.
- `writing-style.md` — mandatory before drafting prose. Lists AI-tells (em-dashes, "delve", rule-of-three, hedging participles, "not just X but Y", and the Japanese equivalents) plus a final self-check.

## Operating principles

- **One file, fully self-contained** — output is a single `.html` the user can double-click. No build step.
- **Semantic-first** — pick the right HTML element before reaching for a class.
- **Don't restyle**, customize via CSS variables only.
- **Keep markup terse** — that's the whole point. If a generated section feels verbose, look for a class that already does it.
- **Commit, be specific, vary.** The visual framework can carry weak prose only so far. See `writing-style.md` for the discipline.
