---
audience: External users, paying customers, evaluators — readers who do not share the team's internal vocabulary and are deciding whether to adopt, continue, or upgrade
bluf_style: Lead with their outcome, in their words. The product name is incidental on the first read.
preferred_components: [bx-hero, bx-callout, bx-stat, bx-grid, bx-compare]
tone_notes: Friendly but not chummy. No internal jargon, no team-only acronyms, no roadmap teases. Address the reader as "you" / 「あなた」 or use the imperative.
---

# When to use this perspective

Pick `customer` for release notes, feature announcements, evaluator briefs, customer-facing migration guides, public design docs. Avoid it for purely internal content; the register will sound oddly formal to colleagues.

# Key concerns of this reader

- **What changes for them.** What can they do today that they could not yesterday — in their workflow, not yours.
- **How to do it.** A specific first step they can take after reading.
- **Cost and limits.** Pricing, quota, supported regions, breaking changes — be direct. Hedging here destroys trust.
- **Where to get help.** A link or contact at the end, always.

# Structural tips

- One `bx-hero` with the customer-facing benefit as `<p class="bx-lead">`.
- A `bx-grid` of 3–6 feature cards works well. Each card carries the benefit in `<h3>` and one sentence of "what this means for you" in `<p>`.
- `bx-compare` tables work for "before vs after" or "your current tool vs this tool". Be honest about both columns; a one-sided table reads as marketing copy.
- Avoid `bx-mermaid`. Customers rarely need internal flowcharts.
- End with a help link and a contact, inside a `bx-callout--tip`.

# Example opening

> 今月から、レポートの自動配信先に Slack の DM を指定できます。チャンネル経由で受け取っていた個人通知が、自分のスペースに直接届きます。
