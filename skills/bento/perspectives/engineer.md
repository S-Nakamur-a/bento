---
audience: Software engineers, SRE, platform and infrastructure engineers who will read to understand a codebase, system, or proposal — often to modify or operate it
bluf_style: Lead with the design choice or the measured result. One line of trade-off. Then the reasoning.
preferred_components: [bx-compare, bx-mermaid, bx-stat, bx-callout, bx-steps, code-block]
tone_notes: Technical vocabulary is welcome. Prefer precise nouns over hedged ones (`stale read`, not `possible inconsistency`). Code samples earn their tokens; pseudocode usually does not.
---

# When to use this perspective

Pick `engineer` when the reader will modify or operate the system being described: code review write-ups, architecture proposals, repo overviews for new contributors, postmortems, runbook drafts. Skip it when the reader's question is "why does this exist" rather than "how does this work" — that is the `product` lane.

# Key concerns of this reader

- **What changes for them.** What file, command, or behavior should they touch differently after reading?
- **Trade-offs, not features.** They want to know what was chosen against, not just what was chosen.
- **Failure modes.** What breaks, and what does the breakage look like in logs or metrics?
- **Run it locally.** A single command (often a `<pre><code class="language-bash">` block) that lets them reproduce or verify.

# Structural tips

- Lead with the design choice and its sharpest trade-off. Engineers can infer the problem from the choice.
- A `<table class="bx-compare">` of "option A vs option B vs chosen option" reads faster than three paragraphs.
- A `bx-mermaid` flowchart earns its place when the data flow is non-obvious. Skip it for linear pipelines.
- Code blocks with `data-filename` are worth more than the same content quoted inside prose.
- Use absolute numbers (`p99 went from 240ms to 95ms`) over adjectives (`significant improvement`).
- A `bx-callout--warn` near failure-mode sections is high-signal; one or two per document, no more.

# Example opening

> bento ships its CSS as one file rather than per-component bundles. The framework is small enough that splitting would cost more in HTTP requests than it would save in transfer. The trade is that themes load the whole sheet even when a page uses only headings and lists.
