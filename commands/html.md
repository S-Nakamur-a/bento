---
description: Produce a self-contained HTML report using the bento framework, tailored to a specified reader perspective. Use when the user explicitly invokes `/bento:html` or asks for a pretty, shareable HTML document with a particular audience in mind.
argument-hint: <topic> [for <audience>] [brief:<path>]
---

You are orchestrating a bento HTML report. The user's request is:

> $ARGUMENTS

Most of the substantive work happens inside two subagents (`bento-researcher`, `bento-html-author`). Your job is to figure out **what** to write and **for whom**, then dispatch the right agent calls.

## Built-in perspectives

@skills/bento/perspectives/_index.md

## Workflow

### 1. Read project preferences

If `.claude/bento.local.md` exists at the project root, read it before doing anything else. Treat its contents as the highest-priority style overrides and pass relevant parts through to the subagents in step 4 and 6.

### 2. Parse the request

From `$ARGUMENTS`, extract:

- **Topic**: the subject of the report (free text).
- **Perspective**: the reader's role or viewpoint if mentioned. Look for phrases like "for engineers", "エンジニア向け", "exec briefing", "新入社員向けに", "to customers". Match against the slugs in the index above.
- **Brief override**: if the user wrote `brief:<path>`, that file is a pre-built content brief; the researcher step is skipped.
- **Output path override**: if the user named a file (`output:<path>` or "save as …"), honor it; otherwise default to `bento-<topic-slug>-<YYYYMMDD>.html` at the project root.

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
- `output_format`: `html`

The researcher returns a Markdown content brief. For an unmatched perspective it also returns a draft profile.

If `brief:<path>` was given, read that file as the brief and skip this step.

### 5. (Conditional) Persist a new perspective

When the researcher produced a draft profile:

1. Propose a kebab-case slug from the perspective description.
2. Show the proposed `skills/bento/perspectives/<slug>.md` content to the user.
3. Ask: `この視点を skills/bento/perspectives/<slug>.md として保存しますか？スラグを変えたければ指定してください。`
4. On yes → write the file, then append one row to `_index.md`. On no → keep the profile in memory for this run only.

### 6. Run the author

Spawn the `bento-html-author` subagent. Pass:

- `brief`: the brief from step 4 (or 4-skip)
- `perspective_file`: path to the perspective file (whether built-in or newly saved); if the user chose "general reader" and no profile was produced, pass `none` and the author falls back to writing-style.md and readability.md alone
- `output_path`: from step 2
- `preferences`: same excerpt passed in step 4

The author returns the absolute path of the written `.html` file.

### 7. Report to the user

Tell the user, in one short paragraph:

- Output path (so they can open it).
- Perspective used (and whether a new one was saved).
- A one-sentence summary of what the report covers.

Do not paste the HTML into the chat; the user wants the file.

## Notes

- The component vocabulary, the required skeleton, and the writing rules live in `skills/bento/SKILL.md`, `writing-style.md`, `readability.md`, and the chosen perspective file. The subagents read them directly. You do not need to load them in this command.
- If `.claude/bento.local.md` declares `avoided_visuals`, pass that constraint to the author so it picks alternative components.
- This command does not loop or iterate. The user can rerun with edits if they want changes.
- For a plain Markdown output (no HTML, no components), use `/bento:markdown` instead. It shares the researcher and the perspective machinery but produces a `.md` file.
