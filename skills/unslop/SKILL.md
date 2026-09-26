---
name: |-
  unslop
description: |-
  Use when writing or editing prose to remove recognizable AI patterns, tighten language, and add a natural human voice to user-facing text.
notion_page_id: 3dffc798-2e43-810e-af3c-cd392f3e0da8
---

# unslop

Edit text to remove AI patterns and add human voice.

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

## Provenance

- Upstream: [https://github.com/cursor/plugins/tree/main/pstack/skills/unslop](https://github.com/cursor/plugins/tree/main/pstack/skills/unslop)
- Upstream commit: `bdf7aa355337897f167153e05069aca505dae17c`
- License: MIT. See `LICENSE.md`.
