# bento — writing style guide

> Read this **before** drafting any prose inside a bento document.
> Beautiful HTML around AI-sounding prose still reads as an AI artifact.
> The visual framework is a stage; this file is the script discipline.

The guide is organized by the four roots of "AI-tells" — **vocabulary**,
**sentence shape**, **structure**, **typography**. For each, the principle
comes first, then concrete bad → good rewrites.

---

## 0. The single principle

> **Commit. Be specific. Vary.**

Most AI-tells reduce to one of three failures:

1. **Refusing to commit** — hedging, "it depends", "both sides have merit",
   listing pros and cons instead of taking a stance.
2. **Refusing to be specific** — abstractions, generic nouns ("landscape",
   "framework"), nameless examples, round numbers without sources.
3. **Refusing to vary** — same sentence length, same opener, same closer,
   same triplet rhythm paragraph after paragraph.

When in doubt, ask: *am I committing, being specific, and varying?*

---

## 1. Vocabulary — words and phrases to avoid

### 1.1 English: the AI lexicon

Avoid these unless the topic genuinely demands them. They are not wrong
words, but their **frequency** in AI output makes them tells.

| Category | Avoid | Try instead |
| --- | --- | --- |
| Inflated verbs | delve, leverage, utilize, harness, streamline, underscore, foster, showcase, navigate (metaphorical) | dig into, use, make easier, point to, build, show, work through |
| Adjectives of significance | pivotal, robust, seamless, cutting-edge, innovative, transformative, holistic, comprehensive | important, working, smooth, new, that-changes-X, whole, full |
| Filler nouns | landscape, realm, tapestry, synergy, testament, underpinnings, ecosystem (metaphorical) | field, area, mix, fit, proof, basis, group |
| Promotional puffery | vibrant, intricate, enduring, meticulous, captivating, profound, rich | lively, complex, lasting, careful, gripping, deep, full |
| Outline fillers | Additionally, Furthermore, Moreover, In conclusion, It is worth noting | (delete most of them; if a transition is needed, use **but**, **so**, **and**, **then**) |
| "Connect" verbs | bridges the gap, intersects with, lies at the intersection of | links, mixes, sits between |

A useful drill: **delete every adverb and "very"**, then put back only the
ones whose loss changed the meaning. Usually three out of four stay deleted.

### 1.2 Japanese: AI 語彙

| カテゴリ | 避ける | 代替 |
| --- | --- | --- |
| カタカナ語の過多 | ソリューション、アライメント、シナジー、コミットメント、ロードマップ、リスクヘッジ、レバレッジ | 解決策、すり合わせ、相乗、約束、計画、保険、てこ |
| 抽象名詞 | 本質、価値最大化、最適化、可能性、ポテンシャル、エコシステム | 中身、もうけを増やす、いちばん良い形、できること、伸びしろ、まわり全体 |
| 定型接続 | まず、次に、そのため、したがって、また、さらに | （多くは削れる。順接は接続詞なしで繋ぐ） |
| 万能の評価語 | 革新的、画期的、最先端、〜の鍵、〜を切り拓く | （根拠を書く。語だけで持ち上げない） |
| 事なかれ言い回し | 一概には言えませんが、メリットもあればデメリットも、あまり推奨されません、場合によっては | 言い切る。例：「やめるべき」「○○の時だけ使う」 |
| 比喩テンプレ | 地図、羅針盤、土台、エンジン、レシピ、ピース | （より鮮烈で具体的なものに。または比喩自体を捨てる） |

---

## 2. Sentence shape — patterns to break

### 2.1 The "rule of three" addiction

AI loves triplets: "fast, scalable, and reliable" / "短く、明快で、力強い".
Use them at most **once per page**. Mostly use one strong word or a pair.

> ✗ The framework is intuitive, powerful, and extensible.
> ✓ The framework is extensible — almost everything is a plug-in.

> ✗ シンプルで、軽量で、わかりやすい設計です。
> ✓ 設計は軽い。プラグイン一つで全部組み替えられます。

### 2.2 The "not just X, but Y" reflex

"Not just a tool, but a way of thinking" / 「ただの○○ではなく、△△です」
is the most overused AI rhetorical move. Drop it. State Y directly.

> ✗ It's not just a database, it's a knowledge layer.
> ✓ It's a knowledge layer. (Cut the negation — start with the claim.)

> ✗ これは単なるツールではなく、思考の枠組みです。
> ✓ これは思考の枠組みです。

### 2.3 Hedging participles

Sentences that end with `-ing` clauses adding vague analytic weight are an
AI fingerprint: *"...the system processes data, **highlighting its
importance to modern infrastructure**."* End the sentence at the verb.

### 2.4 Copula avoidance

AI dodges plain *is*: "serves as", "represents", "constitutes", "stands as".
日本語なら「〜という側面を持つ」「〜と位置づけられる」。
Use **is / は / です** unless you mean something more specific.

### 2.5 Vary cadence

Mix lengths. After two medium sentences, write one of three words. Then a
long one that earns its length by carrying real information across two
beats. Then a short one. Like that.

日本語も同じ。短文。長文。リズムを意図的に揺らす。連続する文末
（です・です・です／ました・ました・ました）を**1段落で2回**以上
許さない。

---

## 3. Structure — paragraph and document shape

### 3.1 Reject the 5-paragraph essay

AI defaults to: intro → 3 points → conclusion. Real writing has
unbalanced sections. Some claims need a sentence, some need three
paragraphs. **Let length follow weight**, not symmetry.

### 3.2 Lead with the claim

If a paragraph's first sentence is scene-setting ("In today's world…",
「現代のビジネス環境において…」), delete it. Open with the actual claim.

### 3.3 Don't announce structure

> ✗ In this section we will explore three key benefits.
> ✗ 本記事では、以下の3つのポイントを解説します。

Bento headings (`<h2>`, `<h3>`) and the auto-TOC already announce
structure. Saying it again in prose is filler.

### 3.4 Cut the "challenges and future" closer

AI ends with a hedged "however, challenges remain, but with continued
effort the future is bright" / 「課題はあるものの、今後の取り組みが
期待される」. This adds zero information. End on the last real point, or
on a single sharp question.

### 3.5 Prefer prose to bullets

A bullet list of 4 items with one sentence each is usually prose in
disguise. If the items have grammatical parallelism and a natural reading
order, write it as a paragraph. Reserve bullets for genuinely list-shaped
content (steps, options, columns of a comparison).

---

## 4. Typography and punctuation

### 4.1 Em-dashes — the loudest fingerprint

The em-dash (—) is the single most reliable AI tell in 2025–2026. Replace
nearly all of them: with a period, a comma, parentheses, or a colon.

> ✗ The result was clear — performance doubled overnight.
> ✓ The result was clear: performance doubled overnight.

日本語のダッシュ（— / ――）も同じ。「つまり」「すなわち」または
句点で置き換える。

### 4.2 Curly vs straight quotes

Use **straight quotes** (`"`, `'`) unless the document is typographically
intentional. Curly quotes (`" "`, `' '`) inside otherwise-plain text are
a paste-from-ChatGPT marker.

### 4.3 Boldface restraint

Avoid bolding **a key term** every time it appears. Bold once per concept,
at first mention or at the moment of payoff. In bento, prefer using
`<strong>` only inside callout titles and definitions.

### 4.4 Emoji and symbol clutter

✅ ❌ 🚀 ⭐ used as bullet markers signal AI. The bento framework already
styles `✓` and `✗` in `.bento-compare` tables and has badges, callouts,
and steps with semantic icons — use those instead of inline emoji.

### 4.5 Japanese-specific typography

- 三点リーダは「…」一つ。「...」（半角ピリオド3つ）は使わない。
- 括弧は和文中なら「」、引用や強調は『』。`""` は使わない。
- 全角・半角の混在を避ける（数字・英字は半角、記号は文脈に合わせて）。

---

## 5. Voice — the harder layer

### 5.1 Have a stance

Every claim should be falsifiable or arguable. "AI is changing how we
work" is unfalsifiable filler. "GitHub Copilot cut my refactor time on
this codebase from a day to two hours" is a stance with evidence.

### 5.2 Use specifics, names, numbers

Replace "many companies" with **three named ones**, or with a number with
a source. Replace "significantly improved" with **"38% faster"** or with
a measurement context. If you don't have the specifics, **delete the
sentence** — don't paper over the gap with adverbs.

### 5.3 Allow asymmetry and small imperfections

Humans use contractions, parentheticals, the occasional sentence
fragment. They don't begin every paragraph with a topic sentence.
日本語であれば、体言止めを混ぜる、ですます調の中に体言止めを一つ挿す、
あるいは時々「。」で切るより「、」で繋ぐなど。

### 5.4 Don't summarize what just happened

The final paragraph of an AI essay restates the body. Stop. The reader
read the body. Either advance the argument or stop writing.

---

## 6. The self-check before you stop

Before declaring a bento document done, scan the prose against this list:

- [ ] No em-dashes (or, at most, one with strong purpose)
- [ ] No "delve / leverage / pivotal / robust / seamless / tapestry"
- [ ] No 「まず / 次に / そのため / さらに」 in default positions
- [ ] No paragraph opens with "In today's [X]" / 「現代の○○において」
- [ ] No `not just X, but Y` constructions / 「単なる○○ではなく」
- [ ] At least three concrete specifics (names, numbers, dates) per page
- [ ] Sentence lengths vary visibly (not all 12–18 words)
- [ ] Bullet lists contain genuinely list-shaped content, not prose
- [ ] No final summary paragraph that restates earlier content
- [ ] Bold used **once per concept**, not on every recurrence
- [ ] At least one passage where you took a stance someone could disagree with

If a single document fails three or more of these, rewrite — don't patch.
The framework can dress up almost anything, but it can't disguise prose
that doesn't commit to saying something.
