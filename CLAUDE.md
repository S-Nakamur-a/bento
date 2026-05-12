# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Claude Code plugin that ships a single skill, **bento**. The skill is a small CSS/JS framework plus three instruction files (`SKILL.md` + `writing-style.md` + `readability.md`) that together help another Claude instance produce HTML reports without burning tokens on inline styling. There is no build step; the assets are loaded from jsDelivr in user-generated documents.

## Commands

There is no build, lint, or test runner. The only tooling worth knowing:

- `node --check skills/bento/assets/bento.js`: JS syntax check. Run after any edit to `bento.js`. The closest thing this repo has to a CI gate.
- `open skills/bento/examples/<name>.html`: browser preview. All examples use relative paths (`../assets/bento.css`, `../assets/bento.js`) so they work without a local server.
- No `package.json` exists and none is needed. Don't introduce one; the distribution model assumes the repo contents are directly servable as-is.

## Architecture

### Three layers, three files

The skill works as three complementary instruction files that all load into the consuming Claude's context when the skill activates:

| File | Layer | What it disciplines |
| --- | --- | --- |
| `skills/bento/SKILL.md` | Visual | Component vocabulary (`.bx-card`, `.bx-callout`, etc.), the required HTML skeleton, theme switching, the user-preference file convention |
| `skills/bento/writing-style.md` | Sentence | Vocabulary, sentence shape, punctuation, AI-tells to avoid (EN + JA) |
| `skills/bento/readability.md` | Document | BLUF / Pyramid Principle, paragraph design, heading hierarchy, component-choice-by-shape |

Edits to any of these propagate to every user of the skill the moment the commit lands on `main` (see distribution model below). Keep changes deliberate.

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

When adding any new component or helper, update three places in lockstep:

1. The CSS/JS asset(s)
2. The component catalogue table in `SKILL.md`
3. The "Components at a glance" table and (if structural) the directory tree in `README.md`

The instruction layer is the public API of this skill; CSS without a SKILL.md entry is invisible to the AI that's supposed to use it.
