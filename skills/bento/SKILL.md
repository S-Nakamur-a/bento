---
name: bento
description: HTML output for documents a human will read carefully — not skim once and discard. Trigger on "pretty document", "rich HTML", "美しいドキュメント", "HTMLレポート", "見栄えの良い資料", "shareable report", "briefing", "design spec", or any output the reader will sit with, return to, share, or print. Produces a single self-contained .html file; visual polish (typography, callouts, charts, mermaid, math, code highlight) comes from a CDN-hosted CSS/JS framework so the AI can focus on prose quality and structure. Accepts a deliberate token premium over plain Markdown in exchange for reading-quality Markdown can't reach.
---

# bento — HTML for documents humans actually read

Some outputs are conversational and ephemeral — a quick Markdown reply is the right tool. Others deserve more: a human is going to sit with the document, return to it, share it, perhaps print it. **bento is for those.**

The visual layer (typography, layout, callouts, charts, mermaid, math, code highlight) lives in a CDN-hosted CSS/JS framework. You write near-vanilla semantic HTML; the framework dresses the page so your sentences can carry the substance.

This costs some tokens over plain Markdown. Pay them deliberately — when the reader's time and attention are worth more than the output's tokens. When they aren't, skip the skill (see "Do NOT use" below).

## When to use

Use bento when the reader is a **human** and will read the document **carefully** — not skim once and forget. Concrete triggers:

- The output will be shared with others (team, stakeholders, customer)
- The reader will return to it (briefings, design specs, reference docs, runbooks)
- The doc will be printed or persisted, not just scrolled past
- The content needs structure beyond Markdown's reach (charts, comparison tables, callouts, KPI tiles, multi-column layout, mermaid diagrams)
- The user explicitly asks for "polished", "shareable", "HTMLレポート", "美しいドキュメント", "資料", or similar

Do NOT use bento when:

- The output will be consumed by another LLM — HTML markup is pure overhead for an LLM reader; the skill load is also wasted
- The reply is conversational or ephemeral — the reader will read once, ack, and move on
- The user explicitly wants Markdown, plain text, or a code file
- It's a short factual answer that doesn't reward visual structure

The trade-off is deliberate: bento costs more tokens than Markdown. Make sure the document earns those tokens by being something a human will actually invest reading time in.

## How to produce output

1. **Read user preferences first.** If `.claude/bento.local.md` exists at the project root, read it **before drafting any output**. Its instructions override the defaults in this skill, `writing-style.md`, and `readability.md`. See `## Preferences` below for the file format and how to update it.
2. **Create a single `.html` file** (the user will open it in a browser, share it, or print it).
3. **Use the skeleton below verbatim** as the first lines, then write your content inside `<main class="bx-doc">`.
4. **Compose using bento classes** (see catalogue). Don't invent new class names; if you need something not covered, use plain semantic HTML — the framework styles `h1-h6`, `p`, `ul`, `ol`, `blockquote`, `table`, `code`, `pre`, `figure` etc. out of the box.
5. **Don't inline raw CSS unless customizing the theme.** A single `<style>` block at top is fine for overrides; never restyle from scratch.
6. **Mindful with markup, but never at the reader's expense.** Use the shortest equivalent form when it costs nothing in clarity: semantic-attribute callouts `<aside data-tone>`, modifier-only badge classes, bare `<article>` inside `.bx-grid` as a card, compact `data-labels="A,B,C"` for charts, `<section data-md>` for prose-heavy regions. See `token.md` for the catalogue — but if the longer form reads better in source, write it. Token savings are a side benefit, not the goal.
7. **Write like a human, not like ChatGPT.** Before drafting any prose, read `writing-style.md` in this directory — beautiful HTML around AI-sounding prose still reads as an AI artifact. The framework dresses the page; your sentences carry the credibility.
8. **Design for skimmers, not readers.** Roughly 70% of readers skim; the first 5–7 seconds decide whether they invest more. Open with the bottom line, use `<h2>` headings as a text-shaped TOC, and put one visual element (callout / card grid / stat row / chart / compare table) near the top of every section. Read `readability.md` for the document-level discipline (paragraph length, component choice by shape, the self-check before you stop).

### Required skeleton

Replace `@main` with a pinned version tag (e.g. `@v0.1.0`) once the user releases one. `data-theme` is optional; omit for default. See `assets/themes/` for available themes.

```html
<!doctype html>
<html lang="ja">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>YOUR TITLE</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.css">
<script src="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.js" defer></script>
<body class="bx">
<main>
<!-- content -->
</main>
```

HTML5 lets you omit `<head>`, the `</body>`/`</html>` closers, and quote-less attributes; the framework also accepts a bare `<main>` (no `class="bx-doc"`) directly inside `<body class="bx">`. Both shortcuts are pure savings — don't write the longer form unless you need a specific behavior.

### Component catalogue

See `assets/bento.css` for full reference; below are the most useful classes.

**Layout**
- `.bx-doc` — main reading column (max-width, comfortable typography). Wrap all content in this.
- `.bx-hero` — large hero band for titles / subtitles. Inside it use `<h1>` and `<p class="bx-lead">`.
- `.bx-grid` — auto-fit grid for cards (`<div class="bx-grid">…<div class="bx-card">…</div></div>`). Default 3-up, collapses to 1 on mobile. Supports `data-cols="2"` … `data-cols="6"` to lock the count.
- `.bx-split` — 2-column side-by-side; children become equal columns.
- `.bx-sidebar` — asymmetric 2-column (narrow + wide). Default places the narrow column on the left. Use `data-side="right"` to flip and `data-ratio="1:2"`, `"1:3"`, or `"1:4"` to widen the main area. Collapses to a single column on mobile. Good for editors, palette + canvas, nav + content.
- `.bx-toc` — auto-generated table of contents (just put an empty `<nav class="bx-toc"></nav>` near top; JS fills it from `h2/h3`).

**Cross-references** — section-to-section jumps. `h2` / `h3` get slug IDs automatically (works with or without a TOC).
- Inline link: `<a class="bx-xref" href="#section-slug">label</a>` — arrow + dashed underline. If the link's text is left empty (`<a class="bx-xref" href="#section-slug"></a>`), the framework fills it with the target heading's text at runtime. Useful inside prose: *"…the typography rules (see <a class='bx-xref' href='#typography'></a>) make this clearer."*
- Related block: `<aside class="bx-related"><strong>Related</strong><ul><li><a href="#a">…</a></li>…</ul></aside>` — compact sidebar listing related sections.
  Shortcut form: `<aside class="bx-related" data-refs="#a, #b"></aside>` (also accepts `data-title="関連する章"` to set the heading). The link list is built at runtime from the target headings' text. Use this at the end of a section to point readers to related ones.

**Cards & callouts** — three equivalent forms per component, listed shortest first. Prefer the shortest one that's clear.
- **Card**: bare `<article>…</article>` inside `.bx-grid` *(shortest)* · `<div class="bx-card">…</div>` *(explicit)*. Children: `<h3>`, `<p>`, optional `<footer>`.
- **Callout**: `<aside data-tone="info">…</aside>` *(shortest)* · `<div class="bx-callout--info">…</div>` *(modifier alone)* · `<div class="bx-callout bx-callout--info">…</div>` *(BEM)*. Tones: `info|note|tip|success|warn|danger`. Children: optional `<strong>` title + `<p>`.
- **Stat**: `<div class="bx-stat"><span class="bx-stat-value">42</span><span class="bx-stat-label">…</span></div>`. Combine with `.bx-grid` for dashboards.
- **Badge**: `<span data-tone="primary">…</span>` *(shortest)* · `<span class="bx-badge--primary">…</span>` *(modifier alone)*. Tones: `primary|success|warn|danger|muted`.

**Rich content (data-attribute driven)**
- **Markdown island** *(highest-leverage shortcut)*: `<section data-md>…markdown…</section>` — anything inside renders as Markdown at load time. Use for prose-heavy regions (paragraphs, lists, headings, inline code) where Markdown is far denser than HTML. Visual elements (`.bx-chart`, callouts, mermaid) still need raw HTML; just embed them inside the island. Leading whitespace common to every line is auto-stripped, so the source can stay readably indented.
- **Mermaid**: `<div class="bx-mermaid">graph TD; A-->B</div>` — JS auto-renders. No need to load mermaid yourself.
- **Charts**: `<div class="bx-chart" data-type="bar" data-labels="A,B,C" data-values="10,20,30"></div>`. Types: `bar`, `line`, `doughnut`, `radar`. `data-labels` / `data-values` accept comma-separated values (shortest) or JSON arrays. For multi-series use `data-series='[{"label":"2024","values":[…]},…]'` (JSON only). `data-type="bar"` is the default — drop it for bars.
- **Math (KaTeX)**: inline `\(…\)`, block `\[…\]`. Auto-rendered.
- **Code**: standard `<pre><code class="language-python">…</code></pre>` — highlight.js auto-loads. Add `data-filename="app.py"` on `<pre>` to show a filename strip.
- **Collapsible**: native `<details><summary>…</summary>…</details>` is styled.
- **Steps**: `<ol class="bx-steps"><li>…</li>…</ol>` for numbered procedures with nice step circles.
- **Timeline**: `<ol class="bx-timeline"><li><time>2024-01</time><h4>…</h4><p>…</p></li>…</ol>`.
- **Compare table**: `<table class="bx-compare"><thead>…</thead>…</table>` — adds checkmark/cross styling for `✓` and `✗` cell contents.

**Interactive controls** — for two-way docs (forms, palettes, throwaway editors).
- **Buttons**: three equivalent opt-in forms — `<button data-variant="primary">…</button>` *(shortest)* · `<button class="bx-btn--primary">…</button>` *(modifier alone)* · `<button class="bx-btn bx-btn--primary">…</button>` *(BEM)*. Variants: `primary|danger|ghost`. Sizes via `data-size="sm"` / `"lg"` (or `bx-btn--sm` / `--lg`). Raw `<button>` without `data-variant` or `.bx-btn` is intentionally left unstyled.
- **Form controls**: `<input>` (text/email/password/search/url/tel/number/date/time/range/color/checkbox/radio), `<select>`, `<textarea>`, `<label>`, `<fieldset>`/`<legend>` are styled out of the box — no class needed. Focus ring, invalid state, and `accent-color` follow the theme.
- **Field group**: wrap label + control with `<div class="bx-field"><label>…</label><input>…</div>`. Add `<span class="bx-field-help">…</span>` for hint text. Modifier `bx-field--inline` puts them on one row.
- **SVG illustration**: wrap an inline `<svg>` in `<figure class="bx-illust">…</figure>` (or apply `class="bx-illust"` directly on `<svg>`). The element's `color` is set to `--bx-accent`, so any path drawn with `stroke="currentColor"` / `fill="currentColor"` follows the theme.
- **Copy to clipboard**: `<button class="bx-btn bx-copy" data-copy-from="#payload">Copy as JSON</button>` copies the target's `value` (for form fields) or `textContent` (anything else) on click. Shows a brief ✓ on success / ✕ on failure. Use this to close the loop on a custom editor — let the reader paste their edits back into another Claude session. `data-copy-text="literal"` also works for fixed strings.

**Utility**
- `.bx-center` `.bx-right` — alignment
- `.bx-muted` `.bx-small` `.bx-mono` — type
- `.bx-hr` — section divider (or just `<hr>`)
- `.bx-print-only` `.bx-screen-only` — visibility per medium

## Preferences

`.claude/bento.local.md` at the project root holds per-project preferences for this skill. If the file exists, **read it before drafting any output** and treat its contents as the highest-priority style instructions (overriding `writing-style.md`, `readability.md`, and framework defaults).

### File format

YAML frontmatter for structured preferences, markdown body for free-form rules.

```markdown
---
theme: editorial         # default | dark | editorial | mono | playful
voice: terse             # terse | balanced | warm
language: ja             # ja | en | auto
em_dash: 0               # 0 = never, 1 = at most one with intent, default = follow writing-style.md
paragraph_max: 3         # max sentences per paragraph
heading_case: sentence   # sentence | title
preferred_visuals: [bx-compare, bx-stat, bx-callout]
avoided_visuals: [bx-mermaid]
---

# Free-form rules
- 結論を最初に出してほしい
- カタカナ語は最小限
- emoji は本文で使わない
- 比喩より具体例を優先
```

Unknown frontmatter keys and any markdown body content are treated as additional user instructions at the same priority level. A field set in the file silently overrides the corresponding default — don't surface that you applied it unless asked.

### Reactive capture (asking to save)

When the user gives feedback that suggests a **recurring** stylistic preference (not a one-off paragraph edit), ask once whether to persist it. Triggers include:

- 「もっと短く」「冗長」「シンプルに」 → `voice: terse`, `paragraph_max: N`
- 「em-dash やめて」「ダッシュ使わないで」 → `em_dash: 0`
- 「serif にして」「Mincho で」 → font preference in body
- 「mermaid じゃなくて table で」「図はいらない」 → `avoided_visuals`
- 「カタカナ語が多い」「もっと平易に」 → body note
- 「emoji は不要」 → body note
- Theme / color complaints → `theme:` or `--bx-accent` body note

Ask exactly:

> 「これを `.claude/bento.local.md` に default として保存しますか？」

On yes: read the existing file if any, merge the new preference into the frontmatter (or append a bullet to the markdown body for free-form rules), and write the file back. Create the file (and the `.claude/` directory if needed) if absent. Don't ask permission for each write — the user already confirmed.

On no: apply the preference for this conversation only.

**Rules:**
- Don't ask the same kind of preference question twice in one conversation.
- Don't propose to save for **one-off edits** ("make this paragraph shorter" is for this paragraph; "I always want short paragraphs" is a preference).
- Don't volunteer preference dialogs proactively — only when the user has actually given feedback that reveals a preference.

## Use cases

bento covers five families of HTML output. Pick the family first, then the components.

**1. Reports, research, status updates.** Heroes, KPI stats, charts, callouts, timelines, code samples — the dashboard-style document a person reads end to end. Components: `.bx-hero`, `.bx-stat` + `.bx-grid`, `.bx-chart`, `.bx-callout`, `.bx-timeline`, `<pre><code>`. See `examples/report.html`.

**2. Specs, plans, design docs.** Long-form prose with diagrams and decision tables. Components: `.bx-toc` for navigation, `.bx-mermaid` for flow diagrams, `.bx-compare` tables for option matrices, `.bx-related` to point between sections, `<details>` for foldable appendices. Cross-link aggressively — the reader is going to skim and jump.

**3. Code review and explainers.** Show the code AND explain it. Components: `<pre data-filename="…"><code class="language-…">` for syntax-highlighted source, `.bx-callout--note` for inline commentary, `.bx-sidebar` for code + commentary side-by-side, `.bx-illust` with SVG for data-flow diagrams, `.bx-steps` for a walkthrough.

**4. Design and prototype documents.** Visual exploration of UI options. Components: `.bx-grid` (use `data-cols="2"`/`"3"`) for side-by-side variants, `.bx-card` for each variant with caption + `<footer>`, `.bx-illust` for SVG mockups, native form controls inside a card to show interaction. End each variant with a `.bx-callout` describing the tradeoff.

**5. Custom editing interfaces (throwaway editors).** Build a UI to edit one piece of data, then export it back to text. Components: `.bx-sidebar` (controls on the left, preview on the right), form controls (`<input>`/`<select>`/`<textarea>`), `.bx-btn`, a hidden `<textarea id="payload">` that holds the serialized output, and `<button class="bx-btn bx-copy" data-copy-from="#payload">` as the export. The "copy" closes the loop: the user pastes the result back into another Claude session. See `examples/playground.html`.

Pick the family explicitly when starting — it determines whether the document is reading-shaped or interacting-shaped, which changes layout choices significantly.

## Themes

Built-in themes (set via `<body data-theme="…">`): `default`, `dark`, `editorial`, `mono`, `playful`.
See `assets/themes/` for the source.

**Important**: set `data-theme` in the source HTML, not via runtime JS. Mermaid and Chart.js read theme variables once at init and bake colors into the rendered SVG/canvas. Changing `data-theme` after load only restyles plain CSS (typography, callouts, cards) — diagrams keep their initial theme until the page is reloaded.

To customize on the fly, add a `<style>` block in `<head>` after the framework link:

```html
<style>
  .bx {
    --bx-accent: #d23669;
    --bx-bg: #fffaf3;
    --bx-font-sans: "Hiragino Sans", system-ui, sans-serif;
  }
</style>
```

The full variable list lives in `assets/bento.css` at the top under `:where(.bx)`. Common variables:

- `--bx-accent` — primary accent color (links, buttons, focus)
- `--bx-fg` `--bx-bg` `--bx-muted` — base colors
- `--bx-surface` `--bx-border` — cards/borders
- `--bx-radius` — corner roundness
- `--bx-font-sans` `--bx-font-mono` `--bx-font-serif`
- `--bx-max-width` — reading column width

## Templates and examples

- `templates/starter.html` — minimal blank document
- `examples/report.html` — full feature showcase (cards, charts, mermaid, etc.). Read this first if you want to see real usage of every component.
- `examples/compact-forms.html` — every token-efficient shortcut applied: `<aside data-tone>` callouts, `<span data-tone>` badges, `<button data-variant>` buttons, bare `<article>` cards, comma-separated chart data, `<section data-md>` markdown island. Read this when optimizing for token cost.
- `examples/playground.html` — Custom Editing Interface demo: sidebar layout, form controls, SVG preview, and a copy-as-JSON export button.
- `examples/writing-style.html` — long-form report that exercises cross-references (`.bx-xref`, `.bx-related`) end to end.
- `writing-style.md` — sentence-level discipline. Read before drafting prose. Lists AI-tells (em-dashes, "delve", rule-of-three, hedging participles, "not just X but Y", and the Japanese equivalents) plus a final self-check.
- `readability.md` — document-level discipline. Pyramid Principle / BLUF, paragraph design, heading hierarchy, component choice by shape (paragraph vs `<ul>` vs `.bx-card` grid vs `.bx-compare` vs callout), density targets, and a 5-minute structural self-check.
- `token.md` — cost-level discipline. Where bento spends extra tokens, the shortcut catalogue (compact forms, `<section data-md>` markdown islands, when to skip bento entirely), and a 1-minute self-check before emitting HTML.

## Operating principles

- **Reader-first, not token-first.** bento exists for documents a human will read carefully. Token efficiency matters only when it doesn't damage that. If the two conflict, pick reading quality.
- **Commit, be specific, vary.** The visual framework can carry weak prose only so far. See `writing-style.md` for sentence-level discipline.
- **Skimmer-first structure.** Bottom line up top, signpost headings, one visual element per section. See `readability.md` for document-level rules.
- **One file, fully self-contained** — output is a single `.html` the user can double-click, share, or print. No build step.
- **Semantic-first** — pick the right HTML element before reaching for a class. The framework auto-styles `<p>`, `<h1>`–`<h6>`, `<ul>`, `<ol>`, `<table>`, `<blockquote>`, `<details>`, native form controls; many components also have semantic-attribute shortcuts (`<aside data-tone>`, `<span data-tone>`, `<button data-variant>`, bare `<article>` in `.bx-grid`).
- **Don't restyle**, customize via CSS variables only.
- **Mindful with markup.** Use the shortest equivalent form when it costs nothing in clarity. See `token.md` for the trade-offs and when not to use bento at all — but the shortcuts serve the reader, not vice versa.
