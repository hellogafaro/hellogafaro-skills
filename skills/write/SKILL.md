---
name: |-
  write
description: |-
  Use when drafting or editing user-facing prose, including replies, task comments, documents, summaries, and stakeholder messages. Preserve the facts while making the text concise, natural, and easy to act on.
notion_page_id: 3dffc798-2e43-810e-af3c-cd392f3e0da8
---

# write

Lead with the result or decision. Give the reader only the context needed to understand it and act correctly.

## Choose the shape

- For a quick answer, use one or two complete sentences. For several distinct choices or findings, use short bullets or a compact comparison.
- For connected reasoning, use prose. Use headings when they help a longer answer stay navigable, not to dress up a short reply.
- For an unresolved choice, show the useful options and a recommendation. Use `visualize` when seeing the difference is easier than reading about it.
- Reveal detail progressively. Answer the current decision without dumping the entire analysis or splitting completed work into artificial approval turns.

## Preserve meaning

Keep the necessary evidence, uncertainty, safety boundary, and next action. Preserve code, commands, identifiers, quotes, dates, exact errors, and links. Shorten surrounding prose, not the facts or grammar. Never turn unverified work into a confident claim to save words.

Match the recipient's language and established voice. In chat, report only a changed conclusion, meaningful milestone, or blocker while work continues. Keep tool narration and repeated status out of the conversation.

## Edit

Remove repetition, filler, hype, generic advice, and labels that merely restate the sentence. Prefer concrete verbs and ordinary words. Use sentence case, straight quotes, and no decorative emojis or em dashes in authored prose. Technical syntax and quoted source material remain exact.

For longer editing work, consult [patterns](references/patterns.md) and [natural voice](references/adding-soul.md). Before sending, check whether every sentence changes what the reader knows or does. Cut the rest without losing a material caveat.

Use `summarize` for completed-work recaps and `handoff` for continuation context. This skill writes messages; it does not authorize sending or publishing them.

## Provenance

The editing references derive from [pstack's unslop](https://github.com/cursor/plugins/tree/main/pstack/skills/unslop), upstream commit `bdf7aa355337897f167153e05069aca505dae17c`. Its MIT notice is retained in `LICENSE.md`. Concise output is also informed by [Caveman](https://github.com/juliusbrussee/caveman), without adopting compressed grammar or a context-compression proxy.
