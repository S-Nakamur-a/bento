---
audience: New joiners, onboarding readers, or readers entirely outside the original context — anyone who will read to orient themselves before doing anything else
bluf_style: One sentence that names what the reader will be able to do after reading. Then the orientation map.
preferred_components: [bx-callout, bx-steps, bx-grid, bx-mermaid]
tone_notes: Plain language at the first use of any term. Inline glossary instead of footnotes. No team-internal acronyms without expansion at first appearance.
---

# When to use this perspective

Pick `newcomer` for repo and project overviews aimed at new contributors, "how this team works" briefs, hand-off documents, public-facing introductions. Avoid it when the reader is expected to already share the team's vocabulary; the explanations become noise.

# Key concerns of this reader

- **No assumed context.** Every internal term gets a one-line expansion at first use.
- **A concrete first step.** Inside the first screen there is a `bx-steps` block or a code block they can act on.
- **A map of the territory.** Where are things, who owns what, where to ask questions.
- **What is safe to skip.** Mark optional reading explicitly with `bx-callout--note` ("Skip this section if …").

# Structural tips

- Open with what they will be able to do, not who you are or what the project is called.
- `bx-steps` for the first-thing path; bullets feel less guided.
- A small glossary as a `bx-grid` of bare `<article>` cards (term in `<h3>`, one-sentence definition in `<p>`) belongs near the top. 4–6 terms; more becomes a wall.
- One `bx-mermaid` if the system has a non-obvious topology. Skip it if the picture is three boxes in a row.
- End with a "where to ask" callout, not a summary.

# Example opening

> このリポジトリは bento スキル一個を提供します。読み終えると、自分のローカルで examples を開いて動かし、`SKILL.md` を編集して挙動を変えられる状態になります。
