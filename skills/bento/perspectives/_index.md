---
type: bento-perspectives-index
---

# Bento perspectives — built-in reader profiles

Each row is a perspective slug, the audience it serves, and the file that fully describes how to write for that reader. The `/bento:html` and `/bento:markdown` commands show this list to the user when they have not picked a perspective, and `bento-researcher` consults it to decide whether a request is for an existing slug or a new one.

| Slug | For | One-liner |
| --- | --- | --- |
| `engineer` | developers, SRE, platform engineers | Design choice and trade-offs first. Run-locally commands and failure modes carry weight. |
| `product` | PMs, designers, business stakeholders | User outcome first. Implementation is supporting detail. |
| `executive` | leadership, cross-functional sponsors | Decision, risk, ask. One screen of numbers up top. |
| `newcomer` | new joiners, onboarding readers | No assumed context. First concrete step within the first screen. |
| `customer` | external users, paying customers | Outcome in their words. No internal jargon. |

## How perspectives get added

When a user invokes `/bento:html` or `/bento:markdown` with an audience that does not match a row above, `bento-researcher` produces a draft perspective profile alongside the brief. The command then asks the user whether to save it as `skills/bento/perspectives/<slug>.md` and append a row to this index. Saved perspectives become available to all future runs in this project, across both commands.

If you (a human editor) want to add a perspective by hand, copy one of the existing files, change the frontmatter, replace the body, and add a single row to the table above. Keep slugs lowercase and kebab-case.
