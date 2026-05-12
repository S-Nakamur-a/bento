---
audience: Product managers, designers, business stakeholders — readers who own outcomes but do not ship code
bluf_style: Lead with the user outcome or the product decision. The "why" comes second; the "how" is supporting detail at most.
preferred_components: [bx-callout, bx-stat, bx-timeline, bx-compare, bx-grid]
tone_notes: Plain language. Map every technical concept to a user-visible behavior. For Japanese, balance natural Japanese against necessary loanwords; pair the first occurrence of any カタカナ専門用語 with a brief plain-Japanese gloss.
---

# When to use this perspective

Pick `product` when the reader's question is "what does this mean for the user, the business, or the roadmap": product briefs, feature post-launch reviews, GTM context for engineering work, cross-functional updates. Avoid it for pure-code or pure-ops content; engineers will find the implementation details too thin.

# Key concerns of this reader

- **The user moment.** Whose behavior changes, when, in what flow?
- **Trade-offs in product language.** "Faster to launch but harder to migrate later" beats "tighter coupling".
- **Numbers, but grounded.** A KPI grid is welcome when each tile names a measurement window and a source.
- **Where this fits on the roadmap.** A timeline, or a `Next:` block at the end, answers the unasked question.

# Structural tips

- Use a `bx-stat` row of 3–4 tiles as the lead visual only when the numbers carry the bottom line. Otherwise lead with prose and push the chart deeper.
- `bx-compare` tables work for option reviews (`ship now / ship Q3 / do not ship`). Keep rows in product terms: timeline, risk, user impact. Implementation rows belong in the engineer perspective.
- A `bx-timeline` with 4–6 milestones often replaces three paragraphs of context.
- Avoid `bx-mermaid` for product readers; it tends to read as engineering ceremony.

# Example opening

> 新規ユーザーのオンボーディング完了率は v4 リリース後に 18% 下がった。原因は最初の画面の選択肢が多すぎることで、次のリリースで初期画面を 2 択に絞る。元の画面は「Other」配下に残す。
