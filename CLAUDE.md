# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Claude Code plugin that produces reader-perspective documents in two output formats. Both go through the same orchestration and the same writing discipline; the final author differs.

- **`/bento:html`** uses the bento skill: a small CSS/JS framework plus `SKILL.md` + `writing-style.md` + `readability.md`. The HTML author writes near-vanilla semantic HTML; the framework dresses the page. Assets are loaded from jsDelivr in user-generated documents; there is no build step.
- **`/bento:markdown`** skips the HTML skill entirely. The Markdown author reads `writing-style.md` + `readability.md` + the perspective profile, then writes a plain `.md` file. No HTML, no bento classes, no framework.

## Commands

There is no build, lint, or test runner. The only tooling worth knowing:

- `node --check skills/bento/assets/bento.js`: JS syntax check. Run after any edit to `bento.js`. The closest thing this repo has to a CI gate.
- `open skills/bento/examples/<name>.html`: browser preview. All examples use relative paths (`../assets/bento.css`, `../assets/bento.js`) so they work without a local server.
- No `package.json` exists and none is needed. Don't introduce one; the distribution model assumes the repo contents are directly servable as-is.

## Architecture

### Entry points and runtime layout

The plugin exposes six runtime components Claude Code loads:

| Path | Component type | Role |
| --- | --- | --- |
| `commands/html.md` | slash command | `/bento:html` entry. Parses topic + perspective, orchestrates the researcher + HTML author. |
| `commands/markdown.md` | slash command | `/bento:markdown` entry. Same orchestration; dispatches the Markdown author instead. |
| `skills/bento/SKILL.md` | skill | Ambient fallback for the HTML path (auto-activates on "make an HTML report" / 「美しい資料」 style prompts). Also the authoritative reference for HTML components, skeleton, themes; `bento-html-author` reads it. Not consulted by the Markdown path. |
| `agents/bento-researcher.md` | subagent | Produces a format-agnostic Markdown content brief from topic + perspective + sources. Shared by both commands. |
| `agents/bento-html-author.md` | subagent | Writes the final `.html` from the brief, the perspective, and `SKILL.md`. |
| `agents/bento-markdown-author.md` | subagent | Writes the final `.md` from the brief and the perspective. Reads `writing-style.md` + `readability.md` only — never `SKILL.md`. Translates bento-shape shorthand in the brief to Markdown equivalents (tables, blockquotes, fenced code). |

### Three discipline files

Three writing-discipline files apply across the subagents and the ambient skill path:

| File | Layer | What it disciplines |
| --- | --- | --- |
| `skills/bento/SKILL.md` | Visual (HTML only) | Component vocabulary (`.bx-card`, `.bx-callout`, etc.), the required HTML skeleton, theme switching, the user-preference file convention. **Markdown path ignores this file.** |
| `skills/bento/writing-style.md` | Sentence | Vocabulary, sentence shape, punctuation, AI-tells to avoid (EN + JA). Both paths read it. |
| `skills/bento/readability.md` | Document | BLUF / Pyramid Principle, paragraph design, heading hierarchy, component-choice-by-shape. Both paths read it. |

Edits to any of these propagate to every user of the skill the moment the commit lands on `main` (see distribution model below). Keep changes deliberate.

### Reader perspectives

`skills/bento/perspectives/` holds reader-profile presets:

- `_index.md` — the slug list (`engineer`, `product`, `executive`, `newcomer`, `customer`). Both commands read it to know which slugs exist; the researcher reads it to know which audiences are already covered.
- `<slug>.md` — frontmatter (`audience`, `bluf_style`, `preferred_components`, `tone_notes`) plus body sections (when to use, key concerns, structural tips, example opening).

The researcher consults a profile to shape the brief. The HTML author reads the same profile and treats `preferred_components` as bento classes; the Markdown author reads them as **shape hints** (`bx-compare` → Markdown table, `bx-callout` → blockquote, `bx-mermaid` → fenced `mermaid` code block, `bx-chart` → small data table + one-sentence trend). Profiles are shared across both commands; you do not need parallel HTML / Markdown profile sets. For audiences not in `_index.md`, the researcher drafts a profile and the calling command offers to persist it as `perspectives/<slug>.md`.

### Distribution model

The skill's CSS and JS are referenced from documents via jsDelivr URLs of the form:

```
https://cdn.jsdelivr.net/gh/S-Nakamur-a/bento@main/skills/bento/assets/bento.{css,js}
```

`@main` means HEAD on `main` is what users load. There is no staging environment. Pin examples and user-facing snippets to a tag (e.g. `@v0.1.0`) once the project starts releasing. Until then, `main` is production.

### The `.claude/bento.local.md` preference file

Per-project preferences override every other layer. The format (YAML frontmatter + markdown body) and the reactive-capture behaviour are documented in `SKILL.md` → `## Preferences`. When adding new defaults to the skill, design them so they can be overridden by a single entry in this file.

## Conventions

### Self-demonstration is mandatory for examples

Every `examples/*.html` is expected to follow the skill's own rules: BLUF, parallel sibling headings, em-dash budget (0–1 per document), no `not just X but Y`, no `delve / leverage / pivotal / robust / seamless` in own-voice prose. When editing or adding an example, run the same self-check the skill demands of generated output. Past sessions have caught regressions by grepping the file for `—`, `delve|leverage|pivotal|robust|seamless`, and `単なる.*ではなく` before declaring done.

### Opt-in vs auto styling

A deliberate split:

- **Opt-in (class required)**: `.bx-btn`. Raw `<button>` is left untouched because `<button class="bx-badge">` is a pre-existing pattern used as a click target in examples; auto-styling buttons would break it.
- **Automatic (no class)**: form elements (`<input>`, `<select>`, `<textarea>`, `<fieldset>`). Too many input types to require per-class adoption.
- **Data-attribute driven**: `.bx-chart` (data-type, data-labels, data-values), `.bx-mermaid` (raw mermaid source as text), `.bx-copy` (data-copy-from / data-copy-text), `.bx-related` (data-refs shortcut). Use this style for any new feature whose configuration is more than one or two booleans.

When adding a new component, pick one of these three modes deliberately and explain the choice in the commit.

### No innerHTML in shipped JS or examples

`bento.js` uses `createElement` / `textContent` / `DOMParser` for all dynamic content (mermaid SVG, chart canvases, cross-references). `examples/playground.html` does the same. A pre-tool security hook actively blocks `innerHTML` writes; if it triggers, the fix is to use DOM API, not to escape and retry.

### Heading IDs are framework-managed

`bento.js` assigns slug IDs to `<h2>` / `<h3>` inside `.bx-doc` before the TOC and cross-references are built (see `ensureHeadingIds` in `bento.js`). Examples that need stable anchors (for `.bx-xref` / `.bx-related`) should set explicit `id` attributes on the target headings rather than rely on the auto-slug, which can drift if heading text changes.

### Adding to the catalogue

When adding a new **component or helper**, update three places in lockstep:

1. The CSS/JS asset(s).
2. The component catalogue table in `SKILL.md`.
3. The "Components at a glance" table and (if structural) the directory tree in `README.md`.

When adding a new **perspective**, update two places:

1. `skills/bento/perspectives/<slug>.md` with the new profile.
2. The slug table in `skills/bento/perspectives/_index.md`.

When changing the **command or a subagent**, update:

1. The relevant `commands/{html,markdown}.md` or `agents/<name>.md`.
2. The "Entry points and runtime layout" table above, if the responsibility split shifted.
3. The README section describing the entry point, if the user-facing contract changed.
4. If the change affects both output paths (e.g. a researcher tweak), update both command files in lockstep — they share most of their workflow text, and drift between them is a maintenance hazard.

The instruction layer is the public API of this skill; CSS without a SKILL.md entry is invisible to the AI that's supposed to use it, and a perspective file without an `_index.md` row is invisible to the commands.
