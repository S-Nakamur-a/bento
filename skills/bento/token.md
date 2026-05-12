# bento — token cost guide

> bento documents trade some output tokens for reading quality. This file is
> about paying that tax mindfully — where the extra tokens go, the shortcut
> forms that keep the overhead small, and (most important) when not to use
> bento at all.
>
> Read alongside `writing-style.md` (sentence-level discipline) and
> `readability.md` (document-level discipline). This is the **cost-level**
> discipline, deliberately ranked below the other two: never trade reading
> quality for a token saving.

---

## Tokens are a tax, not the goal

bento exists for documents a human will read carefully — briefings, design
specs, polished reports, shareable summaries. The typographic care,
structured visual components, and consistent reading rhythm are the
point. Tokens are what you pay for that.

The shortcuts in §1 let you pay less tax without losing what makes the
document worth reading. They are not, however, a path to "bx-lite":
if the audience will skim once and move on, **skip bento entirely** (§4)
rather than dial it down to the bone. The skill load and skeleton are
optimized for documents that earn their tokens, not for ephemeral
output.

---

## Where the tokens go

A bento document spends extra tokens (vs plain Markdown) in three places:

1. **Skeleton** — doctype, head, framework `<link>` / `<script>`, body wrappers. Paid once per document.
2. **Wrappers** — `.bx-grid`, `.bx-sidebar`, the `<main>` reading column. Paid per layout block.
3. **Component shells** — the markup around callouts, cards, stats, charts. Paid per component.

Prose content itself costs the same in Markdown and HTML — that's not where bento spends extra. The techniques below target the three buckets above, never the prose.

---

## 1. Shortcut catalogue (use these by default)

The framework supports multiple equivalent forms for most components. Pick the shortest one that's clear; the longer ones exist for cases where you need explicit semantics or compatibility.

### Component shortcuts

| Component | Shortest | Equivalent longer forms |
| --- | --- | --- |
| Callout | `<aside data-tone="info"><strong>Info</strong><p>body</p></aside>` | `<div class="bx-callout--info">…</div>` · `<div class="bx-callout bx-callout--info">…</div>` |
| Badge | `<span data-tone="primary">…</span>` | `<span class="bx-badge--primary">…</span>` · `<span class="bx-badge bx-badge--primary">…</span>` |
| Button | `<button data-variant="primary">…</button>` | `<button class="bx-btn--primary">…</button>` · `<button class="bx-btn bx-btn--primary">…</button>` |
| Card (inside `.bx-grid`) | `<article><h3>Title</h3><p>Body</p></article>` | `<div class="bx-card"><h3>Title</h3><p>Body</p></div>` |
| Reading column wrapper | `<main>` directly inside `<body class="bx">` | `<main class="bx-doc">` |
| Chart labels / values | `data-labels="A,B,C" data-values="10,20,30"` | `data-labels='["A","B","C"]' data-values='[10,20,30]'` |

Tones recognized on `<aside data-tone>`: `info`, `note`, `tip`, `success`, `warn`, `danger`. Tones on `<span data-tone>`: `primary`, `success`, `warn`, `danger`, `muted`. Variants on `<button data-variant>` / `<a data-variant>`: `primary`, `danger`, `ghost`; size via `data-size="sm"` / `"lg"`.

### Existing shortcuts (already in the framework)

These were available before; use them always:

| Long form | Shortcut |
| --- | --- |
| Manual `<ul><li><a href="#a">A</a>…</ul>` inside a related-aside | `<aside class="bx-related" data-refs="#a, #b"></aside>` |
| `<a class="bx-xref" href="#x">Section X heading</a>` | `<a class="bx-xref" href="#x"></a>` (label auto-fills from target heading) |
| Hand-built `<nav>` with manual section links | `<nav class="bx-toc"></nav>` |

### Markdown islands (highest leverage)

Wrap any prose-heavy region in `<section data-md>` and write plain Markdown inside:

```html
<section data-md>
## Investigation

After 14 user interviews, the dominant issue is **step 2 friction**.

- 8 of 14 stalled on the first config screen
- 6 expected a different default
- 3 abandoned before reaching step 3

The redesign collapses steps 1–3 into one screen.
</section>
```

Inside the island, the AI emits Markdown (denser than HTML for paragraphs, lists, headings, inline code). The framework lazy-loads `marked` and renders to HTML at load time. Visual components (`.bx-chart`, mermaid, callouts) still need raw HTML — embed them inline inside the markdown.

Leading whitespace common to every line is stripped automatically, so the source can stay readably indented inside the surrounding HTML.

This is the single biggest output-side saving — prose is usually the largest token pool in a document.

### Drop default-value attributes

The framework supplies sensible defaults; omit attributes when the value would be the default:

- `.bx-grid` auto-fits to 3 columns → drop `data-cols="3"`
- `.bx-sidebar` defaults to narrow-on-left → drop `data-side="left"`
- `.bx-chart` defaults to `data-type="bar"` → drop it when bar is wanted

### Short skeleton

HTML5 is permissive. The skeleton can shrink to:

```html
<!doctype html>
<html lang="ja">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>X</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.css">
<script src="https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.js" defer></script>
<body class="bx">
<main>
content
</main>
```

No `<head>`, no `</body>` / `</html>` closers. Keep `<html lang>` and the viewport meta — those affect accessibility and mobile rendering.

---

## 2. Class-decoration is wasted tokens

The framework auto-styles `<h1>`-`<h6>`, `<p>`, `<ul>`, `<ol>`, `<table>`, `<blockquote>`, `<code>`, `<pre>`, `<details>`, `<figure>`, native form controls. **No class needed.** Reaching for `bx-*` on them is wasted markup.

> ✗ `<p class="bx-text">…</p>` (no such class; `<p>` is already styled)
> ✓ `<p>…</p>`

The trap is mental — Markdown trained you to think "headings are just headings, paragraphs are just paragraphs". HTML carries that same property inside `.bx`. Trust the defaults.

---

## 3. One `<style>` block, not per-element styles

A single `<style>` block in `<head>` overriding CSS variables is far cheaper than `style="…"` repeated across elements. Override the theme; don't restyle. If you find yourself overriding more than three or four variables, the chosen theme is wrong — switch themes (`data-theme="editorial"` etc.) instead of fighting one.

---

## 4. When to skip bento entirely

The most important section of this file. bento's premium only pays off when the audience reads carefully — for everyone else, the right call is plain Markdown. Skip when:

- The output goes to another LLM → Markdown. HTML markup is pure overhead for an LLM reader, and the skill load is wasted.
- The reply is conversational or ephemeral — the reader will read once, ack, and move on → Markdown.
- The content has no element Markdown can't express (no chart, no callout grid, no KPI tiles, no multi-column layout) → Markdown is faster, cleaner, and free of skill overhead.
- The output is a single code snippet → fenced code block in Markdown.
- The user explicitly asked for Markdown, plain text, or a code file → respect it.

A clean skip beats every output-side optimization. Don't reach for the shortcuts in §1 as a workaround for an audience that wouldn't have read the bento version anyway.

---

## 5. The 1-minute self-check

Before generating an HTML doc, in order:

**Audience first — are we paying tokens that earn their keep?**
- [ ] Is the audience a human (not another LLM)? If no → use Markdown.
- [ ] Will the reader sit with this doc (return to it, share it, print it), not just skim once? If no → use Markdown.
- [ ] Does the content actually need structure Markdown can't reach (chart, multi-column, callout grid, mermaid, KPI tiles)? If no → Markdown is cheaper *and* serves the reader at least as well.

**Then markup hygiene — pay the tax without waste.**
- [ ] For prose-heavy regions, am I using `<section data-md>` and writing Markdown inside? If no → wrap them.
- [ ] Am I using the shortest equivalent form for each component (semantic-attribute callouts, modifier-only classes, bare `<article>` in grids, comma-separated chart data)? If no → swap them in.
- [ ] Am I using the existing auto-builds (`<nav class="bx-toc"></nav>`, empty `<a class="bx-xref">`, `data-refs`)? If no → use them.

If any of the **audience** questions failed → use Markdown. If only the **markup** questions failed → fix the markup but keep bento.

---

## 6. The dial-down hierarchy

When you really need to cut tokens, in order:

1. **Skip the skill entirely** if the output doesn't benefit (see §4).
2. **Wrap prose in `<section data-md>`** so paragraphs/lists/headings emit as Markdown.
3. **Use the shortest component form** (`<aside data-tone>`, `<span data-tone>`, `<button data-variant>`, bare `<article>` in grids).
4. **Use the existing auto-builds** (`<nav class="bx-toc"></nav>`, empty xref, `data-refs`).
5. **Drop default-value attributes** (`data-cols="3"`, `data-side="left"`, `data-type="bar"`).
6. **Strip class decoration** on already-styled semantic elements (`<p>`, `<h2>`, `<ul>`, `<table>`).
7. **Use compact chart data** (`data-labels="A,B,C"` instead of JSON arrays).
8. **Single `<style>` block** over scattered inline `style="…"` attributes.

Anything beyond this is rearranging deck chairs; the document itself is the cost floor.
