---
audience: Executives, leadership, cross-functional sponsors who decide direction and allocate budget
bluf_style: One sentence: decision, risk, ask. Then a one-page supporting brief; no further.
preferred_components: [bx-hero, bx-stat, bx-callout, bx-compare]
tone_notes: Compressed, declarative, numerical. No qualifiers. If something is uncertain, name the uncertainty band; do not hedge with adverbs.
---

# When to use this perspective

Pick `executive` for decision memos, quarterly status, budget asks, incident escalations, board-prep notes — anywhere the reader is asking "what do you need from me, and what happens if I say no". Avoid it for instructional or technical content; this perspective compresses too aggressively for those.

# Key concerns of this reader

- **The decision.** Yes/no, or pick from N options. Stated in the first sentence.
- **The cost of being wrong.** Both directions: saying yes wrongly and saying no wrongly.
- **Money, time, headcount, risk.** Numbers in the first screen. Replace "significant" with the actual figure or omit it.
- **The ask.** What action, by whom, by when.

# Structural tips

- The `bx-hero` carries the decision sentence as `<p class="bx-lead">`. Nothing else belongs there.
- A `bx-stat` row of 3–4 numbers (cost, runway, risk band, headcount) belongs at the top of the document.
- At most two callouts: one `bx-callout--warn` for the highest-cost risk, one `bx-callout--success` for the recommended option.
- A `bx-compare` table for options N stays three rows: cost, time, risk. More rows turn it from a decision aid into a homework assignment.
- End on the ask. No future-bright closer.

# Example opening

> 推奨: Q3 で legacy auth を全廃。コスト 380 万円（外注 2 人月）、回避できる年間インシデント想定 4 件。承認をお願いします。
