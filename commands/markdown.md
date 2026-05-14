---
description: Produce a plain Markdown document tailored to a specified reader perspective, using bento's writing-style and readability discipline (no HTML, no components). Use when the user invokes `/bento:markdown` or asks for a polished Markdown report aimed at a particular audience.
argument-hint: <topic> [for <audience>] [brief:<path>]
---

You are orchestrating a bento Markdown document. The user's request is:

> $ARGUMENTS

This command produces a `.md` file — no HTML, no bento CSS classes, no framework. It exists for outputs where the reader will consume Markdown directly (a wiki page, a GitHub README, a Notion paste, an LLM-readable doc). The reader-perspective machinery and the prose discipline from `writing-style.md` + `readability.md` carry over; the visual framework does not.

If you want the styled HTML version, use `/bento:html` instead.

The substantive work happens inside two subagents (`bento-researcher`, `bento-markdown-author`). Your job is to figure out **what** to write and **for whom**, then dispatch the right agent calls.

## Built-in perspectives

@skills/bento/perspectives/_index.md

## Workflow

### 1. Read project preferences

If `.claude/bento.local.md` exists at the project root, read it before doing anything else. Treat its contents as the highest-priority style overrides and pass relevant parts through to the subagents in step 4 and 6.

Keys that apply to Markdown output: `voice`, `language`, `em_dash`, `paragraph_max`, `heading_case`, plus any free-form body rules. HTML-only keys (`theme`, `preferred_visuals`, `avoided_visuals`) are ignored — though `avoided_visuals` is reinterpreted: if it lists `bx-mermaid`, drop mermaid code fences too.

### 2. Parse the request

From `$ARGUMENTS`, extract:

- **Topic**: the subject of the document (free text).
- **Perspective**: the reader's role or viewpoint if mentioned. Look for phrases like "for engineers", "エンジニア向け", "exec briefing", "新入社員向けに", "to customers". Match against the slugs in the index above.
- **Brief override**: if the user wrote `brief:<path>`, that file is a pre-built content brief; the researcher step is skipped.
- **Output path override**: if the user named a file (`output:<path>` or "save as …"), honor it; otherwise default to `bento-<topic-slug>-<YYYYMMDD>.md` at the project root.

If `$ARGUMENTS` is empty, use `AskUserQuestion` to ask the user for the topic and the perspective in one shot.

### 3. Resolve the perspective

- **Matched slug** (e.g. user said "for engineers", index has `engineer`) → use `skills/bento/perspectives/<slug>.md`.
- **Unmatched description** (user said "for our procurement team", no matching slug) → treat as a new perspective; the researcher will produce a draft profile.
- **No perspective mentioned** → ask the user with `AskUserQuestion`. Show the slugs from the index plus two extra options: "その他 / Other (specify)" and "視点指定なし / general reader". The user's answer becomes the perspective for the rest of the flow.

### 4. Run the researcher

Unless a `brief:` override was given, spawn the `bento-researcher` subagent. Pass:

- `topic`: from step 2
- `perspective`: the matched slug, the free-form description, or "general reader"
- `perspective_file`: path to the matched perspective file, when applicable
- `sources`: any URLs, file paths, or pasted material the user supplied in `$ARGUMENTS`
- `preferences`: the relevant excerpt from `.claude/bento.local.md` if it exists
- `output_format`: `markdown`

The researcher returns a Markdown content brief. The brief is the same shape regardless of `output_format`; the visual suggestions inside it use bento class names as shorthand for shapes (e.g. `bx-compare table` = "comparison table"). The Markdown author translates those shapes to Markdown equivalents.

If `brief:<path>` was given, read that file as the brief and skip this step.

### 5. (Conditional) Persist a new perspective

When the researcher produced a draft profile:

1. Propose a kebab-case slug from the perspective description.
2. Show the proposed `skills/bento/perspectives/<slug>.md` content to the user.
3. Ask: `この視点を skills/bento/perspectives/<slug>.md として保存しますか？スラグを変えたければ指定してください。`
4. On yes → write the file, then append one row to `_index.md`. On no → keep the profile in memory for this run only.

Perspective files are shared between `/bento:html` and `/bento:markdown`. The HTML-specific fields (`preferred_components`) carry over as visual-shape hints; the Markdown author maps them to tables, blockquotes, code fences, etc.

### 6. Run the author

Spawn the `bento-markdown-author` subagent. Pass:

- `brief`: the brief from step 4 (or 4-skip)
- `perspective_file`: path to the perspective file (whether built-in or newly saved); if the user chose "general reader" and no profile was produced, pass `none` and the author falls back to writing-style.md and readability.md alone
- `output_path`: from step 2
- `preferences`: same excerpt passed in step 4

The author returns the absolute path of the written `.md` file.

### 7. Report to the user

Tell the user, in one short paragraph:

- Output path (so they can open it).
- Perspective used (and whether a new one was saved).
- A one-sentence summary of what the document covers.

Do not paste the full Markdown into the chat; the user wants the file.

## Notes

- The writing rules live in `skills/bento/writing-style.md` and `skills/bento/readability.md`. The Markdown author reads them directly. You do not need to load them in this command.
- `skills/bento/SKILL.md` is HTML-specific and is **not** consulted on this path. If you find yourself reaching for bento class names in the orchestration, you are in the wrong command — switch to `/bento:html`.
- This command does not loop or iterate. The user can rerun with edits if they want changes.
