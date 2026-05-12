# bento — readability guide

> Read this alongside `writing-style.md`.
> `writing-style.md` is sentence-level discipline (vocabulary, voice, AI-tells).
> This file is document-level discipline (structure, hierarchy, component choice).

The visual layer in `bento.css` already encodes most readability defaults:
17px base type, 1.65 line-height for body, a 76ch reading column, a tuned
heading scale, generous component padding. Don't override those without
reason. This guide covers the choices the framework can't make for you:
how to **arrange** the content so it gets read.

---

## 0. The one frame you need

> **About 70% of readers skim. The first 5–7 seconds decide whether they
> read the rest.**
>
> Therefore: surface the bottom line first, build a heading hierarchy a
> skimmer can navigate, and design every paragraph so its first sentence
> answers "should I keep reading this?".

This is the **Pyramid Principle** (Minto, 1969) and **BLUF** (Bottom
Line Up Front, US military memo style) wearing different uniforms.
Conclusion first; supporting points in logical groups under it; evidence
and detail last.

---

## 1. Document architecture

### Lead with the answer

The AI default is intro → exploration → conclusion. Readers want
conclusion → why → details. Flip it.

> ✗ "The team explored several factors that may influence onboarding completion..."
> ✓ "Onboarding completion dropped 18% after the v4 redesign. Three reasons; see below."

The opening paragraph (or `<p class="bento-lead">`) is for the **bottom
line**: result, claim, or recommendation in plain words.

### Tree, not chain

Build the document as a tree:

- **Root**: the claim, in one sentence
- **Branches** (`<h2>` sections): 3–5 supporting reasons, each a complete sub-argument
- **Leaves**: evidence, examples, code, data inside each section

A skimmer reading only the root and branch headings should still get
the spine. If they don't, the headings are decorative, not structural.

### When to break the rule

Narrative-shaped writing (postmortems with a twist, an essay where the
reveal is the point) can build to the conclusion. Even then, give the
reader a one-line `<p class="bento-lead">` at the top hinting at the
destination. Suspense is fine; mystery is not.

---

## 2. Paragraph design

### Topic sentence first

Every paragraph's first sentence should answer "what is this paragraph
about?". Test: read **only** the first sentences of each paragraph in
order. The document should still make sense. If not, the paragraphs
have no spine.

### One idea per paragraph

If you can't summarize a paragraph in five words, it's at least two
paragraphs.

### Short on screen

- 1–4 sentences is the default range.
- A 5–7 sentence paragraph is fine for depth, but never two in a row.
- One-sentence paragraphs aren't lazy; they're a tool for emphasis.

### Vary cadence inside the paragraph

Three short sentences in a row feel choppy. Three long sentences feel
turgid. Mix them. After two medium-length sentences, write a short one.
Then a long one that earns its length by carrying two ideas across.

---

## 3. Visual hierarchy

Headings are **signposts**, not titles. Treat `<h2>` and `<h3>` as a
text-shaped TOC. A skimmer reading just the headings should get the
gist.

### Heading depth

- `<h1>`: document title, exactly one
- `<h2>`: major section. Aim for 4–8 per document
- `<h3>`: subsection inside an `<h2>`. Use sparingly
- `<h4>`: small label only, inside `.bento-card` / `.bento-callout` / `.bento-steps`

If you find yourself reaching for `<h5>`, the document needs to be
split.

### Heading wording

- **Descriptive, not cute.** "How charts work" beats "Charts: the
  magic behind the scenes".
- **Parallel grammar across siblings.** If `<h2>` #1 is "Loading data",
  `<h2>` #2 should be "Saving data", not "How to save your data". The
  reader's eye uses parallel form as a navigation aid.
- **Front-load the keyword.** "Pricing" beats "How we think about
  pricing"; the skimmer's eye lands on the left.

### The skimmability stack

For each `<h2>` section, give the skimmer four layers:

1. The heading (the signpost)
2. A leading sentence that frames the section in one breath
3. A scannable element near the top: a `.bento-callout`, a `.bento-stat`
   row, a 3-row `.bento-compare` table, or a small chart
4. The fuller prose below

A reader who only consumes (1)+(2)+(3) should still come away with the
substance. (4) is for the reader who chose to invest more time.

---

## 4. Component choice: prose vs UI

bento gives you many ways to express the same content. Pick by **shape**,
not preference.

### Use a paragraph when

- Items have a natural reading order tied by grammar ("first… because… so…")
- One item depends on the previous
- Lengths per item vary a lot

### Use `<ul>` or `<ol>` when

- Items are genuinely parallel (similar grammatical shape, similar length)
- The reader will scan, not read
- Reordering wouldn't break sense (for `<ul>`; `<ol>` is for genuine sequences)
- There are 3–7 items. Below 3, write a sentence. Above 7, split into groups.

### Use a `.bento-card` grid when

- Items are independent units the reader compares
- Each has a title + 1–2 sentence body + optional footer
- 3–8 cards total. Beyond that, split into a second grid

### Use a `.bento-stat` grid when

- The unit is a number with a label
- The numbers are comparable (same scale or all percentages)
- 3–6 stats fit cleanly; 4 is the sweet spot

### Use a `.bento-callout` when

- A single highlighted note is meant to interrupt the prose flow
- The reader should leave with this specific point if they leave with one thing
- **Sparingly.** One or two per page. More than three and they stop interrupting and start being noise.

### Use a `.bento-compare` table when

- Comparing 2–4 alternatives across 3–8 attributes
- `✓` / `✗` for boolean attributes, short text for nuance
- Each column header is an alternative, each row an attribute

### Use `.bento-steps` when

- Order matters
- Each step has an action the reader takes

### Use `.bento-timeline` when

- Items anchor to specific dates
- The reader cares about chronology, not just sequence

### Anti-pattern: bullets inside a paragraph

If you write "There are three reasons: first, …; second, …; third, …",
write a `<ul>` (or split into three paragraphs). The reader's eye wants
the structure to be visible.

---

## 5. Density and whitespace

- The framework sets section spacing automatically. **Don't add `<br>` for spacing.**
- An `<hr>` is rarely needed; the `<h2>` border-bottom is usually a clear
  enough divider.
- Cards, callouts, charts, and tables already have generous internal
  padding. Don't wrap them in extra `<div>`s for breathing room.

### Skim density target

Per `<h2>` section, expect roughly:

- 1–2 paragraphs of substantive prose
- 1 visual element (card grid, stat row, callout, chart, table, diagram)
- Optional code or `<details>` for depth

If a section is 8 paragraphs and no visuals, it's too dense. Split into
subsections, or pull one paragraph out as a callout, or add a
comparison table.

---

## 6. Visual design: when to override defaults

bento's defaults are tuned for general readability:

| Property | Default | Why |
| --- | --- | --- |
| Body font size | `17px` | 16px is the floor; 17 is the comfort line. Big enough on retina, generous for kanji density. |
| Line height (body) | `1.65` | Research puts the floor for long prose at 1.5; 1.65 leaves room for mixed JA/EN. |
| Reading column | `76ch` (`--bento-max-width`) | English: 60–75 chars per line target met. Mixed JA/EN: about 38–44 文字/行, well inside the 30–50 文字 comfort zone. |
| Heading line-height | `1.2` | Tight, for visual weight. |
| Paragraph margin | `1.1em` | One blank line between paragraphs without being airy. |

Override only when:

- The output is presentation- or poster-shaped (use larger type)
- The audience is single-language with different needs (e.g. very short
  Japanese body text on mobile may drop to 16px)
- The container is constrained (cards inside cards, etc.)

Override via a single `<style>` block:

```html
<style>
  .bento {
    --bento-max-width: 64ch;
    --bento-fs-base: 18px;
  }
</style>
```

Don't override the font stack unless there's a clear reason. The
default already prioritizes Hiragino / Noto Sans JP ahead of generic
sans, so Japanese rendering is solid out of the box.

---

## 7. Japanese specifics

Most principles above are language-agnostic, but a few details are
Japan-specific:

- **行長**: 横書きの読み物は 30–50 文字/行が快適圏。bento の 76ch は
  この範囲に収まる。それより長くしない。
- **行間**: 日本語は kanji の密度が高いので、英語より行間を取った
  方が読みやすい。bento の 1.65 はすでにそれを織り込み済み。
- **段落の切り方**: 日本語は文末が長くなりがちなので、英語より段落を
  短めに保つと読みやすい (3–4 文を上限の目安に)。
- **書体**: 横書きは Gothic (Hiragino Sans / Noto Sans JP)、縦書きや
  長文の印象重視には Serif (Hiragino Mincho / Noto Serif JP)。bento の
  既定は Gothic 系。`--bento-font-serif` 経由で本文を serif に切り替え
  も可能。
- **半角・全角**: 数字と英字は半角、記号は文脈に合わせて。「、。」の
  あとは詰めない。

---

## 8. The 5-minute self-check

Scan the document before declaring it done:

- [ ] A reader who consumes only headings + first sentence of each paragraph + visual elements gets the main message.
- [ ] The bottom line appears in the first 1–2 paragraphs.
- [ ] Paragraphs are 1–4 sentences most of the time; no two long paragraphs in a row.
- [ ] Every `<h2>` has at least one visual element nearby (callout / card grid / stat row / chart / compare).
- [ ] Bullet lists contain genuinely list-shaped content, not prose in disguise.
- [ ] `<h2>` siblings follow parallel wording.
- [ ] The longest paragraph is under 8 sentences.
- [ ] At most 1–2 `.bento-callout`s per page.
- [ ] No `<br>` for spacing, no decorative wrapper `<div>`s.
- [ ] Document title is in `<h1>`, sections in `<h2>`, and you didn't reach for `<h5>`.

If three or more fail, restructure. Don't patch.

---

## 9. Two layers, one job

`writing-style.md` disciplines the **sentence**.
`readability.md` disciplines the **document**.

Both are necessary. Beautiful sentences in a wrong-shaped document
fail; a right-shaped document with AI-sounding sentences also fails.
The bento visual framework is the third layer that lets both succeed
at scale.
