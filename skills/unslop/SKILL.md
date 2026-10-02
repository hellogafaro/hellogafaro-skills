---
name: |-
  unslop
description: |-
  Use when writing or editing prose to remove recognizable AI patterns, tighten language, and add a natural human voice to user-facing text.
notion_page_id: 3dffc798-2e43-810e-af3c-cd392f3e0da8
---

# unslop

Edit text to remove AI patterns and add human voice.

## User-facing output

Lead with actual value or outcome. Default to the leanest useful answer, readable in about three seconds: one or two short sentences or a few short bullets. Include only a necessary decision or blocker, a material caveat, and a useful link when it matters. Omit filler, preamble, repetition, routine process narration, and speculative detail. Expand only when requested or necessary for correct understanding or approval. Keep natural language and complete meaning; never compress away necessary safety or approval information.

Keep progress notes sparse and meaningful. State a new finding, material change, or blocker without repeating status. Put detailed evidence in a handoff or linked artifact instead of flooding the final chat.

Use a canvas only when substantial information needs a separate artifact or the user explicitly requests one. Small work stays in concise chat with the smallest useful real evidence. Completion or review alone never requires a canvas.

## Process

1. Scan for the patterns in [patterns.md](references/patterns.md).
2. Rewrite. Preserve meaning, match intended tone.
3. Add soul using [adding-soul.md](references/adding-soul.md).
4. Self-audit: "What makes this obviously AI generated?" Fix remaining tells.

## Hard rules

- Avoid em dashes entirely. Use periods or commas only, with no parentheses, en dashes, or hyphen-as-dash substitutes.
- Use sentence case headings, straight quotes, and no decorative emojis.
- Remove chatbot phrases, sycophantic tone, filler, hedging, and generic conclusions.
- Prefer the plain word, active voice, and one idea per sentence.
- Removing patterns is half the job. Sterile, voiceless writing is just as obvious.
- Write it clean as you draft. A cleanup pass afterwards misses what the first draft baked in.
- Never fabricate a link, citation, or quote. Link only what you produced or read.

## Provenance

- Upstream: [https://github.com/cursor/plugins/tree/main/pstack/skills/unslop](https://github.com/cursor/plugins/tree/main/pstack/skills/unslop)
- Upstream commit: `bdf7aa355337897f167153e05069aca505dae17c`
- License: MIT. See `LICENSE.md`.
